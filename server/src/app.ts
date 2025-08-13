import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import path from "node:path";

const app: express.Application = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use(helmet());
app.use(morgan("dev"));
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
