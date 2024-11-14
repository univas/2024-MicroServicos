const express = require("express")
const router = express.Router()
const Produto = require("../models/produto")
// /produtos

router.post("/", async (req, res) => {
    const dados = req.body

    try{
        const novoProduto = new Produto(dados)
        const produtoSalvo = await novoProduto.save()

        res.status(201).send(produtoSalvo)
    }catch(err){
        res.status(500).send({ mensagem: "Erro ao criar produto"})
    }
})

router.delete("/:id", async (req, res) => {
    try{
        const {id} = req.params
        const produtoExcluido = await Produto.findByIdAndDelete(id)
        if(!produtoExcluido){
            return res.status(404).send("Produto não encontrado")
        }

        res.send("Produto deletado com sucesso")
    }catch(err){
        res.status(500).send({ mensagem: "Erro ao deletar produto"})
    }
})

module.exports = router