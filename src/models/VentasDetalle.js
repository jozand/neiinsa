import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const VentasDetalle = sequelize.define(
  'ventas_detalle',
  {
    ventasDetalleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precioVenta: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false,
    },
    precioTotalVenta: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false,
    },
    precioCosto: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false,
    },
    precioTotalCosto: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false,
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'ventas_detalle',
    hooks: {
      ...baseModelHooks(),
    },
  }
)
export default VentasDetalle
