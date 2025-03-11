export interface NER {
  nodes: {
    label: string;
  }[];
  edges: {
    from: string;
    to: string;
    label: string;
  }[];
}
