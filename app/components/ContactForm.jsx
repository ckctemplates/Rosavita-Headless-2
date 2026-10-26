import {useEffect, useRef, useState} from 'react';
import {Form, useActionData, useNavigation} from 'react-router';
import {FormField} from '~/components/FormField';
import {FormMessage} from '~/components/FormMessage';
import {
  CONTACT_SUCCESS_MESSAGE,
  validateContactValues,
} from '~/lib/contact';

const FIELD_ORDER = ['name', 'email', 'phone', 'body'];
const FIELD_IDS = {
  name: 'contact-name',
  email: 'contact-email',
  phone: 'contact-phone',
  body: 'contact-body',
};

/**
 * @param {{
 *   contactPosted?: boolean,
 *   renderedAt: number,
 *   turnstileSiteKey?: string | null,
 * }} props
 */
export function ContactForm({
  contactPosted = false,
  renderedAt,
  turnstileSiteKey = null,
}) {
  const actionData = useActionData();
  const navigation = useNavigation();
  const [clientErrors, setClientErrors] = useState({});
  const formRef = useRef(null);
  const successRef = useRef(null);
  const errorRef = useRef(null);
  const wasSubmitting = useRef(false);
  const didMount = useRef(false);

  const actionErrors =
    actionData && typeof actionData === 'object' && actionData.errors
      ? actionData.errors
      : {};
  const errors = {...actionErrors, ...clientErrors};
  const hasErrors = Object.keys(errors).length > 0;
  const showSuccess = Boolean(contactPosted) && !hasErrors;
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (navigation.state === 'submitting') {
      wasSubmitting.current = true;
      return;
    }
    if (navigation.state !== 'idle' || !wasSubmitting.current) return;

    wasSubmitting.current = false;

    if (contactPosted && !actionData?.errors) {
      formRef.current?.reset();
      setClientErrors({});
      successRef.current?.focus();
    }
  }, [navigation.state, contactPosted, actionData]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      if (contactPosted) successRef.current?.focus();
    }
  }, [contactPosted]);

  useEffect(() => {
    if (!actionData?.errors) return;

    const firstField = FIELD_ORDER.find((field) => actionData.errors[field]);
    if (firstField) {
      document.getElementById(FIELD_IDS[firstField])?.focus();
      return;
    }

    errorRef.current?.focus();
  }, [actionData]);

  useEffect(() => {
    if (
      turnstileSiteKey &&
      navigation.state === 'idle' &&
      actionData?.errors &&
      typeof window !== 'undefined' &&
      window.turnstile
    ) {
      window.turnstile.reset();
    }
  }, [turnstileSiteKey, navigation.state, actionData]);

  /**
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  function handleSubmit(event) {
    const formData = new FormData(event.currentTarget);
    const {errors: nextErrors} = validateContactValues({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      body: formData.get('body'),
    });

    setClientErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) return;

    event.preventDefault();

    const firstField = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstField) {
      document.getElementById(FIELD_IDS[firstField])?.focus();
    }
  }

  /**
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  function handleInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
      return;
    }

    const name = target.name;
    if (!name || !clientErrors[name]) return;

    setClientErrors((current) => {
      if (!current[name]) return current;
      const next = {...current};
      delete next[name];
      return next;
    });
  }

  const showFieldList = !errors.form;

  return (
    <div className="rv-contact__form-wrap">
      {showSuccess ? (
        <FormMessage
          ref={successRef}
          type="success"
          id="contact-success"
          className="rv-contact__message--top"
        >
          <p>{CONTACT_SUCCESS_MESSAGE}</p>
        </FormMessage>
      ) : null}

      {hasErrors ? (
        <FormMessage
          ref={errorRef}
          type="error"
          id="contact-error"
          className="rv-contact__message--top"
        >
          {errors.form ? (
            <p>{errors.form}</p>
          ) : null}
          {showFieldList ? (
            <ul className="rv-contact__message-list">
              {FIELD_ORDER.map((field) =>
                errors[field] ? <li key={field}>{errors[field]}</li> : null,
              )}
            </ul>
          ) : null}
        </FormMessage>
      ) : null}

      <Form
        ref={formRef}
        method="post"
        className="rv-contact__form"
        noValidate
        onSubmit={handleSubmit}
        onInput={handleInput}
        aria-labelledby="rv-contact-title"
      >
        <div className="rv-contact__row">
          <FormField
            id={FIELD_IDS.name}
            name="name"
            label="Name"
            autoComplete="name"
            maxLength={100}
            defaultValue={actionData?.values?.name ?? ''}
            error={errors.name}
          />
          <FormField
            id={FIELD_IDS.email}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            required
            maxLength={254}
            defaultValue={actionData?.values?.email ?? ''}
            error={errors.email}
          />
        </div>

        <FormField
          id={FIELD_IDS.phone}
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={30}
          defaultValue={actionData?.values?.phone ?? ''}
          error={errors.phone}
        />

        <FormField
          id={FIELD_IDS.body}
          name="body"
          label="Comment"
          multiline
          required
          maxLength={5000}
          defaultValue={actionData?.values?.body ?? ''}
          error={errors.body}
        />

        {turnstileSiteKey ? (
          <TurnstileWidget siteKey={turnstileSiteKey} />
        ) : null}

        <div className="rv-contact__honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
        <input type="hidden" name="renderedAt" defaultValue={renderedAt} />

        <div className="rv-contact__actions">
          <button
            className="rv-contact__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </Form>
    </div>
  );
}

/**
 * Cloudflare Turnstile is entirely optional. When no site key is configured
 * this renders nothing and sends no extra requests.
 * @param {{siteKey: string}} props
 */
function TurnstileWidget({siteKey}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;

    const render = () => {
      if (
        cancelled ||
        !containerRef.current ||
        containerRef.current.dataset.rendered === 'true' ||
        typeof window === 'undefined' ||
        !window.turnstile
      ) {
        return;
      }
      window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
      });
      containerRef.current.dataset.rendered = 'true';
    };

    if (window.turnstile) {
      render();
      return () => {
        cancelled = true;
      };
    }

    const existing = document.querySelector('script[data-rv-turnstile]');
    if (existing) {
      existing.addEventListener('load', render);
      return () => {
        cancelled = true;
        existing.removeEventListener('load', render);
      };
    }

    const script = document.createElement('script');
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset.rvTurnstile = 'true';
    script.addEventListener('load', render);
    document.head.appendChild(script);

    return () => {
      cancelled = true;
      script.removeEventListener('load', render);
    };
  }, [siteKey]);

  return <div className="rv-contact__turnstile" ref={containerRef} />;
}
