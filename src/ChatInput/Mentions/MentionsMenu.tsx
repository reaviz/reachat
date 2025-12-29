import { FC, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { Mention, MentionsMenuProps } from './types';

/**
 * Groups mentions by their category.
 */
const groupMentionsByCategory = (
  mentions: Mention[]
): Map<string, Mention[]> => {
  const groups = new Map<string, Mention[]>();

  mentions.forEach(mention => {
    const category = mention.category || 'Suggestions';
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(mention);
  });

  return groups;
};

/**
 * Filters mentions based on the search filter.
 */
const filterMentions = (mentions: Mention[], filter: string): Mention[] => {
  if (!filter) return mentions;

  const lowerFilter = filter.toLowerCase();
  return mentions.filter(
    mention =>
      mention.name.toLowerCase().includes(lowerFilter) ||
      mention.description?.toLowerCase().includes(lowerFilter)
  );
};

/**
 * MentionsMenu displays a list of available mentions
 * that users can select using keyboard or mouse.
 */
export const MentionsMenu: FC<MentionsMenuProps> = ({
  mentions,
  filter = '',
  activeIndex = 0,
  isLoading = false,
  onSelect,
  onClose,
  renderMention,
  className,
  maxHeight = 300,
  groupByCategory = false,
  emptyContent,
  loadingContent
}) => {
  const { theme } = useContext(ChatContext);
  const menuRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Filter mentions based on search
  const filteredMentions = useMemo(
    () => filterMentions(mentions, filter),
    [mentions, filter]
  );

  // Group mentions if enabled
  const groupedMentions = useMemo(() => {
    if (!groupByCategory) {
      return new Map([['Suggestions', filteredMentions]]);
    }
    return groupMentionsByCategory(filteredMentions);
  }, [filteredMentions, groupByCategory]);

  // Flatten grouped mentions for index tracking
  const flatMentions = useMemo(() => {
    const flat: Mention[] = [];
    groupedMentions.forEach(items => {
      flat.push(...items);
    });
    return flat;
  }, [groupedMentions]);

  // Scroll active item into view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const handleSelect = useCallback(
    (mention: Mention) => {
      if (!mention.disabled) {
        onSelect?.(mention);
      }
    },
    [onSelect]
  );

  const mentionTheme = theme?.input?.mention;

  // Loading state
  if (isLoading) {
    return (
      <div
        ref={menuRef}
        className={cn(
          'rounded-lg border shadow-lg overflow-hidden',
          'bg-white dark:bg-gray-900',
          'border-gray-200 dark:border-gray-700',
          mentionTheme?.menu,
          className
        )}
      >
        <div
          className={cn(
            'p-4 text-center text-gray-500 dark:text-gray-400',
            mentionTheme?.loading
          )}
        >
          {loadingContent || (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredMentions.length === 0) {
    return (
      <div
        ref={menuRef}
        className={cn(
          'rounded-lg border shadow-lg overflow-hidden',
          'bg-white dark:bg-gray-900',
          'border-gray-200 dark:border-gray-700',
          mentionTheme?.menu,
          className
        )}
      >
        <div
          className={cn(
            'p-4 text-center text-gray-500 dark:text-gray-400',
            mentionTheme?.empty
          )}
        >
          {emptyContent || 'No matches found'}
        </div>
      </div>
    );
  }

  let currentFlatIndex = 0;

  return (
    <div
      ref={menuRef}
      className={cn(
        'rounded-lg border shadow-lg overflow-hidden',
        'bg-white dark:bg-gray-900',
        'border-gray-200 dark:border-gray-700',
        mentionTheme?.menu,
        className
      )}
      style={{ maxHeight }}
    >
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {Array.from(groupedMentions.entries()).map(
          ([category, categoryMentions]) => (
            <div key={category}>
              {groupByCategory && groupedMentions.size > 1 && (
                <div
                  className={cn(
                    'px-3 py-2 text-xs font-semibold uppercase tracking-wide',
                    'text-gray-500 dark:text-gray-400',
                    'bg-gray-50 dark:bg-gray-800/50',
                    'border-b border-gray-200 dark:border-gray-700',
                    mentionTheme?.category
                  )}
                >
                  {category}
                </div>
              )}
              {categoryMentions.map(mention => {
                const flatIndex = currentFlatIndex++;
                const isActive = flatIndex === activeIndex;

                if (renderMention) {
                  return (
                    <div
                      key={mention.id}
                      ref={isActive ? activeItemRef : undefined}
                      onClick={() => handleSelect(mention)}
                    >
                      {renderMention(mention, isActive)}
                    </div>
                  );
                }

                return (
                  <div
                    key={mention.id}
                    ref={isActive ? activeItemRef : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 cursor-pointer',
                      'transition-colors duration-100',
                      {
                        'bg-blue-50 dark:bg-blue-900/30': isActive,
                        'hover:bg-gray-50 dark:hover:bg-gray-800/50': !isActive,
                        'opacity-50 cursor-not-allowed': mention.disabled
                      },
                      mentionTheme?.item?.base,
                      isActive && mentionTheme?.item?.active,
                      mention.disabled && mentionTheme?.item?.disabled
                    )}
                    onClick={() => handleSelect(mention)}
                  >
                    {mention.avatar && (
                      <div
                        className={cn(
                          'flex-shrink-0 w-8 h-8 rounded-full overflow-hidden',
                          'bg-gray-200 dark:bg-gray-700',
                          mentionTheme?.avatar
                        )}
                      >
                        {typeof mention.avatar === 'string' ? (
                          <img
                            src={mention.avatar}
                            alt={mention.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
                            {mention.avatar}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          'font-medium text-sm block',
                          'text-gray-900 dark:text-gray-100',
                          mentionTheme?.name
                        )}
                      >
                        {mention.name}
                      </span>
                      {mention.description && (
                        <p
                          className={cn(
                            'text-xs truncate',
                            'text-gray-500 dark:text-gray-400',
                            mentionTheme?.description
                          )}
                        >
                          {mention.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};
