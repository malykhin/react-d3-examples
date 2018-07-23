import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { injectGlobal } from 'styled-components'

import Root from './modules/Root/containers/Root'
import store from './store'
import { globalStyles } from './assets/styles'

injectGlobal`${globalStyles}`

render(
  <Provider store={store}>
    <Root />
  </Provider>
  , document.getElementById('app')
)
