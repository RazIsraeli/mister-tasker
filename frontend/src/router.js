import { createRouter, createWebHashHistory } from 'vue-router'

import home from './views/home.vue'
import taskApp from './views/task-app.vue'
import taskEdit from './views/task-edit.vue'
import taskDetails from './views/task-details.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
  },
  {
    path: '/task',
    name: 'task-app',
    component: taskApp,
  },
  {
    path: '/task/edit/:id?',
    name: 'task-edit',
    component: taskEdit,
  },
  {
    path: '/task/:id',
    name: 'task-details',
    component: taskDetails,
  },
]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
  // base: process.env.BASE_URL,
})
