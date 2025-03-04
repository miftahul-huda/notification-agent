const { all } = require("../../app");
const fs = require('fs');

class NotificationLogic 
{
    static generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

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
            if(body.app == null)
            {
                return { success: false, message: "provide app source and app target"}
            }
            

            let toFullName = "";
            if(fs.existsSync("users.json") == false)
            {
                console.log("no notifications.json file. Create a new one")
                fs.writeFileSync("users.json", JSON.stringify([]));
            }

            let users = fs.readFileSync("users.json")
            users = JSON.parse(users);
            users.map((user)=>{
                if(user.username == body.to.username)
                {
                    toFullName = user.fullName;
                }
            })


            const o = {
                id: this.generateRandomString(20),
                from: body.from,
                to: body.to,
                message: body.message,
                isDelivered: false,
                createdAt: Date.now(),
                app: body.app   
            }

            if(fs.existsSync("notifications.json") == false)
            {
                console.log("no notifications.json file. Create a new one")
                fs.writeFileSync("notifications.json", JSON.stringify([]));
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
