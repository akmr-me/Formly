import express from "express";
import "./types/express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import path from "node:path";
import { env } from "./config/env";

const app: express.Application = express();

// Middleware
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/cover",
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),
  express.static(path.join(process.cwd(), "public/cover"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

// Routes
app.use("/api", routes);

app.use(errorHandler);

export default app;
