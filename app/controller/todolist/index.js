const todolistModel = require('../../models/todolist')

exports.getAll = async (req, res) => {
    return res.status(200).json({ msg: 'OK', todolists: await todolistModel.findAll()})
}

exports.create = async (req, res) => {
    // get body content of request
    const { name, description, statut, userId } = req.body
    try {
        const todolist = await todolistModel.create({
            name,
            description,
            statut,
            userId
        })
        if (!todolist.id){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK', todolist: todolist.dataValues})
        // return todolist.id ? res.status(200).json({ msg: 'OK', todolist}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}

exports.update = async (req, res) => {
    try {
        if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
        if (!req.body) return res.status(400).json({ msg: 'BAD REQUEST BODY IS REQUIRED'})
        const {  name, description, statut } = req.body
        const { uuid } = req.params
        const todolist = await todolistModel.update({
            name,
            description,
            statut,
        }, {where: { id: uuid}})
        return res.status(200).json({ msg: 'OK', todolist})
        // return todolist.id ? res.status(200).json({ msg: 'OK', todolist}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}

exports.delete = async (req, res) => {
    if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
    const { uuid } = req.params
    try {
        const todolist = await todolistModel.destroy( {where: { id: uuid}})
        console.log(todolist)
        if (!todolist){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK'})
        // return todolist.id ? res.status(200).json({ msg: 'OK', todolist}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}

exports.getById = async (req, res) => {
    if (!req.params.uuid) return res.status(400).json({ msg: 'BAD REQUEST PARAMS IS REQUIRED'})
    const { uuid } = req.params
    try {
        // const todolist = await todolistModel.findByPk(uuid)
        const todolist = await todolistModel.findOne({
            include: [
                {
                association: 'todolist_belongsTo_user', // alias = as
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
        console.log(todolist.dataValues)
        if (!todolist){
            res.status(400).json({ msg: 'BAD REQUEST'})
        }
        return res.status(200).json({ msg: 'OK', todolist: todolist.dataValues})
        // return todolist.id ? res.status(200).json({ msg: 'OK', todolist}) : res.status(400).json({ msg: 'BAD REQUEST'})
    } catch (e) {
        console.error(e.message)
        res.status(400).json({ msg: 'BAD REQUEST' + e.message})
    }
}
