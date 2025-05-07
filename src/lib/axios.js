import { useAppStore } from '@/stores/app'
import axios from 'axios'
import { normalizeLaravelErrors } from './utils'

const appStore = useAppStore()

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const response = error.response
    let message = 'Something went wrong'

    if (response?.data) {
      if (typeof response.data === 'string') {
        message = response.data
      } else if (response.data.error) {
        message = response.data.error
      }

      if (response.data.errors) {
        const errors = normalizeLaravelErrors(response.data.errors)
        const messages = Object.values(errors).flat()
        message = messages.join('\n')
      }
    }

    appStore.addMessage({ type: 'error', text: message })
    return Promise.reject(error)
  },
)
export { api }
