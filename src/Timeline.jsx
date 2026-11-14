import { useEffect, useRef } from 'react';
import { Icon } from './Icons';

export function localDateKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return [date.getFullYear(), month, day].join('-');
}

export function groupJourney(journey) {
  const groups = [];
  for (const step of journey) {
    const previous = groups.at(-1);
    if (step.type === 'day' && previous?.city === step.city) {
      previous.days.push(step);
    } else if (step.type === 'day') {
      groups.push({ city: step.city, days: [step] });
    } else {
      groups.push({ transfer: step });
    }
  }
  return groups;
}

export function TodayLink({ step, stepHref, label, onClick }) {
  if (!step) return null;
  return <a className="today-link" href={stepHref(step)} onClick={onClick}><Icon name="sun" /> {label}</a>;
}

export function Timeline({ groups, cities, t, translate, title, dayText, shortDate, stepHref,
  cityHref, cityPages, cityPage, cityId, selected, today, open, setOpen }) {
  const toggle = useRef(null);
  const rail = useRef(null);

  useEffect(() => {
    const pane = rail.current;
    const current = pane?.querySelector('.rail-step[aria-current="page"]')
      ?? pane?.querySelector('[aria-current="page"]') ?? pane?.querySelector('[data-today]');
    if (!pane?.clientWidth || !current) return;
    const container = pane.getBoundingClientRect();
    const item = current.getBoundingClientRect();
    if (item.right > container.right || item.left < container.left) {
      pane.scrollLeft += item.left - container.left - (container.width - item.width) / 2;
    }
  }, [open, selected, today, cityId, cityPage]);

  function closeFromKeyboard(event) {
    if (open && event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      toggle.current?.focus();
    }
  }

  function closeOnMobile() {
    if (window.matchMedia('(max-width: 58rem)').matches) setOpen(false);
  }

  function scrollRail(direction) {
    const pane = rail.current;
    if (pane) pane.scrollBy({ left: direction * pane.clientWidth * .8,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return <aside className="timeline" onKeyDown={closeFromKeyboard}>
    <div className="timeline-header">
      <button type="button" ref={toggle} className="timeline-toggle" aria-expanded={open}
        aria-controls="timeline-steps" onClick={() => setOpen(value => !value)}>
        <Icon name="route" /> {t.route} <span className="toggle-arrow"><Icon name="chevron" /></span>
      </button>
      <TodayLink step={today} stepHref={stepHref} label={t.goToday} onClick={closeOnMobile} />
      {open && <div className="rail-controls">
        <button className="icon-link" type="button" aria-label={t.laterSteps} title={t.laterSteps}
          aria-controls="timeline-steps" onClick={() => scrollRail(-1)}><Icon name="previous" /></button>
        <button className="icon-link" type="button" aria-label={t.earlierSteps} title={t.earlierSteps}
          aria-controls="timeline-steps" onClick={() => scrollRail(1)}><Icon name="next" /></button>
      </div>}
    </div>
    <nav ref={rail} id="timeline-steps" dir="rtl" aria-label={t.route} hidden={!open} className="timeline-steps"
      onClick={event => { if (event.target.closest('a')) closeOnMobile(); }}>
      <ol className="plain rail-groups">
        {groups.map(group => {
          if (group.transfer) {
            const transfer = group.transfer;
            return <li className="timeline-transfer" key={transfer.id}>
              <a className="rail-step" dir="ltr" href={stepHref(transfer)} aria-current={selected === transfer ? 'page' : undefined}>
                <span className="stamp"><Icon name="train" /></span><span>{title(transfer)}</span>
              </a>
            </li>;
          }
          const city = cities[group.city];
          return <li className="timeline-city" key={group.days[0].id} style={{ '--rail-accent': city.accent }}>
            <div className="rail-city-tools" dir="ltr">
              <a className="rail-city-link" href={cityHref('cidade', city.id)}
                aria-current={cityId === city.id && cityPage === 'cidade' ? 'page' : undefined}>
                <span className="stamp"><Icon name={city.symbol} /></span><span>{translate(city.name)}</span>
              </a>
              {cityPages.filter(page => page.kind !== 'cidade').map(page => {
                const label = t[page.label] + ' · ' + translate(city.name);
                return <a className="rail-shortcut" key={page.kind} href={cityHref(page.kind, city.id)}
                  aria-label={label} title={label}
                  aria-current={cityId === city.id && cityPage === page.kind ? 'page' : undefined}>
                  <Icon name={page.icon} /> {t[page.label]}
                </a>;
              })}
            </div>
            <ol className="plain rail-days">
              {group.days.map(step => <li key={step.id}>
                <a className="rail-step" dir="ltr" href={stepHref(step)} aria-current={selected === step ? 'page' : undefined}
                  data-today={step === today ? '' : undefined}>
                  <span className="rail-date"><span>{dayText(step.number)}</span><time dateTime={step.date}>{shortDate(step.date)}</time>
                    {step === today && <strong className="today-tag">{t.today}</strong>}</span>
                  <span className="rail-title">{title(step)}</span>
                </a>
              </li>)}
            </ol>
          </li>;
        })}
      </ol>
    </nav>
  </aside>;
}
