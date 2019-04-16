import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Dropdown } from './dropdown/Dropdown';
import { DateField } from './date-field/DateField';
import { MonthNavigator } from './month-navigator/MonthNavigator';
import { Month } from './month/Month';
import './Widget.scss';
import { Tag } from './tag/Tag';
import _map from 'lodash/map';

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

  onChangeField({ day, month, year, resolvedDate }) {
    if (resolvedDate && resolvedDate.isValid() && resolvedDate.year() >= MIN_YEAR && resolvedDate.year() <= MAX_YEAR) {
      this.changeDay({ day, month, year });
    }
  }

  createMonths() {
    const { day, month, year, date, selectedDay, selectedMonth, selectedYear } = this.state;
    const list = [];
    for (let i = -1; i < 2; i++) {
      const current = moment([year, month, 1]).add(i, 'month');
      let style = {};
      if (i !== 0) {
        style = {
          position: 'absolute',
          top: 0,
        }
      }
      list.push(
        <Month month={current.month()} year={current.year()} date={date}
          day={day} selectedDay={selectedDay} selectedMonth={selectedMonth} selectedYear={selectedYear}
          changeDay={(...args) => this.changeDay(...args)}
          key={i}
          style={{...style, zIndex: 2-Math.abs(i)}}/>
      );
    }
    return list;
  }

  render() {
    const { month, year } = this.state;
    const monthList = this.createMonths();
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
          <div className="widget-header-days">
            {this.createDayLabels()}
          </div>
          <div className="widget-body" ref="body">
            {monthList}
          </div>
        </div>
      </div>
    );
  }
}
