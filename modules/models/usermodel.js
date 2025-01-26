const { Model, DataTypes } = require('sequelize');

class UserModel extends Model {
    static initialize(sequelize, force=false)
    { 

        this.username=null;
        this.fullName=null;
        this.socketId=null;
        this.app=null;
    }
}

module.exports = UserModel;