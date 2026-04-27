import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};

function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const nested = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(nested)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = (cart?.totalQuantity ?? 0) > 0;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  if (layout === 'page') {
    return (
      <>
        <CartEmpty hidden={linesCount} layout="page" />
        {cartHasItems && (
          <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-16">
            {/* Left: title + checkout summary */}
            <div className="md:sticky md:top-[100px] md:self-start flex flex-col gap-4">
              <h1 className="text-4xl font-bold text-black">Cart</h1>
              <p className="text-sm text-black/60">
                Review your items below before checking out.
              </p>
              <CartSummary cart={cart} layout="page" />
            </div>

            {/* Right: items card */}
            <div className="bg-[#FDFFF8] rounded-[24px] p-8 border-2 border-black md:min-w-[600px] flex-1">
              <ul
                aria-label="Cart line items"
                className="divide-y divide-black/10"
              >
                {(cart?.lines?.nodes ?? []).map((line) => {
                  if (
                    'parentRelationship' in line &&
                    line.parentRelationship?.parent
                  )
                    return null;
                  return (
                    <CartLineItem
                      key={line.id}
                      line={line}
                      layout="page"
                      childrenMap={childrenMap}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </>
    );
  }

  // Aside / drawer layout
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <section className={className} aria-label="Cart drawer">
      <CartEmpty hidden={linesCount} layout="aside" />
      <div className="cart-details">
        <p id="cart-lines" className="sr-only">
          Line items
        </p>
        <div>
          <ul aria-labelledby="cart-lines">
            {(cart?.lines?.nodes ?? []).map((line) => {
              if (
                'parentRelationship' in line &&
                line.parentRelationship?.parent
              )
                return null;
              return (
                <CartLineItem
                  key={line.id}
                  line={line}
                  layout="aside"
                  childrenMap={childrenMap}
                />
              );
            })}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout="aside" />}
      </div>
    </section>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-black">Cart</h1>
      <p className="text-base text-black">
        Looks like you haven&rsquo;t added anything yet — let&rsquo;s fix that!
      </p>
      <Link
        to="/collections/all"
        onClick={close}
        prefetch="viewport"
        className="bg-black text-[#f0f2ea] border-2 border-black rounded-full px-8 py-4 flex items-center w-fit text-base hover:bg-transparent hover:text-black transition-colors"
      >
        Continue shopping →
      </Link>
    </div>
  );
}
