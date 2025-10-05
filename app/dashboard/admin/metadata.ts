// app/dashboard/admin/metadata.ts
import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  const pathname = params?.slug?.join("/") || "";
  let title = "Admin Dashboard - DOLT";
  let description = "Manage your DOLT platform";

  if (pathname.includes("contacts")) {
    title = "Contacts - Admin - DOLT";
    description = "Manage customer inquiries and support requests on the DOLT platform";
  } else if (pathname.includes("bookings")) {
    title = "Bookings - Admin - DOLT";
    description = "Manage all bookings on the DOLT platform";
  } else if (pathname.includes("users")) {
    title = "Users - Admin - DOLT";
    description = "Manage user accounts on the DOLT platform";
  } else if (pathname.includes("providers")) {
    title = "Providers - Admin - DOLT";
    description = "Manage service providers on the DOLT platform";
  } else if (pathname.includes("payments")) {
    title = "Payments - Admin - DOLT";
    description = "Manage payment transactions on the DOLT platform";
  } else if (pathname.includes("setting")) {
    title = "Settings - Admin - DOLT";
    description = "Configure platform settings for the DOLT platform";
  }

  return { title, description };
}