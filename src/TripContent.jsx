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

function ItemName({ name, translate, lang, href }) {
  const title = translate(name);
  return <span className="item-name"><strong>{href ? <a href={href}>{title}</a> : title}</strong>
    {lang !== 'ja' && name.ja && name.ja !== translate(name) && <small lang="ja">{name.ja}</small>}
  </span>;
}

function MapLink({ label, query }) {
  return <a className="icon-link map" aria-label={label} title={label}
    href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query)}>
    <Icon name="pin" />
  </a>;
}

function VenueList({ venues, display, venueHref, selectedId }) {
  const { t, translate } = display;
  return <ul className="plain venue-list">{venues.map(venue => {
    const name = translate(venue.name);
    const mapLabel = t.map + ' · ' + name;
    const detailsLabel = t.venueDetails + ' · ' + name;
    const selected = venue.id === selectedId;
    return <li className={selected ? 'venue-row linked-entry' : 'venue-row'}
      key={venue.id} tabIndex={selected ? -1 : undefined}>
      <div>
        <ItemName name={venue.name} href={venueHref?.(venue)} {...display} />
        <p className="meta">{translate(venue.description)}</p>
        <p className="meta venue-address" lang="ja">{venue.addressJa}</p>
      </div>
      <div className="venue-links">
        <MapLink label={mapLabel} query={(venue.name.ja ?? name) + ' ' + venue.addressJa} />
        {venue.url && <a className="icon-link" href={venue.url} aria-label={detailsLabel} title={detailsLabel}>
          <Icon name="external" />
        </a>}
      </div>
    </li>;
  })}</ul>;
}

export function ShoppingList({ city, display, selectedId }) {
  if (!city.shops?.length) return <p>{display.t.empty}</p>;
  return <div className="shopping-list"><VenueList venues={city.shops} display={display} selectedId={selectedId} /></div>;
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

function FoodList({ foods, display, eager, showPhotos = true, foodHref, selectedId }) {
  const { t, translate } = display;
  if (!foods.length) return <p>{t.empty}</p>;
  return <ul className="plain food-list">{foods.map(food => <li key={food.id}
    tabIndex={food.id === selectedId ? -1 : undefined}
    className={food.id === selectedId ? 'linked-entry' : undefined}>
    <div className="food-copy">
      <div className="food-body">
        <Status done={food.done} complete={t.tasted} pending={t.untasted} />
        <div><ItemName name={food.name} href={foodHref?.(food)} {...display} />
          <p className="meta">{translate(food.description)}</p></div>
      </div>
      {food.venues?.length > 0 && <div className="food-venues">
        <strong>{t.whereToTry}</strong>
        <VenueList venues={food.venues} display={display} />
      </div>}
    </div>
    {showPhotos && <Photo id={food.photo} translate={translate} eager={eager} />}
  </li>)}</ul>;
}

export function CityFood({ city, display, eager = false, selectedId }) {
  return <div className="food-sections">
    {['savory', 'sweet'].map(category => <section key={category}>
      {eager ? <h4>{display.t[category]}</h4> : <h2>{display.t[category]}</h2>}
      <FoodList foods={city.foods.filter(food => food.kind === category)} display={display} eager={eager}
        selectedId={selectedId} />
    </section>)}
  </div>;
}

export function DayContent({ day, city, display, eager = false, foodHref, shopHref }) {
  const { t, translate, duration } = display;
  const suggestions = (day.foodIds ?? []).map(id => city.foods.find(food => food.id === id)).filter(Boolean);
  const shops = (day.shopIds ?? []).map(id => city.shops?.find(shop => shop.id === id)).filter(Boolean);
  const Heading = eager ? 'h3' : 'h2';
  const dayPhotos = [...new Set([day.photo, ...suggestions.map(food => food.photo)].filter(Boolean))];
  return <div className="spread spread-side day-spread">
    <div className="day-gallery">
      {dayPhotos.map(id => <Photo key={id} id={id} translate={translate} eager={eager || id === day.photo} />)}
    </div>
    <div className="copy">
      <section>
        <Heading>{t.stops}</Heading>
        {day.stops.length ? <ol className="plain stop-list" role="list">{day.stops.map((stop, index) => {
          const mapLabel = t.map + ' · ' + translate(stop.name);
          return <li key={stop.id}>
            <span className="stop-order" aria-hidden="true">{index + 1}</span>
            <Status done={stop.done} complete={t.done} pending={t.pending} />
            <div>
              <ItemName name={stop.name} {...display} />
              {stop.minutes != null && <span className="meta">≈ {duration(stop.minutes)}</span>}
              {stop.addressJa && <span className="meta" lang="ja">{stop.addressJa}</span>}
              {stop.description && <p className="stop-description">{translate(stop.description)}</p>}
            </div>
            {stop.mapQuery && <MapLink label={mapLabel} query={stop.mapQuery} />}
          </li>;
        })}</ol> : <p>{t.empty}</p>}
      </section>
      {suggestions.length > 0 && <section className="day-food">
        <Heading><Icon name="bowl" /> {t.dayFood}</Heading>
        <FoodList foods={suggestions} display={display} eager={eager} showPhotos={false} foodHref={foodHref} />
      </section>}
      {shops.length > 0 && <section className="day-shops">
        <Heading><Icon name="bag" /> {t.dayShops}</Heading>
        <VenueList venues={shops} display={display} venueHref={shopHref} />
      </section>}
    </div>
  </div>;
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
