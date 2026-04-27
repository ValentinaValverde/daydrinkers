import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection> encapsulates the previous and next pagination behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  ariaLabel?: string;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <PreviousLink className="mb-16 bg-black text-[#f0f2ea] border-2 border-black rounded-full px-8 h-[52px] flex flex-row items-center justify-center w-full mt-2 text-base group hover:bg-transparent hover:text-black transition-colors">
              {isLoading ? 'Loading...' : <span>Load previous</span>}
            </PreviousLink>
            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={resourcesClassName}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}
            <NextLink className="mt-16 bg-black text-[#f0f2ea] border-2 border-black rounded-full px-8 h-[52px] flex flex-row items-center justify-center w-full mt-2 text-base group hover:bg-transparent hover:text-black transition-colors">
              {isLoading ? 'Loading...' : <span>Load more</span>}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}
