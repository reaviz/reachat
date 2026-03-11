export interface ChatTheme {
  base: string;
  console: string;
  companion: string;
  empty: string;
  appbar: string;
  status: {
    base: string;
    header: string;
    icon: {
      base: string;
      loading: string;
      complete: string;
      error: string;
    };
    text: {
      base: string;
      loading: string;
      complete: string;
      error: string;
    };
    steps: {
      base: string;
      step: {
        base: string;
        icon: string;
        text: string;
        loading: string;
        complete: string;
        error: string;
      };
    };
  };
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
      scrollToBottom: {
        container: string;
        button: string;
      };
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
        hr: string;
        p: string;
        a: string;
        table: string;
        th: string;
        td: string;
        code: string;
        inlineCode: string;
        toolbar: string;
        li: string;
        ul: string;
        ol: string;
        copy: string;
        h1: string;
        h2: string;
        h3: string;
        h4: string;
        h5: string;
        h6: string;
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
    dropzone: {
      base: string;
      active: string;
      overlay: string;
      text: string;
      icon: string;
    };
    popup: {
      base: string;
      content: string;
      item: string;
      itemHighlighted: string;
      itemIcon: string;
      itemContent: string;
      itemLabel: string;
      itemDescription: string;
      itemShortcut: string;
      empty: string;
      loading: string;
    };
    tag: {
      base: string;
      mention: string;
      command: string;
    };
    editor: {
      base: string;
      container: string;
      placeholder: string;
    };
  };
  suggestions: {
    base: string;
    item: {
      base: string;
      icon: string;
      text: string;
    };
  };
  chart: {
    base: string;
    title: string;
    content: string;
    error: {
      base: string;
      title: string;
      code: string;
    };
    warning: {
      base: string;
      title: string;
    };
  };
}

