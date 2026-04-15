import API from './api'

const authService = {
  async register(userData) {
    const { data } = await API.post('/auth/register', userData)
    if (data.token) localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  },
  async login(credentials) {
    const { data } = await API.post('/auth/login', credentials)
    if (data.token) localStorage.setItem('userInfo', JSON.stringify(data))
    return data
  },
  logout() {
    localStorage.removeItem('userInfo')
  },
}

export default authService