import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useEffect, useCallback } from "react";
import { ArrowRight, ArrowLeft, X, MapPin } from "lucide-react";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import { thirdStepSchema, StepProps, ThirdStepData } from "../types";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DUMMY_CITIES, type SearchResult } from "@/modules/photos/lib/dummy-cities";

interface ThirdStepProps extends StepProps {
  onAddressUpdate?: (addressData: any) => void;
}

export function ThirdStep({
  onNext,
  onBack,
  initialData,
  isSubmitting,
  onAddressUpdate,
}: ThirdStepProps) {
  // Get initial coordinates from EXIF data or form data
  const initialLongitude = initialData?.longitude ?? 0;
  const initialLatitude = initialData?.latitude ?? 0;

  // Manage current location state
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: initialLatitude || 0,
    lng: initialLongitude || 0,
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<ThirdStepData>({
    resolver: zodResolver(thirdStepSchema),
    defaultValues: {
      latitude: initialData?.latitude ?? 0,
      longitude: initialData?.longitude ?? 0,
      ...initialData,
    },
    mode: "onChange",
  });

  const { handleSubmit, formState } = form;
  const { isValid } = formState;

  // Search for places from dummy data
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Filter dummy cities based on search query
      const query = searchQuery.toLowerCase();
      const filtered = DUMMY_CITIES.filter(
        (city) =>
          city.properties.name.toLowerCase().includes(query) ||
          city.properties.country?.toLowerCase().includes(query) ||
          city.properties.place_formatted.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Auto-search when query changes (with debounce)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms delay

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, handleSearch]);

  // Handle selecting a search result
  const handleSelectLocation = (result: SearchResult) => {
    const [lng, lat] = result.geometry.coordinates;
    setCurrentLocation({ lat, lng });
    
    // Update search query with selected location
    setSearchQuery(result.properties.name);
    setSearchResults([]);
    
    // Update form fields
    form.setValue("city_set", result.properties.name);
    
    // Update address data when location is selected
    if (onAddressUpdate) {
      onAddressUpdate({
        country: result.properties.country,
        countryCode: result.properties.country_code,
        region: result.properties.region,
        city: result.properties.place_name,
        fullAddress: result.properties.place_formatted || result.properties.place_name,
        placeFormatted: result.properties.place_formatted || result.properties.place_name,
        latitude: lat,
        longitude: lng,
      });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Show all cities when input is focused but empty
  const handleInputFocus = () => {
    if (!searchQuery.trim()) {
      setSearchResults(DUMMY_CITIES);
    }
  };

  // Memoize map values to reduce re-renders
  const mapValues = useMemo(() => {
    const longitude = currentLocation.lng || initialLongitude;
    const latitude = currentLocation.lat || initialLatitude;

    return {
      markers:
        longitude === 0 && latitude === 0
          ? []
          : [
              {
                id: "location",
                longitude,
                latitude,
              },
            ],
      viewState: {
        longitude: longitude || -122.4, // Default to San Francisco
        latitude: latitude || 37.8,
        zoom: longitude === 0 && latitude === 0 ? 2 : 10,
      },
    };
  }, [
    currentLocation.lat,
    currentLocation.lng,
    initialLatitude,
    initialLongitude,
  ]);

  const onSubmit = (data: ThirdStepData) => {
    // Include current location and city_set in submitted data
    onNext({
      ...data,
      latitude: currentLocation.lat || initialLatitude,
      longitude: currentLocation.lng || initialLongitude,
      city_set: searchQuery || data.city_set,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="relative">
          <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1.5 block">
            City / Location
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
              <Input
                placeholder="Search by city or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-red-500 focus-visible:border-red-500/40 rounded-lg h-9 text-sm"
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-3 h-9 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/8 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {searchResults.length > 0 && (
            <div className="absolute z-20 w-full mt-1 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-xl overflow-hidden">
              <ScrollArea className="h-[220px]">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-start gap-3 border-b border-white/5 last:border-b-0"
                    onClick={() => handleSelectLocation(result)}
                  >
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-red-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white truncate">{result.properties.name}</p>
                      <p className="text-xs text-white/40 truncate">{result.properties.place_formatted}</p>
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Selected Location Summary */}
        {searchQuery && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-600/5">
            <div className="w-6 h-6 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-3 h-3 text-red-400" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">{searchQuery}</p>
              {currentLocation.lat !== 0 && currentLocation.lng !== 0 && (
                <p className="text-white/40 text-xs font-mono">
                  {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-white/8 bg-white/2 text-center">
            <MapPin className="h-8 w-8 text-white/15 mb-2" />
            <p className="text-white/30 text-sm">Search for a city to tag this photo</p>
            <p className="text-white/20 text-xs mt-0.5">Optional — you can skip this step</p>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold uppercase tracking-wide px-4 py-2.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded-lg transition-colors">
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </Form>
  );
}
