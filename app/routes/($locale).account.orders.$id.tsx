import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/account.orders.$id';
import {Money, Image} from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const {data, errors}: {data: OrderQuery; errors?: Array<{message: string}>} =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;

  // Extract line items directly from nodes array
  const lineItems = order.lineItems.nodes;

  // Extract discount applications directly from nodes array
  const discountApplications = order.discountApplications.nodes;

  // Get fulfillment status from first fulfillment node
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

  // Get first discount value with proper type checking
  const firstDiscount = discountApplications[0]?.value;

  // Type guard for MoneyV2 discount
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<
          typeof firstDiscount,
          {__typename: 'MoneyV2'}
        >)
      : null;

  // Type guard for percentage discount
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (
          firstDiscount as Extract<
            typeof firstDiscount,
            {__typename: 'PricingPercentageValue'}
          >
        ).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-black">
          Order {order.name}
        </h2>
        <p className="text-sm text-black/60">
          Placed on {new Date(order.processedAt!).toDateString()}
        </p>
        {order.confirmationNumber && (
          <p className="text-sm text-black/60">
            Confirmation: {order.confirmationNumber}
          </p>
        )}
      </div>

      <div className="bg-white/60 rounded-[32px] border border-black/10 overflow-hidden">
        <table className="w-full text-sm text-black">
          <thead>
            <tr className="border-b border-black/10">
              <th scope="col" className="text-left px-6 py-4 font-medium">
                Product
              </th>
              <th scope="col" className="text-left px-6 py-4 font-medium">
                Price
              </th>
              <th scope="col" className="text-left px-6 py-4 font-medium">
                Qty
              </th>
              <th scope="col" className="text-left px-6 py-4 font-medium">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((lineItem, lineItemIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
            ))}
          </tbody>
          <tfoot className="border-t border-black/10">
            {((discountValue && discountValue.amount) ||
              discountPercentage) && (
              <tr className="border-t border-black/10">
                <td colSpan={3} className="px-6 py-3 text-black/60">
                  Discounts
                </td>
                <td className="px-6 py-3">
                  {discountPercentage ? (
                    <span>-{discountPercentage}% OFF</span>
                  ) : (
                    discountValue && <Money data={discountValue!} />
                  )}
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={3} className="px-6 py-3 text-black/60">
                Subtotal
              </td>
              <td className="px-6 py-3">
                <Money data={order.subtotal!} />
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-6 py-3 text-black/60">
                Tax
              </td>
              <td className="px-6 py-3">
                <Money data={order.totalTax!} />
              </td>
            </tr>
            <tr className="border-t border-black/10">
              <td colSpan={3} className="px-6 py-4 font-semibold">
                Total
              </td>
              <td className="px-6 py-4 font-semibold">
                <Money data={order.totalPrice!} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-black">
            Shipping Address
          </h3>
          {order?.shippingAddress ? (
            <address className="not-italic text-sm text-black/70 flex flex-col gap-0.5">
              <p>{order.shippingAddress.name}</p>
              {order.shippingAddress.formatted && (
                <p>{order.shippingAddress.formatted}</p>
              )}
              {order.shippingAddress.formattedArea && (
                <p>{order.shippingAddress.formattedArea}</p>
              )}
            </address>
          ) : (
            <p className="text-sm text-black/60">No shipping address defined</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-black">Status</h3>
          <p className="text-sm text-black/70">{fulfillmentStatus}</p>
        </div>
      </div>

      <a
        target="_blank"
        href={order.statusPageUrl}
        rel="noreferrer"
        className="rounded-full px-6 py-2.5 text-sm font-medium border border-black bg-transparent text-black hover:bg-black/5 transition-colors w-fit"
      >
        View Order Status
      </a>
    </div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <tr className="border-t border-black/10">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {lineItem?.image && (
            <Image
              data={lineItem.image}
              width={64}
              height={64}
              className="rounded-xl object-cover flex-shrink-0"
            />
          )}
          <div>
            <p className="font-medium">{lineItem.title}</p>
            {lineItem.variantTitle && (
              <p className="text-xs text-black/50">{lineItem.variantTitle}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Money data={lineItem.price!} />
      </td>
      <td className="px-6 py-4">{lineItem.quantity}</td>
      <td className="px-6 py-4">
        <Money data={lineItem.totalDiscount!} />
      </td>
    </tr>
  );
}
