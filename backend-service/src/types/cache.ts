export interface MessageCache {
  role: string;
  content: string;
}

export interface ConversationCache {
  id?: string;
  messages?: MessageCache[];
}
