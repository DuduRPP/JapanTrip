import { useRef } from 'react';
import { Icon } from './Icons';
import { CityFood, DayContent, HotelList, Photo, ShoppingList, TransportList } from './TripContent';

export function TripPrint({ trip, coverPhoto, cities, display, title, dayText, date, back }) {
  const printable = useRef(null);
  const { t, translate } = display;

  async function print() {
    const images = [...printable.current.querySelectorAll('img')];
    await Promise.allSettled([...images.map(image => image.decode()), document.fonts.ready]);
    window.print();
  }

  return <>
    <div className="print-controls">
      <a href={back}>{t.back}</a>
      <button type="button" className="utility-button" onClick={print}><Icon name="print" /> {t.pdf}</button>
      <p>{t.printHelp}</p>
    </div>
    <article className="print-book" ref={printable}>
      <header className="print-cover">
        <h1>{t.title}</h1>
        <p>{t.completeTrip} · {trip.cities.map(city => translate(city.name)).join(' → ')}</p>
        {trip.demo && <p className="sample">{t.sample}</p>}
        <Photo id={coverPhoto} translate={translate} eager />
      </header>
      <section className="print-itinerary" aria-label={t.route}>
        {trip.journey.map(step => {
          if (step.type === 'transfer') return <section className="print-entry" key={step.id}>
            <h2>{title(step)}</h2>
            <h3>{t.transport}</h3>
            <TransportList step={step} display={display} />
          </section>;
          const city = cities[step.city];
          return <section className="print-entry" key={step.id}>
            <h2>{dayText(step.number)} · {title(step)}</h2>
            <p className="chapter">{translate(city.name)} · <time dateTime={step.date}>{date(step.date)}</time></p>
            <DayContent day={step} city={city} display={display} eager />
          </section>;
        })}
      </section>
      <section className="print-city-guide" aria-label={t.cities}>
        {trip.cities.map(city => <section className="print-entry" key={city.id}>
          <h2>{translate(city.name)}</h2>
          {city.description && <p>{translate(city.description)}</p>}
          <Photo id={city.photo} translate={translate} eager />
          <h3>{t.stays}</h3>
          <HotelList city={city} display={display} />
          <h3>{t.food}</h3>
          <CityFood city={city} display={display} eager />
          {city.shops?.length > 0 && <>
            <h3>{t.shopping}</h3>
            <ShoppingList city={city} display={display} />
          </>}
        </section>)}
      </section>
    </article>
  </>;
}
