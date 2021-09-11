import dayjs from 'dayjs';
import React from 'react';
import themed from '@dr.pogodin/react-themes';

import defaultTheme from './default.module.scss';

function Calendar({
  theme,
}) {
  const date = dayjs();
  const first = date.startOf('month');
  const last = date.endOf('month');

  // This is the day of week for the first date in the current month,
  // with 0 being Monday and 6 being Sunday.
  let firstDateInWeek = first.day() - 1;
  if (firstDateInWeek < 0) firstDateInWeek += 7;

  let lastDateInWeek = last.day() - 1;
  if (lastDateInWeek < 0) lastDateInWeek += 7;

  const dates = [];
  for (let i = 0; i < firstDateInWeek; ++i) {
    dates.push(<div className={theme.cell} key={`front-spacer-${i}`} />);
  }
  for (let i = 1; i <= last.date(); ++i) {
    let className = theme.cell;
    if (i === date.date()) className += ` ${theme.today}`;
    if ((firstDateInWeek + i) % 7 === 0) className += ` ${theme.sunday}`;
    dates.push(<div className={className} key={`date-${i}`}>{i}</div>);
  }
  for (let i = lastDateInWeek; i < 6; ++i) {
    let className = theme.cell;
    if ((firstDateInWeek + last.date() + i - lastDateInWeek + 1) % 7 === 0) {
      className += ` ${theme.sunday}`;
    }
    dates.push(<div className={className} key={`end-spacer-${i}`} />)
  }

  const headerClass = `${theme.cell} ${theme.headerCell}`;

  return (
    <div className={theme.container}>
      <div className={theme.title}>
        {date.format('D MMM YYYY')}
      </div>
      <div className={theme.grid}>
        <div className={headerClass}>M</div>
        <div className={headerClass}>T</div>
        <div className={headerClass}>W</div>
        <div className={headerClass}>T</div>
        <div className={headerClass}>F</div>
        <div className={headerClass}>S</div>
        <div className={`${headerClass} ${theme.sunday}`}>S</div>
        {dates}
      </div>
    </div>
  );
}

const ThemedCalendar = themed('Calendar', [
  'cell',
  'container',
  'grid',
  'headerCell',
  'sunday',
  'title',
  'today',
], defaultTheme)(Calendar);

Calendar.propTypes = {
  theme: ThemedCalendar.themeType.isRequired,
};

export default ThemedCalendar;
