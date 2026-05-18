<template>
  <section class="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
    <h3 class="text-sm font-bold px-4 py-2 bg-slate-50 border-b border-slate-200">{{ title }}</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs uppercase text-slate-500">
            <th v-for="h in headers" :key="h" class="px-4 py-2 font-bold">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in rows"
            :key="i"
            class="border-t border-slate-100"
          >
            <td v-for="(cell, j) in row" :key="j" class="px-4 py-2">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  headers: { type: Array, required: true },
  rows: { type: Array, required: true },
})
</script>
