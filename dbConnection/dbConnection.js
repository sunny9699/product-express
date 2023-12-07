const { Sequelize } = require('sequelize');
const connection = new Sequelize({
    database: 'products',
    dialect: 'mysql',
    password: 'root',
    host: 'localhost',
    logging: false,
    port: 3306,
    username: 'root',
});

module.exports = connection;
