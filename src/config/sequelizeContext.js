import { Sequelize } from 'sequelize';
import cls from 'cls-hooked';

// Crear un namespace para el contexto
const namespace = cls.createNamespace('sequelize-context');
Sequelize.useCLS(namespace);

export { namespace };
