import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import cuentasRouter from "./routes/cuentas";
import categoriasRouter from "./routes/categorias";
import movimientosRouter from "./routes/movimientos";
import suscripcionesRouter from "./routes/suscripciones";
import metasRouter from "./routes/metas";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use("/api/cuentas", cuentasRouter);
app.use("/api/categorias", categoriasRouter);
app.use("/api/movimientos", movimientosRouter);
app.use("/api/suscripciones", suscripcionesRouter);
app.use("/api/metas", metasRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
