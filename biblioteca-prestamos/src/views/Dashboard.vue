<script setup>
import { computed } from 'vue'
import { useLibrary } from '../stores/library'
import LoanItem from '../components/LoanItem.vue'

const lib = useLibrary()
const stats = computed(() => [
  { label: 'Libros en el catálogo', value: lib.books.length },
  { label: 'Disponibles', value: lib.books.length - lib.openLoans.length, cls: 'text-positive' },
  { label: 'Prestados', value: lib.openLoans.length - lib.overdue.length, cls: 'text-warning' },
  { label: 'Vencidos', value: lib.overdue.length, cls: 'text-negative' }
])
const next = computed(() => [...lib.openLoans].sort((a, b) => a.dueAt.localeCompare(b.dueAt)).slice(0, 8))
</script>

<template>
  <q-page padding class="page">
    <h1 class="text-h5 text-weight-bold q-mt-none">Resumen</h1>
    <div class="panel row stat-strip q-mb-lg">
      <div v-for="s in stats" :key="s.label" class="col-6 col-sm-3 q-pa-md">
        <div class="text-h4 text-weight-bold" :class="s.cls">{{ s.value }}</div>
        <div class="text-caption text-grey-8">{{ s.label }}</div>
      </div>
    </div>
    <h2 class="text-h6 q-mb-sm q-mt-none">Por devolver primero</h2>
    <q-list v-if="next.length" class="panel" separator>
      <LoanItem v-for="l in next" :key="l.id" :loan="l" />
    </q-list>
    <div v-else class="panel q-pa-lg text-grey-8">
      No hay libros prestados. Cuando registres un préstamo aparecerá aquí.
    </div>
  </q-page>
</template>
