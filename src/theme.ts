export interface ChatTheme {
  base: string;
  console: string;
  companion: string;
  empty: string;
  sessions: {
    base: string;
    console: string;
    companion: string;
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
    console: string;
    companion: string;
    back: string;
    inner: string;
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
        toolbar: string;
        li: string;
        ul: string;
        ol: string;
        copy: string;
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
    actions: {
      base: string;
      send: string;
      stop: string;
    };
  };
}

export const chatTheme: ChatTheme = {
  base: 'text-white',
  console: 'flex w-full gap-5 h-full',
  companion: 'w-full h-full overflow-hidden',
  empty: 'text-center flex-1',
  sessions: {
    base: 'overflow-auto',
    console: 'min-w-[150px] w-[30%] max-w-[300px] bg-[#11111F] p-5 rounded-3xl',
    companion: 'w-full h-full',
    group: 'text-xs text-gray-400 mt-4 hover:bg-transparent mb-1',
    create:
      'relative mb-4 rounded-[10px]',
    session: {
      base: 'my-1 rounded-[10px] p-2 text-typography hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50',
      active:
        'bg-gray-800/70 border border-gray-700/70 hover:bg-gray-800/50 border-gray-700/50 text-white',
      delete: '[&>svg]:w-4 [&>svg]:h-4 opacity-50'
    }
  },
  messages: {
    base: '',
    console: 'flex flex-col flex-1 overflow-hidden',
    companion: 'flex w-full h-full',
    back: 'self-start p-0 my-2',
    inner: 'flex-1 h-full flex flex-col',
    title: 'text-2xl font-bold',
    date: 'text-sm whitespace-nowrap pt-2',
    content: 'mt-2 flex-1 overflow-y-auto overflow-x-hidden',
    header: 'flex justify-between items-start gap-2',
    showMore: 'mb-4',
    message: {
      base: 'mt-4 mb-4 flex flex-col p-0 rounded border-none',
      question:
        'font-semibold text-gray-400 mb-4 px-4 py-3 pb-1 rounded-3xl rounded-br-none text-typography bg-gray-900/60 border border-gray-700/50',
      response: '',
      cursor: 'inline-block w-1 h-4 bg-current',
      files: {
        base: 'mb-2 flex flex-wrap gap-3 ',
        file: {
          base: 'flex items-center gap-2 border border-gray-700 p-2 rounded cursor-pointer',
          name: 'text-sm'
        }
      },
      sources: {
        base: 'my-4 flex flex-wrap gap-3',
        source: {
          base: 'flex gap-2 border border-gray-700 p-2 rounded cursor-pointer',
          image: 'w-6 h-6 rounded-md',
          title: 'text-md block',
          url: 'text-sm text-blue-700 underline'
        }
      },
      markdown: {
        copy: 'sticky py-1 [&>svg]:w-4 [&>svg]:h-4 opacity-50',
        p: 'mb-2',
        a: 'text-blue-700 underline',
        table: 'table-auto w-full m-2',
        th: 'px-4 py-2 text-left font-bold border-b border-gray-500',
        td: 'px-4 py-2',
        code: 'm-2 rounded-b relative',
        toolbar: 'text-xs bg-gray-700/50 flex items-center justify-between px-2 py-1 rounded-t sticky top-0 backdrop-blur-md',
        li: 'mb-2 ml-6',
        ul: 'mb-4 list-disc',
        ol: 'mb-4 list-decimal'
      },
      footer: {
        base: 'mt-3 flex gap-1.5',
        copy: 'p-3 rounded-[10px] [&>svg]:w-4 [&>svg]:h-4 opacity-50 hover:!opacity-100 hover:bg-gray-700/40 hover:text-white',
        upvote:
          'p-3 rounded-[10px] [&>svg]:w-4 [&>svg]:h-4 opacity-50 hover:!opacity-100 hover:bg-gray-700/40 hover:text-white',
        downvote:
          'p-3 rounded-[10px] [&>svg]:w-4 [&>svg]:h-4 opacity-50 hover:!opacity-100 hover:bg-gray-700/40 hover:text-white',
        refresh:
          'p-3 rounded-[10px] [&>svg]:w-4 [&>svg]:h-4 opacity-50 hover:!opacity-100 hover:bg-gray-700/40 hover:text-white'
      }
    }
  },
  input: {
    base: 'flex mt-4 relative',
    upload: 'px-5 py-2 text-white size-10',
    input:
      'w-full text-typography border border-gray-700/70 rounded-3xl px-3 py-2 pr-16 after:!mx-10 [&>textarea]:w-full',
    actions: {
      base: 'absolute flex gap-2 items-center right-5 top-[50%] -translate-y-1/2 z-10',
      send: 'px-3 py-3 text-white bg-gray-800 hover:bg-primary-hover rounded-full ',
      stop: 'px-2 py-2 bg-red-500 text-white rounded-full hover:bg-red-700 '
    }
  }
};
