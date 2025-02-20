"use client";

import { useEffect } from "react";
import { useLoadGraph } from "@react-sigma/core";
import { useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import Graph from "graphology";
import { GraphData } from "@/types/graph";

export default function GraphLoader(props: { graph: GraphData}) {
  const loadGraph = useLoadGraph();
  const { assign } = useLayoutForceAtlas2();

  useEffect(() => {
    const graph = new Graph();

    props.graph.nodes.forEach((node) => {
      graph.addNode(node.id, {
        x: Math.random() * 10, // Initial random position
        y: Math.random() * 10, // Initial random position
        size: 15,
        label: node.label,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
    });

    props.graph.edges.forEach((edge, index) => {
      graph.addEdge(edge.from, edge.to, {
        id: `edge${index}`,
        label: edge.label,
        size: 2,
        color: "#999999",
      });
    });

    loadGraph(graph);
    assign(); // Apply ForceAtlas2 layout
  }, [loadGraph, assign, props.graph]);

  return null;
}
