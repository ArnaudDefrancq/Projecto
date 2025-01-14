import { DAO } from "../DAO/DAO";
import { Task } from "../Types/task";

export class TaskModel {
  private taskDao: DAO<Task>; 

  constructor() {
    this.taskDao = new DAO('tasks');
  }
  
  public createTask(task: Task, callback: (error: Error | null, insertId?: number) => void) : void {
    return this.taskDao.create(task, callback);
  }

  public findTask(where: string, select: string = "*"): Promise<Task[]> {
    return  this.taskDao.find(where, select);
  }

  public findById(id: number, select: string = "*"): Promise<Task[]> {
    return this.taskDao.findById(id, select);
  }

  public updateTask(id: number, task: Partial<Task>, callback: (error: Error | null, affectedRows?: number) => void): void {
    return this.taskDao.update(id, task, callback)
  }
  
  public deleteTask(id: number,  callback: (error: Error | null, affectedRows?: number) => void) {
    return this.taskDao.delete(id, callback);
  }
}