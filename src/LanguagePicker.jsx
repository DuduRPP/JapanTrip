import { useEffect, useRef } from 'react';
import { Icon } from './Icons';
import { languages } from './labels';

const flags = {
  pt: <>
    <path fill="#009b3a" d="M0 0h30v20H0z" />
    <path fill="#ffdf00" d="M15 3 27 10 15 17 3 10z" />
    <circle cx="15" cy="10" r="4.25" fill="#002776" />
    <path d="M11.2 8.3a10 10 0 0 1 7.5 3.2" fill="none" stroke="#fff" strokeWidth="1" />
  </>,
  ja: <>
    <path fill="#fff" d="M0 0h30v20H0z" />
    <circle cx="15" cy="10" r="6" fill="#bc002d" />
  </>,
  en: <>
    <path fill="#012169" d="M0 0h30v20H0z" />
    <path d="m0 0 30 20m0-20L0 20" stroke="#fff" strokeWidth="4" />
    <path d="m0 0 30 20m0-20L0 20" stroke="#c8102e" strokeWidth="1.5" />
    <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6.5" />
    <path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3.5" />
  </>,
};

function Flag({ lang }) {
  return <svg className="language-flag" viewBox="0 0 30 20" aria-hidden="true">{flags[lang]}</svg>;
}

export function LanguagePicker({ lang, label, languageHref }) {
  const picker = useRef(null);
  const trigger = useRef(null);

  useEffect(() => {
    const details = picker.current;
    function closeOutside(event) {
      if (!details.contains(event.target)) details.open = false;
    }
    function closeOnNavigation() {
      details.open = false;
    }
    document.addEventListener('pointerdown', closeOutside);
    window.addEventListener('hashchange', closeOnNavigation);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      window.removeEventListener('hashchange', closeOnNavigation);
    };
  }, []);

  function closeWithEscape(event) {
    if (event.key !== 'Escape' || !picker.current.open) return;
    event.preventDefault();
    picker.current.open = false;
    trigger.current.focus();
  }

  return <details className="language-control" ref={picker} onKeyDown={closeWithEscape}>
    <summary ref={trigger} aria-label={label + ' · ' + languages[lang].name}>
      <Flag lang={lang} /> {languages[lang].label} <Icon name="chevron" />
    </summary>
    <nav className="language-options" aria-label={label}>
      {Object.entries(languages).map(([code, language]) => <a key={code} href={languageHref(code)}
        lang={language.tag} aria-current={code === lang ? 'true' : undefined}
        onClick={() => {
          if (code === lang) {
            picker.current.open = false;
            trigger.current.focus();
          }
        }}>
        <Flag lang={code} /> {language.name}
      </a>)}
    </nav>
  </details>;
}
