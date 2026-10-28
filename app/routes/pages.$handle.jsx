import {useLoaderData} from 'react-router';
import {PageContent} from '~/components/PageContent';
import {createPageDescription, preparePageHtml} from '~/lib/prepare-page-html';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {POLICY_FALLBACK_CONTENT} from '~/content/policies';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const page = data?.page;

  if (!page) {
    return [{title: 'Page not found | Rosavita'}];
  }

  const title = page.seo?.title?.trim() || page.title;

  return [
    {title: `${title} | Rosavita`},
    ...(data.description
      ? [{name: 'description', content: data.description}]
      : []),
    {
      tagName: 'link',
      rel: 'canonical',
      href: `/pages/${page.handle}`,
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
const POLICY_PAGE_TITLES = {
  'privacy-policy': 'Privacy policy',
  'terms-of-service': 'Terms of service',
  'refund-policy': 'Refund policy',
};

async function loadCriticalData({context, request, params}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  let page = null;

  try {
    const result = await context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
        language: context.storefront.i18n?.language,
        country: context.storefront.i18n?.country,
      },
      cache: context.storefront.CacheLong(),
    });
    page = result?.page ?? null;
  } catch (error) {
    // Surface the real reason (e.g. a missing unauthenticated_read_content
    // scope) instead of silently rendering a 404.
    console.warn(
      `[pages.$handle] Could not load page "${params.handle}": ${error?.message || error}`,
    );
  }

  const fallback = POLICY_FALLBACK_CONTENT[params.handle];

  if (!page && !fallback) {
    throw new Response('Not Found', {status: 404});
  }

  if (page) {
    redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});
  }

  const shopifyBody = typeof page?.body === 'string' ? page.body : '';
  const hasShopifyBody = shopifyBody.trim().length > 0;
  const bodyToRender = hasShopifyBody ? shopifyBody : fallback || '';

  if (!hasShopifyBody && fallback) {
    console.warn(
      `[pages.$handle] Using fallback content for "${params.handle}": the Shopify page body is unavailable.`,
    );
  }

  let contentHtml = preparePageHtml(bodyToRender, {
    storeDomain: context.env.PUBLIC_STORE_DOMAIN,
  });

  if (!contentHtml.trim()) {
    console.warn(
      `[pages.$handle] No content available for "${params.handle}"; rendering the placeholder message.`,
    );
    contentHtml = '<p>This page is not available yet.</p>';
  }

  return {
    page: {
      handle: page?.handle ?? params.handle,
      title: page?.title?.trim() || POLICY_PAGE_TITLES[params.handle] || 'Page',
      seo: page?.seo ?? null,
    },
    contentHtml,
    description:
      page?.seo?.description?.trim() || createPageDescription(bodyToRender),
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page, contentHtml} = useLoaderData();

  return <PageContent title={page.title} html={contentHtml} />;
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

/** @typedef {import('./+types/pages.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
