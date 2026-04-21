import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  ListIcon,
} from '@phosphor-icons/react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-[#e4ceb4] w-full">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8 flex items-center justify-between h-[66px]">
          {/* Logo */}
          <NavLink prefetch="intent" to="/" end className="flex-shrink-0">
            <img
              src="/images/daydrinkers-logo.png"
              width={150}
              height={50}
              alt={shop.name}
              className="h-[50px] w-auto object-contain"
            />
          </NavLink>

          {/* Desktop nav */}
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />

          {/* Icons */}
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col gap-4 p-6" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className="text-sm text-black hover:opacity-60 transition-opacity"
        >
          Home
        </NavLink>
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;
          const url = resolveUrl(item.url, publicStoreDomain, primaryDomainUrl);
          return (
            <NavLink
              className="text-sm text-black hover:opacity-60 transition-opacity"
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      className="hidden md:flex gap-16 text-sm text-black"
      role="navigation"
    >
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url = resolveUrl(item.url, publicStoreDomain, primaryDomainUrl);
        return (
          <NavLink
            className={({isActive}) =>
              `hover:opacity-60 transition-opacity${isActive ? ' font-semibold' : ''}`
            }
            end
            key={item.id}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  const {open} = useAside();

  return (
    <div className="flex gap-4 items-center text-black">
      <button
        className="hover:opacity-60 transition-opacity cursor-pointer"
        onClick={() => open('search')}
        aria-label="Search"
      >
        <MagnifyingGlassIcon size={24} />
      </button>
      <NavLink
        prefetch="intent"
        to="/account"
        className="hidden md:block hover:opacity-60 transition-opacity"
        aria-label="Account"
      >
        <Suspense fallback={<UserCircleIcon size={24} />}>
          <Await resolve={isLoggedIn}>
            {() => <UserCircleIcon size={24} />}
          </Await>
        </Suspense>
      </NavLink>
      <CartToggle cart={cart} />
      <button
        className="md:hidden hover:opacity-60 transition-opacity cursor-pointer"
        onClick={() => open('mobile')}
        aria-label="Menu"
      >
        <ListIcon size={24} />
      </button>
    </div>
  );
}

function CartBadge({count}: {count: number}) {
  return (
    <NavLink
      to="/cart"
      className="relative hover:opacity-60 transition-opacity"
      aria-label={`Cart, ${count} item${count !== 1 ? 's' : ''}`}
    >
      <ShoppingBagIcon size={24} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#2a6b8f] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium leading-none">
          {count}
        </span>
      )}
    </NavLink>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function resolveUrl(
  url: string,
  publicStoreDomain: string,
  primaryDomainUrl: string,
) {
  return url.includes('myshopify.com') ||
    url.includes(publicStoreDomain) ||
    url.includes(primaryDomainUrl)
    ? new URL(url).pathname
    : url;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};
