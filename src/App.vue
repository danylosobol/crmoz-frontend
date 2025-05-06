<script setup>
import { RouterLink, RouterView } from 'vue-router'
import logo from '@/assets/images/logo-ua.png'
import AppContainer from '@/components/AppContainer.vue'
import Button from '@/components/ui/button/Button.vue'
import { onMounted } from 'vue'
import AppNotification from '@/components/AppNotification.vue'

onMounted(async () => {})
</script>

<template>
  <div class="flex min-h-svh flex-col bg-background">
    <header
      class="sticky w-full left-0 top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-dashed"
    >
      <AppContainer class="border-dashed border-x">
        <div class="flex items-center py-2">
          <RouterLink to="/"
            ><img :src="logo" alt="main logo" class="max-h-[25px] aspect-[160/40]"
          /></RouterLink>
          <nav class="ml-auto">
            <ul class="flex items-center gap-3">
              <li>
                <RouterLink :to="{ name: 'form' }"
                  ><Button as="span" variant="link">Form</Button></RouterLink
                >
              </li>
              <li>
                <RouterLink :to="{ name: 'settings' }"
                  ><Button as="span" variant="link">Settings</Button></RouterLink
                >
              </li>
            </ul>
          </nav>
        </div>
      </AppContainer>
    </header>
    <main class="flex flex-1 flex-col">
      <AppContainer class="border-dashed border-x flex-1">
        <RouterView />
      </AppContainer>
    </main>
    <Teleport to="body">
      <AppNotification />
    </Teleport>
  </div>
</template>
