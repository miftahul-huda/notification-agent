# Notification Agent
Notification agent has endpoint to send notification. It manages notifiation using sqlite, and run a socket server. A client can send notifiation via REST protocol and received notification via socket.
To send notification:
URL : /notify
Method: POST
Body: 
{ 
  from : {
    username: <username>,
    name: <fullname>
  }  
  ,
  to: {
    username: <username>
  }
  ,
  message: <message>
}

To accept notification:
- Connect to server and send registration in the form of json:
  { "command" : "register", "username" : "<username>", "fullname" : "<fullname>" }
- Wait for the notification message:
  { "type" : "notification",
    id: <notificationid>,
    from : {
      username: <username>,
      name: <fullname>
    }  
    ,
    to: {
      username: <username>
    }
    ,
    message: <message>,
    date: <date> 
}
- Once notification is received, send acknowledgment, so the server won't resend the message and delete it. If it is not acknowledge, the server will resend the message within 5 minutes.
  To acknowledge message:
  { command: "acknowledge", id: <id> }
