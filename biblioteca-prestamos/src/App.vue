<script setup>
import { ref } from 'vue'
import { useLibrary } from './stores/library'
import LoanDialog from './components/LoanDialog.vue'

const lib = useLibrary()
const drawer = ref(false)
const loan = ref(false)
const nav = [
  { to: '/', icon: 'space_dashboard', label: 'Resumen' },
  { to: '/libros', icon: 'menu_book', label: 'Libros' },
  { to: '/usuarios', icon: 'group', label: 'Usuarios' },
  { to: '/prestamos', icon: 'swap_horiz', label: 'Préstamos' }
]
</script>

<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-primary">
      <q-toolbar>
        <q-btn flat round icon="menu" class="lt-md" aria-label="Abrir menú" @click="drawer = !drawer" />
        <q-toolbar-title class="book-title">Biblioteca</q-toolbar-title>
        <q-btn unelevated no-caps color="secondary" icon="add" label="Nuevo préstamo" @click="loan = true" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :width="220" bordered>
      <q-list padding>
        <q-item v-for="n in nav" :key="n.to" :to="n.to" exact clickable v-ripple active-class="text-primary text-weight-bold">
          <q-item-section avatar><q-icon :name="n.icon" /></q-item-section>
          <q-item-section>{{ n.label }}</q-item-section>
          <q-item-section v-if="n.to === '/prestamos' && lib.overdue.length" side>
            <q-badge color="negative" :label="lib.overdue.length" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container><router-view /></q-page-container>
    <LoanDialog v-model="loan" />
  </q-layout>
</template>
