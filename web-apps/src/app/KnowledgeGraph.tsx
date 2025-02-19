"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const SigmaContainer = dynamic(
  () => import("@react-sigma/core").then((mod) => mod.SigmaContainer),
  { ssr: false }
);

const GraphLoader = dynamic(() => import("@/components/GraphLoader"), {
  ssr: false,
});

export default function KnowledgeGraph() {
  const sigmaStyle = { height: "500px", width: "1000px" };

  return (
    <SigmaContainer style={sigmaStyle}>
      <Suspense fallback={null}>
        <GraphLoader />
      </Suspense>
    </SigmaContainer>
  );
}
