<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden">
    <!-- Player 1 – top half, rotated 180° so they face across the table -->
    <div class="flex-1 border-b-4 border-gray-300 overflow-hidden">
      <PlayerPanel
        :player="1"
        :score="score1"
        :question="currentQuestion"
        :input="input1"
        :flash="flash1"
        @digit="(d) => appendDigit(1, d)"
        @backspace="backspace(1)"
      />
    </div>

    <!-- Player 2 – bottom half, normal orientation -->
    <div class="flex-1 overflow-hidden">
      <PlayerPanel
        :player="2"
        :score="score2"
        :question="currentQuestion"
        :input="input2"
        :flash="flash2"
        @digit="(d) => appendDigit(2, d)"
        @backspace="backspace(2)"
      />
    </div>
  </div>
</template>

<script setup>
import PlayerPanel from './components/PlayerPanel.vue'
import { useGameState } from './composables/useGameState.js'

const {
  score1, score2,
  input1, input2,
  flash1, flash2,
  currentQuestion,
  appendDigit,
  backspace,
} = useGameState()
</script>
