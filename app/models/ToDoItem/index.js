const { DataTypes } = require('sequelize')
const sequelize = require("../../config/db"),
    UserModel = require('../user'),
    TodolistModel = require('../todolist')

const Todoitem = sequelize.define('Todoitem', {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
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
    },
    todolistId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: TodolistModel,
            key: 'id'
        }
    }
}, {timestamps: true})

Todoitem.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'todoitem_belongsTo_user',
    // The possible choices are RESTRICT, CASCADE, NO ACTION, SET DEFAULT and SET NULL
    // onDelete: "RESTRICT",  Default is SET NULL
    // onUpdate: "RESTRICT",     Default is CASCADE
})
UserModel.hasMany(Todoitem, {
    foreignKey: 'userId',
    as: 'user_hasOne_todoitem'
})

Todoitem.belongsTo(TodolistModel, {
    foreignKey: 'todolistId',
    as: 'todoitem_belongsTo_todolist',
    // onDelete: "RESTRICT",
    // onUpdate: "RESTRICT"
})
TodolistModel.hasMany(Todoitem, {
    foreignKey: 'todolistId',
    as: 'user_hasOne_todoitem'
})
//Product.sync({ force: true })
// update User table if exist without delete
// await Product.sync({ alter: true });
// drop and create User table
// await Product.sync({ force: true });
// create User table if not exist
module.exports = Todoitem
