import { useState } from 'react';
import photos from './data/photos.json';
import { Icon } from './Icons';

export function Photo({ id, translate, eager = false }) {
  const photo = photos[id];
  const [failed, setFailed] = useState(false);
  if (!photo || failed) return null;
  return <figure className="photo">
    <img src={photo.url} alt={translate(photo.alt)} loading={eager ? 'eager' : 'lazy'}
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

export function HotelList({ city, display }) {
  const { t, yen, translate } = display;
  if (!city.stays.length) return <p>{t.empty}</p>;
  return <ul className="plain hotel-list">{city.stays.map(stay => <li key={stay.id ?? stay.name.pt}>
    <span className="stamp"><Icon name="bed" /></span>
    <div>
      {stay.url ? <a href={stay.url}>{translate(stay.name)}</a> : <ItemName name={stay.name} {...display} />}
      <p className="meta">{t.from} {yen(stay.fromYen)} / {t.perNight}</p>
    </div>
  </li>)}</ul>;
}

function FoodList({ foods, display, eager }) {
  const { t, translate } = display;
  if (!foods.length) return <p>{t.empty}</p>;
  return <ul className="plain food-list">{foods.map(food => <li key={food.id}>
    <Photo id={food.photo} translate={translate} eager={eager} />
    <div className="food-body">
      <Status done={food.done} complete={t.tasted} pending={t.untasted} />
      <div><ItemName name={food.name} {...display} />
        <p className="meta">{translate(food.description)}</p></div>
    </div>
  </li>)}</ul>;
}

export function CityFood({ city, display, eager = false }) {
  return <div className="food-sections">
    {['savory', 'sweet'].map(category => <section key={category}>
      {eager ? <h4>{display.t[category]}</h4> : <h2>{display.t[category]}</h2>}
      <FoodList foods={city.foods.filter(food => food.kind === category)} display={display} eager={eager} />
    </section>)}
  </div>;
}

export function DayContent({ day, city, display, eager = false }) {
  const { t, translate, duration } = display;
  const foodById = new Map(city.foods.map(food => [food.id, food]));
  const suggestions = (day.foodIds ?? []).map(id => foodById.get(id)).filter(Boolean);
  return <>
    <div className={'spread spread-' + day.layout}>
      <Photo key={day.id} id={day.photo} translate={translate} eager />
      <section className="copy">
        {eager ? <h3>{t.stops}</h3> : <h2>{t.stops}</h2>}
        {day.stops.length ? <ul className="plain stop-list">{day.stops.map(stop => {
          const schedule = [stop.time, stop.minutes != null && '≈ ' + duration(stop.minutes)].filter(Boolean).join(' · ');
          const mapLabel = t.map + ' · ' + translate(stop.name);
          return <li key={stop.id}>
            <Status done={stop.done} complete={t.done} pending={t.pending} />
            <div>
              <ItemName name={stop.name} {...display} />
              {schedule && <span className="meta">{schedule}</span>}
              {stop.addressJa && <span className="meta" lang="ja">{stop.addressJa}</span>}
              {stop.description && <p className="stop-description">{translate(stop.description)}</p>}
            </div>
            {stop.mapQuery && <a className="icon-link map" aria-label={mapLabel} title={mapLabel}
              href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(stop.mapQuery)}>
              <Icon name="pin" />
            </a>}
          </li>;
        })}</ul> : <p>{t.empty}</p>}
      </section>
    </div>
    {suggestions.length > 0 && <section className="day-food">
      {eager ? <h3>{t.dayFood}</h3> : <h2><Icon name="bowl" /> {t.dayFood}</h2>}
      <FoodList foods={suggestions} display={display} eager={eager} />
    </section>}
  </>;
}

export function TransportList({ step, display }) {
  const { t, duration, yen } = display;
  if (!step.options.length) return <p>{t.empty}</p>;
  return <ul className="plain transport-list">{step.options.map(option => <li key={option.id}>
    <ItemName name={option.name} {...display} />
    <p className="meta">≈ {duration(option.minutes)} · {yen(option.yen)} / {t.perPerson}</p>
    {option.url && <a href={option.url}>{t.operator}</a>}
  </li>)}</ul>;
}
