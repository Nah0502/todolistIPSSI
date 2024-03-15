const { DataTypes } = require('sequelize')
const sequelize = require("../../config/db");

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {timestamps: true})
// User.sync({ force: true })

// update User table if exist without delete
// await User.sync({ alter: true });
// drop and create User table
// await User.sync({ force: true });
// create User table if not exist
module.exports = User
