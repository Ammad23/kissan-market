import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth";
import { getDefaultRouteForRole } from "@/lib/navigation";

export default async function AuthLandingPage() {
  const session = await getCurrentSession();

  if (!session?.user?.role) {
    redirect("/login");
  }

  redirect(getDefaultRouteForRole(session.user.role));
}
