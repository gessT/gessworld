"use client";

import dynamic from "next/dynamic";
import type { User } from "@/modules/auth/lib/auth-types";

// Dynamically imported to avoid Radix UI useId() hydration mismatch
// caused by the async server component (DashboardSidebar) shifting the React tree depth.
const NavUser = dynamic(
  () =>
    import("./nav-user").then((m) => ({ default: m.NavUser })),
  { ssr: false }
);

export function NavUserClient({ user }: { user: User }) {
  return <NavUser user={user} />;
}
