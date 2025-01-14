import { DAO } from "../DAO/DAO";
import { Project } from "../Types/project";

export class ProjectModel {
  private projectDao: DAO<Project>; 

  constructor() {
    this.projectDao = new DAO('projects');
  }
  
  public createProject(project: Project, callback: (error: Error | null, insertId?: number) => void) : void {
    return this.projectDao.create(project, callback);
  }

  public findProject(where: string, select: string = "*"): Promise<Project[]> {
    return  this.projectDao.find(where, select);
  }

  public findById(id: number, select: string = "*"): Promise<Project[]> {
    return this.projectDao.findById(id, select);
  }

  public updateProject(id: number, project: Partial<Project>, callback: (error: Error | null, affectedRows?: number) => void): void {
    return this.projectDao.update(id, project, callback)
  }
  
  public deleteProject(id: number,  callback: (error: Error | null, affectedRows?: number) => void) {
    return this.projectDao.delete(id, callback);
  }
}