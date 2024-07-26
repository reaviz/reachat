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
    date: string;
    content: string;
    header: string;
    showMore: string;
    message: {
      base: string;
      question: string;
      response: string;
      footer: {
        base: string;
        copy: string;
        upvote: string;
        downvote: string;
        refresh: string;
      };
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
    base: 'overflow-auto min-w-[150px] w-[30%] max-w-[300px] bg-[#11111F] p-5 rounded',
    group: 'text-xs text-gray-400 mt-4',
    create: 'mb-4',
    session: {
      base: '',
      delete: '[&>svg]:w-4 [&>svg]:h-4 opacity-50'
    }
  },
  messages: {
    base: 'flex flex-col flex-1 overflow-hidden',
    title: 'text-2xl font-bold',
    date: 'text-sm',
    content: 'mt-2 flex-1 overflow-auto',
    header: 'flex justify-between items-center',
    showMore: 'mb-4',
    message: {
      base: 'mb-6 flex flex-col border-gray-400 border p-5 rounded',
      question: 'font-semibold text-gray-400 mb-1',
      response: '',
      footer: {
        base: 'mt-3 flex gap-3',
        copy: '[&>svg]:w-4 [&>svg]:h-4 opacity-50',
        upvote: '[&>svg]:w-4 [&>svg]:h-4 opacity-50',
        downvote: '[&>svg]:w-4 [&>svg]:h-4 opacity-50',
        refresh: '[&>svg]:w-4 [&>svg]:h-4 opacity-50'
      }
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
