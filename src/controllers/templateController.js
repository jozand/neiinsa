const mostrarAlerta = (req, res) => {
  const mensaje = req.query.mensaje || ''   
  res.render('templates/mostrarAlerta', { mensaje })
}

const mostrarAlertaConfirmacion = (req, res) => {``
  const mensaje = req.query.mensaje || ''   
  res.render('templates/mostrarAlertaConfirmacion', { mensaje })
}


export {
  mostrarAlerta,
  mostrarAlertaConfirmacion
}