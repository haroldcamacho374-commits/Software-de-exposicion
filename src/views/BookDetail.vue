<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLibrary } from '../stores/library'
import { fmt } from '../utils'
import FormDialog from '../components/FormDialog.vue'
import LoanDialog from '../components/LoanDialog.vue'
import LoanItem from '../components/LoanItem.vue'
import StatusChip from '../components/StatusChip.vue'

const props = defineProps({ id: String })
const lib = useLibrary()
const router = useRouter()
const $q = useQuasar()
const edit = ref(false)
const loan = ref(false)
const book = computed(() => lib.book(props.id))
const current = computed(() => lib.openByBook.get(props.id))
const history = computed(() => lib.historyOf('bookId', props.id))
const fields = [
  { key: 'title', label: 'Título', required: true },
  { key: 'author', label: 'Autor', required: true },
  { key: 'isbn', label: 'ISBN' },
  { key: 'category', label: 'Categoría' }
]
const remove = () => $q.dialog({ title: 'Eliminar libro', message: `¿Eliminar «${book.value.title}» del catálogo?`, cancel: true, persistent: true })
  .onOk(() => {
    try { lib.removeBook(props.id); router.replace('/libros') }
    catch (e) { $q.notify({ type: 'negative', message: e.message }) }
  })
</script>

<template>
  <q-page padding class="page">
    <q-btn flat no-caps dense icon="arrow_back" label="Volver a libros" class="q-mb-md" to="/libros" />
    <div v-if="!book" class="panel q-pa-lg">Este libro no existe. Vuelve al catálogo para elegir otro.</div>
    <template v-else>
      <div class="panel q-pa-md q-mb-lg">
        <div class="row items-start no-wrap">
          <div class="col">
            <div class="book-title text-h5">{{ book.title }}</div>
            <div class="text-grey-8">{{ book.author }}</div>
            <div class="text-caption text-grey-7 q-mt-xs">
              <span v-if="book.category">Categoría: {{ book.category }}. </span><span v-if="book.isbn">ISBN {{ book.isbn }}.</span>
            </div>
          </div>
          <StatusChip :status="lib.status(id)" />
        </div>
        <div v-if="current" class="q-mt-md">
          Lo tiene {{ lib.user(current.userId)?.name }} desde el {{ fmt(current.loanedAt) }}; vence el {{ fmt(current.dueAt) }}.
        </div>
        <div class="row q-gutter-sm q-mt-md">
          <q-btn v-if="!current" unelevated no-caps color="primary" icon="add" label="Prestar" @click="loan = true" />
          <q-btn flat no-caps icon="edit" label="Editar" @click="edit = true" />
          <q-btn flat no-caps color="negative" icon="delete_outline" label="Eliminar" @click="remove" />
        </div>
      </div>

      <h2 class="text-h6 q-mt-none q-mb-sm">Historial de préstamos ({{ history.length }})</h2>
      <q-list v-if="history.length" class="panel" separator>
        <LoanItem v-for="l in history" :key="l.id" :loan="l" />
      </q-list>
      <div v-else class="panel q-pa-lg text-grey-8">Este libro todavía no se ha prestado.</div>

      <FormDialog v-model="edit" title="Editar libro" :fields="fields" :initial="book" @save="d => lib.updateBook(id, d)" />
      <LoanDialog v-model="loan" :book-id="id" />
    </template>
  </q-page>
</template>
