import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type {Route} from './+types/account.orders._index';
import {useRef} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import PrimaryButton from '~/components/ui/Button';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="flex flex-col gap-8">
      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div aria-live="polite" className="flex flex-col gap-4">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  return (
    <div className="flex flex-col gap-4">
      {hasFilters ? (
        <>
          <p className="text-base text-black">
            No orders found matching your search.
          </p>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4 h-[400px]">
          <p className="text-base text-black">
            You haven&apos;t placed any orders yet.
          </p>
          <PrimaryButton text="Start shopping" link="/collections/all" />
        </div>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      aria-label="Search orders"
      className="flex gap-4 items-center"
    >
      <input
        type="search"
        name={ORDER_FILTER_FIELDS.NAME}
        placeholder="Order #"
        aria-label="Order number"
        defaultValue={currentFilters.name || ''}
        className="w-full rounded-full border border-2 border-black/20 px-5 py-2.5 text-sm bg-white text-black placeholder:text-black/40 focus:outline-none focus:border-black transition-colors"
      />
      <input
        type="search"
        name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
        placeholder="Confirmation #"
        aria-label="Confirmation number"
        defaultValue={currentFilters.confirmationNumber || ''}
        className="w-full rounded-full border border-2 border-black/20 px-5 py-2.5 text-sm bg-white text-black placeholder:text-black/40 focus:outline-none focus:border-black transition-colors"
      />
      <button
        type="submit"
        disabled={isSearching}
        className="rounded-full px-6 py-2.5 text-sm font-medium bg-black text-[#f0f2ea] border border-black hover:bg-black/80 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isSearching ? 'Searching…' : 'Search'}
      </button>
      {hasFilters && (
        <button
          type="button"
          disabled={isSearching}
          className="rounded-full px-6 py-2.5 text-sm font-medium border border-2 border-black bg-transparent text-black hover:bg-black/5 transition-colors disabled:opacity-50 cursor-pointer"
          onClick={() => {
            setSearchParams(new URLSearchParams());
            formRef.current?.reset();
          }}
        >
          Clear
        </button>
      )}
    </form>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <div className="bg-white/60 rounded-[32px] p-6 border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <Link
          to={`/account/orders/${btoa(order.id)}`}
          className="text-base font-semibold text-black hover:underline"
        >
          #{order.number}
        </Link>
        <p className="text-sm text-black/60">
          {new Date(order.processedAt).toDateString()}
        </p>
        {order.confirmationNumber && (
          <p className="text-sm text-black/60">
            Confirmation: {order.confirmationNumber}
          </p>
        )}
      </div>
      <div className="flex flex-col sm:items-end gap-1">
        <p className="text-sm text-black">{order.financialStatus}</p>
        {fulfillmentStatus && (
          <p className="text-sm text-black/60">{fulfillmentStatus}</p>
        )}
        <Money
          data={order.totalPrice}
          className="text-base font-semibold text-black"
        />
      </div>
      <Link
        to={`/account/orders/${btoa(order.id)}`}
        className="rounded-full px-6 py-2.5 text-sm font-medium border border-black bg-transparent text-black hover:bg-black/5 transition-colors w-fit"
      >
        View Order
      </Link>
    </div>
  );
}
