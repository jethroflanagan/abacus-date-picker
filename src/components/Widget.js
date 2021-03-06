import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { find as _find } from 'lodash';
import { Dropdown } from './dropdown/Dropdown';
import { DateField } from './date-field/DateField';
import { MonthNavigator } from './month-navigator/MonthNavigator';
import './Widget.scss';

const MIN_YEAR = 1900;
const MAX_YEAR = moment().year() + 5;

export class Widget extends Component {

  constructor(props) {
    super(props);
    const date = props.date || moment();
    this.state = {
      date,
      day: date.date(),
      month: date.month(),
      year: date.year(),
      selectedDay: 10,
      selectedMonth: 2,
      selectedYear: 2019,
      dropdownHeight: 200,
    };
  }

  // createDay({ dayNumber, startDay }) {
  //   const { day, month, year, date, selectedDay } = this.state;

  //   let state = '';
  //   if (month === date.month() && year === date.year()) {
  //     state = dayNumber === selectedDay
  //       ? 'Widget-day--selected'
  //       : (dayNumber === day
  //         ? 'Widget-day--current'
  //         : ''
  //       );
  //   }
  //   const style = {};
  //   if (startDay) {
  //     style = { ...style, gridColumnStart: startDay};
  //     startDay = 0;
  //   }
  //   return (
  //     <div className={`Widget-day ${state}`} onClick={() => this.changeDay({ day: dayNumber)}
  //       style={style}
  //       key={dayNumber}>
  //       {dayNumber}
  //     </div>
  //   );
  // }

  /**
   * 
   * @param {object} param
   * @param {string} param.type   Can be: 'previous' | 'next' | `null` where `null` is current
   */
  createDays() {
    const daysInWeek = 7;
    const { day, month, year, date, selectedDay, selectedMonth, selectedYear } = this.state;
    const list = [];
    const daysInCurrentMonth = moment([year, month, day]).daysInMonth();
    const daysInPreviousMonth = moment([year, month, day]).subtract(1, 'month').daysInMonth();
    let startDay = moment([year, month, 1]).day();

    const numPreviousDaysShown = Math.max(startDay - 1, 0);
    let numNextDaysShown = daysInWeek - (daysInCurrentMonth + numPreviousDaysShown) % daysInWeek;
    if (numNextDaysShown === daysInWeek) {
      numNextDaysShown = 0;
    }

    let from = 0 - numPreviousDaysShown;
    let until = daysInCurrentMonth + numNextDaysShown;

    const classNamePrefix = 'widget-day--';

    for (let i = from; i < until; i++) {
      const dayNumber = i + 1;
      const classNames = [];
      const style = {};
      let isDisabled = false;
      let type = '';
      let referenceDate = moment([year, month, 1]);

      if (dayNumber <= 0) {
        dayNumber = daysInPreviousMonth + i + 1;
        type = 'previous';
        referenceDate.subtract(1, 'month');
      }
      else if (dayNumber > daysInCurrentMonth) {
        dayNumber = i - daysInCurrentMonth + 1;
        type = 'next';
        referenceDate.add(1, 'month');
      }
      else {
        referenceDate.date(dayNumber);
      }

      // if (startDay) {
      //   style = { ...style, gridColumnStart: startDay};
      //   startDay = 0;
      // }

      if (type) {
        classNames.push(`${classNamePrefix}${type}`);
      }

      if (referenceDate.year() === selectedYear && referenceDate.month() === selectedMonth && dayNumber === selectedDay) {
        classNames.push(`${classNamePrefix}selected`);
      }
      else if (dayNumber === day && month === date.month() && year === date.year()) {
        classNames.push(`${classNamePrefix}current`);
      }

      if (this.checkIsInDisabledRange({ day: dayNumber, month: referenceDate.month(), year: referenceDate.year() })) {
        isDisabled = true;
        classNames.push(`${classNamePrefix}disabled`);
      }

      const clickAction = !isDisabled
        ? () => this.changeDay({ day: dayNumber, month: referenceDate.month(), year: referenceDate.year() })
        : () => {};

      list.push(
        <div className={`widget-day ${classNames.join(' ')}`} onClick={clickAction}
          style={style}
          key={i}
        >
          {dayNumber}
        </div>
      );
    }
    return list;
  }

