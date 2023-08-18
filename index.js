import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from "morgan";
import cors from "cors";
import path from "path";

import userRoute from "./routes/userRoutes.js"
import authRoute from "./routes/authRoute.js"
import publicationRoute from "./routes/publicationRoute.js"
import jigsawRoute from "./routes/jigsawRoute.js"

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    serverSelectionTimeoutMS: 5000
  }).catch(err => console.log(err.reason));
  

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors())

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/publication", publicationRoute);
app.use("/api/jigsaw", jigsawRoute)
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build", "index.html"));
  });

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
