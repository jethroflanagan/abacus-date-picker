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
    // const daysInPreviousMonth = moment([year, month, day]).subtract(1, 'month').daysInMonth();
    // const daysInNextMonth = moment([year, month, day]).subtract(1, 'month').daysInMonth();
    let startDay = moment([year, month, 1]).day();
    // if (startDay ===
    console.log(startDay,'|', month, year, moment([year, month, 1]).format('MMM yyyy'));

    let from = 0;;
    let until = daysInMonth;

    const classNamePrefix = 'day--';

    for (let i = from - startDay; i < until; i++) {
      const dayNumber = i + 1;
      if (dayNumber <= 0) {
        dayNumber = '';
      }
      const classNames = [];
      const style = {};
      const containerStyle = {};

      let isDisabled = false;
      let type = '';
      let referenceDate = moment([year, month, 1]);

      referenceDate.date(dayNumber);

      // if (startDay) {
      //   // containerStyle = { ...containerStyle, gridColumnStart: startDay};
      //   startDay = 0;
      // }

      if (dayNumber && dayNumber <= daysInWeek) {
        containerStyle = { ...containerStyle,
          borderTopWidth: '1px',
        };
        if (dayNumber === 1) {
          containerStyle = { ...containerStyle,
            borderLeftWidth: '1px',
          };
        }
      }

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
        <div className="day-container" style={containerStyle}>
          <div className={`day ${classNames.join(' ')}`} onClick={clickAction}
            style={style}
            key={i}
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
      <div className="month" ref={this.ref}>
        {/* <Tag month={month} year={year} /> */}

        {days}
      </div>
    );
  }
}

