const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const externalService = require('../../services/external.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { txt: '' }) {
  const criteria = {}
  try {
    // criteria = {
    //   vendor: { $regex: filterBy.txt, $options: 'i' },
    // }
    const collection = await dbService.getCollection('task')
    var tasks = await collection.find(criteria).toArray()
    return tasks
  } catch (err) {
    logger.error('cannot find tasks', err)
    throw err
  }
}

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

async function remove(taskId) {
  try {
    const collection = await dbService.getCollection('task')
    await collection.deleteOne({ _id: ObjectId(taskId) })
    return taskId
  } catch (err) {
    logger.error(`cannot remove task ${taskId}`, err)
    throw err
  }
}

async function add(task) {
  try {
    const collection = await dbService.getCollection('task')
    await collection.insertOne(task)
    return task
  } catch (err) {
    logger.error('cannot insert task', err)
    throw err
  }
}

async function update(task) {
  try {
    const taskToSave = {
      title: task.title,
      importance: task.importance,
    }
    const collection = await dbService.getCollection('task')
    await collection.updateOne(
      { _id: ObjectId(task._id) },
      { $set: taskToSave }
    )
    delete task._id
    return task
  } catch (err) {
    logger.error(`cannot update task ${taskId}`, err)
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

async function addTaskMsg(taskId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('task')
    await collection.updateOne(
      { _id: ObjectId(taskId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add task msg ${taskId}`, err)
    throw err
  }
}

async function removeTaskMsg(taskId, msgId) {
  try {
    const collection = await dbService.getCollection('task')
    await collection.updateOne(
      { _id: ObjectId(taskId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add task msg ${taskId}`, err)
    throw err
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  performTask,
  getNextTask,
  addTaskMsg,
  removeTaskMsg,
}
