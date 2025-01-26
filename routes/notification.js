const CrudRouter = require("./crudrouter");

class NotificationRouter{
    static getRouter(logic)
    {
        var express = require('express');
        var router = express.Router();
        router.logic = logic;
        let me = this;

        router.post('/notify', function (req, res){

            const body = req.body;
            let logic = router.logic;
            console.log(logic)
            logic.notify(body).then(function (result)
            {
                res.send(result);
            }).catch(function (err){
                console.log("error")
                res.send(err);
            })

        });

        return router;
    }

}

module.exports = NotificationRouter;