const { DataTypes } = require('sequelize')
const sequelize = require("../../config/db"),
    UserModel = require('../user')

const Todolist = sequelize.define('Todolist', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    statut: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id'
        }
    }
}, {timestamps: true})

Todolist.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'todolist_belongsTo_user'
})
UserModel.hasMany(Todolist, {
    foreignKey: 'userId',
    as: 'user_hasOne_todolist'
})

module.exports = Todolist
