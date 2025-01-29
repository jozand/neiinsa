import { Sequelize } from 'sequelize';
import { MYSQL_DATABASE, MYSQLUSER, MYSQL_ROOT_PASSWORD, MYSQLPORT, MYSQLHOST} from './env.js';

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQLUSER, MYSQL_ROOT_PASSWORD, {
    host: MYSQLHOST,
    port: MYSQLPORT,
    dialect: 'mysql',
    dafine: {
        timestaps: true
    },
    timezone: '-06:00',
    pool: {
        max: 6,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

// Función para sincronizar los modelos
const syncDatabase = async () => {
    try {
      await sequelize.authenticate();
      console.log('Conexión exitosa a la base de datos.');    
      //await sequelize.sync({ alter: true });
      await sequelize.sync();
      console.log('Modelos sincronizados con la base de datos.');
    } catch (error) {
      console.error('Error al conectar o sincronizar la base de datos:', error);
    }
  };
  
  export { sequelize, syncDatabase };