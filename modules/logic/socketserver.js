class SocketServer
{
    
    static runNotificationServer()
    {
        this.sockets = [];
        this.isSending = false;
        const net = require('net');

        const host = '0.0.0.0'; // Localhost
        const port = process.env.SOCKET_SERVER_PORT; // Port to listen on

        const server = net.createServer((socket) => {
        console.log('A client connected: ' + socket.remoteAddress + ':' + socket.remotePort);

        socket.on('data', (data) => {
            console.log('Server received: ' + data);
            this.processData(socket, data);

        });

        socket.on('close', () => {
            console.log('Client disconnected');
        });

        socket.on('error', (err) => {
                console.error('Socket Error:', err);
            });
        });

        server.listen(port, host, () => {
            console.log(`Server listening on ${host}:${port}`);
        });


        setInterval(function(){
            if(this.isSending == false)
                this.sendNotifications();
        }, 1000)

        console.log("Run notification server on port " + port);
    }

    static processData(socket, data)
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

    static async registerUser(socket, reg)
    {
        this.sockets[reg.username] = socket;
        const u = { username: reg.username, fullName: reg.fullName }

        const model = require("../models/user");
        await model.create(u);
    }

    static async acknowldge(socket, reg)
    {
        const id = reg.id;
        const model = require("../models/notification");
        await model.destroy({
            where: {
                id: id
            }
        });

    }

    static async sendNotifications()
    {
        this.isSending = true;
        
        const model = require("../models/notification");

        //Get notifications that is not delievered
        const notifications = await model.findAll({
            where: {
                isDelivered: false
            }
        });

        //For each notification
        notifications.map(async (notification)=>{

            //Get socket associated to target username
            const to = notification.to;
            const socket = this.sockets[to];

            //If socket is not null, send the notification
            if(socket != null)
            {
                //assemble notification message
                const notificationToSend = {
                    id: notification.id,
                    from: {
                        username: notification.from,
                        fullName: notification.fromFullName
                    },
                    to: {
                        username: notification.to,
                        fullName: notification.toFullName
                    }
                    ,
                    message: notification.message,
                    date: notification.createdAt
                }

                try
                {
                    //Send the notification message
                    socket.write(JSON.stringify(notificationToSend));

                    //Update notification in sqlite, set it has been delivered
                    await model.update({ isDelivered: true, deliveredDate: new Date() }, {
                        where: {
                            id: notification.id
                        }
                    });                 
                }
                catch(e)
                {
                    console.error("Error.sendNotifications()")
                    console.error(e);
                }


            }
        })

        this.isSending = false;
    }
}


module.exports = SocketServer;