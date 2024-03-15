const todolistRoute = require('express').Router(),
    todolistController = require('../../controller/todolist');
const {checkIsAuth} = require("../../config/jwtConfig");

module.exports = (app) => {
    todolistRoute.get('/todolists', todolistController.getAll)
    todolistRoute.post('/todolist', checkIsAuth, todolistController.create)
    todolistRoute.put('/todolist/:uuid', checkIsAuth,/*checkTodolistPermission*/ todolistController.update)
    todolistRoute.delete('/todolist/:uuid', checkIsAuth, /*checkTodolistPermission*/todolistController.delete)
    todolistRoute.get('/todolist/:uuid', todolistController.getById)
    app.use('/api/v1', todolistRoute)
}