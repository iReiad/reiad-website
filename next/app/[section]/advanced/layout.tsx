/* The study planner's shell: the German school's, because the
   page is one of its tools, so the rail marks German and the
   footer is the school's. `advanced` is a static segment beside
   `[slug]`, which is what stops it being read as a stage, and it
   answers under one school only. */

import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SchoolShell } from "../[slug]/layout";

export default async function AdvancedLayout({
  children, params,
}: {
  children: ReactNode;
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (section !== "deutsch") notFound();
  return <SchoolShell school="deutsch" crumb="Advanced learners">{children}</SchoolShell>;
}
