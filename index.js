const express = require('express')
const mongoose = require('mongoose')
const userRoute = require("./Routes/routes")
const adminRoute = require("./Routes/adminRoutes")
require("dotenv").config()



const app = express()
let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 3000;
}


app.use(express.urlencoded({extended: false}))
app.use(express.json())

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      w: 'majority'
    }
  }).then(() => {
    console.log("mongodb connected.");
  })
  .catch((err) => console.log(err.message));

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Templates/funny_message.html');
  });

app.use("/user",userRoute)
app.use("/admin",adminRoute)


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})
