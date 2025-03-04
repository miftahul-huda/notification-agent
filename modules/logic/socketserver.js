const { Sequelize, Model, DataTypes } = require('sequelize');
const { Op } = require("sequelize");
let fs = require('fs');

const WebSocket = require('ws');

class SocketServer
{
    

    static runNotificationServer()
    {
        console.log("Run notification server")
        const me = this;
        this.sockets = [];
        this.isSending = false;
        this.isSendingAck = false;

        const host = '0.0.0.0'; // Localhost
        const port = process.env.SOCKET_SERVER_PORT; // Port to listen on

        const wss = new WebSocket.Server({ port: port });

        wss.on('connection', function connection(ws) {
            // Handle incoming messages)

            ws.on('message', function incoming(message) {
                // Handle incoming message
                console.log("Incomming message")
                message = message.toString('utf8');
                console.log(message);
                me.processData(ws, message);

            });

            ws.on('close', function() {
                // Handle connection close
                console.log("connection closed")
            });

            ws.on('error', function(error) {
                // Handle connection error
                console.log("connection error")
                console.log(error)
            })
        });


        setInterval(function(){
            if(me.isSending == false)
            {
                try
                {
                    me.sendNotifications();
                }
                catch(e)
                {
                    console.error("Error.sendNotifications()")
                    console.error(e);
                }
            }

        }, 1000)

        setInterval(function(){
            if(me.isSendingAck == false)
            {
                try
                {
                    me.sendUnAcknowlegedNotifications();
                }
                catch(e)
                {
                    console.error("Error.sendNotifications()")
                    console.error(e);
                }
            }
        }, 5000)

        console.log("Run notification server on port " + port);
    }

    static processData(socket, data)
    {
        try
        {
            const reg = JSON.parse(data);
            const command = reg.command;
            switch(command)
            {
                case "register":
                    this.registerUser(socket, reg);
                    break;
                case "ack":
                    this.acknowldge(socket, reg);
                break;
                case "unregister":
                    break;
            }
        

        }
        catch(e)
        {

        }
    }

    static async registerUser(socket, reg)
    {
        this.sockets[reg.username] = socket;
        const u = { username: reg.username, fullName: reg.fullName }



        if(fs.existsSync("users.json") == false)
        {
            console.log("no notifications.json file. Create a new one")
            fs.writeFileSync("users.json", JSON.stringify([]));
        }

        let allData = fs.readFileSync("users.json")
        allData = JSON.parse(allData);
        let indexes = [];
        let idx = 0;
        allData.map((user)=>{
            if(user.username == reg.username)
            {
                indexes.push(idx);
            }
            idx++;
        });

        indexes.map((index)=>{
            allData.splice(index, 1);
        })

        allData.push(u);
        fs.writeFileSync("users.json", JSON.stringify( allData));


    }

    static async acknowldge(socket, reg)
    {
        console.log("acknowledge")
        console.log(reg)

        if(fs.existsSync("notifications.json") == false)
        {
            console.log("no notifications.json file. Create a new one")
            fs.writeFileSync("notifications.json", JSON.stringify([]));
        }
        let allData = fs.readFileSync("notifications.json")
        allData = JSON.parse(allData);
        let indexes = [];
        let idx = 0;
        allData.map((notification)=>{
            if(notification.id == reg.id)
            {
                indexes.push(idx);
            }
            idx++;
        });

        indexes.map((index)=>{
            allData.splice(index, 1);
        })

        fs.writeFileSync("notifications.json", JSON.stringify( allData));


    }

    static async sendNotifications()
    {
        this.isSending = true;


        if(fs.existsSync("notifications.json") == false)
        {
            console.log("no notifications.json file. Create a new one")
            fs.writeFileSync("notifications.json", JSON.stringify([]));
        }

        let allData = fs.readFileSync("notifications.json")
        allData = JSON.parse(allData);
        let newAllData = [];
        allData.map((data)=>{
            if(data.isDelivered == false)
            {
                newAllData.push(data);
            }
        })

        this.sendAllNotifications(newAllData);
        this.isSending = false;
    }

    static async sendUnAcknowlegedNotifications()
    {
        let me = this;
        this.isSendingAck = true;

        if(fs.existsSync("notifications.json") == false)
        {
            console.log("no notifications.json file. Create a new one")
            fs.writeFileSync("notifications.json", JSON.stringify([]));
        }

        let allData = fs.readFileSync("notifications.json")
        allData = JSON.parse(allData);
        
        
        let newAllData = [];
        allData.map((data)=>{
            if(data.isDelivered == true)
            {
                let secs = me.secondsBetweenDates(new Date(data.deliveredDate), new Date());
                console.log("Secs")
                console.log(secs)
                if(data.deliveredDate != null && secs >= 60)
                {
                    newAllData.push(data);
    
                }
            }
        })


        this.sendAllNotifications(newAllData);
        this.isSendingAck = false;
    }

    static sendAllNotifications(notifications, model)
    {

        //For each notification
        notifications.map(async (notification)=>{

            //Get socket associated to target username
            const to = notification.to;
            const socket = this.sockets[to.username];

            //If socket is not null, send the notification
            if(socket != null)
            {
                //assemble notification message
                console.log("Notification")
                console.log(notification)
                const notificationToSend = notification
                delete notificationToSend.isDelivered;

                try
                {
                    //Send the notification message
                    socket.send(JSON.stringify(notificationToSend));


                    if(fs.existsSync("notifications.json") == false)
                    {
                        console.log("no notifications.json file. Create a new one")
                        fs.writeFileSync("notifications.json", JSON.stringify([]));
                    }
                   
                    let notifications = fs.readFileSync("notifications.json");
                    notifications = JSON.parse(notifications);
                    notifications.map((notification)=>{
                        if(notification.id == notificationToSend.id)
                        {
                            notification.isDelivered = true;
                            notification.deliveredDate = new Date();
                        }
                    })

                    notifications = JSON.stringify(notifications);
                    fs.writeFileSync("notifications.json", notifications);
                }
                catch(e)
                {
                    console.error("Error.sendNotifications()")
                    console.error(e);
                }


            }
        })
    }
    
    static secondsBetweenDates(date1, date2) {
        const oneSecond = 1000; // milliseconds in one second
        const diffInMilliseconds = Math.abs(date2 - date1);
        return Math.floor(diffInMilliseconds / oneSecond);
    }
      
}


module.exports = SocketServer;