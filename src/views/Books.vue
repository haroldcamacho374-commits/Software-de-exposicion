<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLibrary } from '../stores/library'
import FormDialog from '../components/FormDialog.vue'
import LoanDialog from '../components/LoanDialog.vue'
import StatusChip from '../components/StatusChip.vue'

const lib = useLibrary()
const router = useRouter()
const $q = useQuasar()
const search = ref('')
const filter = ref('all')
const form = ref(false)
const loanOpen = ref(false)
const loanBook = ref(null)
const fields = [
  { key: 'title', label: 'Título', required: true },
  { key: 'author', label: 'Autor', required: true },
  { key: 'isbn', label: 'ISBN' },
  { key: 'category', label: 'Categoría' }
]
const rows = computed(() => lib.books.filter(b =>
  (filter.value === 'all' || (filter.value === 'available') === (lib.status(b.id) === 'available')) &&
  `${b.title} ${b.author} ${b.isbn} ${b.category}`.toLowerCase().includes((search.value || '').toLowerCase())))
const lend = b => { loanBook.value = b.id; loanOpen.value = true }
const create = d => { lib.addBook(d); $q.notify({ type: 'positive', message: 'Libro agregado' }) }
</script>

<template>
  <q-page padding class="page">
    <div class="row items-center q-mb-md">
      <h1 class="text-h5 text-weight-bold q-ma-none col">Libros</h1>
      <q-btn unelevated no-caps color="primary" icon="add" label="Agregar libro" @click="form = true" />
    </div>
    <div class="row q-col-gutter-md q-mb-md items-center">
      <div class="col-12 col-sm">
        <q-input v-model="search" outlined dense clearable bg-color="white" placeholder="Buscar por título, autor o categoría">
          <template #prepend><q-icon name="search" /></template>
        </q-input>
      </div>
      <div class="col-12 col-sm-auto">
        <q-btn-toggle v-model="filter" unelevated no-caps toggle-color="primary" color="white" text-color="dark"
          :options="[{ label: 'Todos', value: 'all' }, { label: 'Disponibles', value: 'available' }, { label: 'Prestados', value: 'loaned' }]" />
      </div>
    </div>

    <q-list v-if="rows.length" class="panel" separator>
      <q-item v-for="b in rows" :key="b.id" clickable @click="router.push('/libros/' + b.id)">
        <q-item-section>
          <q-item-label class="book-title">{{ b.title }}</q-item-label>
          <q-item-label caption>{{ b.author }}<template v-if="b.category">, {{ b.category }}</template></q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row items-center q-gutter-sm no-wrap">
            <StatusChip :status="lib.status(b.id)" />
            <q-btn v-if="lib.status(b.id) === 'available'" outline no-caps size="sm" color="primary" label="Prestar" @click.stop="lend(b)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else class="panel q-pa-lg text-grey-8">
      {{ lib.books.length ? 'Ningún libro coincide con la búsqueda.' : 'Aún no hay libros. Agrega el primero para empezar.' }}
    </div>

    <FormDialog v-model="form" title="Agregar libro" :fields="fields" @save="create" />
    <LoanDialog v-model="loanOpen" :book-id="loanBook" />
  </q-page>
</template>
