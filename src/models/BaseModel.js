import { DataTypes } from "sequelize";
import { namespace } from "../config/sequelizeContext.js";

// Función base para modelos con campos comunes
export function baseModelAttributes() {
  return {
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  };
}

// Función base para hooks comunes
export function baseModelHooks() {
  return {
    beforeValidate: (instance) => {
      const usuarioId = namespace.get("usuarioId");
      if (usuarioId) {
        instance.usuarioId = usuarioId;
      } else {
        throw new Error("El usuarioId no está disponible en el contexto");
      }
    },
  };
}
