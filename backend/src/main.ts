import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import errorMiddleware from "./middlewares/error.middleware";

const PORT = 8000

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})