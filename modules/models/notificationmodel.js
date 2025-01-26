const { Model, DataTypes } = require('sequelize');

class NotificationModel {
    
    initialize()
    {
        this.from=null;
        this.fromFullName=null;
        this.to=null;
        this.toFullName=null;
        this.message=null;
        this.isDelivered;
        this.deliveredDate;
        this.app=null;    
    }
}

module.exports = NotificationModel;