import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'
import { baseModelAttributes, baseModelHooks } from './BaseModel.js'

const PedidosDetalle = sequelize.define(
  'pedidos_detalle',
  {
    pedidoDetalleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    precioCosto: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false,
    },
    precioUnitario: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalVenta: {
      type: DataTypes.VIRTUAL,
      get() {
        const venta = this.precioUnitario || 0
        const cant = this.cantidad || 0
        return venta * cant
      },
    },
    totalCosto: {
      type: DataTypes.VIRTUAL,
      get() {
        const venta = this.precioCosto || 0
        const cant = this.cantidad || 0
        return venta * cant
      },
    },
    ...baseModelAttributes(),
  },
  {
    tableName: 'pedidos_detalle',
    hooks: {
      ...baseModelHooks(),
    },
  }
)

export default PedidosDetalle
