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
      animationDirection: 0,
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
    // this.
    // this.setState({ selectedDay: day, selectedMonth: month, selectedYear: year, month, year });
    let animationDirection = 0;
    if (+moment([year, month, day]) > +this.state.date) {
      animationDirection = -1;
    }
    else {
      animationDirection = 1;
    }
    this.setState({
      animationDirection,
    });
    this.setupAnimationCompletion();
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
    // this.setState({ day: previousMonth.date(), month: previousMonth.month(), year: previousMonth.year() });
    this.setState({ animationDirection: 1 });
    this.setupAnimationCompletion();
  }

  nextMonth() {
    let { day, month, year } = this.state;
    const nextMonth = moment([year, month, day]).add(1, 'month');
    // this.setState({ day: nextMonth.date(), month: nextMonth.month(), year: nextMonth.year() });
    this.setState({ animationDirection: -1 });
    this.setupAnimationCompletion();
  }

  setupAnimationCompletion() {
    setTimeout(() => {
      // this.setState({
      //   animationDirection: 0,
      // });
    }, 2000);
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
      let monthOffset = 0;
      if (i === -1) {
        monthOffset = -1;
      }
      if (i === 1) {
        monthOffset = 1;
      }
      list.push(
        <Month month={current.month()} year={current.year()} date={date}
          day={day} selectedDay={selectedDay} selectedMonth={selectedMonth} selectedYear={selectedYear}
          changeDay={(...args) => this.changeDay(...args)}
          key={i}
          style={{...style, zIndex: 2-Math.abs(i)}}
          monthOffset={monthOffset}/>
      );
    }
    return list;
  }

  getAmountOfRows({ month, year }) {
    const DAYS_IN_WEEK = 7;
    const daysInMonth = moment([year, month, 1]).daysInMonth();
    let startDay = moment([year, month, 1]).day();;
    const numRows = Math.ceil((daysInMonth + startDay) / DAYS_IN_WEEK);
    return numRows;
  }

  render() {
    const { month, year, animationDirection } = this.state;
    const monthList = this.createMonths();
    let monthAnimationStyle = {};
    if (animationDirection !== 0) {
      const DAY_HEIGHT = 45;
      const refDate = moment([ year, month, 1 ]).subtract(animationDirection, 'months');
      const numRows = this.getAmountOfRows({ month, year });
      const numNextRows = this.getAmountOfRows({ month: refDate.month(), year: refDate.year() });
      console.log('refDate', refDate.format('DD MMM YYYY'), numNextRows);

      monthAnimationStyle = {
        transform: `translateY(${DAY_HEIGHT * numRows * animationDirection}px)`,
        height: `${DAY_HEIGHT * numNextRows}px`,
      };
    }
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
            <div className="widget-months" style={monthAnimationStyle}>
              {monthList}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
