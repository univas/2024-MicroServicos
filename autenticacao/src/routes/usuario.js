const router = require("express").Router()
const usuarioSchema = require("../schemas/usuario")
const encriptador = require("../services/EncriptadorDeSenhas")
const {Usuario} = require("../models")
const jwt = require("jsonwebtoken")

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

// gerarToken
router.post('/gerarToken', async (req, res) => {
    const {email, senha} = req.body

    if(!email || !senha){
        return res.status(403).send({
            mensagem: "Usuário ou senha inválidos",
            sucesso: false
        })
    }

    const usuario = await Usuario.findOne({
        where: {
            email: email
        }
    })

    // se a variável usuário for algum valor vazio (null, undefined)
    if(!usuario){
        return res.status(403).send({
            mensagem: "Usuário ou senha inválidos",
            sucesso: false
        })
    }

    const senhaValida = await encriptador.comparar(usuario.senha, senha)

    if(!senhaValida){
        return res.status(403).send({
            mensagem: "Usuário ou senha inválidos",
            sucesso: false
        })
    }

    const payload = {
        dados: {
            email: usuario.email,
            nome: usuario.nome
        }
    }

    const token = jwt.sign(payload, process.env.KEY, {
        algorithm: 'HS256',
        expiresIn: 60*20 // 20 minutos
    })

    return res.status(200).send({
        sucesso: true,
        token: token
    })
})

// validarToken
router.post('/validarToken', async (req, res) => {
    const {token} = req.body

    try{
        const decodificado = jwt.verify(token, process.env.KEY)

        return res.send({
            sucesso: true,
            mensagem: "Token Válido",
            dados: decodificado
        })
    }catch(err){
        return res.status(401).send({
            sucesso: false,
            mensagem: err.message
        })
    }
})

// redefinirSenha

module.exports = router