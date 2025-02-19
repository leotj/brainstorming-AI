export interface Node {
  id: string;
  label: string;
}

export interface Edge {
  source: string;
  target: string;
  label: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}
