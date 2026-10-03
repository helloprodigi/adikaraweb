import { Suspense } from "react";
import { TeamScore } from "@/components/team-score/TeamScore";

export default function TeamScorePage() {
  return (
    <Suspense fallback={null}>
      <TeamScore />
    </Suspense>
  );
}