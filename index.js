import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import { SERVER_PORT } from './src/config/env.js';
import { syncDatabase } from './src/config/database.js';
import router from './src/routes/index.js';

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended :true}));

app.use(cookieParser());

app.use(csrf({ cookie: true }));

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.set('view engine','pug');

app.set('views', './src/views');

app.use(express.static('./public'));

app.use('/', router);

const port = SERVER_PORT;

// Sincronizar la base de datos y levantar el servidor
const startServer = async () => {
    try {
      await syncDatabase(); // Esperar a que la base de datos esté sincronizada
      app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
      });
    } catch (error) {
      console.error('Error al iniciar la aplicación:', error);
      process.exit(1); // Terminar el proceso si hay un error crítico
    }
  };
  
// Iniciar la aplicación
startServer();