// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'task'

export const taskService = {
  query,
  getById,
  save,
  remove,
  runTask,
  toggleWorker,
  getEmptyTask,
  addTaskMsg,
}
window.cs = taskService

async function query(filterBy = { txt: '' }) {
  return httpService.get(STORAGE_KEY, filterBy)

  // var tasks = await storageService.query(STORAGE_KEY)
  // if (filterBy.txt) {
  //     const regex = new RegExp(filterBy.txt, 'i')
  //     tasks = tasks.filter(task => regex.test(task.vendor) || regex.test(task.description))
  // }
  // if (filterBy.price) {
  //     tasks = tasks.filter(task => task.price <= filterBy.price)
  // }
  // return tasks
}
function getById(taskId) {
  // return storageService.get(STORAGE_KEY, taskId)
  return httpService.get(`task/${taskId}`)
}
async function save(task) {
  var savedTask
  if (task._id) {
    // savedTask = await storageService.put(STORAGE_KEY, task)
    savedTask = await httpService.put(`task/${task._id}`, task)
  } else {
    // Later, owner is set by the backend
    // savedTask = await storageService.post(STORAGE_KEY, task)
    savedTask = await httpService.post('task', task)
  }
  return savedTask
}
async function remove(taskId) {
  // await storageService.remove(STORAGE_KEY, taskId)
  return httpService.delete(`task/${taskId}`)
}
async function runTask(taskId) {
  return httpService.put(`task/${taskId}/start`)
}

function toggleWorker() {
  return httpService.get('task/worker')
}

async function addTaskMsg(taskId, txt) {
  const savedMsg = await httpService.post(`task/${taskId}/msg`, { txt })
  return savedMsg
}

function getEmptyTask() {
  return {
    vendor: 'Susita-' + (Date.now() % 1000),
    price: utilService.getRandomIntInclusive(1000, 9000),
  }
}
