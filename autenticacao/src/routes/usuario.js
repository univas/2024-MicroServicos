const router = require("express").Router()
const usuarioSchema = require("../schemas/usuario")
const encriptador = require("../services/EncriptadorDeSenhas")
const {Usuario} = require("../models")

router.post('/cadastro', async (req, res) => {
    // extrair os dados
    const dados = req.body
    try{
        // validar os dados
        const usuario = usuarioSchema.parse(dados)

        // encriptar a senha
        usuario.senha = await encriptador.encriptar(usuario.senha)

        // persistir no banco
        const usuarioSalvo = await Usuario.create(usuario)

        // retornar dados salvos
        res.status(201).send({
            mensagem: "Usuário salvo com sucesso!",
            sucesso: true,
            id: usuarioSalvo.id
        })
    }catch(err){
        res.status(400).send(err.errors || err.message)
    }
})

module.exports = router