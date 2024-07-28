export interface ConversationSource {
  /**
   * Unique identifier for the conversation source
   */
  id: string;

  /**
   * URL of the source, if applicable
   */
  url?: string;

  /**
   * Title or description of the source
   */
  title: string;
}

export interface Conversation {
  /**
   * Unique identifier for the conversation
   */
  id: string;

  /**
   * Date and time when the conversation was created
   */
  createdAt: Date;

  /**
   * Date and time when the conversation was last updated
   */
  updatedAt?: Date;

  /**
   * The user's question or input that initiated the conversation
   */
  question: string;

  /**
   * The AI's response to the user's question
   */
  response?: string;

  /**
   * Array of sources referenced in the conversation
   */
  sources?: ConversationSource[];

  /**
   * Array of file paths or identifiers associated with the conversation
   */
  files?: string[];
}

export interface Session {
  /**
   * Unique identifier for the session
   */
  id: string;

  /**
   * Title of the session
   */
  title?: string;

  /**
   * Date and time when the session was created
   */
  createdAt?: Date;

  /**
   * Date and time when the session was last updated
   */
  updatedAt?: Date;

  /**
   * Array of conversations within this session
   */
  conversations: Conversation[];
}
