<template>
  <section v-if="currTask" class="task-details">
    <router-link to="/task" class="router">BACK</router-link>
    <h1>Title: {{ currTask.title }}</h1>
    <h1>Importance: {{ currTask.importance }}</h1>
    <pre>{{ currTask.description }}</pre>
    <h1>
      Status: <span :style="statusColor">{{ currTask.status }}</span>
    </h1>
    <h4>Tries: {{ currTask.triesCount }} times</h4>
    <h4>Errors count: {{ currTask.errors.length }}</h4>
    <ul>
      <li v-for="(error, idx) in currTask.errors" :key="idx">
        {{ idx + ' : ' + error }}
      </li>
    </ul>
  </section>
</template>
<script>
import { taskService } from '../services/task.service'

export default {
  name: 'task-details',
  props: {},
  data() {
    return {
      currTask: null,
    }
  },
  async created() {
    const { id } = this.$route.params
    try {
      const task = await taskService.getById(id)
      this.$store.commit({ type: 'setCurrTask', currTask: task })
      this.currTask = this.$store.getters.currTask
    } catch (err) {
      throw err
    }
  },
  methods: {},
  computed: {
    statusColor() {
      if (this.currTask.status === 'running') return { color: 'yellow' }
      if (this.currTask.status === 'done') return { color: 'lightgreen' }
      if (this.currTask.status === 'failed') return { color: 'red' }
    },
  },
  components: {},
}
</script>
