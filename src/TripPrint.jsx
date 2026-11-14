import { useRef } from 'react';
import { Icon } from './Icons';
import { CityHeading, DayHeading } from './CityHeading';
import { CityFood, DayContent, HotelList, Photo, ShoppingList, TransportList } from './TripContent';
import { cityLabels } from './labels';

export function TripPrint({ trip, coverPhoto, cities, display, title, dayText, date, back }) {
  const printable = useRef(null);
  const { t, lang, translate } = display;

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
          return <section className="print-entry print-city-entry" key={step.id} style={{ '--accent': city.accent }}>
            <DayHeading city={city} cityName={translate(city.name)} title={title(step)}
              day={dayText(step.number)} date={step.date} formattedDate={date(step.date)} level="h2" />
            <DayContent day={step} city={city} display={{ ...display, t: cityLabels(lang, city) }} eager />
          </section>;
        })}
      </section>
      <section className="print-city-guide" aria-label={t.cities}>
        {trip.cities.map(city => {
          const name = translate(city.name);
          const local = cityLabels(lang, city);
          const cityDisplay = { ...display, t: local };
          return <section className="print-entry print-city-entry" key={city.id} style={{ '--accent': city.accent }}>
            <CityHeading city={city} title={name} level="h2" />
            {city.description && <p>{translate(city.description)}</p>}
            <Photo id={city.photo} translate={translate} eager />
            <h3>{local.staysTitle(name)}</h3>
            <HotelList city={city} display={cityDisplay} />
            <h3>{local.foodTitle(name)}</h3>
            <CityFood city={city} display={cityDisplay} eager />
            {city.shops?.length > 0 && <>
              <h3>{local.shoppingTitle(name)}</h3>
              <ShoppingList city={city} display={cityDisplay} />
            </>}
          </section>;
        })}
      </section>
    </article>
  </>;
}
