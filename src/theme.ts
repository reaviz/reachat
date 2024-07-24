export interface ChatTheme {
  base: string;
  empty: string;
  sessions: {
    base: string;
    create: string;
    group: string;
    session: {
      base: string;
      delete: string;
    };
  };
  messages: {
    base: string;
    title: string;
    content: string;
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
    base: 'overflow-auto',
    group: 'text-xs text-gray-400 mt-4',
    create: 'mb-4',
    session: {
      base: '',
      delete: 'w-4 h-4'
    }
  },
  messages: {
    base: 'flex flex-col flex-1',
    title: 'text-2xl font-bold',
    content: 'mt-2 flex-1',
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
