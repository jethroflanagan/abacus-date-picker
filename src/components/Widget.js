import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Dropdown } from './dropdown/Dropdown';
import { MonthNavigator } from './month-navigator/MonthNavigator';
import './Widget.scss';

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

  createDay({ dayNumber, startDay }) {
    const { day, month, year, date, selectedDay } = this.state;

    let state = '';
    if (month === date.month() && year === date.year()) {
      state = dayNumber === selectedDay
        ? 'Widget-day--selected'
        : (dayNumber === day
          ? 'Widget-day--current'
          : ''
        );
    }
    const style = {};
    if (startDay) {
      style = { ...style, gridColumnStart: startDay};
      startDay = 0;
    }
    return (
      <div className={`Widget-day ${state}`} onClick={() => this.changeDay(dayNumber)}
        style={style}
        key={dayNumber}>
        {dayNumber}
      </div>
    );
  }

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

    let from = - numPreviousDaysShown;
    let until = daysInCurrentMonth + numNextDaysShown;

    const classNamePrefix = 'Widget-day--';

    for (let i = from; i < until; i++) {
      const dayNumber = i + 1;
      const classNames = [];
      const style = {};
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

      list.push(
        <div className={`Widget-day ${classNames.join(' ')}`} onClick={() => this.changeDay(dayNumber, referenceDate.month(), referenceDate.year())}
          style={style}
          key={i}
        >
          {dayNumber}
        </div>
      );
    }
    return list;
  }


  createDayLabels() {
    const list = [];
    for (let i = 1; i < 8; i++) {
      const label = moment().day(i).format('ddd');
      list.push(<div className="Widget-label" key={i}>{label}</div>)
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
    for (let i = 1900; i < moment().year() + 5; i++) {
      list.push({ value: i, label: moment().year(i).format('YYYY')});
    }
    return (
      <Dropdown onChange={(value) => this.changeYear(value)} value={current} options={list} height={this.state.dropdownHeight} />
    );
  }

  changeDay(day, month, year) {
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

    this.setState({ selectedDay: day, selectedMonth: month, selectedYear: year })
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

  render() {
    const { day, month, year, date } = this.state;
    return (
      <div className="Widget">
        <div className="Header">
          <MonthNavigator onClick={() => this.previousMonth()} direction="left" />
          <div className="Header-month">{this.createMonthSelector(month)}</div>
          <div className="Header-year">{this.createYearSelector(year)}</div>
          <MonthNavigator onClick={() => this.nextMonth()} direction="right" />
        </div>
        <div className="Widget-body" ref="body">
          {this.createDayLabels()}
          {this.createDays()}
        </div>
      </div>
    );
  }
}
