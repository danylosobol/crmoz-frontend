import { api } from '@/lib/axios'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    client_id: '',
    client_secret: '',
    redirect_uri: '',
    api_domain: '',
  }),

  getters: {
    getSetting: (state) => {
      return (key) => state[key]
    },
  },

  actions: {
    updateSettings(settings) {
      settings.forEach((setting) => {
        if (setting?.key && setting?.value && this.$state.hasOwnProperty(setting.key)) {
          this.$state[setting.key] = setting.value
        }
      })
    },
    async setSettings(data) {
      const response = await api.post('/settings', {
        settings: data,
      })

      if (response?.data && response.data.length > 0) {
        this.updateSettingsState(response.data)
      }

      return response.data
    },
    async getSettings(keys) {
      const response = await api.get('/settings', {
        params: {
          keys,
        },
      })
      if (response?.data && response.data.length > 0) {
        this.updateSettingsState(response.data)
      }

      return response.data
    },
  },
})
