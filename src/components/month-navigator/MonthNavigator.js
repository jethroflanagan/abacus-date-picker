import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MonthArrowRight from '../../assets/month-arrow-right.svg';
import './MonthNavigator.scss';

export class MonthNavigator extends Component {
  static propTypes = {
    direction: PropTypes.oneOf([ 'left', 'right' ]),
  }

  static defaultProps = {
    direction: 'right',
  }

  render() {
    let arrowStyle = { };
    if (this.props.direction === 'left') {
      arrowStyle = { ...arrowStyle, transform: 'rotate(180deg)' };
    }
    return (
      <div className="navigator" onClick={() => this.props.onClick()}><img src={MonthArrowRight} style={arrowStyle} /></div>
    );
  }
}
