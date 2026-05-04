import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className="min-h-screen bg-[#f0f2ea]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-semibold text-black mb-8">
          {heading}
        </h1>
        <AccountMenu />
        <div className="mt-12">
          <Outlet context={{customer}} />
        </div>
      </div>
    </div>
  );
}

const navLinkClass = ({isActive}: {isActive: boolean}) =>
  `rounded-full px-6 py-2.5 text-sm font-medium border border-black transition-colors ${
    isActive
      ? 'bg-black text-[#f0f2ea]'
      : 'bg-transparent text-black hover:bg-black/5'
  }`;

function AccountMenu() {
  return (
    <nav role="navigation" className="flex flex-wrap gap-3">
      <NavLink to="/account/orders" className={navLinkClass}>
        Orders
      </NavLink>
      <NavLink to="/account/profile" className={navLinkClass}>
        Profile
      </NavLink>
      <NavLink to="/account/addresses" className={navLinkClass}>
        Addresses
      </NavLink>
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form method="POST" action="/account/logout">
      <button
        type="submit"
        className="rounded-full px-6 py-2.5 text-sm font-medium border border-black bg-transparent text-black hover:bg-black/5 transition-colors"
      >
        Sign out
      </button>
    </Form>
  );
}
