import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import trip from './data/trip.json';
import photos from './data/photos.json';
import { labels, languages } from './labels';
import { Icon } from './Icons';
import { Timeline, TodayLink, groupJourney, localDateKey } from './Timeline';
import './style.css';

const cities = Object.assign(Object.create(null), Object.fromEntries(trip.cities.map(city => [city.id, city])));
const timelineGroups = groupJourney(trip.journey);
const coverPhotos = trip.coverPhotos ?? [trip.coverPhoto].filter(Boolean);
const cityPages = [
  { kind: 'cidade', label: 'overview', icon: 'book' },
  { kind: 'hoteis', label: 'stays', icon: 'bed' },
  { kind: 'sabores', label: 'food', icon: 'bowl' },
];

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
  const [todayKey, setTodayKey] = useState(() => localDateKey());
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
  const shortDate = value => new Intl.DateTimeFormat(locale, {
    month: 'short', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(value));
  const title = step => step.type === 'day' ? translate(step.title) : cityName(step.from) + ' → ' + cityName(step.to);
  const stepHref = step => href(lang, step.type === 'day' ? 'dia' : 'trajeto', step.id);
  const cityHref = (page, cityId) => href(lang, page, cityId);
  const stepIndex = trip.journey.findIndex(step => step.id === id && (
    (kind === 'dia' && step.type === 'day') || (kind === 'trajeto' && step.type === 'transfer')
  ));
  const step = trip.journey[stepIndex];
  const cityPage = cityPages.find(page => page.kind === kind);
  const city = cityPage ? cities[id] : cities[step?.city];
  const home = kind === 'inicio' && !id;
  const today = trip.journey.find(item => item.type === 'day' && item.date === todayKey);
  const cityDays = city ? trip.journey.filter(item => item.type === 'day' && item.city === city.id) : [];
  let heading = t.missing;
  if (home) heading = t.title;
  else if (step) heading = title(step);
  else if (city) heading = kind === 'cidade' ? translate(city.name) : t[cityPage.label] + ' · ' + translate(city.name);

  useEffect(() => {
    function onHashChange() {
      hasNavigated.current = true;
      setRoute(readRoute());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const refresh = () => setTodayKey(localDateKey());
    const interval = window.setInterval(refresh, 30_000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
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
      <a className="brand" href={href(lang)} aria-current={home ? 'page' : undefined}>
        <span className="stamp"><Icon name="book" /></span>{t.title}
      </a>
      <nav className="languages" aria-label={t.language}>
        {Object.entries(languages).map(([code, language]) => <a key={code}
          href={href(code, kind, id)} lang={language.tag} aria-label={language.name}
          aria-current={lang === code ? 'true' : undefined}>{language.label}</a>)}
      </nav>
    </header>
    <div className={'wrap ' + (home ? 'cover-shell' : 'journal-shell')}>
    {!home && <Timeline groups={timelineGroups} cities={cities} t={t} translate={translate}
      title={title} dayText={dayText} shortDate={shortDate} stepHref={stepHref} cityHref={cityHref}
      selected={step} today={today} overviewCity={kind === 'cidade' ? id : undefined} />}
    <main id="content" className={'page' + (home ? ' cover' : '')} tabIndex={-1} ref={main}>
      {!home && trip.demo && <p className="sample">{t.sample}</p>}
      {step?.type === 'day' && <p className="chapter"><Icon name={city.symbol} />
        {dayText(step.number)} · {translate(city.name)} · <time dateTime={step.date}>{date(step.date)}</time>
      </p>}
      <h1>{heading}</h1>
      {city && <nav className="city-nav" aria-label={t.cityPages}>
        {cityPages.map(page => <a key={page.kind} href={cityHref(page.kind, city.id)}
          aria-current={page.kind === kind ? 'page' : undefined}>
          <Icon name={page.icon} /> {t[page.label]}
        </a>)}
      </nav>}
      {home && <>
        <p className="intro">{t.intro}</p>
        <nav className="cover-cities" aria-label={t.cities}>
          {trip.cities.map(item => <a key={item.id} href={cityHref('cidade', item.id)} style={{ '--accent': item.accent }}>
            <span className="stamp"><Icon name={item.symbol} /></span>{translate(item.name)}<Icon name="chevron" />
          </a>)}
          <TodayLink step={today} stepHref={stepHref} label={t.goToday} />
        </nav>
        <div className="cover-photos">
          {coverPhotos.map(photo => <Photo key={photo} id={photo} translate={translate} cover />)}
        </div>
        {trip.demo && <p className="sample">{t.sample}</p>}
      </>}
      {kind === 'cidade' && city && <div className="spread spread-top city-overview">
        <Photo key={city.id} id={city.photo ?? cityDays.find(item => item.photo)?.photo} translate={translate} cover />
        <section className="copy">
          {city.description && <p className="intro">{translate(city.description)}</p>}
          <h2>{t.cityDays}</h2>
          {cityDays.length ? <ol className="route-list">{cityDays.map(item => <li key={item.id}>
            <time dateTime={item.date}>{shortDate(item.date)}</time>
            <a href={stepHref(item)}>{dayText(item.number)} · {title(item)}</a>
            {item === today && <strong className="today-tag">{t.today}</strong>}
          </li>)}</ol> : <p>{t.empty}</p>}
        </section>
      </div>}
      {kind === 'hoteis' && city && <section className="hotel-section">
        {city.stays.length ? <ul className="plain hotel-list">{city.stays.map(stay => <li key={stay.id ?? stay.name.pt}>
          <span className="stamp"><Icon name="bed" /></span>
          <div>
            {stay.url ? <a href={stay.url}>{translate(stay.name)}</a> : <ItemName name={stay.name} translate={translate} lang={lang} />}
            <p className="meta">{t.from} {yen(stay.fromYen)} / {t.perNight}</p>
          </div>
        </li>)}</ul> : <p>{t.empty}</p>}
      </section>}
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
      {!home && !step && !city && <a href={href(lang)}>{t.title}</a>}
    </main>
    </div>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
