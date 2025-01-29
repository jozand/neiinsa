import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const Pedidos = sequelize.define(
  'pedidos',
  {
    pedidoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreProveedor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    precioTotal: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false,
    },
    cantidadTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    finalizado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'pedidos',
    hooks: {
      ...baseModelHooks(),
    },
  }
)

export default Pedidos
