const nodemailer = require("nodemailer")

const transportador = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

const enviarEmail = async (destinario, assunto, conteudo) => {
    await transportador.sendMail({
        from: "Marcos Antonio <marcosantonio@microservicos.com.br>",
        to: destinario,
        subject: assunto,
        html: conteudo
    })

    return true
}

module.exports = {
    enviarEmail: enviarEmail
}