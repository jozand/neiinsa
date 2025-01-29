import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';
import { JWT_SECRET } from '../config/env.js';
import { namespace } from '../config/sequelizeContext.js';

const protegerRuta = async (req, res, next) => {
    
    //Verificar si hay un token
    const { _token } = req.cookies;

    if(!_token){
        return res.redirect('/auth/login');
    }   
    
    //Comrpobar el token
    try {
        
        const decoded = jwt.verify(_token, JWT_SECRET);

        const usuario = await Usuario.findByPk(decoded.id);
                        
        //almacenar el usuario al request     
        if(usuario){
            namespace.run(() => {
                namespace.set('usuarioId', usuario.usuarioId);
                next();
            });
        }else{
            return res.redirect('/auth/login');
        }


    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export default protegerRuta;