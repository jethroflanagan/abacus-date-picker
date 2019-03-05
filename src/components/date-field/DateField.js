import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import './DateField.scss';

const SEPARATOR = '-';
const POSSIBLE_SEPARATORS = ['-', '/', ' ', String.fromCharCode(13)];
const FIELDS = [{
  label: 'DD',
  pad: '0',
},
{
  label: 'MM',
  pad: '0',
},
{
  label: 'YYYY',
  pad: moment().year(),
}];

const HINT = FIELDS.map(field => field.label).join(SEPARATOR);
const MAX_LENGTH = HINT.length;

export class DateField extends Component {
  static defaultProps = {
    onChange: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      hint: HINT,
      errors: [],
    };
  }

  /**
   * Find difference between words (i.e. insertion or edit point)
   * @param {*} value
   * @param {*} lastValue
   */
  findDifference(value, lastValue) {
    for (let i = 0; i < value.length && i < lastValue.length; i++) {
      if (value[i] !== lastValue[i]) {
        return i;
      }
    }
    return value.length - 1;
  }

  findClosestSeparatorFieldIndex({ value, editIndex }) {
    const partialValue = value.substr(0, editIndex + 1);
    let numSeparators = partialValue.match(new RegExp(SEPARATOR, 'g'));

    if (numSeparators) {
      // FIELD index from zero (['DD', 'MM', 'YYYY'])
      return numSeparators.length - 1;
    }
    return null;
  }

  change(e) {
    const inputField = this.refs.input;
    const caretStart = inputField.selectionStart;
    const caretEnd = inputField.selectionEnd;

    // e.preventDefault();
    let { hint } = this.state;
    let value = e.target.value.toString();
    console.log('value', value);
    const errors = [];

    // swap all possible separators for correct one
    value = value.replace(
      new RegExp(`[${POSSIBLE_SEPARATORS.join('')}]`, 'g'),
      SEPARATOR
    );

    // remove non-valid chars (not sep or digit)
    value = value.replace(
      new RegExp(`[^${SEPARATOR}0-9]`, ''),
      ''
    );

    let editIndex = this.findDifference(value, this.state.value);
    let fieldToCompleteIndex = null;

    // find attempts at splitting
    if (value.charAt(editIndex) === SEPARATOR) {
      // const allSeparators = new RegExp(SEPARATOR, 'g').exec(value);
      // console.log('all', allSeparators);
      // const closestSeparator = _.find(allSeparators, (match, i) => {
      //   return editIndex < match.index ? i : false;
      // });

      fieldToCompleteIndex = this.findClosestSeparatorFieldIndex({ value, editIndex });
      // console.log(fieldToCompleteIndex);
      // if (editIndex >
      // if (editIndex < 2) {
      //   completeComponent = 'day';
      // }
      // console.log(editIndex, 'YES');

    }

    // fix value by removing non-digits
    value = value.replace(/[^0-9]/g, '');
    const maxLength = HINT.replace(SEPARATOR, '').length;

    // size limit
    if (value.length > maxLength) {
      value = value.substr(0, maxLength);
    }


    // split into fields
    let day = value.substr(0,2);
    let month = value.substr(2,2);
    let year = value.substr(4,4);

    // const resolvedDate = this.resolveDate({ day, month, year })
    // console.log(resolvedDate);

    if (fieldToCompleteIndex === 0) {
      day = this.completeField(day, fieldToCompleteIndex);
    }
    if (fieldToCompleteIndex === 1) {
      month = this.completeField(month, fieldToCompleteIndex);
    }
    if (fieldToCompleteIndex === 2) {
      year = this.completeField(year, fieldToCompleteIndex);
    }
    // editIndex++;

    let resolvedDate = null;
    if (day && month && year) {
      resolvedDate = moment([year, month - 1, day]);
      if (!resolvedDate.isValid()) {
        errors.push('Invalid');
        // console.log(resolvedDate);
      }
    }

    value = day + (month || fieldToCompleteIndex === 0 ? SEPARATOR + month: '') + (year || fieldToCompleteIndex === 1 ? SEPARATOR + year: '');

    // edit hint to remove replaced chars
    hint = HINT.substr(value.length);

    this.setState({ value, hint, errors });
    this.props.onChange({ day: parseInt(day, 10), month: parseInt(month, 10) - 1, year: parseInt(year, 10), value, resolvedDate });
    console.log('caretStart', caretStart, 'caretEnd', caretEnd, 'editIndex', editIndex);
    // requestAnimationFrame(() => {
    //   inputField.selectionStart = editIndex;
    //   inputField.selectionEnd = editIndex;
    // });
  }

  // resolveDate({ day, month, year }) {
  //   const today = moment();
  //   day  = parseInt(day) || 1;
  //   month = parseInt(month) || 0;
  //   year = parseInt(year) || today.year();

  //   let resolvedDate = moment([year, month, day]);
  //   console.log(resolvedDate);
  //   // if (parseInt(day) > ) {
  //   //   day = 1;
  //   // }
  //   if (!month || parseInt(month) === 0) {
  //     month = today.month();
  //   }

  //   return {
  //     day,
  //     month,
  //     year,
  //   };
  // }

  completeField(value, fieldIndex) {
    return _.padStart(value, FIELDS[fieldIndex].label.length, FIELDS[fieldIndex].pad);
  }

  render() {
    const { value, hint, errors } = this.state;
    return (
      <div>
        <div className="field">
          <div className="field-hint"><span className="hint-filled">{ value }</span>{ hint }</div>
          <input className="field-input" onChange={e => this.change(e)} value={value} ref="input" />
        </div>
        <div className="field-errors">
          { errors.map((error, i) => <div className="field-errors-item" key={i}>{error}</div>) }
        </div>
      </div>
    );
  }
}
