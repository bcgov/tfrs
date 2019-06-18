import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class AutosaveNotifier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: false
    };
    this.handle = null;
    this.tick = this.tick.bind(this);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.saving && !nextProps.saving) {
      this.setState({
        showMessage: true
      });
      this.handle = setInterval(this.tick, 1500);
    }
  }

  tick() {
    this.setState({
      showMessage: false
    })
  }

  componentWillUnmount() {
    if (this.handle !== null) {
       clearInterval(this.handle);
    }
  }


  render() {

    if (this.props.saving) {
      return (<FontAwesomeIcon key="icon" icon="spinner" pulse/>)
    }
    ;

    if (this.state.showMessage) {
      return (<span>Saved...</span>)
    }

    return null;

  }
}

AutosaveNotifier.propTypes = {
  saving: PropTypes.bool.isRequired
};

export default AutosaveNotifier;
