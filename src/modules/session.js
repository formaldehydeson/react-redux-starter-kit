import {push} from 'react-router-redux'

// ------------------------------------
// Constants
// ------------------------------------
export const SESSION_LOGIN_SUCCESS = 'SESSION_LOGIN_SUCCESS'
export const SESSION_LOGIN_FAIL = 'SESSION_LOGIN_FAIL'

// ------------------------------------
// Actions
// ------------------------------------
export function loginSuccess (value) {
  return {
    type: SESSION_LOGIN_SUCCESS,
    payload: value
  }
}

export function loginFail (value) {
  return {
    type: SESSION_LOGIN_FAIL,
    payload: value
  }
}

export const loginAsync = (loginObj) => {
  return async (dispatch, getState) => {
    let loginToken = await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 200)
    }).then(() => {

      if (loginObj.user === 'przeor' && loginObj.password === 'mwp.io') {
        return 'www.mwp.io'
      } else {
        return 'invalid'
      }
    })

    if (loginToken !== 'invalid') {
      dispatch(loginSuccess(loginToken))
      dispatch(push('/dashboard'))
    } else {
      dispatch(loginFail(loginToken))
    }

  }
}

// ------------------------------------
// Reducer
// ------------------------------------