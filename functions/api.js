const express = require("express");

const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const serverless = require("serverless-http");

const app = express();

const router = express.Router();

app.get("/",function(req, res){
    
    res.sendFile(__dirname + "/dist/signup.html" );
    //res.send("Server is up and running") only can send 1 per get
})
app.post("/", function(req, res){
    
    const firstName = req.body.fName;
    const lastName =  req.body.lName;
    const email = req.body.email;
    console.log(req.body.email);
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/e2ea619b34";

    const options = {
        method: "POST",
        auth:"damian1:8362f842d26317bd601a9a0bd6a78886-us8"
    }
    
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/dist/success.html" );
        } else {
            res.sendFile(__dirname + "/dist/failure.html" );
            
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end(); 
});

app.post("/failure", function(req, res) {
    res.redirect("/");
})
/*
app.listen(process,env,PORT || 3000, function(){
    console.log("Server is running on port 3000");
})

router.get("/", (req, res) => {
    res.json({
        'path' : 'Home',
        'firstName': 'Bibek',
        'lastName':'Saha'
    });
});

router.get('/json', (req, res) => {
    res.json({
        'path': 'json',
        'author': 'Bibek Saha'
    });
});*/
app.use('/', router);
module.exports.handler = serverless(app);