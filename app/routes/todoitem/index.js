const todoitemRoute = require('express').Router(),
    todoitemController = require('../../controller/todoitem');
const {checkIsAuth} = require("../../config/jwtConfig");
const {checkPermission} = require("../../config/jwtConfig");

const {checkTodoitemPermission} = require("../../config/jwtConfig");

module.exports = (app) => {
    todoitemRoute.get('/todoitems', todoitemController.getAll)
    todoitemRoute.post('/todoitem', checkIsAuth, todoitemController.create)
    todoitemRoute.put('/todoitem/:uuid', checkIsAuth,/*checkTodoitemPermission*/ todoitemController.update)
    todoitemRoute.delete('/todoitem/:uuid', /*checkTodoitemPermission*/todoitemController.delete)
    todoitemRoute.get('/todoitem/:uuid', todoitemController.getById)
    app.use('/api/v1', todoitemRoute)
}