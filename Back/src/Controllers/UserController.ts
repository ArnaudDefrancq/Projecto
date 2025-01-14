import { Request, Response, NextFunction } from "express";
import { Security } from "../Tools/Security";
import { UserModel } from "../Models/UserModel";
import { User } from "../Types/user";

export class UserController {
    static async signUp (req: Request, res: Response, next: NextFunction): Promise<number | any> {
        try {
            if (await Security.checkEmail(req.body.email)) {
                return res.status(409).json({error: 'Email already exists '})
            }

            const userModel = new UserModel();
            const hash: string = await Security.hashPassword(req.body.password);


            const user: User = {
                email: req.body.email,
                password: String(hash),
                pseudo: req.body.pseudo,
                id_role: 2
            };

            userModel.createUser(user, async (error, insertId) => {
                if (error) {
                    return res.status(500).json({error: 'User don\'t create'});
                }
                res.status(200).json({message: 'User create ! ' + insertId});
                return insertId;
            })
        } catch (err) {
            return res.status(500).json({ err });
        }
    }

    static async logIn (req: Request, res: Response, next: NextFunction) {}

    static async updateUser (req: Request, res: Response, next: NextFunction) {}

    static async deleteUser (req: Request, res: Response, next:  NextFunction) {}
}