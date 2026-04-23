import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {InstagramLogoIcon, FacebookLogoIcon} from '@phosphor-icons/react';
import ScallopBorder from '~/components/ui/ScallopBorder';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <footer>
      {/* Scalloped transition from page background into footer */}
      <div className="bg-[#f0f2ea] rotate-180">
        <ScallopBorder color="#e4ceb4" />
      </div>

      <div className="bg-gradient-to-b from-[#e4ceb4] to-[#e1ac77]">
        {/* Made with Love */}
        <div className="flex flex-col items-center pt-32 pb-10 gap-4 text-center px-8">
          <h2 className="text-3xl font-bold text-black">Made with Love</h2>
          <p className="text-base text-black max-w-[603px]">
            Comfy apparel, top notch drinks, cool people.
          </p>
          <div className="flex gap-4 mt-2 text-black">
            <a
              href="https://www.instagram.com/hellodaydrinkers/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:opacity-60 transition-opacity"
            >
              <InstagramLogoIcon size={24} />
            </a>
            <a
              href="https://www.facebook.com/people/Daydrinkers/100093336322058"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:opacity-60 transition-opacity"
            >
              <FacebookLogoIcon size={24} />
            </a>
          </div>
        </div>

        {/* Storefront image */}
        <div className="w-full">
          <img
            src="/images/footer-img.png"
            alt="Daydrinkers storefront"
            className="w-full h-[400px] md:h-[805px] object-cover"
          />
        </div>

        {/* Policy links from Shopify */}
        <Suspense>
          <Await resolve={footerPromise}>
            {(footer) =>
              footer?.menu && header.shop.primaryDomain?.url ? (
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              ) : (
                <FooterFallback />
              )
            }
          </Await>
        </Suspense>
      </div>
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <div className="py-6 text-center mt-[-70px]">
      <p className="text-xs text-white flex flex-wrap justify-center gap-x-3 gap-y-1 px-4">
        <span>2026</span>
        {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          return (
            <span key={item.id} className="flex items-center gap-x-3">
              <span className="opacity-50">•</span>
              {isExternal ? (
                <a
                  href={url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:opacity-70 transition-opacity"
                >
                  {item.title}
                </a>
              ) : (
                <NavLink
                  end
                  prefetch="intent"
                  to={url}
                  className="hover:opacity-70 transition-opacity"
                >
                  {item.title}
                </NavLink>
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
}

function FooterFallback() {
  return (
    <div className="py-6 text-center mt-[-70px]">
      <p className="text-xs text-white">
        2026 &nbsp;•&nbsp; Refund policy &nbsp;•&nbsp; Privacy policy
        &nbsp;•&nbsp; Terms of service &nbsp;•&nbsp; Contact information
      </p>
    </div>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
