<template>
  <section v-if="currTask.importance" class="task-edit">
    <form>
      <input v-model="currTask.title" type="text" placeholder="title" />
      <input
        v-model="currTask.importance"
        type="number"
        min="1"
        max="3"
        placeholder="importance (1-3)"
      />
      <input
        v-model="currTask.description"
        type="text"
        placeholder="description"
      />
      <button v-if="!currTask._id" @click.prevent="createTask">SAVE</button>
      <button v-if="currTask._id" @click.prevent="updateTask">UPDATE</button>
    </form>
  </section>
  <section v-else class="loading">Loading...</section>
</template>
<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { taskService } from '../services/task.service'

export default {
  name: 'task-edit',
  props: {},
  data() {
    return {
      currTask: {
        title: '',
        importance: 3,
        description: '',
      },
    }
  },
  async created() {
    const { id } = this.$route.params
    if (id) {
      try {
        const task = await taskService.getById(id)
        this.$store.commit({ type: 'setCurrTask', currTask: task })
        this.currTask = JSON.parse(JSON.stringify(this.$store.getters.currTask))
      } catch (err) {
        throw err
      }
    }
  },
  methods: {
    async createTask() {
      try {
        await this.$store.dispatch({ type: 'addTask', task: this.currTask })
        this.$router.push('/task')
        showSuccessMsg('new task added!')
      } catch (err) {
        showErrorMsg('could not create new task...')
      }
    },
    async updateTask() {
      try {
        await this.$store.dispatch({ type: 'updateTask', task: this.currTask })
        this.$router.push('/task')
        showSuccessMsg('task updated!')
      } catch (err) {
        showErrorMsg('could not update task...')
      }
    },
  },
  computed: {},
  components: {},
}
</script>
