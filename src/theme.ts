export interface ChatTheme {
  base: string;
  list: {
    base: string;
    create: string;
  };
  messages: {
    base: string;
    input: string;
  }
}

export const chatTheme: ChatTheme = {
  base: 'text-white',
  list: {
    base: '',
    create: 'mb-4'
  },
  messages: {
    base: '',
    input: ''
  }
};
