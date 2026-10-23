import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="cart" heading="YOUR CART">
 *  <p>...</p>
 * </Aside>
 * ```
 * @param {{
 *   children?: React.ReactNode;
 *   type: AsideType;
 *   heading?: React.ReactNode;
 *   className?: string;
 *   panelClassName?: string;
 *   showHeader?: boolean;
 *   labelledBy?: string;
 * }}
 */
export function Aside({
  children,
  heading,
  type,
  className = '',
  panelClassName = '',
  showHeader = true,
  labelledBy,
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const panelRef = useRef(null);
  const autoId = useId();
  const titleId = labelledBy ?? `aside-title-${autoId}`;

  useEffect(() => {
    if (!expanded) return;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;
    let didFocus = false;
    let frame;

    function focusPanel() {
      if (didFocus || !panel) return;
      const focusTarget =
        panel.querySelector('[data-autofocus]') ?? panel.querySelector(FOCUSABLE);
      if (!focusTarget) return;

      didFocus = true;
      focusTarget.focus?.();
    }

    const observer = new MutationObserver(focusPanel);
    if (panel) {
      observer.observe(panel, {childList: true, subtree: true});
    }
    frame = requestAnimationFrame(focusPanel);

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;

      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (element) => !element.hasAttribute('hidden'),
      );

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus?.();
      }
    };
  }, [close, expanded]);

  return (
    <div
      aria-hidden={!expanded}
      aria-labelledby={showHeader ? titleId : labelledBy}
      aria-modal={expanded}
      className={`overlay ${expanded ? 'expanded' : ''} ${className}`}
      role="dialog"
    >
      <button
        aria-label="Close cart"
        className="close-outside"
        onClick={close}
        tabIndex={expanded ? 0 : -1}
        type="button"
      />
      <aside className={panelClassName} ref={panelRef}>
        {showHeader ? (
          <header>
            <h3 id={titleId}>{heading}</h3>
            <button
              className="close reset"
              onClick={close}
              aria-label="Close"
              data-autofocus
              type="button"
            >
              &times;
            </button>
          </header>
        ) : null}
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');
  const returnFocusRef = useRef(null);

  const open = useCallback((mode) => {
    if (mode !== 'closed') {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    }
    setType(mode);
  }, []);

  const close = useCallback(() => {
    setType('closed');
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    requestAnimationFrame(() => {
      if (target?.isConnected) target.focus?.();
    });
  }, []);

  useEffect(() => {
    if (type === 'closed') return;

    const {body} = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [type]);

  return (
    <AsideContext.Provider value={{type, open, close}}>
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */
/**
 * @typedef {{
 *   type: AsideType;
 *   open: (mode: AsideType) => void;
 *   close: () => void;
 * }} AsideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */
