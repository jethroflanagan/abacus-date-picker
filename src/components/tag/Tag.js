import React, { Component } from 'react';
import moment from 'moment';

import './Tag.scss';

export class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
    }
  }

  componentDidMount() {
    this.setState({
      // omfg
      position: this.props.el.current.ref.current.offsetTop,
    });
  }

  render() {
    const { position } = this.state;
    const { month, year, el } = this.props;
    if (!el) {
      return;
    }

    return (
      <div className="tag" style={{ top: position + 'px' }}>
        {moment().month(month).format('MMMM')} {year}
      </div>     
    );
  }
}
