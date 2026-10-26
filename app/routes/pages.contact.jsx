import {data, redirect, useLoaderData} from 'react-router';
import {ContactForm} from '~/components/ContactForm';
import {
  CONTACT_ERROR_MESSAGE,
  CONTACT_PAGE_DESCRIPTION,
  CONTACT_PAGE_TITLE,
  CONTACT_RATE_LIMIT_MESSAGE,
} from '~/lib/contact';
import {processContactSubmission} from '~/lib/contact.server';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const title = data?.page?.title || CONTACT_PAGE_TITLE;
  const description =
    data?.page?.seo?.description || CONTACT_PAGE_DESCRIPTION;

  return [
    {title: `${title} | Rosavita`},
    {name: 'description', content: description},
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({context, request}) {
  const url = new URL(request.url);
  const contactPosted = url.searchParams.get('contact_posted') === 'true';

  let page = null;
  try {
    const result = await context.storefront.query(CONTACT_PAGE_QUERY, {
      variables: {
        handle: 'contact',
        language: context.storefront.i18n.language,
        country: context.storefront.i18n.country,
      },
    });
    page = result?.page ?? null;
  } catch (error) {
    // The Storefront token may not have `unauthenticated_read_content`.
    // The contact page must still render with the fallback title.
    console.warn(
      `[contact] Could not load the Shopify "contact" page: ${
        error instanceof Error ? error.message : 'unknown error'
      }`,
    );
  }

  return {
    page,
    contactPosted,
    renderedAt: Date.now(),
    turnstileSiteKey: context.env.TURNSTILE_SITE_KEY || null,
  };
}

/**
 * @param {Route.ActionArgs} args
 */
export async function action({request, context}) {
  if (request.method !== 'POST') {
    return data(
      {errors: {form: CONTACT_ERROR_MESSAGE}, values: {}},
      {status: 405},
    );
  }

  try {
    const formData = await request.formData();
    const result = await processContactSubmission({
      request,
      env: context.env,
      formData,
    });

    if (result.status === 'success') {
      return redirect('/pages/contact?contact_posted=true');
    }

    const status =
      result.errors?.form === CONTACT_RATE_LIMIT_MESSAGE ? 429 : 400;

    return data(
      {
        errors: result.errors || {form: CONTACT_ERROR_MESSAGE},
        values: result.values || {},
      },
      {status},
    );
  } catch (error) {
    // Never leak technical details to the shopper.
    console.error(
      `[contact] Unexpected submission error: ${
        error instanceof Error ? error.message : 'unknown error'
      }`,
    );
    return data(
      {errors: {form: CONTACT_ERROR_MESSAGE}, values: {}},
      {status: 500},
    );
  }
}

export default function ContactPage() {
  /** @type {LoaderReturnData} */
  const {page, contactPosted, renderedAt, turnstileSiteKey} = useLoaderData();

  return (
    <div className="rv-contact">
      <div className="rv-contact__inner">
        <div
          className={`rv-contact__intro${
            page?.body ? ' rv-contact__intro--body' : ''
          }`}
        >
          <h1 className="rv-contact__title" id="rv-contact-title">
            {page?.title || CONTACT_PAGE_TITLE}
          </h1>
          {page?.body ? (
            <div
              className="rv-contact__body"
              dangerouslySetInnerHTML={{__html: page.body}}
            />
          ) : null}
        </div>

        <ContactForm
          contactPosted={contactPosted}
          renderedAt={renderedAt}
          turnstileSiteKey={turnstileSiteKey}
        />
      </div>
    </div>
  );
}

const CONTACT_PAGE_QUERY = `#graphql
  query ContactPage(
    $language: LanguageCode
    $country: CountryCode
    $handle: String!
  ) @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      handle
      title
      body
      seo {
        title
        description
      }
    }
  }
`;

/** @typedef {import('./+types/pages.contact').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