  /**
   *  Disabled ranges = array of from, until
   *
   * @param {number} day
   * @param {number} month
   * @param {number} year
   */
  checkIsInDisabledRange({ day, month, year }) {
    const current = moment([year, month, day]);
    return _find(this.props.disabledRanges, range => {
      const from = moment([range.from.year, range.from.month, range.from.day]);
      const until = moment([range.until.year, range.until.month, range.until.day]);
      return current.isSameOrAfter(from) && current.isSameOrBefore(until);
    }) != null;
  }

  createDayLabels() {
    const list = [];
    for (let i = 1; i < 8; i++) {
      const label = moment().day(i).format('ddd');
      list.push(<div className="widget-label" key={i}>{label}</div>)
    }
    return list;
  }

  createMonthSelector(current) {
    const list = [];
    for (let i = 0; i < 12; i++) {
      list.push({ value: i, label: moment().month(i).format('MMMM')});
    }
    return (
      <Dropdown onChange={(value) => this.changeMonth(value)} value={current} options={list} height={this.state.dropdownHeight} />
    );
  }

  createYearSelector(current) {
    const list = [];
    for (let i = MIN_YEAR; i < MAX_YEAR; i++) {
      list.push({ value: i, label: moment().year(i).format('YYYY')});
    }
    return (
      <Dropdown onChange={(value) => this.changeYear(value)} value={current} options={list} height={this.state.dropdownHeight} />
    );
  }

  changeDay({ day, month, year }) {
    console.log(day, month, year, moment([year, month, day]).format('DD MMM YYYY'));

    // let { month, year } = this.state;
    // let reference = moment([year, month, 1]);
    // const day = value + 1;
    // if (value < 0) {
    //   reference.subtract(1, 'month');
    //   reference.date(reference.daysInMonth() + day);
    // }
    // else {
    //   reference.date(day);
    // }
    // console.log(reference.date(), month, year);

    // moving to previous or next
    this.setState({ selectedDay: day, selectedMonth: month, selectedYear: year, month, year })
  }

  changeMonth(value) {
    this.setState({ month: value });
  }

  changeYear(value) {
    this.setState({ year: value })
  }

  previousMonth() {
    let { day, month, year } = this.state;
    const previousMonth = moment([year, month, day]).add(-1, 'month');
    this.setState({ day: previousMonth.date(), month: previousMonth.month(), year: previousMonth.year() });
  }

  nextMonth() {
    let { day, month, year } = this.state;
    const nextMonth = moment([year, month, day]).add(1, 'month');
    this.setState({ day: nextMonth.date(), month: nextMonth.month(), year: nextMonth.year() });
  }

  componentDidUpdate() {
    if (this.state.dropdownHeight !== this.refs.body.clientHeight) {
      this.setState({ dropdownHeight: this.refs.body.clientHeight });
    }
  }
  componentDidMount() {
    this.setState({ dropdownHeight: this.refs.body.clientHeight });
  }

  // onChangeField({ value, day, month, year }) {
  //   console.log('change', value, day, month, year);
  //   if (day && month && year) {
  //     this.setState({ selectedDay: day, selectedMonth: month, selectedYear: year });
  //   }
  // }

  onChangeField({ day, month, year, resolvedDate }) {
    if (resolvedDate && resolvedDate.isValid() && resolvedDate.year() >= MIN_YEAR && resolvedDate.year() <= MAX_YEAR) {
      this.changeDay({ day, month, year });
    }
  }

  render() {
    const { day, month, year, date } = this.state;
    return (
      <div className="date-picker">
        <DateField onChange={value => this.onChangeField(value)} />
        <div className="widget">
          <div className="header">
            <MonthNavigator onClick={() => this.previousMonth()} direction="left" />
            <div className="header-month">{this.createMonthSelector(month)}</div>
            <div className="header-year">{this.createYearSelector(year)}</div>
            <MonthNavigator onClick={() => this.nextMonth()} direction="right" />
          </div>
          <div className="widget-body" ref="body">
            {this.createDayLabels()}
            {this.createDays()}
          </div>
        </div>
      </div>
    );
  }
}
