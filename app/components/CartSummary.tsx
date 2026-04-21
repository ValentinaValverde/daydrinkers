import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  if (layout === 'page') {
    return (
      <div className="flex flex-col gap-4">
        {cart?.cost?.subtotalAmount?.amount && (
          <p className="text-sm font-bold text-black">
            Subtotal:{' '}
            <Money data={cart.cost.subtotalAmount} />
          </p>
        )}
        <CartDiscounts
          discountCodes={cart?.discountCodes}
          discountsHeadingId={discountsHeadingId}
          discountCodeInputId={discountCodeInputId}
          layout="page"
        />
        <CartGiftCard
          giftCardCodes={cart?.appliedGiftCards}
          giftCardHeadingId={giftCardHeadingId}
          giftCardInputId={giftCardInputId}
          layout="page"
        />
        <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} layout="page" />
      </div>
    );
  }

  // Aside layout
  return (
    <div
      aria-labelledby={summaryId}
      className="cart-summary-aside"
    >
      <h4 id={summaryId}>Totals</h4>
      <dl role="group" className="cart-subtotal">
        <dt>Subtotal</dt>
        <dd>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
        layout="aside"
      />
      <CartGiftCard
        giftCardCodes={cart?.appliedGiftCards}
        giftCardHeadingId={giftCardHeadingId}
        giftCardInputId={giftCardInputId}
        layout="aside"
      />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} layout="aside" />
    </div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  layout,
}: {
  checkoutUrl?: string;
  layout: CartLayout;
}) {
  if (!checkoutUrl) return null;

  if (layout === 'page') {
    return (
      <a
        href={checkoutUrl}
        target="_self"
        className="bg-black text-[#f0f2ea] border-2 border-black rounded-full px-8 h-[52px] flex items-center w-fit text-base hover:bg-transparent hover:text-black transition-colors"
      >
        Checkout →
      </a>
    );
  }

  return (
    <div>
      <a href={checkoutUrl} target="_self">
        <p>Continue to Checkout &rarr;</p>
      </a>
      <br />
    </div>
  );
}

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
  layout,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
  discountCodeInputId: string;
  layout: CartLayout;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  if (layout === 'page') {
    return (
      <div className="flex flex-col gap-2">
        {codes.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-black">
            <span className="font-medium">Discount:</span>
            <code className="bg-[#e4ceb4] px-2 py-0.5 rounded text-xs">
              {codes.join(', ')}
            </code>
            <UpdateDiscountForm>
              <button
                type="submit"
                className="text-xs text-black/50 hover:text-black transition-colors"
              >
                Remove
              </button>
            </UpdateDiscountForm>
          </div>
        )}
        <UpdateDiscountForm discountCodes={codes}>
          <div className="flex gap-2">
            <label htmlFor={discountCodeInputId} className="sr-only">
              Discount code
            </label>
            <input
              id={discountCodeInputId}
              type="text"
              name="discountCode"
              placeholder="Discount code"
              className="bg-white border border-[#2a6b8f] rounded-full px-4 h-10 text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-[#2a6b8f] flex-1"
            />
            <button
              type="submit"
              className="bg-black text-[#f0f2ea] rounded-full px-4 h-10 text-sm hover:opacity-80 transition-opacity"
            >
              Apply
            </button>
          </div>
        </UpdateDiscountForm>
      </div>
    );
  }

  return (
    <section aria-label="Discounts">
      <dl hidden={!codes.length}>
        <div>
          <dt id={discountsHeadingId}>Discounts</dt>
          <UpdateDiscountForm>
            <div
              className="cart-discount"
              role="group"
              aria-labelledby={discountsHeadingId}
            >
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button type="submit" aria-label="Remove discount">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <label htmlFor={discountCodeInputId} className="sr-only">
            Discount code
          </label>
          <input
            id={discountCodeInputId}
            type="text"
            name="discountCode"
            placeholder="Discount code"
          />
          &nbsp;
          <button type="submit" aria-label="Apply discount code">
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </section>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{discountCodes: discountCodes || []}}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardHeadingId,
  giftCardInputId,
  layout,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardHeadingId: string;
  giftCardInputId: string;
  layout: CartLayout;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previousCardIdsRef = useRef<string[]>([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (giftCardAddFetcher.data && giftCardCodeInput.current) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];
    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;
      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }
      setRemovedCardIndex(null);
    }
    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId: string) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) setRemovedCardIndex(index);
  };

  if (layout === 'page') {
    return (
      <div className="flex flex-col gap-2">
        {giftCardCodes && giftCardCodes.length > 0 && (
          <div className="flex flex-col gap-1">
            {giftCardCodes.map((giftCard) => (
              <div
                key={giftCard.id}
                className="flex items-center gap-2 text-sm text-black"
              >
                <span className="font-medium">Gift card:</span>
                <code className="bg-[#e4ceb4] px-2 py-0.5 rounded text-xs">
                  ***{giftCard.lastCharacters}
                </code>
                <Money data={giftCard.amountUsed} />
                <RemoveGiftCardForm
                  giftCardId={giftCard.id}
                  lastCharacters={giftCard.lastCharacters}
                  onRemoveClick={() => handleRemoveClick(giftCard.id)}
                  buttonRef={(el: HTMLButtonElement | null) => {
                    if (el) removeButtonRefs.current.set(giftCard.id, el);
                    else removeButtonRefs.current.delete(giftCard.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs text-black/50 hover:text-black transition-colors"
                  >
                    Remove
                  </button>
                </RemoveGiftCardForm>
              </div>
            ))}
          </div>
        )}
        <AddGiftCardForm fetcherKey="gift-card-add">
          <div className="flex gap-2">
            <label htmlFor={giftCardInputId} className="sr-only">
              Gift card code
            </label>
            <input
              id={giftCardInputId}
              type="text"
              name="giftCardCode"
              placeholder="Gift card code"
              ref={giftCardCodeInput}
              className="bg-white border border-[#2a6b8f] rounded-full px-4 h-10 text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-[#2a6b8f] flex-1"
            />
            <button
              type="submit"
              disabled={giftCardAddFetcher.state !== 'idle'}
              className="bg-black text-[#f0f2ea] rounded-full px-4 h-10 text-sm hover:opacity-80 transition-opacity disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </AddGiftCardForm>
      </div>
    );
  }

  return (
    <section aria-label="Gift cards">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt id={giftCardHeadingId}>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id} className="cart-discount">
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el: HTMLButtonElement | null) => {
                  if (el) removeButtonRefs.current.set(giftCard.id, el);
                  else removeButtonRefs.current.delete(giftCard.id);
                }}
              >
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}
      <AddGiftCardForm fetcherKey="gift-card-add">
        <div>
          <label htmlFor={giftCardInputId} className="sr-only">
            Gift card code
          </label>
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            aria-label="Apply gift card code"
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}: {
  giftCardId: string;
  lastCharacters: string;
  children: React.ReactNode;
  onRemoveClick?: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{giftCardCodes: [giftCardId]}}
    >
      {children}
      &nbsp;
      <button
        type="submit"
        aria-label={`Remove gift card ending in ${lastCharacters}`}
        onClick={onRemoveClick}
        ref={buttonRef}
      >
        Remove
      </button>
    </CartForm>
  );
}
