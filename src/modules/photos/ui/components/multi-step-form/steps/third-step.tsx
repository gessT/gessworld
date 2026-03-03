import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ArrowLeft, X, MapPin, Loader2, Search, Link2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { thirdStepSchema, StepProps, ThirdStepData } from "../types";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { POPULAR_CITIES, searchCities, type SearchResult } from "@/modules/photos/lib/dummy-cities";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface SelectedLocation {
  name: string;
  formatted: string;
  lat: number;
  lng: number;
  albumId?: string;
  coverPhotoUrl?: string;
}

interface ThirdStepProps extends StepProps {
  onAddressUpdate?: (addressData: any) => void;
}

function OsmMap({ lat, lng }: { lat: number; lng: number }) {
  const delta = 0.08;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <div className="relative w-full h-[180px] overflow-hidden">
      <iframe
        src={src}
        className="absolute inset-0 w-full h-full border-0"
        style={{ filter: "invert(90%) hue-rotate(180deg) brightness(0.9) saturate(0.8)" }}
        title="Location map"
        loading="lazy"
      />
      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

export function ThirdStep({
  onNext,
  onBack,
  initialData,
  isSubmitting,
  onAddressUpdate,
}: ThirdStepProps) {
  const initialLongitude = initialData?.longitude ?? 0;
  const initialLatitude = initialData?.latitude ?? 0;

  const trpc = useTRPC();
  const { data: albums = [], isLoading: albumsLoading } = useQuery(
    trpc.city.getMany.queryOptions()
  );

  const [mode, setMode] = useState<"album" | "search">("album");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState<SelectedLocation | null>(null);

  const form = useForm<ThirdStepData>({
    resolver: zodResolver(thirdStepSchema),
    defaultValues: {
      latitude: initialData?.latitude ?? 0,
      longitude: initialData?.longitude ?? 0,
      ...initialData,
    },
    mode: "onChange",
  });

  const { handleSubmit } = form;

  // Search logic
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchCities(searchQuery);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(handleSearch, 300);
    return () => clearTimeout(t);
  }, [searchQuery, handleSearch]);

  // Select from search results
  const handleSelectSearch = (result: SearchResult) => {
    const [lng, lat] = result.geometry.coordinates;
    setSelected({
      name: result.properties.name,
      formatted: result.properties.place_formatted,
      lat, lng,
    });
    setSearchQuery(result.properties.name);
    setSearchResults([]);
    onAddressUpdate?.({
      country: result.properties.country,
      countryCode: result.properties.country_code,
      region: result.properties.region,
      city: result.properties.place_name,
      fullAddress: result.properties.place_formatted,
      latitude: lat,
      longitude: lng,
    });
  };

  // Select from city album
  const handleSelectAlbum = (album: typeof albums[0]) => {
    // Albums have no lat/lng in schema  use 0,0 fallback
    setSelected({
      name: album.city,
      formatted: `${album.city}, ${album.country}`,
      lat: 0,
      lng: 0,
      albumId: album.id,
      coverPhotoUrl: album.coverPhotoUrl,
    });
    onAddressUpdate?.({
      country: album.country,
      countryCode: album.countryCode,
      city: album.city,
      fullAddress: `${album.city}, ${album.country}`,
    });
  };

  const handleClear = () => {
    setSelected(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const onSubmit = (data: ThirdStepData) => {
    onNext({
      ...data,
      latitude: selected?.lat || initialLatitude,
      longitude: selected?.lng || initialLongitude,
    });
  };

  const hasMap = selected && selected.lat !== 0 && selected.lng !== 0;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Mode toggle */}
        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3 block">
            Location
          </label>
          <div className="flex gap-2 p-1 rounded-lg bg-white/5 border border-white/8">
            <button
              type="button"
              onClick={() => { setMode("album"); handleClear(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${
                mode === "album"
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Link Album
            </button>
            <button
              type="button"
              onClick={() => { setMode("search"); handleClear(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${
                mode === "search"
                  ? "bg-white/10 text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              New Location
            </button>
          </div>
        </div>

        {/* Album picker */}
        {mode === "album" && (
          <div>
            {albumsLoading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-white/30">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading albums...</span>
              </div>
            ) : albums.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-white/8 text-center">
                <MapPin className="h-7 w-7 text-white/15 mb-2" />
                <p className="text-white/30 text-sm">No city albums yet</p>
                <p className="text-white/20 text-xs mt-0.5">Switch to "New Location" to search</p>
              </div>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2 pr-1">
                  {albums.map((album) => {
                    const isActive = selected?.albumId === album.id;
                    return (
                      <button
                        key={album.id}
                        type="button"
                        onClick={() => handleSelectAlbum(album)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors text-left ${
                          isActive
                            ? "border-red-500/40 bg-red-600/8"
                            : "border-white/8 bg-white/3 hover:border-white/16 hover:bg-white/6"
                        }`}
                      >
                        {album.coverPhotoUrl ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                            <Image
                              src={album.coverPhotoUrl}
                              alt={album.city}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-white/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${isActive ? "text-red-300" : "text-white"}`}>
                            {album.city}
                          </p>
                          <p className="text-xs text-white/40 truncate">{album.country} &middot; {album.photoCount} photos</p>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {/* Search / new location */}
        {mode === "search" && (
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                <Input
                  placeholder="Search by city or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (!searchQuery.trim()) setSearchResults(POPULAR_CITIES); }}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-red-500 focus-visible:border-red-500/40 rounded-lg h-9 text-sm"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 animate-spin" />
                )}
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 h-9 rounded-lg border border-white/10 bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="absolute z-20 w-full mt-1 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-xl overflow-hidden">
                <ScrollArea className="h-[200px]">
                  {searchResults.map((result, i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-start gap-3 border-b border-white/5 last:border-b-0"
                      onClick={() => handleSelectSearch(result)}
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

            {!selected && !searchQuery && (
              <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-white/8 bg-white/2 text-center mt-3">
                <MapPin className="h-8 w-8 text-white/15 mb-2" />
                <p className="text-white/30 text-sm">Search for a city to tag this photo</p>
                <p className="text-white/20 text-xs mt-0.5">Optional - you can skip this step</p>
              </div>
            )}
          </div>
        )}

        {/* Selected preview */}
        {selected && (
          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#141414]">
            {hasMap ? (
              <OsmMap lat={selected.lat} lng={selected.lng} />
            ) : selected.coverPhotoUrl ? (
              <div className="relative w-full h-[180px]">
                <Image
                  src={selected.coverPhotoUrl}
                  alt={selected.name}
                  fill
                  className="object-cover opacity-60"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_16px_6px_rgba(239,68,68,0.5)]" />
                </div>
              </div>
            ) : (
              <div className="relative w-full h-[180px] bg-[#0e0e0e] overflow-hidden">
                <div className="absolute inset-0 opacity-8"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)`,
                    backgroundSize: "36px 36px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {[110, 72, 40].map((s) => (
                    <div key={s} className="absolute rounded-full border border-white/8" style={{ width: s, height: s }} />
                  ))}
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_14px_5px_rgba(239,68,68,0.45)]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
              </div>
            )}

            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-red-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-bold truncate">{selected.name}</p>
                  <p className="text-white/40 text-xs truncate">{selected.formatted}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {hasMap && (
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-white/30 leading-tight">{selected.lat.toFixed(4)}</p>
                    <p className="text-[10px] font-mono text-white/30 leading-tight">{selected.lng.toFixed(4)}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-6 h-6 rounded-md bg-white/8 hover:bg-white/16 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-white/40" />
                </button>
              </div>
            </div>
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
