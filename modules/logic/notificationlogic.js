const { all } = require("../../app");
const fs = require('fs');

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
            

            let toFullName = "";
            let users = fs.readFileSync("users.json")
            users = JSON.parse(users);
            users.map((user)=>{
                if(user.username == body.to.username && user.app == body.app)
                {
                    toFullName = user.fullName;
                }
            })


            const o = {
                from: body.from.username,
                fromFullName: body.from.fullName,
                to: body.to.username,
                toFullName: toFullName,
                message: body.message,
                isDelivered: false,
                app: body.app   
            }

            let allData = fs.readFileSync("notifications.json")
            allData = JSON.parse(allData);
            allData.push(o);
            fs.writeFileSync("notifications.json", JSON.stringify( allData));
            return { success: true, payload: o }

        }
        catch(e)
        {
            console.error(e)
            throw { success: false, message: e }

        }
    }
}

module.exports = NotificationLogic;
