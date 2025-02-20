export interface Node {
  id: string;
  label: string;
}

export interface Edge {
  from: string;
  to: string;
  label: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}
