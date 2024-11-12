const router = require("express").Router()
const usuarioSchema = require("../schemas/usuario")
const encriptador = require("../services/EncriptadorDeSenhas")
const {Usuario} = require("../models")
const jwt = require("jsonwebtoken")
const Email = require("../services/Email")

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
router.post('/redefinirSenha', async(req, res) => {
    const {email} = req.body

    if(!email){
        return res.status(403).send({
            mensagem: "Usuário inválido",
            sucesso: false
        })
    }

    const nova_senha = Math.random().toString(36).slice(-6)

    const usuario = await Usuario.findOne({where: {email:email}})

    if(!usuario){
        return res.status(404).send()
    }

    const senha_criptografada = await encriptador.encriptar(nova_senha)
    await usuario.update({ senha:  senha_criptografada})
    await usuario.save()

    const conteudo = `<p>Recebemos sua solicitação de nova senha.<br>Senha nova: ${nova_senha}</p>`

    await Email.enviarEmail(email, "Redefinição de senha", conteudo)

    return res.status(200).send({
        sucesso: true,
        mensagem: "E-mail de redefinição de senha enviado!"
    })
})

module.exports = router