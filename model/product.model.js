const conncetion = require('../dbConnection/dbConnection');
const { DataTypes } = require('sequelize');

const Products = conncetion.define('Products', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
}, { timestamps: false });

module.exports = Products;
