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
    if (step.type === 'transfer') {
      groups.push({ transfer: step });
      continue;
    }

    const base = step.base === undefined ? step.city : step.base;
    const city = base ?? step.city;
    const hasStay = base !== null;
    let group = groups.at(-1);
    if (group?.city !== city || group?.hasStay !== hasStay) {
      group = { id: step.id, city, hasStay, visits: [] };
      groups.push(group);
    }

    let visit = group.visits.at(-1);
    if (visit?.city !== step.city) {
      visit = { city: step.city, days: [] };
      group.visits.push(visit);
    }
    visit.days.push(step);
  }
  return groups;
}

export function TodayLink({ step, stepHref, label }) {
  if (!step) return null;
  return <a className="today-link" href={stepHref(step)}><Icon name="sun" /> {label}</a>;
}

export function Timeline({ groups, cities, t, translate, title, dayText, shortDate, stepHref,
  cityHref, cityPages, cityPage, cityId, selected, today }) {
  const dialog = useRef(null);
  const rail = useRef(null);

  useEffect(() => {
    function closeOnNavigation() {
      dialog.current?.close();
    }
    window.addEventListener('hashchange', closeOnNavigation);
    return () => window.removeEventListener('hashchange', closeOnNavigation);
  }, []);

  function showTimeline() {
    dialog.current.showModal();
    const pane = rail.current;
    const current = pane.querySelector('.rail-step[aria-current="page"]')
      ?? pane.querySelector('[aria-current="page"]') ?? pane.querySelector('[data-today]');
    if (!current) return;
    const view = pane.getBoundingClientRect();
    const item = current.getBoundingClientRect();
    if (item.top < view.top || item.bottom > view.bottom) {
      pane.scrollTop += item.top - view.top - (view.height - item.height) / 2;
    }
  }

  function closeOnLink(event) {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey &&
        event.target.closest('a')) {
      dialog.current.close();
    }
  }

  function cityLinks(city, kind, { showHotels = false, compact = false } = {}) {
    const name = translate(city.name);
    return <div className={'rail-city-tools' + (compact ? ' rail-city-tools-compact' : '')}>
      <a className="rail-city-link" href={cityHref('cidade', city.id)}
        aria-current={cityId === city.id && cityPage === 'cidade' ? 'page' : undefined}>
        <span className="stamp"><Icon name={city.symbol} /></span>
        <span className="rail-city-copy">
          <strong>{name}</strong>
          <span className="rail-city-kind">{kind}</span>
        </span>
      </a>
      {cityPages.filter(page => page.kind !== 'cidade' && (showHotels || page.kind !== 'hoteis')).map(page => {
        const label = t[page.label] + ' · ' + name;
        return <a className="rail-shortcut" key={page.kind} href={cityHref(page.kind, city.id)}
          aria-label={label} title={label}
          aria-current={cityId === city.id && cityPage === page.kind ? 'page' : undefined}>
          <Icon name={page.icon} /> {!compact && t[page.label]}
        </a>;
      })}
    </div>;
  }

  function dayLink(step) {
    return <li key={step.id}>
      <a className="rail-step" href={stepHref(step)} aria-current={selected === step ? 'page' : undefined}
        data-today={step === today ? '' : undefined}>
        <span className="rail-date"><span>{dayText(step.number)}</span><time dateTime={step.date}>{shortDate(step.date)}</time>
          {step === today && <strong className="today-tag">{t.today}</strong>}</span>
        <span className="rail-title">{title(step)}</span>
      </a>
    </li>;
  }

  return <div className="timeline">
    <button type="button" className="timeline-toggle utility-button" aria-haspopup="dialog"
      aria-controls="timeline-panel" aria-label={t.route} title={t.route} onClick={showTimeline}>
      <Icon name="route" /><span>{t.route}</span>
    </button>
    <dialog className="timeline-panel" id="timeline-panel" ref={dialog} aria-labelledby="timeline-title"
      onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <div className="timeline-panel-content">
        <header className="timeline-panel-header">
          <h2 id="timeline-title"><Icon name="route" /> {t.route}</h2>
          <button type="button" className="icon-link" aria-label={t.closeRoute} title={t.closeRoute}
            autoFocus onClick={() => dialog.current.close()}><Icon name="close" /></button>
        </header>
        {today && <div className="timeline-today">
          <TodayLink step={today} stepHref={stepHref} label={t.goToday} />
        </div>}
        <nav ref={rail} aria-label={t.route} className="timeline-steps" onClick={closeOnLink}>
          <ol className="plain rail-groups">
            {groups.map(group => {
              if (group.transfer) {
                const transfer = group.transfer;
                return <li className="timeline-transfer" key={transfer.id}>
                  <a className="rail-step" href={stepHref(transfer)} aria-current={selected === transfer ? 'page' : undefined}>
                    <span className="stamp"><Icon name="train" /></span><span>{title(transfer)}</span>
                  </a>
                </li>;
              }
              const city = cities[group.city];
              return <li className="timeline-city" key={group.id} style={{ '--rail-accent': city.accent }}>
                {cityLinks(city, group.hasStay ? t.lodgingBase : t.noOvernight, { showHotels: group.hasStay })}
                <ol className="plain rail-days">
                  {group.visits.map(visit => {
                    if (visit.city === group.city) return visit.days.map(dayLink);

                    const destination = cities[visit.city];
                    return <li className="rail-day-trip" key={visit.days[0].id}>
                      <div className="rail-day-trip-content" style={{ '--rail-accent': destination.accent }}>
                        {cityLinks(destination, t.dayTripFrom(translate(city.name)), { compact: true })}
                        <ol className="plain rail-days">{visit.days.map(dayLink)}</ol>
                      </div>
                    </li>;
                  })}
                </ol>
              </li>;
            })}
          </ol>
        </nav>
      </div>
    </dialog>
  </div>;
}
