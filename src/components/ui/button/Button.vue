<script setup>
import { cn } from '@/lib/utils'
import { Primitive } from 'reka-ui'
import { buttonVariants } from '.'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps({
  variant: { type: null, required: false },
  size: { type: null, required: false },
  class: { type: null, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: 'button' },
  loading: { type: Boolean, required: false, default: false },
})
</script>

<template>
  <Primitive
    data-slot="button"
    :disabled="as === 'button' && loading"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />

    <slot />
  </Primitive>
</template>
