const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const VideoData = sequelize.define('VideoData', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    thumbnailURL: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = VideoData;