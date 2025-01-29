import { DataTypes } from 'sequelize';
import bcryp from 'bcryptjs';
import { sequelize } from '../config/database.js';

const Usuario = sequelize.define('usuario', {
  usuarioId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
      type: DataTypes.STRING,
      allowNull: false
  },
  correo: {
      type: DataTypes.STRING,
      allowNull: false

  },
  contrasenia: {
      type: DataTypes.STRING,
      allowNull: false
  },
  activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
  },    
  token: DataTypes.STRING,
  confirmado: DataTypes.BOOLEAN
},
{
    tableName: 'usuarios'   
});

//Metodos personaliados
Usuario.prototype.verificarPassword = function(contrasenia) {
  return bcryp.compareSync(contrasenia, this.contrasenia);
};

export default Usuario;