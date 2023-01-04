import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import store from './store/store'

import './app/FontAwesome'
import '../styles/index.scss'

import App from './app/App'
import Loading from './app/components/Loading'

const persistor = persistStore(store)

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={<Loading/>} persistor={persistor}>
        <App/>
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'))
