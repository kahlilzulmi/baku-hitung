<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden">
    <!-- Player 1 – top half (rotated 180° inside component) -->
    <div class="flex-1 overflow-hidden">
      <PlayerPanel
        :player="1"
        :level="level"
        :momentum="momentum"
        :question="currentQuestion"
        :input="input1"
        :frozen="frozen"
        :scored-player="scoredPlayer"
        :round-winner="roundWinner"
        :current-quote="currentQuote"
        :shake="shake1"
        @digit="(d) => appendDigit(1, d)"
        @backspace="backspace(1)"
      />
    </div>

    <!-- Centre divider -->
    <div class="h-1 bg-gray-400 flex-shrink-0"></div>

    <!-- Player 2 – bottom half (normal orientation) -->
    <div class="flex-1 overflow-hidden">
      <PlayerPanel
        :player="2"
        :level="level"
        :momentum="momentum"
        :question="currentQuestion"
        :input="input2"
        :frozen="frozen"
        :scored-player="scoredPlayer"
        :round-winner="roundWinner"
        :current-quote="currentQuote"
        :shake="shake2"
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
  level,
  momentum,
  input1,
  input2,
  frozen,
  scoredPlayer,
  roundWinner,
  currentQuote,
  shake1,
  shake2,
  currentQuestion,
  appendDigit,
  backspace,
} = useGameState()
</script>
