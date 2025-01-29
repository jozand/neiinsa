import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const Ventas = sequelize.define(
  'ventas',
  {
    ventaId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numeroVenta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fechaDeVenta: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    precioTotal: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: true,
    },
    precioTotalCosto: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: true,
    },
    cantidadTotal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    envio: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'ventas',
    hooks: {
      ...baseModelHooks(),
    },
  }
)

export default Ventas
