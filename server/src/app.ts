import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app: express.Application = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"] }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

app.use(errorHandler);

export default app;
