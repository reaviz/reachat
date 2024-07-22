export interface LlmOptions {
  provider: 'openai' | 'claude' | 'gemini';
}

export const useLlm = (options: LlmOptions) => {
  // Goal of the hook is to provider a data provider wrapper
  // for the streaming data.
};