export const unifyChatTheme: ChatTheme = {
  base: 'text-content-text-neutral-base',
  console: 'flex w-full gap-4 h-full',
  companion: 'w-full h-full overflow-hidden',
  empty: 'text-center flex-1 min-h-0',
  appbar: 'flex p-5',
  status: {
    base: 'py-2 px-3 rounded-lg bg-background-neutral-raised-4/50',
    header: 'flex items-center gap-2',
    icon: {
      base: 'flex-shrink-0 w-4 h-4',
      loading: 'text-content-assets-brand-base',
      complete: 'text-content-assets-semantic-success-base',
      error: 'text-content-assets-semantic-error-base'
    },
    text: {
      base: 'text-sm',
      loading: 'text-content-text-neutral-2',
      complete: 'text-content-assets-semantic-success-base',
      error: 'text-content-assets-semantic-error-base'
    },
    steps: {
      base: 'mt-1 ml-6 space-y-0.5',
      step: {
        base: 'flex items-center gap-2',
        icon: 'flex-shrink-0 w-3.5 h-3.5',
        text: 'text-sm',
        loading: 'text-content-text-neutral-3',
        complete: 'text-content-assets-semantic-success-base',
        error: 'text-content-assets-semantic-error-base'
      }
    }
  },
  sessions: {
    base: 'overflow-auto',
    console:
      'min-w-[150px] w-[30%] max-w-[300px] bg-gradient-neutral-200 p-5 rounded-3xl',
    companion: 'w-full h-full',
    group: 'text-xs text-content-text-neutral-3 mt-4 hover:bg-transparent mb-1',
    create: 'relative mb-4 rounded-[10px] text-white',
    session: {
      base: 'group my-1 rounded-[10px] p-2 text-content-text-neutral-1 border border-transparent hover:border-stroke-neutral-4',
      active: 'border-stroke-focused-highlight [&_button]:opacity-100!',
      delete: '[&>svg]:w-4 [&>svg]:h-4 opacity-0 group-hover:opacity-50!'
    }
  },
  messages: {
    base: '',
    console: 'flex flex-col mx-5 flex-1 min-h-0',
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
        'relative font-semibold mb-4 px-4 py-4 pb-2 rounded-3xl rounded-br-none text-content-text-neutral-base border bg-(--background-neutral-raised-5) border-(--stroke-neutral-5)',
      response:
        'relative data-[compact=false]:px-4 text-content-text-neutral-base',
      overlay:
        "overflow-y-hidden max-h-[350px] after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-16 after:bg-linear-to-b after:from-transparent after:to-effects-shadows-base-base",
      cursor: 'inline-block w-1 h-4 bg-current',
      expand: 'absolute bottom-1 right-1 z-10',
      scrollToBottom: {
        container: 'absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10',
        button: 'rounded-full p-2 shadow-lg'
      },
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
        hr: 'my-4 border-t border-stroke-neutral-4',
        copy: 'sticky py-1 [&>svg]:w-4 [&>svg]:h-4 opacity-50',
        p: 'mb-2',
        a: 'text-buttons-colors-link-primary-text-resting underline',
        table: 'table-auto w-full m-2',
        th: 'px-4 py-2 text-left font-bold border-b border-stroke-neutral-4',
        td: 'px-4 py-2',
        code: 'm-2 rounded-b relative',
        inlineCode: 'bg-gradient-neutral-200 p-1 rounded',
        toolbar:
          'text-xs flex items-center justify-between px-2 py-1 rounded-t sticky top-0 backdrop-blur-md bg-gradient-neutral-500/50',
        li: 'mb-2 ml-6',
        ul: 'mb-4 list-disc',
        ol: 'mb-4 list-decimal',
        h1: 'text-4xl font-bold mb-4 mt-6',
        h2: 'text-3xl font-bold mb-3 mt-5',
        h3: 'text-2xl font-bold mb-3 mt-4',
        h4: 'text-xl font-bold mb-2 mt-3',
        h5: 'text-lg font-bold mb-2 mt-2',
        h6: 'text-base font-bold mb-2 mt-2'
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
      'w-full border border-(--color-inputs-colors-normal-stroke-resting) rounded-3xl px-3 py-1 pr-16 hover:border-(--color-inputs-colors-normal-stroke-hover) focus-within:border-(--color-inputs-colors-normal-stroke-selected) focus-within:bg-(--color-inputs-colors-normal-background-selected) text-(--color-inputs-colors-normal-text-input-text-filled) placeholder:text-(--color-inputs-colors-normal-text-input-text-resting) after:hidden after:mx-10! [&>textarea]:w-full [&>textarea]:flex-none [&>textarea]:outline-none [&>textarea]:resize-none',
    actions: {
      base: 'absolute flex gap-2 items-center right-2 inset-y-1/2 -translate-y-1/2 z-10',
      send: 'px-3 py-3 hover:bg-background-brand-1 rounded-full size-8',
      stop: 'px-2 py-2 bg-content-assets-semantic-error-base text-white rounded-full hover:bg-content-assets-semantic-error-1 size-8'
    },
    dropzone: {
      base: 'relative w-full',
      active: 'ring-1 ring-stroke-brand-base ring-offset-2 rounded-3xl',
      overlay:
        'absolute inset-0 bg-background-brand-base/10 border-2 border-dashed border-stroke-brand-base rounded-3xl flex items-center justify-center gap-1.5 z-20 backdrop-blur-sm',
      text: 'text-content-assets-brand-base font-medium text-sm',
      icon: '[&>svg]:w-4 [&>svg]:h-4 text-content-assets-brand-base'
    },
    popup: {
      base: 'rounded-lg shadow-lg overflow-hidden min-w-[200px] max-w-[300px] border border-stroke-neutral-4',
      content: 'overflow-y-auto max-h-[250px]',
      item: 'flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors',
      itemHighlighted: 'bg-gradient-neutral-200',
      itemIcon:
        'flex-shrink-0 w-5 h-5 text-content-text-neutral-2 [&>svg]:w-full [&>svg]:h-full',
      itemContent: 'flex flex-col min-w-0 flex-1',
      itemLabel: 'text-sm font-medium text-content-text-neutral-base truncate',
      itemDescription: 'text-xs text-content-text-neutral-2 truncate',
      itemShortcut: 'text-xs text-content-text-neutral-3 ml-auto',
      empty: 'px-3 py-4 text-sm text-center text-content-text-neutral-2',
      loading:
        'flex items-center justify-center gap-2 px-3 py-4 text-content-text-neutral-2'
    },
    tag: {
      base: 'inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-medium text-sm leading-[1.2] relative top-[1px]',
      mention:
        'bg-background-semantic-info-5/30 text-content-assets-semantic-info-base',
      command: 'bg-background-accent-1-5/30 text-content-text-accent-1-base'
    },
    editor: {
      base: 'outline-none w-full overflow-y-auto text-inherit font-inherit [&_.tiptap-paragraph]:m-0',
      container: 'px-3 py-2 pr-16',
      placeholder: [
        '[&_.is-editor-empty]:before:content-[attr(data-placeholder)]',
        '[&_.is-editor-empty]:before:text-content-text-neutral-3',
        '[&_.is-editor-empty]:before:float-left',
        '[&_.is-editor-empty]:before:h-0',
        '[&_.is-editor-empty]:before:pointer-events-none'
      ].join(' ')
    }
  },
  suggestions: {
    base: 'flex flex-wrap gap-2 mt-4',
    item: {
      base: [
        'rounded-full! max-w-full py-2 px-4',
        'bg-background-neutral-raised-3 border-stroke-neutral-2 hover:bg-background-neutral-raised-4 hover:border-stroke-neutral-3 text-content-text-neutral-1',
        '[&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-content-assets-brand-base [&>svg]:flex-shrink-0'
      ].join(' '),
      icon: 'w-4 h-4 text-content-assets-brand-base flex-shrink-0',
      text: 'text-sm font-medium truncate'
    }
  },
  chart: {
    base: 'my-6',
    title: 'text-sm font-medium mb-2 text-content-text-neutral-2',
    content: 'flex items-center justify-center',
    error: {
      base: 'my-4 p-4 border rounded border-stroke-semantic-error-4 bg-background-semantic-error-5/20 text-content-assets-semantic-error-base',
      title: 'text-content-assets-semantic-error-base text-sm font-medium mb-2',
      code: 'text-xs overflow-auto'
    },
    warning: {
      base: 'my-4 p-4 border rounded border-stroke-semantic-warning-4 bg-background-semantic-warning-5/20 text-content-assets-semantic-warning-base',
      title:
        'text-content-assets-semantic-warning-base text-sm font-medium mb-2'
    }
  }
};

