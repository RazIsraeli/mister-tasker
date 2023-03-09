const taskService = require('./task.service.js')

const logger = require('../../services/logger.service')

const { broadcast } = require('../../services/socket.service')
const { json } = require('express')

let isWorkerOn = false

async function startTask(req, res) {
  const { id } = req.params
  try {
    let task = await taskService.getById(id)
    task = await taskService.performTask(task)
    res.json(task)
  } catch (err) {
    logger.error(err)
  }
}

async function toggleWorker(req, res) {
  isWorkerOn = !isWorkerOn
  if (isWorkerOn) runWorker()
  logger.info(`worker is ${isWorkerOn ? 'on' : 'off'}`)
  res.json(isWorkerOn)
}

async function runWorker() {
  // The isWorkerOn is toggled by the button: "Start/Stop Task Worker"
  if (!isWorkerOn) return
  var delay = 5000
  try {
    const task = await taskService.getNextTask()
    if (task) {
      try {
        const taskCopy = JSON.parse(JSON.stringify(task))
        taskCopy.status = 'running'
        await broadcast({
          type: 'worker-updates',
          data: taskCopy,
          userId: '',
        })
        await taskService.performTask(task)
        await broadcast({
          type: 'worker-updates',
          data: task,
          userId: '',
        })
      } catch (err) {
        console.log(`Failed Task`, err)
      } finally {
        delay = 1
      }
    } else {
      console.log('Snoozing... no tasks to perform')
      isWorkerOn = false
    }
  } catch (err) {
    console.log(`Failed getting next task to execute`, err)
  } finally {
    setTimeout(runWorker, delay)
  }
}

module.exports = {
  startTask,
  toggleWorker,
  runWorker,
}
