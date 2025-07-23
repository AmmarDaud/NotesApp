import express from "express";
import dotenv from "dotenv";
import db from "./config/connection.js";
import usersRouter from "./routes/users.js";
import router from "./routes/notes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/notes", router);

db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
