const todoitemModel = require('../../models/ToDoItem')
const TodolistModel = require('../../models/todolist')
const UserModel = require('../../models/user')

exports.getAll = async (req, res) => {
    return res.status(200).json({ msg: 'OK', todoitems: await todoitemModel.findAll()})
}

exports.create = async (req, res) => {
    // get body content of request
    const { name, description, statut, userId, todolistId } = req.body
    try {
        // Vérifiez si l'utilisateur avec l'userId existe
        const existingUser = await UserModel.findByPk(userId);
        if (!existingUser) {
            return res.status(400).json({ msg: 'L\'utilisateur avec cet ID n\'existe pas' });
        }

        // Vérifiez si la todolist avec l'todolistId existe
        const existingTodolist = await TodolistModel.findByPk(todolistId);
        if (!existingTodolist) {
            return res.status(400).json({ msg: 'La todolist avec cet ID n\'existe pas' });
        }

        // Si l'utilisateur et la todolist existent, créez le todoitem
        const todoitem = await todoitemModel.create({
            name,
            description,
            statut,
            userId,
            todolistId
        });

        if (!todoitem.id) {
            return res.status(400).json({ msg: 'Erreur lors de la création du Todoitem' });
        }

        return res.status(200).json({ msg: 'OK', todoitem: todoitem.dataValues });
    } catch (e) {
        console.error(e.message);
        res.status(400).json({ msg: 'BAD REQUEST ' + e.message });
    }
}
exports.update = async (req, res) => {
    try {
        if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
        if (!req.body) return res.status(400).json({ msg: 'BAD REQUEST BODY IS REQUIRED'})
        const {  name, description, statut } = req.body
        const { uuid } = req.params
        const todoitem = await todoitemModel.update({
            name,
            description,
            statut,
        }, {where: { id: uuid}})
        return res.status(200).json({ msg: 'OK', todoitem})
        // return todoitem.id ? res.status(200).json({ msg: 'OK', todoitem}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}

exports.delete = async (req, res) => {
    if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
    const { uuid } = req.params
    try {
        const todoitem = await todoitemModel.destroy( {where: { id: uuid}})
        console.log(todoitem)
        if (!todoitem){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK'})
        // return todoitem.id ? res.status(200).json({ msg: 'OK', todoitem}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}

exports.getById = async (req, res) => {
    if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
    const { uuid } = req.params
    try {
        // const todoitem = await todoitemModel.findByPk(uuid)
        const todoitem = await todoitemModel.findOne({
            include: [
                {
                association: 'todoitem_belongsTo_user', // alias = as
                attributes: { exclude: [ 'createdAt', 'updatedAt', 'password' ] }
            }
            ],
            where: {id: uuid},
            attributes: {
                exclude: [
                    'createdAt'
                ]
            }
        })
        console.log(todoitem.dataValues)
        if (!todoitem){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK', todoitem: todoitem.dataValues})
        // return todoitem.id ? res.status(200).json({ msg: 'OK', todoitem}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}
