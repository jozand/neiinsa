import path from 'path';

export default {
  mode: 'development',
  entry: {
    selectMunicipio: './src/public/js/selectMunicipio.js',
    selectDepartamentos: './src/public/js/selectDepartamentos.js',   
    filtroClientes: './src/public/js/filtroClientes.js',
    filtroMarcas: './src/public/js/filtroMarcas.js',
    filtroProductos: './src/public/js/filtroProductos.js',
    filtroDepartamentos: './src/public/js/filtroDepartamentos.js',
    filtroMunicipios: './src/public/js/filtroMunicipios.js',
  },
  output: {   
      filename: '[name].js',
      path: path.resolve('public/js') 
  }
}