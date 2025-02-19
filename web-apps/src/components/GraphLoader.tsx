"use client";

import { useEffect } from "react";
import { useLoadGraph } from "@react-sigma/core";
import Graph from "graphology";

export default function GraphLoader() {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();

    const nodes = [
      { id: "node1", label: "React", x: 0, y: 0 },
      { id: "node2", label: "JavaScript", x: 1, y: 1 },
      { id: "node3", label: "TypeScript", x: -1, y: 1 },
      { id: "node4", label: "Node.js", x: 2, y: 0 },
      { id: "node5", label: "GraphQL", x: -2, y: 0 },
      { id: "node6", label: "Redux", x: 0, y: 2 },
      { id: "node7", label: "Next.js", x: 1, y: -1 },
      { id: "node8", label: "Express", x: -1, y: -1 },
      { id: "node9", label: "MongoDB", x: 2, y: -2 },
      { id: "node10", label: "REST API", x: -2, y: -2 },
      { id: "node11", label: "WebSockets", x: 0, y: -2 },
    ];

    nodes.forEach((node) => {
      graph.addNode(node.id, {
        x: node.x,
        y: node.y,
        size: 15,
        label: node.label,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
    });

    const edges = [
      { from: "node1", to: "node2", label: "uses" },
      { from: "node1", to: "node3", label: "can use" },
      { from: "node1", to: "node6", label: "state management" },
      { from: "node2", to: "node4", label: "runtime" },
      { from: "node4", to: "node8", label: "framework" },
      { from: "node7", to: "node1", label: "based on" },
      { from: "node8", to: "node9", label: "connects to" },
      { from: "node8", to: "node10", label: "implements" },
      { from: "node4", to: "node11", label: "supports" },
      { from: "node5", to: "node10", label: "alternative to" },
      { from: "node3", to: "node2", label: "superset of" },
      { from: "node7", to: "node4", label: "uses" },
    ];

    edges.forEach((edge, index) => {
      graph.addEdge(edge.from, edge.to, {
        id: `edge${index}`,
        label: edge.label,
        size: 2,
        color: "#999999",
      });
    });

    loadGraph(graph);
  }, [loadGraph]);

  return null;
}
