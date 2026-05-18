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
import LobbyView from './LobbyView.vue'
import DuelView from './DuelView.vue'
import PracticeView from './PracticeView.vue'

const activeSession = ref(null)
</script>
