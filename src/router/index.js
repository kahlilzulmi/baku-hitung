import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import TeacherView from '../views/TeacherView.vue'
import ChallengeView from '../views/ChallengeView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'game', component: GameView },
    { path: '/teacher', name: 'teacher', component: TeacherView },
    { path: '/challenge/:seed', name: 'challenge', component: ChallengeView },
  ],
})
