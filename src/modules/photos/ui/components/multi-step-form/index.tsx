"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TExifData, TImageInfo } from "@/modules/photos/lib/utils";
import { PhotoFormData, INITIAL_FORM_VALUES, STEP_CONFIG } from "./types";
import { FirstStep } from "./steps/first-step";
import { SecondStep } from "./steps/second-step";
import { ThirdStep } from "./steps/third-step";
import { FourthStep } from "./steps/fourth-step";
import { ProgressBar } from "./components/progress-bar";
import { StepIndicator } from "./components/step-indicator";
import { SuccessScreen } from "./components/success-screen";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ============================================================================
// TYPES
// ============================================================================

interface MultiStepFormProps {
  className?: string;
  onSubmit?: (data: PhotoFormData) => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MultiStepForm({
  className,
  onSubmit,
}: MultiStepFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createPhoto = useMutation(trpc.photos.create.mutationOptions());
  const removeS3Object = useMutation(trpc.s3.deleteFile.mutationOptions());
  const uploadToS3 = useMutation(trpc.s3.serverUpload.mutationOptions());
  // ========================================
  // State Management
  // ========================================

  // Step control
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Form data
  const [formData, setFormData] =
    useState<Partial<PhotoFormData>>(INITIAL_FORM_VALUES);

  // Upload-related state
  const [url, setUrl] = useState<string | null>(null);
  const [exif, setExif] = useState<TExifData | null>(null);
  const [imageInfo, setImageInfo] = useState<TImageInfo>();
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Address state for location data
  const [address, setAddress] = useState<any>(null);

  // ========================================
  // Handlers
  // ========================================

  // Handle upload success — stores local blob URL + file; actual S3 upload happens on publish
  const handleUploadSuccess = (
    uploadedUrl: string,
    uploadedExif: TExifData | null,
    uploadedImageInfo: TImageInfo,
    file?: File
  ) => {
    setUrl(uploadedUrl);
    setExif(uploadedExif);
    setImageInfo(uploadedImageInfo);
    if (file) setPendingFile(file);
  };

  // Handle re-upload
  const handleReupload = (currentUrl: string) => {
    if (currentUrl.startsWith("blob:")) {
      // Local preview only — just revoke, nothing on S3 to delete
      URL.revokeObjectURL(currentUrl);
    } else {
      // Already on S3 — delete it
      removeS3Object.mutate({ key: currentUrl });
    }
    setUrl(null);
    setExif(null);
    setImageInfo(undefined);
    setPendingFile(null);
  };

  // Handle next step
  const handleNext = async (data: Partial<PhotoFormData>) => {
    let updatedData = { ...formData, ...data };

    // Step 1: Add upload data and EXIF
    if (step === 0) {
      updatedData = {
        ...updatedData,
        url: url || "",
        exif,
        imageInfo,
        // Pre-fill camera parameters from EXIF
        make: exif?.make,
        model: exif?.model,
        lensModel: exif?.lensModel,
        focalLength: exif?.focalLength,
        focalLength35mm: exif?.focalLength35mm,
        fNumber: exif?.fNumber,
        iso: exif?.iso,
        exposureTime: exif?.exposureTime,
        exposureCompensation: exif?.exposureCompensation,
        latitude: exif?.latitude,
        longitude: exif?.longitude,
        gpsAltitude: exif?.gpsAltitude,
        dateTimeOriginal: exif?.dateTimeOriginal,
      };
    }

    setFormData(updatedData);

    if (step < STEP_CONFIG.length - 1) {
      // Move to next step
      setStep(step + 1);
    } else {
      // Final submission - integrate all data including address
      const finalData = {
        ...updatedData,
        url: url || "",
        title: updatedData.title || "",
        description: updatedData.description || "",
        // Add image dimensions and blur data from imageInfo
        aspectRatio: imageInfo ? imageInfo.width / imageInfo.height : 1,
        width: imageInfo?.width || 0,
        height: imageInfo?.height || 0,
        blurData: imageInfo?.blurhash || "",
        // Add address data from location if available
        country: address?.country,
        countryCode: address?.countryCode,
        region: address?.region,
        city: address?.city,
        district: address?.district,
        fullAddress: address?.fullAddress,
        placeFormatted: address?.placeFormatted,
      };

      setIsSubmitting(true);

      const doCreate = (finalUrl: string) => {
        createPhoto.mutate({ ...finalData, url: finalUrl }, {
          onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.photos.getMany.queryOptions({}));
            await queryClient.invalidateQueries(trpc.home.getManyLikePhotos.queryOptions({ limit: 10 }));
            await queryClient.invalidateQueries(trpc.home.getCitySets.queryOptions({ limit: 9 }));
            await queryClient.invalidateQueries(trpc.city.getMany.queryOptions());

            // Revoke blob URL now that the real S3 URL is saved
            if (url?.startsWith("blob:")) URL.revokeObjectURL(url);

            toast.success("Photo published successfully!");
            setIsComplete(true);
            setIsSubmitting(false);
            if (onSubmit) onSubmit(finalData as PhotoFormData);
          },
          onError: (error) => {
            toast.error(error.message);
            setIsSubmitting(false);
          },
        });
      };

      if (pendingFile) {
        // Upload to S3 now (deferred from step 1)
        const timestamp = Date.now();
        const extension = pendingFile.name.split(".").pop() || "";
        const baseName = pendingFile.name.replace(`.${extension}`, "");
        const uniqueFilename = `${baseName}-${timestamp}.${extension}`;

        const fileBuffer = await pendingFile.arrayBuffer();
        const uint8Array = new Uint8Array(fileBuffer);
        const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
        const base64String = btoa(binaryString);

        uploadToS3.mutate(
          { filename: uniqueFilename, contentType: pendingFile.type, folder: "photos", fileBuffer: base64String },
          {
            onSuccess: (result) => doCreate(result.publicUrl),
            onError: (error) => {
              toast.error("Upload failed: " + error.message);
              setIsSubmitting(false);
            },
          }
        );
      } else {
        // File was already on S3
        doCreate(url ?? "");
      }
    }
  };

  // Handle previous step
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Reset entire form
  const handleReset = () => {
    setStep(0);
    setFormData(INITIAL_FORM_VALUES);
    setIsComplete(false);
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    setUrl(null);
    setExif(null);
    setImageInfo(undefined);
    setAddress(null);
    setPendingFile(null);
  };

  // Handle address update from location data
  const handleAddressUpdate = (addressData: any) => {
    setAddress(addressData);
  };

  // ========================================
  // Animation Configuration
  // ========================================

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // ========================================
  // Render Step Content
  // ========================================

  const renderStep = () => {
    const commonProps = {
      initialData: formData,
      isSubmitting,
      onBack: handleBack,
    };

    switch (step) {
      case 0:
        return (
          <FirstStep
            {...commonProps}
            url={url}
            exif={exif}
            imageInfo={imageInfo}
            onUploadSuccess={handleUploadSuccess}
            onReupload={handleReupload}
            onNext={handleNext}
          />
        );
      case 1:
        return <SecondStep {...commonProps} exif={exif} onNext={handleNext} />;
      case 2:
        return (
          <ThirdStep
            {...commonProps}
            onNext={handleNext}
            onAddressUpdate={handleAddressUpdate}
          />
        );
      case 3:
        return <FourthStep {...commonProps} onNext={handleNext} />;
      default:
        return null;
    }
  };

  // ========================================
  // Render
  // ========================================

  return (
    <div className={cn("mx-auto w-full", className)}>
      <ProgressBar currentStep={step} totalSteps={STEP_CONFIG.length} />
      <StepIndicator steps={STEP_CONFIG} currentStep={step} />

      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={`step-${step}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-4 bg-red-500 rounded-full" />
                <h2 className="text-lg font-black uppercase tracking-tight text-white">
                  {STEP_CONFIG[step].title}
                </h2>
              </div>
              <p className="text-white/40 text-xs pl-3">
                {STEP_CONFIG[step].description}
              </p>
            </div>

            {renderStep()}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <SuccessScreen onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
