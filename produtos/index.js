require("dotenv").config()
const express = require("express")
const mongodb = require("./src/database/mongo")

const PORT = process.env.PORT

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("API OK")
})

mongodb()

app.listen(PORT, () => console.log("Servidor rodando"))