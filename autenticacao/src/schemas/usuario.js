const {z} = require("zod")

const usuarioSchema = z.object({
    nome: z.string({message: "Campo obrigatório."}).min(5, "Deve ter no mínimo 05 caracteres."),
    email: z.string({message: "Campo obrigatório."}).email("Deve preencher um e-mail válido."),
    senha: z.string({message: "Campo obrigatório"}).min(6, "Deve ter no mínimo 06 caracteres.")
})

module.exports = usuarioSchema