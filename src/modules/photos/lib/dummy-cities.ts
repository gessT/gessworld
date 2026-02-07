/**
 * Dummy city search results data
 * Used for testing and UI development
 * Format matches SearchResult interface for location search
 */

export interface SearchResult {
  properties: {
    name: string;
    place_formatted: string;
    country?: string;
    country_code?: string;
    region?: string;
    place_name?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

export const DUMMY_CITIES: SearchResult[] = [
  {
    properties: {
      name: "Paris",
      place_formatted: "Paris, France",
      country: "France",
      country_code: "FR",
      region: "Île-de-France",
      place_name: "Paris",
    },
    geometry: {
      coordinates: [2.3522, 48.8566],
    },
  },
  {
    properties: {
      name: "Tokyo",
      place_formatted: "Tokyo, Japan",
      country: "Japan",
      country_code: "JP",
      region: "Tokyo",
      place_name: "Tokyo",
    },
    geometry: {
      coordinates: [139.6917, 35.6895],
    },
  },
  {
    properties: {
      name: "New York",
      place_formatted: "New York, United States",
      country: "United States",
      country_code: "US",
      region: "New York",
      place_name: "New York",
    },
    geometry: {
      coordinates: [-74.006, 40.7128],
    },
  },
  {
    properties: {
      name: "London",
      place_formatted: "London, United Kingdom",
      country: "United Kingdom",
      country_code: "GB",
      region: "England",
      place_name: "London",
    },
    geometry: {
      coordinates: [-0.1276, 51.5074],
    },
  },
  {
    properties: {
      name: "Dubai",
      place_formatted: "Dubai, United Arab Emirates",
      country: "United Arab Emirates",
      country_code: "AE",
      region: "Dubai",
      place_name: "Dubai",
    },
    geometry: {
      coordinates: [55.2708, 25.2048],
    },
  },
  {
    properties: {
      name: "Barcelona",
      place_formatted: "Barcelona, Spain",
      country: "Spain",
      country_code: "ES",
      region: "Catalonia",
      place_name: "Barcelona",
    },
    geometry: {
      coordinates: [2.1729, 41.3874],
    },
  },
  {
    properties: {
      name: "Sydney",
      place_formatted: "Sydney, Australia",
      country: "Australia",
      country_code: "AU",
      region: "New South Wales",
      place_name: "Sydney",
    },
    geometry: {
      coordinates: [151.2093, -33.8688],
    },
  },
  {
    properties: {
      name: "Bangkok",
      place_formatted: "Bangkok, Thailand",
      country: "Thailand",
      country_code: "TH",
      region: "Bangkok",
      place_name: "Bangkok",
    },
    geometry: {
      coordinates: [100.5018, 13.7563],
    },
  },
  {
    properties: {
      name: "Berlin",
      place_formatted: "Berlin, Germany",
      country: "Germany",
      country_code: "DE",
      region: "Berlin",
      place_name: "Berlin",
    },
    geometry: {
      coordinates: [13.405, 52.52],
    },
  },
  {
    properties: {
      name: "Rome",
      place_formatted: "Rome, Italy",
      country: "Italy",
      country_code: "IT",
      region: "Lazio",
      place_name: "Rome",
    },
    geometry: {
      coordinates: [12.4964, 41.9028],
    },
  },
  {
    properties: {
      name: "Amsterdam",
      place_formatted: "Amsterdam, Netherlands",
      country: "Netherlands",
      country_code: "NL",
      region: "North Holland",
      place_name: "Amsterdam",
    },
    geometry: {
      coordinates: [4.8945, 52.3676],
    },
  },
  {
    properties: {
      name: "Venice",
      place_formatted: "Venice, Italy",
      country: "Italy",
      country_code: "IT",
      region: "Veneto",
      place_name: "Venice",
    },
    geometry: {
      coordinates: [12.3345, 45.4408],
    },
  },
  {
    properties: {
      name: "Los Angeles",
      place_formatted: "Los Angeles, United States",
      country: "United States",
      country_code: "US",
      region: "California",
      place_name: "Los Angeles",
    },
    geometry: {
      coordinates: [-118.2437, 34.0522],
    },
  },
  {
    properties: {
      name: "Singapore",
      place_formatted: "Singapore, Singapore",
      country: "Singapore",
      country_code: "SG",
      region: "Singapore",
      place_name: "Singapore",
    },
    geometry: {
      coordinates: [103.8198, 1.3521],
    },
  },
  {
    properties: {
      name: "Istanbul",
      place_formatted: "Istanbul, Turkey",
      country: "Turkey",
      country_code: "TR",
      region: "Istanbul",
      place_name: "Istanbul",
    },
    geometry: {
      coordinates: [28.9784, 41.0082],
    },
  },
];
