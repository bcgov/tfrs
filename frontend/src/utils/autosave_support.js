import React, {Component} from 'react';
import Loading from "../app/components/Loading";
import {loadAutosaveData, saveAutosaveData} from "../actions/autosaveActions";
import {connect} from "react-redux";

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
        };

        this.updateStateToSave = this.updateStateToSave.bind(this);
        this.updateAutosaveKey = this.updateAutosaveKey.bind(this);
      }

      _getKey() {
        const s = this.state;
        return `autosave-${s.name}:${s.key}:${s.version}`
      }

      _doSave() {
        this.setState({
          saving: true
        });

        this.props.saveState(this._getKey(), this.state.stateToSave).then(() => {
          this.setState({saving: false});
        }).catch(() => {
          this.setState({saving: false});
        });
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

      updateAutosaveKey(key) {
        this.setState({
          key
        });
      }

      updateStateToSave(stateToSave) {
        this.setState({
          stateToSave
        });
      }

      componentDidMount() {
        this._doLoad();
      }

      componentWillUnmount() {
        this._doSave();
      }

      render() {
        if (this.state.loading) {
          return (<Loading/>);
        } else {
          return (<WrappedComponent
            updateStateToSave={this.updateStateToSave}
            updateAutosaveKey={this.updateAutosaveKey}
            loadedState={this.state.loadedState}
            saving={this.state.saving}
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
          }
        }
      };


    return connect(null, mapDispatchToProps)(AutosaveSupport);
  }

};


export default autosaved;
