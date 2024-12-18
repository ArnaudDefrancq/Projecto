export interface Task {
    id_task: number,
    name: string,
    content: string,   
    date_start: number,
    date_end: number,
    id_taskStatus: number,
    id_user: number,
    id_project: number
}