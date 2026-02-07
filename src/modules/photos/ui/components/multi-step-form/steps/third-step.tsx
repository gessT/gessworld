import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, MapPin } from "lucide-react";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { thirdStepSchema, StepProps, ThirdStepData } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ButtonGroup } from "@/components/ui/button-group";
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>Search for a place</FormLabel>
          {/* Search Input */}
          <div className="relative mb-2">
            <ButtonGroup>
              <Input
                placeholder="Search by city or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
              />
              <Button
                variant="outline"
                aria-label="Search"
                onClick={handleClearSearch}
                disabled={!searchQuery || isSearching}
              >
                <X />
              </Button>
            </ButtonGroup>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card className="absolute z-10 w-full mt-1 p-0 shadow-lg">
                <ScrollArea className="h-[200px]">
                  <div className="p-0">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-accent transition-colors flex items-start gap-2 border-b last:border-b-0"
                        onClick={() => handleSelectLocation(result)}
                      >
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {result.properties.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.properties.place_formatted}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </div>

          <FormControl>
            <div className="h-[400px] w-full rounded-md border overflow-hidden flex items-center justify-center bg-muted text-sm text-muted-foreground">
              Map feature removed
            </div>
          </FormControl>

          {/* Address Display */}
          <div className="space-y-1 text-sm text-muted-foreground mt-2">
            {searchQuery && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="text-xs font-medium text-foreground">
                  Selected: {searchQuery}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">
                {currentLocation.lat !== 0 && currentLocation.lng !== 0
                  ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                  : "Select a city to set location"}
              </span>
            </div>
          </div>
        </FormItem>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button type="submit" disabled={isSubmitting || !isValid}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
