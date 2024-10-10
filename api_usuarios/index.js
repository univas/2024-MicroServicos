const express = require("express")
const app = express()
let last_id = 0

// adicionar validação com zod

app.use(express.json())

const usuarios = []

app.get("/", (req, res) => {
    res.send("Rodando...")
})

app.get("/usuarios", (req, res) => {
    res.send(usuarios)
})

app.get("/usuarios/:id", (req, res) => {
    const id = req.params.id

    const usuario = usuarios.filter(u => u.id == id)

    if(usuario.length > 0){
        res.send(usuario[0])
    }else{
        res.status(404).send()
    }
})

app.post("/usuarios", (req, res) => {
    const usuarioNovo = req.body
    usuarioNovo.id = ++last_id
    usuarios.push(usuarioNovo)

    res.send(usuarioNovo)
})

app.delete("/usuarios/:id", (req, res) => {

})

app.listen(3000, () => {
    console.log("Aplicação online")
})