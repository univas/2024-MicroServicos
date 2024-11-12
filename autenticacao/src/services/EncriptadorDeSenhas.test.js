const encriptador = require("./EncriptadorDeSenhas")

const senha = "123456"
let hashGerado = ""

beforeAll(async () => {
    hashGerado = await encriptador.encriptar(senha)
})

it('Comparar senha correta', async() => {
    const resultado = await encriptador.comparar(hashGerado, senha)

    expect(resultado).toBeTruthy()
})

it('Comparar senha incorreta', async() => {
    const senhaIncorreta = "123"

    const resultado = await encriptador.comparar(hashGerado, senhaIncorreta)

    expect(resultado).toBe(false)
})

it('Comparar hash incorreto', async() => {
    const hashErrado = "14312341n312vhjh12vb3h12v3hk12v31yh2vb31"
    
    const resultado = await encriptador.comparar(hashErrado, senha)

    expect(resultado).toBe(false)
})