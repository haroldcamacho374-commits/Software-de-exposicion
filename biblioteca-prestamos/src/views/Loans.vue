<script setup>
import { ref, computed } from 'vue'
import { useLibrary } from '../stores/library'
import LoanDialog from '../components/LoanDialog.vue'
import LoanItem from '../components/LoanItem.vue'

const lib = useLibrary()
const tab = ref('active')
const search = ref('')
const dialog = ref(false)
const rows = computed(() => {
  const t = (search.value || '').toLowerCase()
  return lib.loans
    .filter(l => tab.value === 'active' ? !l.returnedAt : tab.value === 'overdue' ? lib.isOverdue(l) : true)
    .filter(l => `${lib.book(l.bookId)?.title} ${lib.user(l.userId)?.name}`.toLowerCase().includes(t))
    .sort((a, b) => b.loanedAt.localeCompare(a.loanedAt))
})
const empty = { active: 'No hay préstamos activos.', overdue: 'No hay préstamos vencidos. Todo al día.', all: 'Aún no se ha registrado ningún préstamo.' }
</script>

<template>
  <q-page padding class="page">
    <div class="row items-center q-mb-sm">
      <h1 class="text-h5 text-weight-bold q-ma-none col">Préstamos</h1>
      <q-btn unelevated no-caps color="primary" icon="add" label="Nuevo préstamo" @click="dialog = true" />
    </div>
    <q-tabs v-model="tab" align="left" no-caps active-color="primary" indicator-color="primary" class="q-mb-md">
      <q-tab name="active" label="Activos" />
      <q-tab name="overdue" label="Vencidos" />
      <q-tab name="all" label="Historial completo" />
    </q-tabs>
    <q-input v-model="search" outlined dense clearable bg-color="white" placeholder="Buscar por libro o usuario" class="q-mb-md">
      <template #prepend><q-icon name="search" /></template>
    </q-input>
    <q-list v-if="rows.length" class="panel" separator>
      <LoanItem v-for="l in rows" :key="l.id" :loan="l" />
    </q-list>
    <div v-else class="panel q-pa-lg text-grey-8">{{ search ? 'Ningún préstamo coincide con la búsqueda.' : empty[tab] }}</div>
    <LoanDialog v-model="dialog" />
  </q-page>
</template>
