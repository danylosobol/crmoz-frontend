import { defineStore } from 'pinia'
export const useAppStore = defineStore('app', {
  state: () => ({
    messages: [],
  }),
  actions: {
    addMessage(message) {
      if (!message) {
        return
      }
      this.messages.push(message)
    },
    getMessages() {
      const ret = [...this.messages]
      this.messages = []
      return ret
    },
  },
})
