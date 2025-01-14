import { DAO } from "../DAO/DAO";
import { Participate } from "../Types/participate";

export class ParticipateModel {
  private participateDao: DAO<Participate>; 

  constructor() {
    this.participateDao = new DAO('participates');
  }
  
  public createParticipate(participate: Participate, callback: (error: Error | null, insertId?: number) => void) : void {
    return this.participateDao.create(participate, callback);
  }

  public findParticipate(where: string, select: string = "*"): Promise<Participate[]> {
    return  this.participateDao.find(where, select);
  }

  public findById(id: number, select: string = "*"): Promise<Participate[]> {
    return this.participateDao.findById(id, select);
  }

  public updateParticipate(id: number, participate: Partial<Participate>, callback: (error: Error | null, affectedRows?: number) => void): void {
    return this.participateDao.update(id, participate, callback)
  }
  
  public deleteParticipate(id: number,  callback: (error: Error | null, affectedRows?: number) => void) {
    return this.participateDao.delete(id, callback);
  }
}