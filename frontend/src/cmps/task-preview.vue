<template>
  <section class="task-preview flex column">
    <h2><span class="task-title">Title:</span> {{ task.title }}</h2>
    <h2><span class="task-title">Importance:</span> {{ task.importance }}</h2>
    <h3>
      <span class="task-title">Status:</span>
      <span class="task-actual" :style="statusColor"> {{ task.status }}</span>
    </h3>
    <p><span class="task-title">Tries:</span> {{ task.triesCount }}</p>
    <div class="actions">
      <button
        @click="runTask(task._id)"
        v-if="task.status !== 'running'"
        ref="start"
      >
        {{ start }}
      </button>
      <button @click="deleteTask(task._id)">DELETE</button>
      <button @click="goToEdit(task._id)">EDIT</button>
      <button @click="goToDetails(task._id)">DETAILS</button>
    </div>
  </section>
</template>
<script>
export default {
  name: 'task-preview',
  props: {
    task: {
      type: Object,
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    runTask(taskId) {
      this.$emit('runTask', taskId)
    },
    deleteTask(taskId) {
      this.$emit('deleteTask', taskId)
    },
    goToEdit(taskId) {
      const route = this.$router.resolve({
        path: `/task/edit/${taskId}`,
      })
      window.open(route.href)
    },
    goToDetails(taskId) {
      const route = this.$router.resolve({
        path: `/task/${taskId}`,
      })
      window.open(route.href)
    },
  },
  computed: {
    start() {
      return !this.task.triesCount ? 'START' : 'RETRY'
    },
    statusColor() {
      if (this.task.status === 'running') return { color: 'yellow' }
      if (this.task.status === 'done') return { color: 'lightgreen' }
      if (this.task.status === 'failed') return { color: 'red' }
    },
  },
  components: {},
}
</script>
