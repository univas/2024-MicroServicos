const bcrypt = require("bcrypt")

const encriptar = (senha) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err){
                reject(err)
            }

            bcrypt.hash(senha, salt, (err, hash) => {
                if(err){
                    reject(err)
                }

                resolve(hash)
            })
        })
    })
}

const comparar = (hash, senha) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(senha, hash, (err, hashSaoIguais) => {
            if(err){
                resolve(false)
            }

            resolve(hashSaoIguais)
        })
    })
}

module.exports = {
    encriptar, comparar
}