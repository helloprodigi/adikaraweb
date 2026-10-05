import { redirect } from "next/navigation";
import { JordanEasterEgg } from "@/components/easter-egg/JordanEasterEgg";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SecretJordanPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nim = typeof params.nim === "string" ? params.nim : "";
  const key = typeof params.key === "string" ? params.key : "";

  if (nim !== "jorgenjorbigjor123" && key !== "jorgenjorbigjor123") {
    redirect("/rankings");
  }

  return <JordanEasterEgg />;
}
