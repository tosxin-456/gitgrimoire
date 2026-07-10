import { redirect } from "next/navigation";
import { CeremonyScene } from "@/components/ceremony/CeremonyScene";

interface PageProps {
  searchParams: Promise<{ user?: string }>;
}

export default async function CeremonyPage({ searchParams }: PageProps) {
  const { user } = await searchParams;
  const login = user?.trim().replace(/^@/, "");

  if (!login) {
    redirect("/");
  }

  return <CeremonyScene login={login} />;
}
