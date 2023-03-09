<template>
  <section v-if="tasks" class="task-app">
    <div class="actions">
      <button @click="toggleWorker">{{ action }} WORKER</button>
      <router-link to="/task/edit">CREATE</router-link>
    </div>
    <task-list :tasks="getTasks" @deleteTask="deleteTask" @runTask="runTask" />
  </section>
  <section v-else class="loading">Loading...</section>
</template>
<script>
import taskList from '../cmps/task-list.vue'
import {
  eventBus,
  showSuccessMsg,
  showErrorMsg,
} from '../services/event-bus.service'
import { taskService } from '../services/task.service'
import { socketService } from '../services/socket.service'
export default {
  name: 'task-app',
  props: {},
  data() {
    return {
      tasks: this.getTasks,
      workerStatus: false,
    }
  },
  async created() {
    await this.$store.dispatch({ type: 'loadTasks' })
    this.tasks = this.getTasks

    socketService.on('worker-updates', (task) => {
      this.$store.commit({ type: 'updateTask', task })
    })
    // this.$store.commit({ type: 'addOrder', order })
  },
  methods: {
    async deleteTask(taskId) {
      try {
        await this.$store.dispatch({ type: 'removeTask', taskId })
        showSuccessMsg('task deleted successfully')
      } catch (err) {
        showErrorMsg('could not delete task...')
        throw err
      }
    },
    async runTask(taskId) {
      try {
        const task = await taskService.getById(taskId)
        task.status = 'running'
        this.$store.commit({ type: 'updateTask', task })
        await this.$store.dispatch({ type: 'runTask', taskId })
      } catch (err) {
        throw err
      }
    },
    async toggleWorker() {
      this.workerStatus = !this.workerStatus
      try {
        await taskService.toggleWorker()
        showSuccessMsg(`worker is now ${this.workerStatus ? 'on' : 'off'}`)
      } catch (err) {
        showErrorMsg(`can't ${this.workerStatus ? 'stop' : 'start'} worker`)
        throw err
      }
    },
  },
  computed: {
    getTasks() {
      return JSON.parse(JSON.stringify(this.$store.getters.tasks))
    },
    action() {
      return this.workerStatus ? 'STOP' : 'START'
    },
  },
  components: { taskList },
}
</script>
