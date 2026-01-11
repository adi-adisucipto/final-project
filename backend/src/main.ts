import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import errorMiddleware from "./middlewares/error.middleware";
import storeAdminOrderRoute from "./routes/storeAdmin.orders.route"

const PORT = 8000

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/api/store-admin/orders", storeAdminOrderRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})