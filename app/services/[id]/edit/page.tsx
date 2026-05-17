import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LegacyEditServicePage({ params }: Props) {
  const { id } = await params;
  redirect(`/developer/services/${id}/edit`);
}
