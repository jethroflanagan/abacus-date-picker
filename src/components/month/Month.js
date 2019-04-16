import React, { Component } from 'react';
import _ from 'lodash';
import { find as _find } from 'lodash';
import { Tag } from '../tag/Tag';
import PropTypes from 'prop-types';
import moment from 'moment';
import './Month.scss';

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

  /**
   *
   * @param {object} param
   * @param {string} param.type   Can be: 'previous' | 'next' | `null` where `null` is current
   */
  createDays({ month, year }) {
    const daysInWeek = 7;
    const { date, day, selectedDay, selectedMonth, selectedYear } = this.props;
    const list = [];
    const daysInMonth = moment([year, month, 1]).daysInMonth();
    const daysInPreviousMonth = moment([year, month, 1]).subtract(1, 'month').daysInMonth();
    // const daysInNextMonth = moment([year, month, day]).subtract(1, 'month').daysInMonth();
    let startDay = this.getStartDay({ month, year });//moment([year, month, 1]).day();
    let extraDays = daysInWeek - ((startDay + daysInMonth) % daysInWeek);
    if (extraDays === daysInWeek) {
      extraDays = 0;
    }
    let from = 0;;
    let until = daysInMonth + extraDays;
    const classNamePrefix = 'day--';

    for (let i = from - startDay; i < until; i++) {
      const dayNumber = i + 1;
      let isClickable = true;
      if (dayNumber <= 0) {// || dayNumber >= daysInMonth) {
        dayNumber = daysInPreviousMonth + i + 1 + '_';
        isClickable = false;
      }
      else if (dayNumber > daysInMonth) {
        dayNumber = '_' + (dayNumber - daysInMonth + 1);
        isClickable = false;
      }
      const classNames = [];
      const style = {};
      const containerStyle = {};

      let isDisabled = false;
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
      if (!isClickable) {
        isDisabled = true;
        containerStyle = { ...containerStyle, pointerEvents: 'none' };
        clickAction = () => {};
      }
      else {
        clickAction = () => this.changeDay({ day: dayNumber, month: referenceDate.month(), year: referenceDate.year() })
      }


      list.push(
        <div className="day-container" style={containerStyle} key={i}>
          <div className={`day ${classNames.join(' ')}`} onClick={clickAction}
            style={style}
          >
            {dayNumber}
          </div>
        </div>
      );
    }
    return list;
  }

  render() {
    const { month, year } = this.props;
    const days = this.createDays({ month, year });
    return (
      <div className='month' ref={this.ref} style={this.props.style}>
        {days}
      </div>
    );
  }
}

