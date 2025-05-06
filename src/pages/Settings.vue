<script setup lang="ts">
import AppCredentialForm from '@/components/AppCredentialForm.vue'
import AppWrapper from '@/components/AppWrapper.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useApiRequest } from '@/composables/useApiRequest'
import { useZohoAuth } from '@/composables/useZohoAuth'
import { api } from '@/lib/axios'
import { useAppStore } from '@/stores/app'
import { useSettingsStore } from '@/stores/settings'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { openZohoOAuth } = useZohoAuth()
const appStore = useAppStore()
const router = useRouter()
const { data, error, loading, sendRequest } = useApiRequest()
const settingsStore = useSettingsStore()

const openAuth = () => {
  if (!settingsStore.getSetting('client_id') || !settingsStore.getSetting('redirect_uri')) {
    appStore.addMessage({
      type: 'error',
      text: 'Client ID or redirect URL is not set.',
    })
    return
  }
  openZohoOAuth(settingsStore.getSetting('client_id'), settingsStore.getSetting('redirect_uri'))
}

const storeAccountUrl = async () => {
  if (router.currentRoute.value.query.code && router.currentRoute.value.query['accounts-server']) {
    await sendRequest(() =>
      api.post('/settings', {
        settings: [
          {
            key: 'account_url',
            value: router.currentRoute.value.query['accounts-server'],
          },
        ],
      }),
    )
    await sendRequest(() =>
      api.post('/zoho/generate', { code: router.currentRoute.value.query.code }),
    )
    if (data.value) {
      appStore.addMessage({ type: 'success', text: 'Tokens have been successfully generated.' })
    }
    router.replace('')
  }
}

onMounted(async () => {
  await storeAccountUrl()
})
</script>

<template>
  <AppWrapper>
    <h1 class="mt-5 text-2xl">Settings</h1>
    <div class="flex flex-wrap -mx-1 mt-5">
      <div class="w-full lg:w-1/3 px-1 mb-3">
        <Card class="h-full">
          <CardHeader>
            <CardTitle class="text-lg">Step 1</CardTitle>
            <CardDescription>Create credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="mb-3">
              Go to the Zoho API Console: 👉
              <Button class="p-0 h-auto" as="a" variant="link" href="https://api-console.zoho.com/"
                >Zoho API Console</Button
              >
            </p>
            <p class="mb-3">Create a New Client:</p>
            <ul class="list-disc pl-5">
              <li>Client Type: Server-based Applications</li>

              <li>Homepage URL: for example, http://domain.com</li>

              <li>Authorized Redirect URI: http://domain.com/settings</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/3 px-1 mb-3">
        <Card class="h-full">
          <CardHeader>
            <CardTitle class="text-lg">Step 2</CardTitle>
            <CardDescription>Enter credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <AppCredentialForm />
          </CardContent>
        </Card>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/3 px-1 mb-3">
        <Card class="h-full">
          <CardHeader>
            <CardTitle class="text-lg">Step 3</CardTitle>
            <CardDescription>Get authorization code</CardDescription>
          </CardHeader>
          <CardContent>
            <Button as="button" type="button" @click="openAuth" class="cursor-pointer"
              >Get code</Button
            >
          </CardContent>
        </Card>
      </div>
    </div>
  </AppWrapper>
</template>
