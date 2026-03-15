import { TripForm } from "../components/trip-form";

export const NewTripView = () => {
  return (
    <div className="px-4 md:px-8 py-4 md:py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">New Trip</h2>
        <p className="text-muted-foreground text-sm">
          Fill in the details below to create a new photography trip.
        </p>
      </div>
      <TripForm />
    </div>
  );
};
