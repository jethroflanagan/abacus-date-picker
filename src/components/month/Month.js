import React, { Component } from 'react';
import _ from 'lodash';
import { find as _find } from 'lodash';
import { Tag } from '../tag/Tag';
import PropTypes from 'prop-types';
import moment from 'moment';
import './Month.scss';

const DAYS_IN_WEEK = 7;
const DAY_HEIGHT = 45;

export class Month extends Component {
  ref;

  constructor(props) {
    super(props);
    // this.state = {  };
    this.ref = React.createRef();
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

  getStartDay({ month, year }) {
    return moment([year, month, 1]).day();
  }

  changeDay({ day, month, year }) {
    this.props.changeDay({ day, month, year });
  }

  hasSpaceAtStart({ month, year }) {
    return this.getStartDay({ month, year }) > 0;
  }
  hasSpaceAtEnd({ month, year }) {
    let startDay = this.getStartDay({ month, year });
    const daysInMonth = moment([year, month, 1]).daysInMonth();
    let extraDays = DAYS_IN_WEEK - ((startDay + daysInMonth) % DAYS_IN_WEEK);
    if (extraDays === DAYS_IN_WEEK) {
      extraDays = 0;
    }
    return (extraDays > 0);
  }

  getAmountOfRows({ month, year }) {
    const daysInMonth = moment([year, month, 1]).daysInMonth();
    let startDay = this.getStartDay({ month, year });
    const numRows = Math.ceil((daysInMonth + startDay) / DAYS_IN_WEEK);
    return numRows;
  }

  /*
   * @param {object} param
   * @param {string} param.type   Can be: 'previous' | 'next' | `null` where `null` is current
   */
  createDays({ month, year }) {
    const { date, day, selectedDay, selectedMonth, selectedYear } = this.props;
    const list = [];
    const daysInMonth = moment([year, month, 1]).daysInMonth();
    const daysInPreviousMonth = moment([year, month, 1]).subtract(1, 'month').daysInMonth();
    // const daysInNextMonth = moment([year, month, day]).subtract(1, 'month').daysInMonth();
    let startDay = this.getStartDay({ month, year });
    let extraDays = DAYS_IN_WEEK - ((startDay + daysInMonth) % DAYS_IN_WEEK);
    if (extraDays === DAYS_IN_WEEK) {
      extraDays = 0;
    }
    let from = 0;;
    let until = daysInMonth + extraDays;
    const classNamePrefix = 'day--';

    if (this.props.monthOffset === 0) {
      console.log('start', startDay, 'extra', extraDays);
    }


    let debugStyle = {
      background: this.props.monthOffset === 0
        ? 'rgba(100,0,0,.4)'
        : (this.props.monthOffset === 1
            ? 'rgba(0, 100,0,.4)'
            : 'rgba(0, 0, 100,.4)'
        )
    };

    for (let i = from - startDay; i < until; i++) {
      const dayNumber = i + 1;
      const dayLabel = dayNumber;
      let isDisabled = false;
      const classNames = [];
      const style = {...debugStyle};
      const containerStyle = {};

      if (dayNumber <= 0) {// || dayNumber >= daysInMonth) {
        dayLabel = daysInPreviousMonth + i + 1;
        isDisabled = true;
        style.background = '';
      }
      else if (dayNumber > daysInMonth) {
        dayLabel = (dayNumber - daysInMonth);
        isDisabled = true;
        style.background = '';
      }

      // let isDisabled = false;
      let type = '';
      let referenceDate = moment([year, month, 1]);

      referenceDate.date(dayNumber);

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

      let clickAction = null;
      if (isDisabled) {
        // isDisabled = true;
        // containerStyle = { ...containerStyle, pointerEvents: 'none' };
        clickAction = () => {
          // add or remove a month from ref date, then set to correct day
          let monthShift = (dayNumber > daysInMonth) ? 1 : -1;
          const nextDate = moment([year, month, 1]).add(monthShift, 'month');
          nextDate.date(dayLabel);
          this.changeDay({ day: nextDate.date(), month: nextDate.month(), year: nextDate.year() })
        };
      }
      else {
        clickAction = () => this.changeDay({ day: dayNumber, month: referenceDate.month(), year: referenceDate.year() })
      }


      list.push(
        <div className="day-container" style={containerStyle} key={i}>
          <div className={`day ${classNames.join(' ')}`} onClick={clickAction}
            style={style}
          >
            {dayLabel}
          </div>
        </div>
      );
    }
    return list;
  }

  render() {
    const { month, year, monthOffset, animationDirection } = this.props;
    const days = this.createDays({ month, year });
    let style = {};
    if (monthOffset !== 0) {
      let extraOffset = 0;
      let baseTranslateOffset = '';
      // reverse offset to get to actual month to compare (subtract)
      let compareDate = moment([year, month, 1]).subtract(monthOffset, 'months');
      const compareDateArgs = { month: compareDate.month(), year: compareDate.year() };
      const numRowsForCompareDate = this.getAmountOfRows(compareDateArgs);

      console.log(monthOffset, 'compareDate',
        compareDate.format('MMM YYYY'),
        'start', this.hasSpaceAtStart(compareDateArgs),
        'end', this.hasSpaceAtEnd(compareDateArgs),
        'rows', numRowsForCompareDate
      );

      if (monthOffset === -1) {
        baseTranslateOffset = '-100%'
        if (this.hasSpaceAtStart(compareDateArgs)) {
          extraOffset = 1;
        }
      }
      else if (monthOffset === 1) {
        baseTranslateOffset = numRowsForCompareDate * DAY_HEIGHT + 'px';
        if (this.hasSpaceAtEnd(compareDateArgs)) {
          extraOffset = -1;
        }
      }
      style = {
        ...style,
        position: 'absolute',
        top: 0,
        transform: `translateY(${baseTranslateOffset}) translateY(${extraOffset * DAY_HEIGHT}px)`,
      };
    }
    else {
    }

    // if (animationDirection === -1) {
    //   if (monthOffset === 1) {
    //     this.style.transform = 'translateY(
    // }

    return (
      <div className='month' ref={this.ref} style={style}>
        {days}
      </div>
    );
  }
}

