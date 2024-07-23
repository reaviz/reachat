export interface ChatTheme {
  base: string;
  empty: string;
  sessions: {
    base: string;
    create: string;
    session: {
      base: string;
      delete: string;
    };
  };
  messages: {
    base: string;
    message: {
      base: string;
      question: string;
      response: string;
    };
  };
  input: {
    base: string;
    upload: string;
    input: string;
    send: string;
    stop: string;
  };
}

export const chatTheme: ChatTheme = {
  base: 'text-white',
  empty: 'text-center flex-1',
  sessions: {
    base: '',
    create: 'mb-4',
    session: {
      base: 'mb-4',
      delete: 'w-4 h-4'
    }
  },
  messages: {
    base: '',
    message: {
      base: '',
      question: '',
      response: ''
    }
  },
  input: {
    base: 'flex mt-4',
    upload: 'px-4 py-2 text-white',
    input: 'w-full',
    send: 'px-4 py-2 text-white',
    stop: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700'
  }
};
