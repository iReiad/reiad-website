import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadHub } from "../../../components/hub";
import { READ_HUB } from "../../../lib/hub";
import { hubMetadata } from "../../../lib/metadata";
import { piecesIn } from "../../../lib/pieces";

type Params = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;
  return READ_HUB[section] ? hubMetadata(section) : {};
}

export default async function ReadHubPage({ params }: Params) {
  const { section } = await params;
  const copy = READ_HUB[section];
  if (!copy) notFound();

  return <ReadHub copy={copy} pieces={await piecesIn(section)} />;
}