export const chatTheme: ChatTheme = {
  base: 'text-text-primary',
  console: 'flex w-full gap-4 h-full',
  companion: 'w-full h-full overflow-hidden',
  empty: 'text-center flex-1 min-h-0',
  appbar: 'flex p-5',
  status: {
    base: 'py-2 px-3 rounded-lg bg-neutral-200/50',
    header: 'flex items-center gap-2',
    icon: {
      base: 'flex-shrink-0 w-4 h-4',
      loading: 'text-primary',
      complete: 'text-success',
      error: 'text-error'
    },
    text: {
      base: 'text-sm',
      loading: 'text-mystic',
      complete: 'text-success',
      error: 'text-error'
    },
    steps: {
      base: 'mt-1 ml-6 space-y-0.5',
      step: {
        base: 'flex items-center gap-2',
        icon: 'flex-shrink-0 w-3.5 h-3.5',
        text: 'text-sm',
        loading: 'text-secondary-content',
        complete: 'text-success',
        error: 'text-error'
      }
    }
  },
  sessions: {
    base: 'overflow-auto',
    console:
      'min-w-[150px] w-[30%] max-w-[300px] bg-neutral-200/50 p-5 rounded-3xl',
    companion: 'w-full h-full',
    group: 'text-xs text-secondary-content mt-4 hover:bg-transparent mb-1',
    create: 'relative mb-4 rounded-[10px] text-white',
    session: {
      base: 'group my-1 rounded-[10px] p-2 text-text-primary border border-transparent hover:border-border-secondary-hover',
      active: 'border-primary [&_button]:opacity-100!',
      delete: '[&>svg]:w-4 [&>svg]:h-4 opacity-0 group-hover:opacity-50!'
    }
  },
  messages: {
    base: '',
    console: 'flex flex-col mx-5 flex-1 min-h-0',
    companion: 'flex w-full h-full',
    back: 'self-start pl-0 my-2 ',
    inner: 'flex-1 h-full flex flex-col',
    title: 'text-base font-bold',
    date: 'text-xs whitespace-nowrap text-mystic',
    content: 'mt-2 flex-1 overflow-auto',
    header: 'flex justify-between items-center gap-2',
    showMore: 'mb-4',
    message: {
      base: 'mt-4 mb-4 flex flex-col p-0 rounded-sm border-none bg-transparent',
      question:
        'relative font-semibold mb-4 px-4 py-4 pb-2 rounded-3xl rounded-br-none text-text-primary border bg-neutral-100 border-border-secondary-hover',
      response: 'relative data-[compact=false]:px-4 text-text-primary',
      overlay:
        "overflow-y-hidden max-h-[350px] after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-16 after:bg-linear-to-b after:from-transparent after:to-panel",
      cursor: 'inline-block w-1 h-4 bg-current',
      expand: 'absolute bottom-1 right-1 z-10',
      scrollToBottom: {
        container: 'absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10',
        button: 'rounded-full p-2 shadow-lg'
      },
      files: {
        base: 'mb-2 flex flex-wrap gap-3 ',
        file: {
          base: 'flex items-center gap-2 border border-border-secondary-hover px-3 py-2 rounded-lg cursor-pointer',
          name: 'text-sm text-waterloo'
        }
      },
      sources: {
        base: 'my-4 flex flex-wrap gap-3',
        source: {
          base: 'flex gap-2 border border-border-secondary-hover px-4 py-2 rounded-lg cursor-pointer',
          companion: 'flex-1 px-3 py-1.5',
          image: 'max-w-10 max-h-10 rounded-md w-full h-fit self-center',
          title: 'text-md block',
          url: 'text-sm text-primary underline'
        }
      },
      markdown: {
        hr: 'my-4 border-t border-border-secondary-hover',
        copy: 'sticky py-1 [&>svg]:w-4 [&>svg]:h-4 opacity-50',
        p: 'mb-2',
        a: 'text-primary underline',
        table: 'table-auto w-full m-2',
        th: 'px-4 py-2 text-left font-bold border-b border-border-secondary-hover',
        td: 'px-4 py-2',
        code: 'm-2 rounded-b relative',
        inlineCode: 'bg-neutral-300 p-1 rounded',
        toolbar:
          'text-xs flex items-center justify-between px-2 py-1 rounded-t sticky top-0 backdrop-blur-md bg-neutral-700/50',
        li: 'mb-2 ml-6',
        ul: 'mb-4 list-disc',
        ol: 'mb-4 list-decimal',
        h1: 'text-4xl font-bold mb-4 mt-6',
        h2: 'text-3xl font-bold mb-3 mt-5',
        h3: 'text-2xl font-bold mb-3 mt-4',
        h4: 'text-xl font-bold mb-2 mt-3',
        h5: 'text-lg font-bold mb-2 mt-2',
        h6: 'text-base font-bold mb-2 mt-2'
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
          base: 'fixed inset-0 bg-surface/70 flex justify-center items-center z-50',
          container: 'bg-surface rounded-md w-11/12 h-5/6 overflow-auto'
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
    upload: 'px-5 py-2 size-10 text-mystic hover:text-text-primary',
    input:
      'w-full border border-(--color-inputs-colors-normal-stroke-resting) rounded-3xl px-3 py-1 pr-16 hover:border-(--color-inputs-colors-normal-stroke-hover) focus-within:border-(--color-inputs-colors-normal-stroke-selected) focus-within:bg-(--color-inputs-colors-normal-background-selected) text-(--color-inputs-colors-normal-text-input-text-filled) placeholder:text-(--color-inputs-colors-normal-text-input-text-resting) after:hidden after:mx-10! [&>textarea]:w-full [&>textarea]:flex-none [&>textarea]:outline-none [&>textarea]:resize-none',
    actions: {
      base: 'absolute flex gap-2 items-center right-2 inset-y-1/2 -translate-y-1/2 z-10',
      send: 'px-3 py-3 hover:bg-primary-hover rounded-full size-8',
      stop: 'px-2 py-2 bg-error text-white rounded-full hover:bg-error-hover size-8'
    },
    dropzone: {
      base: 'relative w-full',
      active: 'ring-1 ring-primary ring-offset-2 rounded-3xl',
      overlay:
        'absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-3xl flex items-center justify-center gap-1.5 z-20 backdrop-blur-sm',
      text: 'text-primary font-medium text-sm',
      icon: '[&>svg]:w-4 [&>svg]:h-4 text-primary'
    },
    popup: {
      base: 'rounded-lg shadow-lg overflow-hidden min-w-[200px] max-w-[300px] border border-border-secondary-hover',
      content: 'overflow-y-auto max-h-[250px]',
      item: 'flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors',
      itemHighlighted: 'bg-neutral-300',
      itemIcon:
        'flex-shrink-0 w-5 h-5 text-mystic [&>svg]:w-full [&>svg]:h-full',
      itemContent: 'flex flex-col min-w-0 flex-1',
      itemLabel: 'text-sm font-medium text-text-primary truncate',
      itemDescription: 'text-xs text-mystic truncate',
      itemShortcut: 'text-xs text-secondary-content ml-auto',
      empty: 'px-3 py-4 text-sm text-center text-mystic',
      loading: 'flex items-center justify-center gap-2 px-3 py-4 text-mystic'
    },
    tag: {
      base: 'inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-medium text-sm leading-[1.2] relative top-[1px]',
      mention: 'bg-info-background/30 text-info',
      command: 'bg-primary-inactive/30 text-primary'
    },
    editor: {
      base: 'outline-none w-full overflow-y-auto text-inherit font-inherit [&_.tiptap-paragraph]:m-0',
      container: 'px-3 py-2 pr-16',
      placeholder: [
        '[&_.is-editor-empty]:before:content-[attr(data-placeholder)]',
        '[&_.is-editor-empty]:before:text-secondary-content',
        '[&_.is-editor-empty]:before:float-left',
        '[&_.is-editor-empty]:before:h-0',
        '[&_.is-editor-empty]:before:pointer-events-none'
      ].join(' ')
    }
  },
  suggestions: {
    base: 'flex flex-wrap gap-2 mt-4',
    item: {
      base: [
        'rounded-full! max-w-full py-2 px-4',
        'bg-neutral-300 border-border-secondary-hover hover:bg-neutral-200 hover:border-panel-border text-text-primary/80',
        '[&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-primary [&>svg]:flex-shrink-0'
      ].join(' '),
      icon: 'w-4 h-4 text-primary flex-shrink-0',
      text: 'text-sm font-medium truncate'
    }
  },
  chart: {
    base: 'my-6',
    title: 'text-sm font-medium mb-2 text-mystic',
    content: 'flex items-center justify-center',
    error: {
      base: 'my-4 p-4 border rounded border-error bg-error-background/20 text-error',
      title: 'text-error text-sm font-medium mb-2',
      code: 'text-xs overflow-auto'
    },
    warning: {
      base: 'my-4 p-4 border rounded border-warning bg-warning-background/20 text-warning',
      title: 'text-warning text-sm font-medium mb-2'
    }
  }
};
