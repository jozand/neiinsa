import fs from 'fs';
import path from 'path';

// Ruta del archivo .env según el entorno (Railway o local)
const envPath = process.env.NODE_ENV === 'production'
  ? 'env/.env.production'
  : '.env';

// Función para cargar las variables de un archivo .env si no estamos en producción
function loadEnvFile() {
  if (process.env.NODE_ENV !== 'production' && fs.existsSync(envPath)) {
    const envData = fs.readFileSync(envPath, 'utf-8');
    const lines = envData.split('\n');

    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value && !process.env[key]) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
}

// Carga las variables de entorno en desarrollo
loadEnvFile();

// Exporta las variables de entorno para su uso en la aplicación
export const SERVER_PORT = process.env.SERVER_PORT;
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
export const MYSQLHOST = process.env.MYSQLHOST;
export const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD;
export const MYSQLPORT = process.env.MYSQLPORT;
export const MYSQLUSER = process.env.MYSQLUSER;
export const JWT_SECRET = process.env.JWT_SECRET;
