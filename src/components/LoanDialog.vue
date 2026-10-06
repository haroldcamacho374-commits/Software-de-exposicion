<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useLibrary } from '../stores/library'
import { addDays, fmt } from '../utils'

const props = defineProps({ modelValue: Boolean, bookId: String })
const emit = defineEmits(['update:modelValue'])
const lib = useLibrary()
const $q = useQuasar()
const selBook = ref(null)
const selUser = ref(null)
const days = ref(7)
const q = reactive({ b: '', u: '' })

watch(() => props.modelValue, open => {
  if (open) { selBook.value = props.bookId || null; selUser.value = null; days.value = 7 }
})

const bookOpts = computed(() => lib.books
  .filter(b => lib.status(b.id) === 'available' && `${b.title} ${b.author}`.toLowerCase().includes(q.b))
  .map(b => ({ label: `${b.title}, ${b.author}`, value: b.id })))
const userOpts = computed(() => lib.users
  .filter(u => `${u.name} ${u.document}`.toLowerCase().includes(q.u))
  .map(u => ({ label: `${u.name} (${u.document})`, value: u.id })))

const submit = () => {
  try {
    lib.lend(selBook.value, selUser.value, days.value)
    $q.notify({ type: 'positive', message: 'Préstamo registrado' })
    emit('update:modelValue', false)
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message })
  }
}
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card style="width: 460px; max-width: 92vw">
      <q-form @submit="submit">
        <q-card-section class="text-h6">Nuevo préstamo</q-card-section>
        <q-card-section class="q-gutter-y-md">
          <q-select v-model="selBook" :options="bookOpts" label="Libro disponible" outlined dense emit-value map-options use-input
            :disable="!!bookId" :rules="[v => !!v || 'Elige un libro']"
            @filter="(v, update) => update(() => (q.b = v.toLowerCase()))">
            <template #no-option><q-item><q-item-section class="text-grey">No hay libros disponibles con ese nombre</q-item-section></q-item></template>
          </q-select>
          <q-select v-model="selUser" :options="userOpts" label="Usuario" outlined dense emit-value map-options use-input
            :rules="[v => !!v || 'Elige un usuario']" @filter="(v, update) => update(() => (q.u = v.toLowerCase()))">
            <template #no-option><q-item><q-item-section class="text-grey">No se encontró el usuario</q-item-section></q-item></template>
          </q-select>
          <div>
            <div class="text-caption q-mb-xs">Plazo</div>
            <q-btn-toggle v-model="days" unelevated no-caps toggle-color="primary" color="grey-3" text-color="dark"
              :options="[{ label: '7 días', value: 7 }, { label: '14 días', value: 14 }, { label: '21 días', value: 21 }]" />
            <div class="text-caption q-mt-sm">Debe devolverlo el {{ fmt(addDays(days)) }}</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancelar" v-close-popup />
          <q-btn unelevated no-caps color="primary" label="Registrar préstamo" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
