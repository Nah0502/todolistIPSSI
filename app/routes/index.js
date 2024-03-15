module.exports = (app) => {
    require('./user')(app)
    require('./auth')(app)
    require('./todolist')(app)
    require('./todoitem')(app)
}