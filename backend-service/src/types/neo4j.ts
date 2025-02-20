import { Integer, Node, Relationship } from 'neo4j-driver';

interface TopicProperties {
  id: string;
  label: string;
}

type Topic = Node<Integer, TopicProperties>;

type RelatedTo = Relationship<Integer>;

export interface TopicRelatedToTopic {
  n: Topic;
  r: RelatedTo;
  m: Topic;
}
