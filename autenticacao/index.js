require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 8000

const rotas_usuario = require("./src/routes/usuario")

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Rodando")
}) 

app.use(rotas_usuario)

app.listen(PORT, () => {
    console.log("Serviço rodando...")
})