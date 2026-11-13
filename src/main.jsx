import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import trip from './data/trip.json';
import photos from './data/photos.json';
import { labels, languages } from './labels';
import './style.css';

const cities = Object.assign(Object.create(null), Object.fromEntries(trip.cities.map(city => [city.id, city])));
const symbols = {
  book: 'M12 5v15M3 4c4-1 7 0 9 2 2-2 5-3 9-2v14c-4-1-7 0-9 2-2-2-5-3-9-2z',
  tower: 'M12 2v4M10 6h4l1 5 3 10M10 6l-1 5-3 10M8 13h8M7 17h10M5 21h14',
  torii: 'M3 4c6 2 12 2 18 0M4 8h16M7 7v14M17 7v14M5 13h14M12 8v5',
  train: 'M5 5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM5 11h14M9 15h.01M15 15h.01M8 18l-2 4m10-4 2 4',
  check: 'm5 12 4 4L19 6',
  bed: 'M3 6v14m18-8v8M3 17h18M3 11h15a3 3 0 0 1 3 3v3M7 11v6',
  bowl: 'M3 12h18a9 9 0 0 1-18 0ZM9 21h6M10 8l8-5m-4 5 7-2',
};

function Icon({ name }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={symbols[name] ?? symbols.book} /></svg>;
}

function readRoute() {
  const parts = window.location.hash.slice(1).split('/').filter(Boolean);
  const hasLanguage = Object.hasOwn(languages, parts[0]);
  const [kind = 'inicio', id] = hasLanguage ? parts.slice(1) : parts;
  return { lang: hasLanguage ? parts[0] : 'pt', kind, id };
}

function href(lang, kind = 'inicio', id) {
  return '#/' + [lang, kind, id].filter(Boolean).join('/');
}

function Photo({ id, translate, cover = false }) {
  const photo = photos[id];
  const [failed, setFailed] = useState(false);
  if (!photo || failed) return null;
  return <figure className="photo">
    <img src={photo.url} alt={translate(photo.alt)} loading={cover ? 'eager' : 'lazy'}
      onError={() => setFailed(true)} />
    <figcaption><a href={photo.source}>{photo.author}</a> · <a href={photo.licenseUrl}>{photo.license}</a></figcaption>
  </figure>;
}

function Status({ done, complete, pending }) {
  return <span className={'status' + (done ? ' status-done' : '')}>
    <span className="status-box" aria-hidden="true">{done && <Icon name="check" />}</span>
    <span className="sr-only">{done ? complete : pending}</span>
  </span>;
}

function ItemName({ name, translate, lang }) {
  return <span className="item-name"><strong>{translate(name)}</strong>
    {lang !== 'ja' && name.ja && name.ja !== translate(name) && <small lang="ja">{name.ja}</small>}
  </span>;
}

