<script setup>
defineProps({ status: String })
const map = {
  available: ['Disponible', 'positive', 'check_circle'],
  loaned: ['Prestado', 'warning', 'schedule'],
  overdue: ['Vencido', 'negative', 'error']
}
</script>
<template>
  <q-chip dense square :color="map[status][1]" text-color="white" :icon="map[status][2]" :label="map[status][0]" />
</template>
