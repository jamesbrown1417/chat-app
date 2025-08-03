import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import ChatView from '../views/ChatView.vue'
import Settings from '../components/Settings.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/chat', component: ChatView },
  { path: '/settings', component: Settings }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router