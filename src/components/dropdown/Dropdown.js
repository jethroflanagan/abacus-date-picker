import _ from 'lodash';
import React, { Component } from 'react';
import DropdownArrow from '../../assets/dropdown-arrow.svg';
import './Dropdown.scss';

export class Dropdown extends Component {
  listRef = null;

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
    this.close();
  }

  onOutsideClicked = (e) => {
    // only outside clicks allowed
    if (this.refs.container && this.refs.container.contains(e.target)) {
      return;
    }
    document.removeEventListener('mousedown', this.onOutsideClicked);
    this.close();
  }

  toggle() {
    const isOpen = !this.state.isOpen;
    this.setState({ isOpen });
    if (isOpen) {
      document.addEventListener('mousedown', this.onOutsideClicked);
    }
  }

  close() {
    this.setState({ isOpen: false });
  }

  componentDidUpdate() {
    console.log(this.props.height);
    if (this.refs.list) {
      const option = this.refs['option-' + this.props.value];
      this.refs.list.scrollTop = option.offsetTop - (this.props.height - option.offsetHeight) / 2;
    }
  }

  render() {
    const { value, isOpen } = this.state;
    const current = _.find(this.props.options, option => {
      // HACK because select returns string
      return option.value == value || option.value.toString() === value.toString();
    });

    const list = _.map(this.props.options, (option) => (
      <div ref={`option-${option.value}`} className={`dropdown-option ${value === option.value ? 'dropdown-option--selected' : ''}`} onClick={() => this.change(option.value)} key={option.value}>{option.label}</div>
    ));

    return (
      <div className={`dropdown ${isOpen ? 'dropdown--open' : ''}`} onClick={() => this.toggle()} ref="container">
        <div className="dropdown-label">{current.label}</div>
        <div className="dropdown-arrow">
          <img src={DropdownArrow} />
        </div>
        {/* <select onChange={(e) => this.change(e.target.value)} defaultValue={value}>{list}</select> */}
        {isOpen
        ? (
          <div className="dropdown-list" style={{ maxHeight: this.props.height + 'px' }} ref="list">
            { list }
          </div>
        ) : null}
      </div>
    );
  }
}
