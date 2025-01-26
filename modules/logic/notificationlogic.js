const NotificationModel = require("../models/notification")

class NotificationLogic 
{
    static async notify(body)
    {
        try
        {
            if(body.from == null)
            {
                return { success: false, message: "provide from information"}
            }
            if(body.to == null)
            {
                return { success: false, message: "provide to information"}
            }
            if(body.from.username == null)
            {
                return { success: false, message: "provide from username"}
            }
            if(body.from.fullName == null)
            {
                return { success: false, message: "provide from full name"}
            }
            if(body.message == null)
            {
                return { success: false, message: "provide message"}
            }

            const toFullName = "";
            const model = require("../models/user");
            const user = await model.findOne({
                where: {
                    username: body.to.username
                }
            });

            if(user != null)
                toFullName = user.fullName;

            const o = {
                from: body.from.username,
                fromFullName: body.from.fullName,
                to: body.to.username,
                toFullName: toFullName,
                message: body.message,
                isDelivered: false
            }

            let result = await NotificationModel.create(o);
            return { success: true, payload: result }

        }
        catch(e)
        {
            console.error(e)
            throw { success: false, message: e }

        }
    }
}