<template>
  <section class="task-list">
    <ul v-for="task in tasks" class="task-list-container">
      <li>
        <task-preview
          :task="task"
          @deleteTask="deleteTask"
          @runTask="runTask"
        />
      </li>
    </ul>
  </section>
</template>
<script>
import taskPreview from './task-preview.vue'
export default {
  name: 'task-list',
  props: {
    tasks: {
      type: Array,
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
  },
  computed: {},
  components: {
    taskPreview,
  },
}
</script>
