<script setup>
import { reactive, watch } from 'vue'
const props = defineProps({ modelValue: Boolean, title: String, fields: Array, initial: Object })
const emit = defineEmits(['update:modelValue', 'save'])
const form = reactive({})
watch(() => props.modelValue, open => {
  if (open) props.fields.forEach(f => (form[f.key] = props.initial?.[f.key] ?? ''))
})
const submit = () => {
  emit('save', { ...form })
  emit('update:modelValue', false)
}
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card style="width: 420px; max-width: 92vw">
      <q-form @submit="submit">
        <q-card-section class="text-h6">{{ title }}</q-card-section>
        <q-card-section class="q-gutter-y-md">
          <q-input
            v-for="f in fields" :key="f.key" v-model="form[f.key]" outlined dense
            :label="f.label + (f.required ? ' (obligatorio)' : '')"
            :rules="f.required ? [v => !!v?.trim() || 'Completa este campo'] : []"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancelar" v-close-popup />
          <q-btn unelevated no-caps color="primary" label="Guardar" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
