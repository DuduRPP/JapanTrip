import { Icon } from './Icons';

export function CityHeading({ city, title, level: Heading = 'h1', children }) {
  return <header className="city-heading" style={{ '--accent': city.accent }}>
    <div className="city-heading-copy">
      <Heading>{title}</Heading>
      {children}
    </div>
    <span className="city-seal" aria-hidden="true">
      <Icon name={city.symbol} /><span lang="ja">{city.name.ja}</span>
    </span>
  </header>;
}

export function DayHeading({ city, cityName, cityHref, title, day, date, formattedDate, level }) {
  return <CityHeading city={city} title={title} level={level}>
    <p className="chapter">
      {cityHref ? <a href={cityHref}>{cityName}</a> : cityName} · {day} · <time dateTime={date}>{formattedDate}</time>
    </p>
  </CityHeading>;
}
