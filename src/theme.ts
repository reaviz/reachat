export interface ChatTheme {
  base: string;
  console: string;
  companion: string;
  empty: string;
  appbar: string;
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
      csvPreview: {
        base: string;
        header: {
          base: string;
          icon: string;
          actions: string;
        };
        tableContainer: string;
        dialog: {
          base: string;
          container: string;
        };
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
  base: 'text-content-text-neutral-base',
  console: 'flex w-full gap-4 h-full',
  companion: 'w-full h-full overflow-hidden',
  empty: 'text-center flex-1',
  appbar: 'flex p-5',
  sessions: {
    base: 'overflow-auto',
    console:
      'min-w-[150px] w-[30%] max-w-[300px] bg-gradient-neutral-200 p-5 rounded-3xl',
    companion: 'w-full h-full',
    group: 'text-xs text-content-text-neutral-3 mt-4 hover:bg-transparent mb-1',
    create: 'relative mb-4 rounded-[10px] text-white',
    session: {
      base: 'group my-1 rounded-[10px] p-2 text-content-text-neutral-1 border border-transparent',
      active:
        'border-select-menu-items-color-item-stroke-row-hover [&_button]:opacity-100!',
      delete: '[&>svg]:w-4 [&>svg]:h-4 opacity-0 group-hover:opacity-50!'
    }
  },
  messages: {
    base: '',
    console: 'flex flex-col mx-5 flex-1 overflow-hidden',
    companion: 'flex w-full h-full',
    back: 'self-start pl-0 my-2 ',
    inner: 'flex-1 h-full flex flex-col',
    title: 'text-base font-bold',
    date: 'text-xs whitespace-nowrap text-content-text-neutral-2',
    content: 'mt-2 flex-1 overflow-auto',
    header: 'flex justify-between items-center gap-2',
    showMore: 'mb-4',
    message: {
      base: 'mt-4 mb-4 flex flex-col p-0 rounded-sm border-none bg-transparent',
      question:
        'relative font-semibold mb-4 px-4 py-4 pb-2 rounded-3xl rounded-br-none text-typography border bg-(--background-neutral-raised-5) border-(--stroke-neutral-5)',
      response:
        'relative data-[compact=false]:px-4 text-content-text-neutral-base',
      overlay:
        "overflow-y-hidden max-h-[350px] after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-16 after:bg-linear-to-b after:from-transparent after:to-effects-shadows-base-2-xl",
      cursor: 'inline-block w-1 h-4 bg-current',
      expand: 'absolute bottom-0 right-1 z-10',
      files: {
        base: 'mb-2 flex flex-wrap gap-3 ',
        file: {
          base: 'flex items-center gap-2 border border-stroke-neutral-4 px-3 py-2 rounded-lg cursor-pointer',
          name: 'text-sm text-content-text-neutral-4'
        }
      },
      sources: {
        base: 'my-4 flex flex-wrap gap-3',
        source: {
          base: 'flex gap-2 border border-stroke-neutral-4 px-4 py-2 rounded-lg cursor-pointer',
          companion: 'flex-1 px-3 py-1.5',
          image: 'max-w-10 max-h-10 rounded-md w-full h-fit self-center',
          title: 'text-md block',
          url: 'text-sm text-buttons-colors-link-primary-text-resting underline'
        }
      },
      markdown: {
        copy: 'sticky py-1 [&>svg]:w-4 [&>svg]:h-4 opacity-50',
        p: 'mb-2',
        a: 'text-buttons-colors-link-primary-text-resting underline',
        table: 'table-auto w-full m-2',
        th: 'px-4 py-2 text-left font-bold border-b border-stroke-neutral-4',
        td: 'px-4 py-2',
        code: 'm-2 rounded-b relative',
        toolbar:
          'text-xs flex items-center justify-between px-2 py-1 rounded-t sticky top-0 backdrop-blur-md bg-gradient-neutral-500/50',
        li: 'mb-2 ml-6',
        ul: 'mb-4 list-disc',
        ol: 'mb-4 list-decimal'
      },
      csvPreview: {
        base: 'flex flex-col gap-2',
        header: {
          base: 'flex justify-between items-center gap-4',
          icon: 'csv-icon flex items-center',
          actions: 'csv-actions flex items-center gap-6'
        },
        tableContainer: 'flex justify-between',
        dialog: {
          base: 'fixed inset-0 bg-background-neutral-canvas-base/70 flex justify-center items-center z-50',
          container:
            'bg-background-neutral-canvas-base rounded-md w-11/12 h-5/6 overflow-auto'
        }
      },
      footer: {
        base: 'mt-3 flex gap-1.5',
        copy: 'p-3 rounded-[10px] [&>svg]:size-4 opacity-50 hover:opacity-100!',
        upvote:
          'p-3 rounded-[10px] [&>svg]:size-4 opacity-50 hover:opacity-100!',
        downvote:
          'p-3 rounded-[10px] [&>svg]:size-4 opacity-50 hover:opacity-100!',
        refresh:
          'p-3 rounded-[10px] [&>svg]:size-4 opacity-50 hover:opacity-100!'
      }
    }
  },
  input: {
    base: 'flex mt-4 relative',
    upload:
      'px-5 py-2 size-10 text-content-text-neutral-2 hover:text-content-text-neutral-base',
    input:
      'w-full border rounded-3xl px-3 py-2 pr-16 after:hidden after:mx-10! [&>textarea]:w-full [&>textarea]:flex-none [&>textarea]:outline-none [&>textarea]:resize-none',
    actions: {
      base: 'absolute flex gap-2 items-center right-2 inset-y-1/2 -translate-y-1/2 z-10',
      send: 'px-3 py-3 hover:bg-primary-hover rounded-full size-8',
      stop: 'px-2 py-2 bg-content-assets-semantic-error-base text-white rounded-full hover:bg-content-assets-semantic-error-1 size-8'
    }
  }
};
