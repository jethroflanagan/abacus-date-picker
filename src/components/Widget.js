import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Dropdown } from './dropdown/Dropdown';
import { DateField } from './date-field/DateField';
import { MonthNavigator } from './month-navigator/MonthNavigator';
import { Month } from './month/Month';
import './Widget.scss';
import { Tag } from './tag/Tag';

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
    // console.log(day, month, year, moment([year, month, day]).format('DD MMM YYYY'));

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

  createScrollingList() {
    const { date, day, selectedDay, selectedMonth, selectedYear } = this.state;
    const currentDate = moment().date(1).subtract(10, 'months');
    const list = [];
    const tags = [];
    for (let i = 0; i < 20; i++) {
      currentDate.add(1, 'months');
      const year = currentDate.year();
      const month = currentDate.month();
      const ref = React.createRef();
      list.push(
        <Month month={month} year={year} date={date} day={day} selectedDay={selectedDay} selectedMonth={selectedMonth} selectedYear={selectedYear} ref={ref} key={i} changeDay={(...args) => this.changeDay(...args)}/>
      );
      tags.push(
        <Tag month={month} year={year} el={ref} key={i}/>
      );
    }
    return { list, tags };
  }

  onScroll(e) {
    this.refs.tags.scrollTo(0, e.target.scrollTop);
  }

  render() {
    const { day, month, year, date } = this.state;
    const { list, tags } = this.createScrollingList();
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
          <div className="widget-body" ref="body" onScroll={(e) => this.onScroll(e)}>
            {list}
          </div>
          <div className="widget-tags" ref="tags">
            {tags}
          </div>
        </div>
      </div>
    );
  }
}
