import { roleUser } from "./statusEnum";

export interface Participate {
    id_user: number,
    id_project: number,
    come: number,
    userRole: roleUser
}