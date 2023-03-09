const taskService = require('./task.service.js')

const logger = require('../../services/logger.service')

const { broadcast } = require('../../services/socket.service')
const { json } = require('express')

let isWorkerOn = false

async function getTasks(req, res) {
  runWorker()
  try {
    logger.debug('Getting Tasks')
    const filterBy = {
      txt: req.query.txt || '',
    }
    const tasks = await taskService.query(filterBy)
    res.json(tasks)
  } catch (err) {
    logger.error('Failed to get tasks', err)
    res.status(500).send({ err: 'Failed to get tasks' })
  }
}

async function getTaskById(req, res) {
  try {
    const taskId = req.params.id
    const task = await taskService.getById(taskId)
    res.json(task)
  } catch (err) {
    logger.error('Failed to get task', err)
    res.status(500).send({ err: 'Failed to get task' })
  }
}

async function addTask(req, res) {
  const task = _getEmptyTask()
  try {
    const { title, importance, description } = req.body
    task.title = title
    task.importance = importance
    task.description = description
    const addedTask = await taskService.add(task)
    res.json(addedTask)
  } catch (err) {
    logger.error('Failed to add task', err)
    res.status(500).send({ err: 'Failed to add task' })
  }
}

async function updateTask(req, res) {
  try {
    const task = req.body
    task._id = req.params.id
    const updatedTask = await taskService.update(task)
    res.json(updatedTask)
  } catch (err) {
    logger.error('Failed to update task', err)
    res.status(500).send({ err: 'Failed to update task' })
  }
}

async function removeTask(req, res) {
  const taskId = req.params.id
  try {
    const removedId = await taskService.remove(taskId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove task', err)
    res.status(500).send({ err: 'Failed to remove task' })
  }
}

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

async function addTaskMsg(req, res) {
  const { loggedinUser } = req
  try {
    const taskId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
    }
    const savedMsg = await taskService.addTaskMsg(taskId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update task', err)
    res.status(500).send({ err: 'Failed to update task' })
  }
}

async function removeTaskMsg(req, res) {
  const { loggedinUser } = req
  try {
    const taskId = req.params.id
    const { msgId } = req.params

    const removedId = await taskService.removeTaskMsg(taskId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove task msg', err)
    res.status(500).send({ err: 'Failed to remove task msg' })
  }
}

function _getEmptyTask() {
  return {
    status: 'new',
    lastTriedAt: '',
    triesCount: 0,
    doneAt: '',
    errors: [],
  }
}

module.exports = {
  getTasks,
  getTaskById,
  addTask,
  updateTask,
  removeTask,
  startTask,
  toggleWorker,
  runWorker,
  addTaskMsg,
  removeTaskMsg,
}
