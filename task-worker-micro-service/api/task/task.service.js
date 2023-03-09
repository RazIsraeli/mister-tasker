const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const externalService = require('../../services/external.service')
const ObjectId = require('mongodb').ObjectId

async function getById(taskId) {
  try {
    const collection = await dbService.getCollection('task')
    const task = collection.findOne({ _id: ObjectId(taskId) })
    return task
  } catch (err) {
    logger.error(`while finding task ${taskId}`, err)
    throw err
  }
}

async function performTask(task) {
  try {
    // TODO: update task status to running and save to DB
    task.status = 'running'
    const collection = await dbService.getCollection('task')
    await collection.updateOne({ _id: ObjectId(task._id) }, { $set: task })
    // TODO: execute the task using: externalService.execute
    await externalService.execute(task)
    // TODO: update task for success (doneAt, status)
    task.status = 'done'
    task.doneAt = Date.now()
  } catch (error) {
    // TODO: update task for error: status, errors
    task.status = 'failed'
    task.errors.unshift(error)
  } finally {
    // TODO: update task lastTried, triesCount and save to DB
    task.lastTriedAt = Date.now()
    task.triesCount++
    const collection = await dbService.getCollection('task')
    await collection.updateOne({ _id: ObjectId(task._id) }, { $set: task })
    return task
  }
}

async function getNextTask() {
  const criteria = {
    $and: [{ triesCount: { $lt: 5 } }, { status: { $not: { $eq: 'done' } } }],
  }
  const sortBy = {
    importance: 1,
    triesCount: 1,
  }
  try {
    const collection = await dbService.getCollection('task')
    const tasks = await collection.find(criteria).sort(sortBy).toArray()
    return tasks[0]
  } catch (err) {
    console.log('error: ', err)
  }
}

module.exports = {
  getById,
  performTask,
  getNextTask,
}
