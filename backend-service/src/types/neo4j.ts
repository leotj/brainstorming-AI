import { Integer, Node, Relationship } from 'neo4j-driver';

interface TopicProperties {
  id: string;
  label: string;
}

type Topic = Node<Integer, TopicProperties>;

type RelatedTo = Relationship<Integer>;

export interface TopicRelatedToTopic {
  t1: Topic;
  r: RelatedTo;
  t2: Topic;
}
