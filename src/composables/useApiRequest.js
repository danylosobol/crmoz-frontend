import { ref } from 'vue'

export function useApiRequest() {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const sendRequest = async (request) => {
    loading.value = true
    error.value = null

    try {
      data.value = await request()
    } catch (err) {
      const responseData = err?.response?._data

      if (responseData?.message) {
        error.value = responseData.message
      } else if (err?.error) {
        error.value = err.error
      } else {
        error.value = err
      }
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, sendRequest }
}
