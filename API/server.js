const express = require("express")
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const cors = require('cors')

const port = 3001
const database = "mongodb+srv://bd:KANhixkdUE7XqARI@automate.c1yl6.mongodb.net/?retryWrites=true&w=majority&appName=Automate"

const app = express()
app.use(bodyParser.json());

const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 200
}

app.use(cors(corsOptions))

const itemRoutes = require("./routes/item")
app.use('/grocery_list', itemRoutes)

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Access-Control-Allow-Origin")

    if (req.method === "OPTIONS") {
        res.status(200).end()
        return
    }
    else{
        next()
    }
})

app.use((err, req, res, next) => {

    console.log("err", err)
    if (!err.statusCode){
        err.statusCode = 500
    }

    res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode })
})
mongoose.connect(database).then(response => {
    app.listen(port, async () => {
        console.log(`Server is running on port: ${port}`)
    })
}).catch(err => console.error(err))

module.exports = app
