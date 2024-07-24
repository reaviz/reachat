export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface ConversationSource {
  id: string;
  url?: string;
  title: string;
}

export interface Conversation {
  id: string;
  createdAt: Date;
  question: string;
  updatedAt?: Date;
  response?: string;
  sources?: ConversationSource[];
  files?: string[]; // TODO
  user?: User; // TODO
}

export interface Session {
  id: string;
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
  conversations: Conversation[];
}
