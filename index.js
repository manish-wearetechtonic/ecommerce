const express = require('express')
const mongoose = require('mongoose')
const userRoute = require("./Routes/routes")
require("dotenv").config()



const app = express()
const port = 3000;


app.use(express.urlencoded({extended: false}))
app.use(express.json())

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
  }).then(() => {
    console.log("mongodb connected.");
  })
  .catch((err) => console.log(err.message));

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/funny_message.html');
  });

app.use("/user",userRoute)

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})