function App() {
  const [route, setRoute] = useState(readRoute);
  const main = useRef(null);
  const hasNavigated = useRef(false);
  const { lang, kind, id } = route;
  const t = labels[lang];
  const locale = languages[lang].tag;
  const translate = value => value[lang] ?? value.pt;
  const dayText = number => lang === 'ja' ? number + t.day : t.day + ' ' + number;
  const cityName = cityId => translate(cities[cityId].name);
  const format = (value, unit) => new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'short' }).format(value);
  const duration = minutes => {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return [hours ? format(hours, 'hour') : '', rest || !hours ? format(rest, 'minute') : ''].filter(Boolean).join(' ');
  };
  const yen = value => new Intl.NumberFormat(locale, {
    style: 'currency', currency: 'JPY', currencyDisplay: 'narrowSymbol',
  }).format(value);
  const date = value => new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value));
  const title = step => step.type === 'day' ? translate(step.title) : cityName(step.from) + ' → ' + cityName(step.to);
  const stepHref = step => href(lang, step.type === 'day' ? 'dia' : 'trajeto', step.id);
  const stepIndex = trip.journey.findIndex(step => step.id === id && (
    (kind === 'dia' && step.type === 'day') || (kind === 'trajeto' && step.type === 'transfer')
  ));
  const step = trip.journey[stepIndex];
  const city = kind === 'sabores' ? cities[id] : step?.city ? cities[step.city] : undefined;
  const home = kind === 'inicio' && !id;
  const heading = home ? t.title : step ? title(step) : city ? t.food + ' · ' + translate(city.name) : t.missing;

  useEffect(() => {
    function onHashChange() {
      hasNavigated.current = true;
      setRoute(readRoute());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = home ? t.title : heading + ' · ' + t.title;
    if (hasNavigated.current) {
      window.scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
    }
  }, [locale, heading, home, t.title, kind, id]);

  return <div className="site" style={{ '--accent': city?.accent }}>
    <a className="skip" href="#content" onClick={event => { event.preventDefault(); main.current?.focus(); }}>{t.skip}</a>
    <header className="site-header wrap">
      <a className="brand" href={href(lang)}><Icon name="book" />{t.title}</a>
      <nav className="languages" aria-label={t.language}>
        {Object.entries(languages).map(([code, language]) => <a key={code}
          href={href(code, kind, id)} lang={language.tag} aria-label={language.name}
          aria-current={lang === code ? 'true' : undefined}>{language.label}</a>)}
      </nav>
    </header>
    <nav className="index-nav wrap" aria-label={t.route}>
      <a href={href(lang)} aria-current={home ? 'page' : undefined}>{t.overview}</a>
      {trip.journey.map(item => <a key={item.id} href={stepHref(item)}
        aria-current={item === step ? 'page' : undefined}>
        <Icon name={item.type === 'day' ? cities[item.city].symbol : 'train'} />
        {item.type === 'day' ? dayText(item.number) + ' · ' + cityName(item.city) : title(item)}
      </a>)}
    </nav>
    <main id="content" className="wrap page" tabIndex={-1} ref={main}>
      {trip.demo && <p className="sample">{t.sample}</p>}
      {step?.type === 'day' && <p className="chapter"><Icon name={city.symbol} />
        {dayText(step.number)} · {translate(city.name)} · <time dateTime={step.date}>{date(step.date)}</time>
      </p>}
      <h1>{heading}</h1>
      {home && <>
        <p className="intro">{t.intro}</p>
        <div className="spread spread-side">
          <Photo key="cover" id={trip.coverPhoto} translate={translate} cover />
          <section className="copy">
            <h2>{t.route}</h2>
            <ol className="route-list">{trip.journey.map(item => <li key={item.id}>
              <Icon name={item.type === 'day' ? cities[item.city].symbol : 'train'} />
              <a href={stepHref(item)}>{item.type === 'day' && dayText(item.number) + ' · '}{title(item)}</a>
            </li>)}</ol>
          </section>
        </div>
        <section className="stays">
          <h2><Icon name="bed" /> {t.stays}</h2>
          <div className="city-index">{trip.cities.map(item => <section key={item.id} style={{ '--city': item.accent }}>
            <h3><Icon name={item.symbol} /> {translate(item.name)}</h3>
            {item.stays.length ? <ul className="plain">{item.stays.map(stay => <li key={stay.name.pt}>
              {stay.url ? <a href={stay.url}>{translate(stay.name)}</a> : translate(stay.name)}
              <p className="meta">{t.from} {yen(stay.fromYen)} / {t.perNight}</p>
            </li>)}</ul> : <p>{t.empty}</p>}
            <a href={href(lang, 'sabores', item.id)}><Icon name="bowl" /> {t.food}</a>
          </section>)}</div>
        </section>
      </>}
      {step?.type === 'day' && <div className={'spread spread-' + step.layout}>
        <Photo key={step.id} id={step.photo} translate={translate} cover />
        <section className="copy">
          <h2>{t.stops}</h2>
          {step.stops.length ? <ul className="plain stop-list">{step.stops.map(stop => <li key={stop.id}>
            <Status done={stop.done} complete={t.done} pending={t.pending} />
            <div>
              <ItemName name={stop.name} translate={translate} lang={lang} />
              <span className="meta">{[stop.time, stop.minutes != null && '≈ ' + duration(stop.minutes)].filter(Boolean).join(' · ')}</span>
              {stop.addressJa && <span className="meta" lang="ja">{stop.addressJa}</span>}
            </div>
            {stop.mapQuery && <a className="map" href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(stop.mapQuery)}>{t.map}</a>}
          </li>)}</ul> : <p>{t.empty}</p>}
          <a className="food-link" href={href(lang, 'sabores', city.id)}><Icon name="bowl" /> {t.food} · {translate(city.name)}</a>
        </section>
      </div>}
      {step?.type === 'transfer' && <section>
        <p className="chapter"><Icon name="train" /> {t.transfer}</p>
        <h2>{t.transport}</h2>
        {step.options.length ? <ul className="plain transport-list">{step.options.map(option => <li key={option.id}>
          <ItemName name={option.name} translate={translate} lang={lang} />
          <p className="meta">≈ {duration(option.minutes)} · {yen(option.yen)} / {t.perPerson}</p>
          {option.url && <a href={option.url}>{t.operator}</a>}
        </li>)}</ul> : <p>{t.empty}</p>}
      </section>}
      {kind === 'sabores' && city && <div className="food-sections">
        {['savory', 'sweet'].map(category => {
          const foods = city.foods.filter(food => food.kind === category);
          return <section key={category}>
            <h2>{t[category]}</h2>
            {foods.length ? <ul className="plain food-list">{foods.map(food => <li key={food.id}>
              <Photo key={food.id} id={food.photo} translate={translate} />
              <div className="food-body">
                <Status done={food.done} complete={t.tasted} pending={t.untasted} />
                <div><ItemName name={food.name} translate={translate} lang={lang} />
                  <p className="meta">{translate(food.description)}</p></div>
              </div>
            </li>)}</ul> : <p>{t.empty}</p>}
          </section>;
        })}
      </div>}
      {step && <nav className="page-turn" aria-label={t.route}>
        {trip.journey[stepIndex - 1] && <a href={stepHref(trip.journey[stepIndex - 1])}>‹ {t.previous}</a>}
        {trip.journey[stepIndex + 1] && <a className="next" href={stepHref(trip.journey[stepIndex + 1])}>{t.next} ›</a>}
      </nav>}
      {!home && !step && !city && <a href={href(lang)}>{t.overview}</a>}
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
