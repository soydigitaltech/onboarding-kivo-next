import {
  CapturaMovil,
} from "@/components/onboarding/captura/CapturaMovil";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function CapturaPage({
  params,
}: PageProps) {
  const { token } = await params;

  return (
    <CapturaMovil token={token} />
  );
}
