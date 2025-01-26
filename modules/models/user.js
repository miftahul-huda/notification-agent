const { Model, DataTypes } = require('sequelize');

class UserModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            username: DataTypes.STRING,
            fullName: DataTypes.STRING,
            socketId: DataTypes.STRING,
        }, 
        { sequelize, modelName: 'user', tableName: 'user', force: force });
    }
}

module.exports = UserModel;