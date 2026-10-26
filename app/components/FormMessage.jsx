import {forwardRef} from 'react';

/**
 * Inline success/error box used by the contact form.
 * @param {{
 *   type?: 'success' | 'error',
 *   id?: string,
 *   className?: string,
 *   children: React.ReactNode,
 * }} props
 */
export const FormMessage = forwardRef(function FormMessage(
  {type = 'success', id, className = '', children},
  ref,
) {
  const isSuccess = type === 'success';

  return (
    <div
      ref={ref}
      id={id}
      className={`rv-contact__message rv-contact__message--${type} ${className}`.trim()}
      role={isSuccess ? 'status' : 'alert'}
      aria-live={isSuccess ? 'polite' : 'assertive'}
      tabIndex={isSuccess ? -1 : undefined}
    >
      <span className="rv-contact__message-icon" aria-hidden="true">
        {isSuccess ? <CheckIcon /> : <AlertIcon />}
      </span>
      <div className="rv-contact__message-content">{children}</div>
    </div>
  );
});

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.9" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.2" />
      <path d="M12 16.4h.01" />
    </svg>
  );
}
