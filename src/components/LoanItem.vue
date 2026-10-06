<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useLibrary } from '../stores/library'
import { fmt } from '../utils'

const props = defineProps({ loan: Object })
const lib = useLibrary()
const $q = useQuasar()
const book = computed(() => lib.book(props.loan.bookId))
const user = computed(() => lib.user(props.loan.userId))
const late = computed(() => lib.isOverdue(props.loan))
const giveBack = () => {
  lib.returnLoan(props.loan.id)
  $q.notify({ type: 'positive', message: `Devuelto: ${book.value.title}` })
}
</script>

<template>
  <q-item>
    <q-item-section>
      <q-item-label class="book-title">{{ book?.title }}</q-item-label>
      <q-item-label caption>{{ user?.name }}</q-item-label>
      <q-item-label caption>
        Prestado el {{ fmt(loan.loanedAt) }},
        <template v-if="loan.returnedAt">devuelto el {{ fmt(loan.returnedAt) }}</template>
        <template v-else>vence el {{ fmt(loan.dueAt) }}</template>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <div class="row items-center q-gutter-sm no-wrap">
        <span v-if="late" class="stamp text-negative">Vencido</span>
        <q-btn v-if="!loan.returnedAt" outline no-caps color="primary" size="sm" icon="assignment_return" label="Devolver" @click="giveBack" />
        <span v-else class="text-caption text-grey-7">Devuelto</span>
      </div>
    </q-item-section>
  </q-item>
</template>
