const drawings = {
  book: <>
    <path className="icon-tint" d="M4 5.5c3.1-.8 5.8-.2 8 1.5 2.2-1.7 4.9-2.3 8-1.5v13c-3.1-.8-5.8-.2-8 1.5-2.2-1.7-4.9-2.3-8-1.5z"/>
    <path d="M12 7v13M7 9.5c1.2 0 2.1.3 3 .8m-3 3c1.2 0 2.1.3 3 .8m4-3.8c.9-.5 1.8-.8 3-.8"/>
  </>,
  tower: <>
    <path className="icon-tint" d="M10.5 7h3l1.3 6 3.4 7h-3.1L12 16l-3.1 4H5.8l3.4-7z"/>
    <path d="M12 3.5V7M9.3 10.5h5.4m-6.4 3.3h7.4M4.4 20h15.2"/>
  </>,
  torii: <>
    <path className="icon-tint" d="M7 8h2v12H7zM15 8h2v12h-2z"/>
    <path d="M3 5c5.6 1.8 12.4 1.8 18 0M4.4 8h15.2M5 12.5h14M12 8v4.5"/>
  </>,
  train: <>
    <path className="icon-tint" d="M6 6.8A3.8 3.8 0 0 1 9.8 3h4.4A3.8 3.8 0 0 1 18 6.8V16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/>
    <path d="M6 11h12M9 18l-2.5 3m8.5-3 2.5 3M9 14.5h.4m5.2 0h.4M10 6h4"/>
  </>,
  bed: <>
    <path className="icon-tint" d="M4 10.5h13.5a3 3 0 0 1 3 3v3H4z"/>
    <path d="M4 6v14m16.5-3.5V20m-11-9.5v6M6.2 8h2.3"/>
  </>,
  bowl: <>
    <path className="icon-tint" d="M3.5 12.3h17a8.5 8.5 0 0 1-17 0z"/>
    <path d="M8.6 21h6.8m-6-12.5 9.5-5.1M13 9l8-2.4"/>
  </>,
  route: <>
    <path d="M6 7.5v9a3 3 0 0 0 3 3h5a4 4 0 0 0 4-4v-2"/>
    <circle className="icon-tint" cx="6" cy="5" r="2.5"/>
    <circle className="icon-tint" cx="18" cy="10.5" r="2.5"/>
  </>,
  sun: <>
    <circle className="icon-tint" cx="12" cy="12" r="4"/>
    <path d="M12 2.5v2m0 15v2M2.5 12h2m15 0h2m-16.2-6.7 1.4 1.4m10.6 10.6 1.4 1.4m0-13.4-1.4 1.4M6.7 17.3l-1.4 1.4"/>
  </>,
  check: <path d="m5 12 4 4L19 6"/>,
  chevron: <path d="m9 6 6 6-6 6"/>,
};

export function Icon({ name }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {drawings[name] ?? drawings.book}
  </svg>;
}
