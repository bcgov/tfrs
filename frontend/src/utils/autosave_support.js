import React, {Component} from 'react';
import Loading from "../app/components/Loading";
import {loadAutosaveData, saveAutosaveData, clearAutosaveData} from "../actions/autosaveActions";
import {connect} from "react-redux";
import {withRouter} from "react-router";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function autosaved(config) {
  return function (WrappedComponent) {

    class AutosaveSupport extends Component {

      constructor(props) {
        super(props);

        this.state = {
          key: config.key || 'key',
          version: config.version || 1,
          name: config.name || 'autosaved',
          loading: true,
          saving: false,
          loadedState: null,
          stateToSave: null,
          dirty: false,
          timerId: null
        };

        this.updateStateToSave = this.updateStateToSave.bind(this);
        this.invalidateAutosaved = this.invalidateAutosaved.bind(this);
        this.tick = this.tick.bind(this);
      }

      _getKey() {
        const s = this.state;
        return `autosave-${s.name}:${s.key}:${s.version}:${this.props.location.pathname}`
      }

      invalidateAutosaved() {
        this.props.clearState();
      }

      _doSave() {
        this.setState({
          saving: true
        });

        this.props.saveState(this._getKey(), this.state.stateToSave).then(() => {
          this.setState({saving: false, dirty: false});
        }).catch(() => {
          this.setState({saving: false});
        });
      }

      _doSaveNoStateUpdates() {
        this.props.saveState(this._getKey(), this.state.stateToSave);
      }

      _doLoad() {
        this.props.loadState(this._getKey()).then((result) => {
          this.setState({
              loading: false,
              loadedState: result
            }
          );
        }).catch(reason => {
          this.setState({
              loading: false,
              loadedState: null
            }
          );
        });
      }

      updateStateToSave(stateToSave) {
        this.setState({
          stateToSave,
          dirty: true
        });
      }

      componentDidMount() {
        const timerId = setInterval(this.tick, 5000);
        this.setState({
          timerId
        });
        this._doLoad();
      }

      tick() {
        if (this.state.dirty) {
          this._doSave();
        }
      }

      componentWillUnmount() {
        clearInterval(this.state.timerId);
        this._doSaveNoStateUpdates();
      }

      render() {
        if (this.state.loading) {
          return (<Loading/>);
        } else {
          return (<WrappedComponent
            updateStateToSave={this.updateStateToSave}
            loadedState={this.state.loadedState}
            invalidateAutosaved={this.invalidateAutosaved}
            saving={this.state.saving}
            {...this.props}
          />)
        }

      }
    }

    AutosaveSupport
      .displayName = `AutosaveSupport(${getDisplayName(WrappedComponent)})`;

    const
      mapDispatchToProps = (dispatch) => {
        return {
          loadState: (key) => {
            return new Promise((resolve, reject) => {
              dispatch(loadAutosaveData({key, resolve, reject}));
            })
          },
          saveState: (key, state) => {
            return new Promise((resolve, reject) => {
              dispatch(saveAutosaveData({key, state, resolve, reject}));
            });
          },
          clearState: () => {
            return new Promise((resolve, reject) => {
              dispatch(clearAutosaveData({resolve, reject}));
            });
          }
        }
      };

    return withRouter(connect(null, mapDispatchToProps)(AutosaveSupport));
  }

};


export default autosaved;
