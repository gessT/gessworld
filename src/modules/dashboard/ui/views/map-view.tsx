"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const MapView = () => {
  return (
    <div className="w-full h-[600px]">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Map Feature Removed</CardTitle>
          <CardDescription>
            The map visualization feature has been disabled
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Map feature is no longer available</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
