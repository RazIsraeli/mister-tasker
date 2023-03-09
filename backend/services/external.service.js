function execute(task) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) resolve(parseInt(Math.random() * 100))
      // TODO: throw some more random errors
      else reject('Could not perform task due to internal process error')
    }, 5000)
  })
}

module.exports = {
  execute,
}
