import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

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

  createDays() {
    const { day, month, year, date, selectedDay } = this.state;
    const numDays = moment([year, month, day]).daysInMonth();
    const list = [];
    let startDay = moment([year, month, 1]).day();
    for (let i = 0; i < numDays; i++) {
      const dayNumber = i + 1;
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
      list.push(
        <div className={`Widget-day ${state}`} onClick={() => this.changeDay(dayNumber)}
          style={style}
          key={dayNumber}
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
      list.push(<option value={i} key={i}>{moment().month(i).format('MMMM')}</option>)
    }
    return (
      <div className="select">
        <div className="select-label">{moment().month(current).format('MMMM')}</div>
        <div className="select-arrow">⌄</div>
        <select onChange={(value) => this.changeMonth(value.target.value)} defaultValue={current}>{list}</select>
      </div>
    );
  }

  createYearSelector(current) {
    const list = [];
    for (let i = 1900; i < moment().year() + 5; i++) {
      list.push(<option value={i}>{moment().year(i).format('YYYY')}</option>)
    }
    return (
      <div className="select">
        <div className="select-label">{moment().year(current).format('YYYY')}</div>
        <div className="select-arrow">⌄</div>
        <select onChange={(value) => this.changeYear(value.target.value)} defaultValue={current}>{list}</select>
      </div>
    );
  }

  changeDay(value) {
    this.setState({ selectedDay: value })
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

  render() {
    const { day, month, year, date } = this.state;
    return (
      <div className="Widget">
        <div className="Header">
          <div className="Header-nav" onClick={() => this.previousMonth()}>🞀</div>
          <div className="Header-month">{this.createMonthSelector(month)}</div>
          <div className="Header-year">{this.createYearSelector(year)}</div>
          <div className="Header-nav" onClick={() => this.nextMonth()}>🞂</div>
        </div>
        <div className="Widget-body">
          {this.createDayLabels()}
          {this.createDays()}
        </div>
      </div>
    );
  }
}
