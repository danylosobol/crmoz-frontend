<script setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useApiRequest } from '@/composables/useApiRequest'
import { useSettingsStore } from '@/stores/settings'
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { api } from '@/lib/axios'

const KEYS = ['client_id', 'client_secret', 'redirect_uri', 'api_domain']
const appStore = useAppStore()
const { data, loading, sendRequest } = useApiRequest()
const settingsStore = useSettingsStore()
const formSchema = toTypedSchema(
  z.object({
    client_id: z.string().nonempty('Client id is required field.'),
    client_secret: z.string().nonempty('Client secret is required field.'),
    redirect_uri: z.string().url('Redirect uri has invalid format.'),
    api_domain: z.string().url('Api domain uri has invalid format.'),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  await sendRequest(() =>
    api.post('/settings', {
      settings: Object.keys(values).map((settingKey) => ({
        key: settingKey,
        value: values[settingKey],
      })),
    }),
  )

  if (data.value?.data && data.value.data.length > 0) {
    appStore.addMessage({
      type: 'success',
      text: 'Credentials have been successfully saved.',
    })
  }
})

const getSettings = async () => {
  await sendRequest(() =>
    api.get('/settings', {
      params: { keys: KEYS },
    }),
  )

  if (data.value?.data && data.value.data.length > 0) {
    settingsStore.updateSettings(data.value.data)
  }

  KEYS.forEach((key) => {
    if (settingsStore.hasOwnProperty(key) && settingsStore[key]) {
      form.setFieldValue(key, settingsStore.getSetting(key))
    }
  })
}

onMounted(async () => {
  await getSettings()
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <FormField v-slot="{ componentField }" name="client_id">
      <FormItem class="mb-3">
        <FormLabel>Client ID</FormLabel>
        <FormControl>
          <Input v-bind="componentField" id="client_id" type="text" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="client_secret">
      <FormItem class="mb-3">
        <FormLabel>Client Secret</FormLabel>
        <FormControl>
          <Input v-bind="componentField" id="client_secret" type="text" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="redirect_uri">
      <FormItem class="mb-3">
        <FormLabel>Redirect uri</FormLabel>
        <FormControl>
          <Input v-bind="componentField" id="redirect_uri" type="text" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="api_domain">
      <FormItem class="mb-3">
        <FormLabel>Api domain</FormLabel>
        <FormControl>
          <Input v-bind="componentField" id="api_domain" type="text" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="mt-6">
      <Button :loading="loading" as="button" class="cursor-pointer" type="submit">Save</Button>
    </div>
  </form>
</template>
