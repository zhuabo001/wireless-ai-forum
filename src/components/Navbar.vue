<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, User, Menu, X, Zap } from 'lucide-vue-next'
const scrolled = ref(false)
const mobileOpen = ref(false)

const navLinks = [
  { label: '首页', href: '#hero' },
  { label: '情报局', href: '#intelligence' },
  { label: '课程', href: '#courses' },
  { label: '论坛', href: '#forum' },
  { label: 'Agent市场', href: '#market' },
]

const handleScroll = () => { scrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-[#e2e8f0]/50' : 'bg-transparent']">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a href="#hero" class="flex items-center gap-2.5 font-bold text-lg text-foreground">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Zap class="w-5 h-5 text-white" />
          </div>
          <span>无线AI极客汇</span>
        </a>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-1">
          <a v-for="link in navLinks" :key="link.label" :href="link.href"
            class="px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors whitespace-nowrap">
            {{ link.label }}
          </a>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2">
          <button class="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors">
            <Search class="w-4 h-4" />
          </button>
          <button class="hidden sm:flex p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors">
            <User class="w-4 h-4" />
          </button>
          <button class="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors" @click="mobileOpen = !mobileOpen">
            <X v-if="mobileOpen" class="w-5 h-5" /><Menu v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileOpen" class="md:hidden bg-white/95 backdrop-blur-md border-t border-[#e2e8f0]/50">
      <div class="px-4 py-3 space-y-1">
        <a v-for="link in navLinks" :key="link.label" :href="link.href"
          class="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
          @click="mobileOpen = false">{{ link.label }}</a>
      </div>
    </div>
  </nav>
</template>
