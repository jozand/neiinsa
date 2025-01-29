import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

const generarJWT = datos => jwt.sign({ id: datos.id, nombre: datos.nombre }, JWT_SECRET, {
  expiresIn: '1d'
});

const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarJWT,
    generarId,
}