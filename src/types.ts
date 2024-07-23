export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface ConversationSource {
  id: string;
  url: string;
  title: string;
}

export interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  question: string;
  response?: string;
  sources?: ConversationSource[];
  user?: User;
}

export interface Session {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  conversations: Conversation[];
}

export interface ResponseTransformer {
  (response: string, next: (transformedResponse: string) => string): string;
}
