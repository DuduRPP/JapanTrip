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

  return <aside className="timeline">
    <div className="timeline-header">
      <button type="button" className="timeline-toggle utility-button" aria-haspopup="dialog"
        aria-controls="timeline-panel" onClick={showTimeline}>
        <Icon name="route" /> {t.route}
      </button>
      <TodayLink step={today} stepHref={stepHref} label={t.goToday} />
    </div>
    <dialog className="timeline-panel" id="timeline-panel" ref={dialog} aria-labelledby="timeline-title"
      onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <div className="timeline-panel-content">
        <header className="timeline-panel-header">
          <h2 id="timeline-title"><Icon name="route" /> {t.route}</h2>
          <button type="button" className="icon-link" aria-label={t.closeRoute} title={t.closeRoute}
            autoFocus onClick={() => dialog.current.close()}><Icon name="close" /></button>
        </header>
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
              return <li className="timeline-city" key={group.days[0].id} style={{ '--rail-accent': city.accent }}>
                <div className="rail-city-tools">
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
                    <a className="rail-step" href={stepHref(step)} aria-current={selected === step ? 'page' : undefined}
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
      </div>
    </dialog>
  </aside>;
}
