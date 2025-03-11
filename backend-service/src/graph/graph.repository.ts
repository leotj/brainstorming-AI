import { Injectable } from '@nestjs/common';
import { SurrealdbService } from 'src/surrealdb/surrealdb.service';
import { NER } from './graph.type';
import Surreal from 'surrealdb';

@Injectable()
export class GraphRepository {
  db: Surreal;

  constructor(private readonly surrealdbService: SurrealdbService) {
    this.db = this.surrealdbService.getDB();
  }

  async addUserKnowledgeGraph(userId: string, conversationId: string, graphData: NER) {
    return await this.db.query(
      `
      BEGIN TRANSACTION;

      LET $user = UPSERT user SET cookieId = <UUID>$cookieId WHERE cookieId = <UUID>$cookieId;
      LET $conversation = UPSERT conversation SET openAIId = $openAIId WHERE openAIId = $openAIId;

      IF (array::is_empty(SELECT * from user_has_conversation WHERE in = $user[0].id AND out = $conversation[0].id)) THEN
          RELATE ONLY $user->user_has_conversation->$conversation;
      END;

      LET $conversationTopics = SELECT * from conversation_has_topic WHERE in = $conversation[0].id;

      IF (array::is_empty($conversationTopics)) {
          LET $newTopics = INSERT INTO topic $graph.nodes;
          RELATE $conversation->conversation_has_topic->$newTopics;
      } ELSE {
          LET $uniqueTopics = array::complement($graph.nodes.label, $conversationTopics.out.label);

          IF (!array::is_empty($uniqueTopics)) {
              LET $newTopics = INSERT INTO topic array::map($uniqueTopics, |$t| {
                  RETURN {
                      label: $t
                  }
              });
              RELATE $conversation->conversation_has_topic->$newTopics;
          }
      };

      FOR $edge IN $graph.edges {
          LET $topics = SELECT * from topic WHERE label IN [$edge.from, $edge.to];
          LET $fromTopic = $topics[0].id;
          LET $toTopic = $topics[1].id;

          IF (array::is_empty(SELECT * FROM topic_relates_to_topic WHERE in = $fromTopic AND out = $toTopic)) {
              RELATE $fromTopic->topic_relates_to_topic->$toTopic
                  CONTENT {
                      label: $edge.label
                  }
          }
      };

      COMMIT TRANSACTION;
      `,
      {
        cookieId: userId,
        openAIId: conversationId,
        graph: graphData,
      },
    );
  }

  async getUserKnowledgeGraph(userId: string, conversationId: string) {
    return await this.db.query(
      `
      BEGIN TRANSACTION;
      LET $conversations = (SELECT out FROM user_has_conversation WHERE in.cookieId = <uuid> $cookieId AND out.openAIId = $openAIId);
      LET $topics = (SELECT out FROM conversation_has_topic WHERE in.id INSIDE $conversations.out);
      LET $edges = (SELECT id, in.id AS from, out.id AS to, label FROM topic_relates_to_topic WHERE in.id INSIDE $topics.out);
      RETURN {
          nodes: $topics.out.*,
          edges: $edges
      };
      COMMIT TRANSACTION;
      `,
      {
        cookieId: userId,
        openAIId: conversationId,
      },
    );
  }

  async deleteUserKnowledgeGraph(userId: string, conversationId: string) {
    return await this.db.query(
      `
      BEGIN TRANSACTION;

      LET $conversations = SELECT out FROM user_has_conversation WHERE in.cookieId = <UUID>$cookieId AND out.openAIId = $openAIId;

      LET $topics = SELECT out from conversation_has_topic WHERE in.id IN $conversations.out;

      DELETE topic WHERE id IN $topics.out;
      DELETE conversation WHERE id IN $conversations.out;

      COMMIT TRANSACTION;
      `,
      {
        cookieId: userId,
        openAIId: conversationId,
      },
    );
  }
}
