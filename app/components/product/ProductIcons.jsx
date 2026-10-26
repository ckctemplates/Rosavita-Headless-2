export function CheckIcon({className, size = 16, strokeWidth = 2}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 20 20"
      width={size}
    >
      <path
        d="m4 10.4 3.8 3.8L16 5.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function CheckCircleIcon({className, size = 14}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 16 16"
      width={size}
    >
      <circle cx="8" cy="8" fill="currentColor" r="8" />
      <path
        d="m4.7 8.2 2.1 2.1 4.5-4.6"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function ChevronRightIcon({className, size = 14}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 16 16"
      width={size}
    >
      <path
        d="m6 3 5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function ChevronLeftIcon({className, size = 20}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="m14.5 5-7 7 7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function ChevronRightLargeIcon({className, size = 20}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="m9.5 5 7 7-7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function TruckIcon({className, size = 15}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 20 20"
      width={size}
    >
      <path
        d="M1.5 4.5h10v10h-10zM11.5 8h3.2l2.8 3.2v3.3h-6z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
      <circle cx="5" cy="15.5" fill="currentColor" r="1.7" />
      <circle cx="14.5" cy="15.5" fill="currentColor" r="1.7" />
    </svg>
  );
}

export function ShieldIcon({className, size = 16}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 20 20"
      width={size}
    >
      <path
        d="M10 1.8 17 4v5.7c0 4.4-2.9 7.5-7 8.5-4.1-1-7-4.1-7-8.5V4z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="m6.6 9.8 2.2 2.2 4.6-4.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function StarIcon({className, fill = 'currentColor', size = 14}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill={fill}
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="M12 2.2l3.05 6.18 6.82.99-4.94 4.81 1.17 6.8L12 17.77l-6.1 3.21 1.17-6.8-4.94-4.81 6.82-.99z" />
    </svg>
  );
}

export function SealIcon({className, size = 56}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      viewBox="0 0 56 56"
      width={size}
    >
      <circle cx="28" cy="28" fill="#1F5C4A" r="27" />
      <circle
        cx="28"
        cy="28"
        fill="none"
        r="22"
        stroke="#fff"
        strokeDasharray="1 2.4"
        strokeLinecap="round"
        strokeWidth="1"
      />
      <path
        d="m19 28.2 5.7 5.7L37.5 21"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <text
        fill="#fff"
        fontFamily="Montserrat, sans-serif"
        fontSize="5.2"
        fontWeight="700"
        letterSpacing="0.55"
        textAnchor="middle"
      >
        <textPath href="#rv-seal-text" startOffset="50%">
          MONEY BACK GUARANTEE
        </textPath>
      </text>
      <defs>
        <path
          d="M 28,28 m -18,0 a 18,18 0 1,1 36,0 a 18,18 0 1,1 -36,0"
          id="rv-seal-text"
        />
      </defs>
    </svg>
  );
}
