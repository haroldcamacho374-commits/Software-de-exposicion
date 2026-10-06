<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useLibrary } from '../stores/library'
import FormDialog from '../components/FormDialog.vue'
import LoanItem from '../components/LoanItem.vue'

const lib = useLibrary()
const $q = useQuasar()
const search = ref('')
const form = ref(false)
const editing = ref(null)
const fields = [
  { key: 'name', label: 'Nombre completo', required: true },
  { key: 'document', label: 'Documento', required: true },
  { key: 'email', label: 'Correo' },
  { key: 'phone', label: 'Teléfono' }
]
const rows = computed(() => lib.users.filter(u => `${u.name} ${u.document}`.toLowerCase().includes((search.value || '').toLowerCase())))
const active = id => lib.openLoans.filter(l => l.userId === id).length
const open = u => { editing.value = u; form.value = true }
const save = d => {
  editing.value ? lib.updateUser(editing.value.id, d) : lib.addUser(d)
  $q.notify({ type: 'positive', message: 'Usuario guardado' })
}
const remove = u => $q.dialog({ title: 'Eliminar usuario', message: `¿Eliminar a ${u.name}?`, cancel: true, persistent: true })
  .onOk(() => {
    try { lib.removeUser(u.id) } catch (e) { $q.notify({ type: 'negative', message: e.message }) }
  })
</script>

<template>
  <q-page padding class="page">
    <div class="row items-center q-mb-md">
      <h1 class="text-h5 text-weight-bold q-ma-none col">Usuarios</h1>
      <q-btn unelevated no-caps color="primary" icon="add" label="Agregar usuario" @click="open(null)" />
    </div>
    <q-input v-model="search" outlined dense clearable bg-color="white" placeholder="Buscar por nombre o documento" class="q-mb-md">
      <template #prepend><q-icon name="search" /></template>
    </q-input>

    <q-list v-if="rows.length" class="panel">
      <q-expansion-item v-for="u in rows" :key="u.id" group="users" expand-separator>
        <template #header>
          <q-item-section avatar><q-avatar color="primary" text-color="white">{{ u.name[0] }}</q-avatar></q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">{{ u.name }}</q-item-label>
            <q-item-label caption>Documento {{ u.document }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge v-if="active(u.id)" color="warning" :label="active(u.id) + ' en préstamo'" />
          </q-item-section>
        </template>
        <div class="q-pa-sm">
          <div class="text-caption text-grey-8 q-px-sm">{{ u.email }} {{ u.phone }}</div>
          <div class="row q-gutter-sm q-mb-sm">
            <q-btn flat dense no-caps icon="edit" label="Editar" @click="open(u)" />
            <q-btn flat dense no-caps color="negative" icon="delete_outline" label="Eliminar" @click="remove(u)" />
          </div>
          <q-list v-if="lib.historyOf('userId', u.id).length" separator>
            <LoanItem v-for="l in lib.historyOf('userId', u.id)" :key="l.id" :loan="l" />
          </q-list>
          <div v-else class="q-pa-sm text-grey-8">Este usuario aún no ha pedido libros.</div>
        </div>
      </q-expansion-item>
    </q-list>
    <div v-else class="panel q-pa-lg text-grey-8">
      {{ lib.users.length ? 'Ningún usuario coincide con la búsqueda.' : 'Aún no hay usuarios. Agrega el primero para poder prestar.' }}
    </div>

    <FormDialog v-model="form" :title="editing ? 'Editar usuario' : 'Agregar usuario'" :fields="fields" :initial="editing" @save="save" />
  </q-page>
</template>
