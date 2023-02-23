const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const NextPageToken = sequelize.define('NextPageToken', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = NextPageToken;