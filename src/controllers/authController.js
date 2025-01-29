import { generarJWT } from "../utils/token.js"
import { Usuario } from "../models/index.js"

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Session",
    csftToken: req.csrfToken(),
  })
}

const autenticar = async (req, res) => {
  const { correo, contrasenia } = req.body
  const usuario = await Usuario.findOne({ where: { correo } })

  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar Session",
      csftToken: req.csrfToken(),
      errores: [{ msg: "Correo o contraseña incorrectos" }],
    })
  }

  if (!usuario.verificarPassword(contrasenia)) {
    return res.render("auth/login", {
      pagina: "Iniciar Session",
      csftToken: req.csrfToken(),
      errores: [{ msg: "Contraseña incorrecta" }],
    })
  }

  // Si todo ha ido bien, crear el token de sesión
  const token = generarJWT({ id: usuario.usuarioId, nombre: usuario.nombre })

  return res
    .cookie("_token", token, {
      httpOnly: true,
    })
    .redirect("/")
}

const cerrarSession = async (req, res) => {
  return res.clearCookie("_token").status(200).redirect("/auth/login")
}

export { 
  formularioLogin, 
  autenticar, 
  cerrarSession 
}
