<script setup lang="ts">
import AppWrapper from '@/components/AppWrapper.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormField, FormControl, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import Input from '@/components/ui/input/Input.vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useApiRequest } from '@/composables/useApiRequest'
import { api } from '@/lib/axios'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/stores/app'

const OPTIONS = [
  'Qualification',
  'Needs Analysis',
  'Value Proposition',
  'Identify Decision Makers',
  'Proposal/Price Quote',
  'Negotiation/Review',
  'Closed Won',
  'Closed Lost',
  'Closed Lost to Competition',
]

const appStore = useAppStore()
const { data, loading, sendRequest } = useApiRequest()
const formSchema = toTypedSchema(
  z.object({
    deal_name: z.string().nonempty('Deal name is required field.'),
    deal_stage: z.string().nonempty('Deal stage is required field.'),
    account_name: z.string().nonempty('Account name is required field.'),
    account_website: z.string().url('Account website has invalid format.'),
    account_phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Account phone has invalid format.'),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  await sendRequest(() => api.post('/zoho', values))
  if (data.value) {
    appStore.addMessage({
      type: 'success',
      text: 'Record has been successfully created.',
    })

    // form.handleReset()
    form.resetForm()
  }
})
</script>

<template>
  <AppWrapper class="justify-center items-center py-6">
    <Card class="max-w-[450px] w-full">
      <CardHeader>
        <CardTitle>Create record</CardTitle>
        <CardDescription>Add new account and deal in one click.</CardDescription>
      </CardHeader>
      <form @submit.prevent="onSubmit">
        <CardContent>
          <FormField v-slot="{ componentField }" name="deal_name">
            <FormItem class="mb-3">
              <FormLabel>Deal name</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  id="deal_name"
                  type="string"
                  placeholder="Example deal name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="deal_stage">
            <FormItem class="mb-3">
              <FormLabel>Deal stage</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="(option, index) in OPTIONS" :key="index" :value="option">
                        {{ option }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="border-dashed mt-4 mb-3 h-[1px] border-t"></div>
          <FormField v-slot="{ componentField }" name="account_name">
            <FormItem class="mb-3">
              <FormLabel>Account name</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  id="account_name"
                  type="string"
                  placeholder="John Smith"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="account_website">
            <FormItem class="mb-3">
              <FormLabel>Account website</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  id="account_website"
                  type="string"
                  placeholder="https://domain.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="account_phone">
            <FormItem class="mb-3">
              <FormLabel>Account phone</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  id="account_phone"
                  type="tel"
                  placeholder="+X (XXX) XXX-XXXX"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </CardContent>
        <CardFooter class="flex justify-center mt-6">
          <Button :loading="loading" as="button" class="cursor-pointer" type="submit"
            >Submit</Button
          >
        </CardFooter>
      </form>
    </Card>
  </AppWrapper>
</template>
