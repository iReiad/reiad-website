/* The money school's shell, around its full index. Same shell its
   hub and its lessons carry, from the same place, for the same
   reason: one school, one footer. */

import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isSchool } from "@reiad/shared/schools";
import { SchoolShell } from "../[slug]/layout";

export default async function ContentsLayout({
  children, params,
}: {
  children: ReactNode;
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!isSchool(section)) notFound();
  return <SchoolShell school={section}>{children}</SchoolShell>;
}
