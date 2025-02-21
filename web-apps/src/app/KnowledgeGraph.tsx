"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { GraphData } from "@/types/graph";
import { socket } from "./socket";

const SigmaContainer = dynamic(
  () => import("@react-sigma/core").then((mod) => mod.SigmaContainer),
  { ssr: false }
);

const GraphLoader = dynamic(() => import("@/components/GraphLoader"), {
  ssr: false,
});

export default function KnowledgeGraph() {
  const [isConnected, setIsConnected] = useState(false);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: []
  });

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGraphDataUpdated(data: GraphData) {
      setGraphData(data);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("graphDataUpdated", onGraphDataUpdated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("graphDataUpdated", onGraphDataUpdated);
    };
  }, [isConnected]);

  return (
    <SigmaContainer className="flex h-screen">
      <Suspense fallback={null}>
        <GraphLoader graph={graphData}/>
      </Suspense>
    </SigmaContainer>
  );
}
