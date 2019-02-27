import _ from 'lodash';
import React, { Component } from 'react';
import DropdownArrow from '../../assets/dropdown-arrow.svg';
import './Dropdown.scss';

export class Dropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      value: props.value,
    };
  }

  change(value) {
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const { value } = this.state;
    const current = _.find(this.props.options, option => {
      // HACK because select returns string
      return option.value == value || option.value.toString() === value.toString();
    });

    const list = _.map(this.props.options, (option) => (
      <option value={option.value} key={option.value}>{option.label}</option>
    ));

    return (
      <div className="dropdown">
        <div className="dropdown-label">{current.label}</div>
        <div className="dropdown-arrow">
          <img src={DropdownArrow} />
        </div>
        <select onChange={(e) => this.change(e.target.value)} defaultValue={value}>{list}</select>
      </div>
    );
  }
}
