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
      overlay: string;
      expand: string;
      recommended: string;
      rimage: string;
      markdownBorder: string;
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
          companion: string;
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
  base: 'dark:text-white text-gray-500',
  console: 'flex w-full gap-4 h-full',
  companion: 'w-full h-full overflow-hidden',
  empty: 'text-center flex-1',
  sessions: {
    base: 'overflow-auto',
    console:
      'min-w-[150px] w-[30%] max-w-[300px] dark:bg-[#11111F] bg-[#F2F3F7] p-5 rounded-3xl',
    companion: 'w-full h-full',
    group:
      'text-xs dart:text-gray-400 text-gray-700 mt-4 hover:bg-transparent mb-1',
    create: 'relative mb-4 rounded-[10px] text-white',
    session: {
      base: [
        'group my-1 rounded-[10px] p-2 text-gray-500 border border-transparent hover:bg-gray-300 hover:border-gray-400 [&_svg]:text-gray-500',
        'dark:text-typography dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:border-gray-700/50 dark:[&_svg]:text-gray-200'
      ].join(' '),
      active: [
        'border border-gray-300 hover:border-gray-400 text-gray-700 bg-gray-200 hover:bg-gray-300 ',
        'dark:text-gray-500 dark:bg-gray-800/70 dark:border-gray-700/50 dark:text-white dark:border-gray-700/70 dark:hover:bg-gray-800/50',
        '[&_button]:!opacity-100'
      ].join(' '),
      delete: '[&>svg]:w-4 [&>svg]:h-4 opacity-0 group-hover:!opacity-50'
    }
  },
  messages: {
    base: '',
    console: 'flex flex-col mx-5 flex-1 overflow-hidden',
    companion: 'flex w-full h-full',
    back: 'self-start p-0 my-2',
    inner: 'flex-1 h-full flex flex-col',
    title: ['text-base font-bold text-gray-500', 'dark:text-gray-200'].join(
      ' '
    ),
    date: 'text-xs whitespace-nowrap text-gray-400',
    content: [
      'mt-2 flex-1 overflow-auto [&_hr]:bg-gray-200',
      'dark:[&_hr]:bg-gray-800/60'
    ].join(' '),
    header: 'flex justify-between items-center gap-2',
    showMore: 'mb-4',
    message: {
      base: 'mt-4 mb-4 flex flex-col p-0 rounded border-none bg-transparent',
      question: [
        'relative font-semibold mb-4 px-4 py-4 pb-2 rounded-3xl rounded-br-none text-typography border bg-gray-200 border-gray-300 text-gray-900',
        'dark:bg-gray-900/60 dark:border-gray-700/50 dark:text-gray-100'
      ].join(' '),
      response: [
        'relative data-[compact=false]:px-4 text-gray-900',
        'dark:text-gray-100'
      ].join(' '),
      overlay:
        "overflow-y-hidden max-h-[350px] after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-16 after:bg-gradient-to-b after:from-transparent dark:after:to-gray-900 after:to-gray-200",
      cursor: 'inline-block w-1 h-4 bg-current',
      expand: 'absolute bottom-1 right-1 z-10',
      recommended: 'flex gap-4 justify-around',
      rimage: ' max-w-[250px] max-h-[250px] object-cover cursor-pointer',
      markdownBorder: [
        'relative font-semibold mb-4 px-4 py-4 pb-2 rounded-4xl rounded-[10px] cursor-pointer text-typography border bg-gray-200 border-gray-300 text-gray-900',
        'dark:bg-gray-900/60 dark:border-gray-700/50 dark:text-gray-100 '
      ].join(' '),
      files: {
        base: 'mb-2 flex flex-wrap gap-3 ',
        file: {
          base: [
            'flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-lg cursor-pointer',
            'dark:border-gray-700'
          ].join(' '),
          name: ['text-sm text-gray-500', 'dark:text-gray-200'].join(' ')
        }
      },
      sources: {
        base: 'my-4 flex flex-wrap gap-3',
        source: {
          base: [
            'flex gap-2 border border-gray-200 px-4 py-2 rounded-lg cursor-pointer',
            'dark:border-gray-700'
          ].join(' '),
          companion: 'flex-1 px-3 py-1.5',
          image: 'max-w-10 max-h-10 rounded-md w-full h-fit self-center',
          title: 'text-md block',
          url: 'text-sm text-blue-400 underline'
        }
      },
      markdown: {
        copy: 'sticky py-1 [&>svg]:w-4 [&>svg]:h-4 opacity-50',
        p: 'mb-2',
        a: 'text-blue-400 underline',
        table: 'table-auto w-full m-2',
        th: 'px-4 py-2 text-left font-bold border-b border-gray-500',
        td: 'px-4 py-2',
        code: 'm-2 rounded-b relative',
        toolbar:
          'text-xs dark:bg-gray-700/50 flex items-center justify-between px-2 py-1 rounded-t sticky top-0 backdrop-blur-md bg-gray-200 ',
        li: 'mb-2 ml-6',
        ul: 'mb-4 list-disc',
        ol: 'mb-4 list-decimal'
      },
      footer: {
        base: 'mt-3 flex gap-1.5 text-gray-400',
        copy: [
          'p-3 rounded-[10px] [&>svg]:w-4 [&>svg]:h-4 opacity-50 hover:!opacity-100 hover:bg-gray-200 hover:text-gray-500',
          'dark:hover:bg-gray-800 dark:hover:text-white'
        ].join(' '),
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
    upload: ['px-5 py-2 text-gray-400 size-10', 'dark:gray-500'].join(' '),
    input: [
      'w-full border rounded-3xl px-3 py-2 pr-16 text-gray-500 border-gray-200 hover:bg-blue-100 hover:border-blue-500 after:hidden after:!mx-10 bg-white [&>textarea]:w-full [&>textarea]:flex-none',
      'dark:border-gray-700/50 dark:text-gray-200 dark:bg-gray-950 dark:hover:bg-blue-950/40'
    ].join(' '),
    actions: {
      base: 'absolute flex gap-2 items-center right-5 inset-y-1/2 -translate-y-1/2 z-10',
      send: [
        'px-3 py-3 hover:bg-primary-hover rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500',
        'dark:text-white dark:bg-gray-800 hover:dark:bg-gray-700'
      ].join(' '),
      stop: 'px-2 py-2 bg-red-500 text-white rounded-full hover:bg-red-700 '
    }
  }
};
