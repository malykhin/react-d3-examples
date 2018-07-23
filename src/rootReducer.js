import { combineReducers } from 'redux'
import { reducer as rootReducer, NAME as ROOT_NAME } from './modules/Root/reducer'

const appReducer = combineReducers({
  [ROOT_NAME]: rootReducer
})

export default appReducer
