import fetch from '../fetch'

export const FLASH_ROM = 'FLASH_ROM'
export const FLASH_ROM_SUCCESS = 'FLASH_ROM_SUCCESS'
export const FLASH_ROM_ERROR = 'FLASH_ROM_ERROR'

export function flashRom() {
  return dispatch => {
    dispatch({ type: FLASH_ROM })
    return fetch('/api/flashrom', { method: 'post' })
      .then(res => res.json())
      .then(() => {
        dispatch({
          type: FLASH_ROM_SUCCESS,
          state: { flashed: true }
        })
      })
      .catch(() => {
        dispatch({
          type: FLASH_ROM_ERROR,
          error: true
        })
      })
  }
}
