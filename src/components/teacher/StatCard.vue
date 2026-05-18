<template>
  <div class="bg-white rounded-lg border border-slate-200 p-3 text-center">
    <p class="text-[10px] font-bold uppercase text-slate-500">{{ label }}</p>
    <p class="text-xl font-black text-slate-900 mt-0.5">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
})
</script>
