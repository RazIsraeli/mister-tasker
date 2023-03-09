const express = require('express')
const { startTask, toggleWorker } = require('./task.controller')
const router = express.Router()

router.get('/worker', toggleWorker)
router.put('/:id/start', startTask)

module.exports = router
