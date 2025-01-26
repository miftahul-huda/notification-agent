const { Model, DataTypes } = require('sequelize');

class NotificationModel extends Model {
    static initialize(sequelize, force=false)
    { 
        super.init({
            from: DataTypes.STRING,
            fromFullName: DataTypes.STRING,
            to: DataTypes.STRING,
            toFullName: DataTypes.STRING,
            message: DataTypes.STRING,
            isDelivered: DataTypes.BOOLEAN,
            deliveredDate: DataTypes.DATE        
        }, 
        { sequelize, modelName: 'notification', tableName: 'notification', force: force });
    }
}

module.exports = NotificationModel;