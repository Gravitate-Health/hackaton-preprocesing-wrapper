import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { PreprocessorWrapperRouter } from "./routes/preprocessing";

const PORT = parseInt(process.env.SERVER_PORT as string) || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }))

app.use((req, res, next) => {
  console.log(`\n\n${new Date().toLocaleString()} | Method: ${req.method} | URL: ${req.originalUrl}`);
  next()
})

app.use("/", PreprocessorWrapperRouter);
app.listen(PORT, () => {
  console.log(`Hackaton preprocessing wrapper listening on port ${PORT}`);
});
