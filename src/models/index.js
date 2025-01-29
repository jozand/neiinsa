
import Usuario from './Usuario.js'
import Cliente from './Cliente.js'
import Departamento from './Departamento.js'
import Municipio from './Municipio.js'
import Marcas from "./Marcas.js"
import Productos from "./Productos.js"
import Pedidos from "./Pedidos.js"
import PedidosDetalle from "./PedidosDetalle.js"
import Inventarios from "./Inventarios.js"
import Ventas from "./Ventas.js"
import VentasDetalle from "./VentasDetalle.js"
import ParametroTipo from './ParametroTipo.js'
import Parametro from './Parametro.js'
import ParametroValor from "./ParametroValor.js";

Municipio.belongsTo(Departamento, { foreignKey: 'departamentoId' , as: 'municipios' })

Cliente.belongsTo(Departamento, { foreignKey:  'departamentoId'})
Cliente.belongsTo(Municipio, { foreignKey:  'municipioId' })

Productos.belongsTo(Marcas, { foreignKey: 'marcaId' })
Marcas.hasMany(Productos, { foreignKey: 'marcaId' })

Pedidos.hasMany(PedidosDetalle, { foreignKey: 'pedidoId' })
PedidosDetalle.belongsTo(Pedidos, { foreignKey: 'pedidoId' })

PedidosDetalle.belongsTo(Productos, { foreignKey: 'productoId' })
Productos.hasMany(PedidosDetalle, { foreignKey: 'productoId' })

Inventarios.belongsTo(Productos, { foreignKey: 'productoId' })

Ventas.belongsTo(Cliente, { foreignKey: 'clienteId' })
Ventas.hasMany(VentasDetalle, { foreignKey: 'ventaId'});

Ventas.belongsTo(Parametro, { as: 'pagoParametro', foreignKey: 'pagoId' })
Ventas.belongsTo(Parametro, { as: 'compraParametro', foreignKey: 'compraId' })
Ventas.belongsTo(Parametro, { as: 'estadoParametro', foreignKey: 'estadoId' })

Parametro.hasMany(Ventas, { foreignKey: 'pagoId', as: 'ventasPago' })
Parametro.hasMany(Ventas, { foreignKey: 'compraId', as: 'VentasCompra' })
Parametro.hasMany(Ventas, { foreignKey: 'estadoId', as: 'guiasEstado' })

VentasDetalle.belongsTo(Ventas, { foreignKey: 'ventaId' })
VentasDetalle.belongsTo(Productos, { foreignKey: 'productoId' })

Parametro.belongsTo(ParametroTipo, { foreignKey: 'parametroTipoId' })

ParametroValor.belongsTo(Parametro, {foreignKey: 'parametroId'})

export { 
    Usuario,
    Cliente,
    Departamento,
    Municipio,
    Marcas,
    Productos,
    Pedidos,
    PedidosDetalle,
    Inventarios,
    Ventas,
    VentasDetalle,
    ParametroTipo,
    Parametro,
    ParametroValor
}