require("dotenv").config()
const mongoose = require("mongoose");

async function connect() {
  await mongoose
    .connect(process.env.BD_MONGO)
    .then(async () => {
      console.log("Conectado a MongoDB");
      const stats = await mongoose.connection.db.command({ dbStats: 1 });
      //console.log("Estadísticas de la base de datos:", stats);
      console.log(`Tamaño de los datos: ${stats.dataSize} bytes`);
      console.log(`Tamaño de almacenamiento reservado: ${stats.storageSize} bytes`);
      console.log(`Tamaño total: ${stats.totalSize} bytes`);
    })
    .catch((err) => console.log(err));
}
module.exports = connect;