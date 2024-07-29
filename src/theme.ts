export interface ChatTheme {
  base: string;
  console: string;
  companion: string;
  empty: string;
  sessions: {
    base: string;
    create: string;
    group: string;
    session: {
      base: string;
      active: string;
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
      cursor: string;
      files: {
        base: string;
        file: {
          base: string;
          name: string;
        };
      };
      sources: {
        base: string;
        source: {
          base: string;
          image: string;
          title: string;
          url: string;
        };
      };
      markdown: {
        p: string;
        a: string;
        table: string;
        th: string;
        td: string;
        code: string;
        li: string;
        ul: string;
        ol: string;
      };
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
  console: 'flex w-full gap-5 h-full',
  companion: 'p-4',
  empty: 'text-center flex-1',
  sessions: {
    base: 'overflow-auto min-w-[150px] w-[30%] max-w-[300px] bg-[#11111F] p-5 rounded',
    group: 'text-xs text-gray-400 mt-4',
    create: 'mb-4',
    session: {
      base: '',
      active: ' text-primary',
      delete: '[&>svg]:w-4 [&>svg]:h-4 opacity-50'
    }
  },
  messages: {
    base: 'flex flex-col flex-1 overflow-hidden',
    title: 'text-2xl font-bold',
    date: 'text-sm whitespace-nowrap pt-2',
    content: 'mt-2 flex-1 overflow-auto',
    header: 'flex justify-between items-start gap-2',
    showMore: 'mb-4',
    message: {
      base: 'mb-6 flex flex-col p-5 rounded',
      question: 'font-semibold text-gray-400 mb-1',
      response: '',
      cursor: 'inline-block w-1 h-4 bg-current',
      files: {
        base: 'mb-2 flex gap-3',
        file: {
          base: 'flex gap-2 border border-gray-700 p-2 rounded cursor-pointer',
          name: 'text-sm'
        }
      },
      sources: {
        base: 'my-4 flex gap-3',
        source: {
          base: 'flex gap-2 border border-gray-700 p-2 rounded cursor-pointer',
          image: 'w-6 h-6 rounded-md',
          title: 'text-md block',
          url: 'text-sm text-blue-700 underline'
        }
      },
      markdown: {
        p: 'mb-2',
        a: 'text-blue-700 underline',
        table: 'table-auto w-full m-2',
        th: 'px-4 py-2 text-left font-bold border-b border-gray-500',
        td: 'px-4 py-2',
        code: 'm-2 rounded',
        li: 'mb-2 ml-6',
        ul: 'mb-4 list-disc',
        ol: 'mb-4 list-decimal'
      },
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
