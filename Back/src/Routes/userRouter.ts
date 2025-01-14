import express from 'express';
import { UserController } from '../Controllers/UserController';

const userRouter = express.Router();

userRouter.post('/auth/signup', UserController.signUp);
userRouter.post('/auth/login', UserController.logIn);
userRouter.put('/:id/update', UserController.updateUser);
userRouter.delete('/:id/delete', UserController.deleteUser);

export default userRouter;
