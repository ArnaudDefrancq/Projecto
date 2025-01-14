import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRouter from './Routes/userRouter';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT_SERVER;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(express.json());

app.use('/user', userRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});