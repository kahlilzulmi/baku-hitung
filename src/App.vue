<template>
  <LobbyView v-if="!activeSession" @start="activeSession = $event" />
  <DuelView
    v-else-if="activeSession.playMode === 'duel'"
    :session="activeSession"
    @exit="activeSession = null"
  />
  <PracticeView
    v-else
    :session="activeSession"
    @exit="activeSession = null"
  />
</template>

<script setup>
import { ref } from 'vue'
import LobbyView from './views/LobbyView.vue'
import DuelView from './views/DuelView.vue'
import PracticeView from './views/PracticeView.vue'

const activeSession = ref(null)
</script>
