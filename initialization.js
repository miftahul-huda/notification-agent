//const LoggerModel  = require( './modules/models/loggermodel')

const { Sequelize, Model, DataTypes } = require('sequelize');
const process = require('process');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite' // Path to your SQLite database file
});

class Initialization {
    static async initializeDatabase(){

        let force = false;
        await sequelize.sync();
    }
}

module.exports = Initialization



