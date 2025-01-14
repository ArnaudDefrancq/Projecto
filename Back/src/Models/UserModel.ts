import { DAO } from "../DAO/DAO";
import { User } from "../Types/user";


export class UserModel {
  private userDao: DAO<User>; 

  constructor() {
    this.userDao = new DAO('users');
  }
  
  public createUser(user: User, callback: (error: Error | null, insertId?: number) => void) : void {
    return this.userDao.create(user, callback);
  }

  public findUser(where: string, select: string = "*"): Promise<User[]> {
    return  this.userDao.find(where, select);
  }

  public findById(id: number, select: string = "*"): Promise<User[]> {
    return this.userDao.findById(id, select);
  }

  public updateUser(id: number, user: Partial<User>, callback: (error: Error | null, affectedRows?: number) => void): void {
    return this.userDao.update(id, user, callback)
  }
  
  public deleteUser(id: number,  callback: (error: Error | null, affectedRows?: number) => void) {
    return this.userDao.delete(id, callback);
  }
}