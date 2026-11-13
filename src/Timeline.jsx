import { useEffect, useRef, useState } from 'react';
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
  cityHref, selected, today, overviewCity }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const rail = useRef(null);

  useEffect(() => {
    const pane = rail.current;
    const current = pane?.querySelector('[aria-current="page"]') ?? pane?.querySelector('[data-today]');
    if (!pane?.clientHeight || !current) return;
    const container = pane.getBoundingClientRect();
    const item = current.getBoundingClientRect();
    if (item.bottom > container.bottom || item.top < container.top) {
      pane.scrollTop += item.top - container.top - (container.height - item.height) / 2;
    }
  }, [open, selected, today, overviewCity]);

  function closeFromKeyboard(event) {
    if (open && event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      toggle.current?.focus();
    }
  }

  return <aside className="timeline" onKeyDown={closeFromKeyboard}>
    <div className="timeline-header">
      <h2><Icon name="route" /> {t.route}</h2>
      <button type="button" ref={toggle} className="timeline-toggle" aria-expanded={open}
        aria-controls="timeline-steps" onClick={() => setOpen(value => !value)}>
        <Icon name="route" /> {t.route} <span className="toggle-arrow"><Icon name="chevron" /></span>
      </button>
      <TodayLink step={today} stepHref={stepHref} label={t.goToday} onClick={() => setOpen(false)} />
    </div>
    <nav ref={rail} id="timeline-steps" aria-label={t.route} className={'timeline-steps' + (open ? ' is-open' : '')}
      onClick={event => { if (event.target.closest('a')) setOpen(false); }}>
      <ol className="plain">
        {groups.map(group => {
          if (group.transfer) {
            const transfer = group.transfer;
            return <li className="timeline-transfer" key={transfer.id}>
              <a href={stepHref(transfer)} aria-current={selected === transfer ? 'page' : undefined}>
                <span className="stamp"><Icon name="train" /></span><span>{title(transfer)}</span>
              </a>
            </li>;
          }
          const city = cities[group.city];
          return <li className="timeline-city" key={group.days[0].id} style={{ '--rail-accent': city.accent }}>
            <a className="rail-city-link" href={cityHref('cidade', city.id)}
              aria-current={overviewCity === city.id ? 'page' : undefined}>
              <span className="stamp"><Icon name={city.symbol} /></span><span>{translate(city.name)}</span>
            </a>
            <ol className="plain rail-days">
              {group.days.map(step => <li key={step.id}>
                <a href={stepHref(step)} aria-current={selected === step ? 'page' : undefined}
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
