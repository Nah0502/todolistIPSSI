const userRoute = require('express').Router(),
    userController = require('../../controller/user');
    const {checkRole} = require("../../config/jwtConfig");
    const {checkIsAuth} = require("../../config/jwtConfig");

module.exports = (app) => {
    userRoute.get('/users',checkRole('admin'),userController.getAll)
    userRoute.post('/user',userController.create)
    userRoute.put('/user/:uuid',checkRole('admin'), userController.update)
    userRoute.delete('/user/:uuid',checkRole('admin'),userController.delete)
    userRoute.get('/user/:uuid',checkRole('admin'),userController.getById)
    app.use('/api/v1', userRoute)
}