const INFO_NAME = 'shopping_user_info'
const HISTORY_NAME = 'search_history'

// 获取userInfo
export const getInfo = () => {
  const result = sessionStorage.getItem(INFO_NAME)
  return result ? JSON.parse(result) : { token: '', id: '' }
}

// 存入userInfo到storage
export const setInfo = (info) => {
  sessionStorage.setItem(INFO_NAME, JSON.stringify(info))
}

// 从storage移除userInfo
export const removeInfo = () => {
  sessionStorage.removeItem(INFO_NAME)
}

// 获取history
export const getHistory = () => {
  const result = localStorage.getItem(HISTORY_NAME)
  return result ? JSON.parse(result) : []
}

// 存入history到storage
export const setHistory = (info) => {
  localStorage.setItem(HISTORY_NAME, JSON.stringify(info))
}
