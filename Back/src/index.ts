import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});