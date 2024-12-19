import { DB } from "../DB/DB";
import { ResultSetHeader } from "mysql2";

export class DAO<T> {
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    /**
     * Insère un nouvel enregistrement dans la table associée à cette instance.
     *
     * Cette méthode initialise la connexion à la base de données (si ce n'est pas déjà fait), 
     * insère les données fournies sous forme d'objet dans la table, et retourne l'ID de l'enregistrement 
     * inséré via un callback.
     *
     * @param {T} item - L'objet contenant les données à insérer dans la base de données.
     *                  Chaque clé de l'objet correspond à une colonne de la table.
     * @param {(error: Error | null, insertId?: number) => void} callback - Une fonction de rappel utilisée pour gérer
     *                  le résultat de l'opération. Elle prend deux arguments :
     *                  - `error` : une instance d'Error si une erreur se produit, ou `null` si l'opération réussit.
     *                  - `insertId` : l'ID de l'enregistrement inséré, uniquement défini si l'opération réussit.
     *
     * @throws {Error} Peut lever une exception si la connexion à la base de données n'est pas initialisée correctement 
     *                 ou si une autre erreur non gérée survient.
     */
    public create(item: T, callback: (error: Error | null, insertId?: number) => void): void {
        DB.init();
        const db = DB.getDb();
        const queryString: string = `INSERT INTO cx__${this.tableName} SET ?`;
        db.query(queryString, item, (error, result) => {
            if (error) {
                return callback(error);
            }
            const { insertId } = result as ResultSetHeader;
            callback(null, insertId);
        });
        DB.close();
    }

    /**
     * Recherche des enregistrements dans la table en fonction des conditions spécifiées.
     *
     * Cette méthode exécute une requête SQL de type `SELECT` et retourne les résultats 
     * sous forme d'un tableau d'objets correspondant au type générique `T`. 
     * Elle utilise une promesse pour gérer les résultats ou les erreurs.
     *
     * @param {string} where - Une clause SQL `WHERE` définissant les conditions de filtrage des résultats.
     * @param {string} [select='*'] - Une liste des colonnes à sélectionner, séparées par des virgules.
     *                                Par défaut, sélectionne toutes les colonnes (`'*'`).
     * @param {string} [queryString] - Une requête SQL complète à exécuter (Pour gérer les jointures). Si fournie, elle remplace la requête
     * 
     * @returns {Promise<T[]>} Une promesse résolue avec un tableau d'objets de type `T` représentant les résultats de la requête.
     *                         Si une erreur survient, la promesse est rejetée avec l'erreur correspondante.
     *
     * @throws {Error} Peut lever une exception si la connexion à la base de données échoue ou si une autre erreur 
     *                 non gérée survient.
     */
    public find(where: string, select: string = '*', queryString?: string): Promise<T[]> {
        DB.init();
        const db = DB.getDb();
        const query: string = queryString || `SELECT ${select} FROM cx__${this.tableName} ${where}`;        
        
        const result = new Promise<T[]>((resolve, reject) => {
            db.query(query, (error, results) => {
                if (error) {                    
                    reject(error);
                } else {
                    resolve(results as T[]);
                }
            });
        });
        DB.close();
        return result;
    }

    /**
     * Recherche un ou plusieurs enregistrements dans la table par leur identifiant unique.
     *
     * Cette méthode exécute une requête SQL de type `SELECT` pour récupérer les données associées 
     * à un identifiant spécifique (`id`). Elle retourne les résultats sous forme d'un tableau d'objets 
     * correspondant au type générique `T`. La requête peut être personnalisée via le paramètre `queryString`.
     *
     * @param {number} id - L'identifiant unique de l'enregistrement à rechercher.
     * @param {string} [select='*'] - Une liste des colonnes à sélectionner, séparées par des virgules.
     *                                Par défaut, sélectionne toutes les colonnes (`'*'`).
     * @param {string} [queryString] - Une requête SQL complète à exécuter (Pour gérer les jointures). Si fournie, elle remplace la requête
     * 
     * @returns {Promise<T[]>} Une promesse résolue avec un tableau d'objets de type `T` représentant les résultats de la requête.
     *                         Si une erreur survient, la promesse est rejetée avec l'erreur correspondante.
     *
     * @throws {Error} Peut lever une exception si la connexion à la base de données échoue ou si une autre erreur 
     *                 non gérée survient.
     */
    public findById(id: number, select: string = '*', queryString?: string): Promise<T[]> {
        DB.init();
        const db = DB.getDb();
        const query: string = queryString || `SELECT ${select} FROM cx__${this.tableName} WHERE id_${this.tableName} = ?`;
        
        const result = new Promise<T[]>((resolve, reject) => {
            db.query(query, [id], (error, results) => {
                if (error) {                    
                    reject(error);
                } else {
                    resolve(results as T[]);
                }
            });
        });
        DB.close();
        return result;
    }

    /**
     * Met à jour un enregistrement existant dans la table en fonction de son identifiant unique.
     *
     * Cette méthode exécute une requête SQL de type `UPDATE` pour modifier les colonnes spécifiées dans l'objet `item` 
     * pour un enregistrement correspondant à l'identifiant donné (`id`). Le résultat de l'opération est transmis 
     * via un callback.
     *
     * @param {number} id - L'identifiant unique de l'enregistrement à mettre à jour.
     * @param {Partial<T>} item - Un objet contenant les colonnes et leurs nouvelles valeurs. 
     *                            Chaque clé correspond au nom d'une colonne dans la table.
     * @param {(error: Error | null, affectedRows?: number) => void} callback - Une fonction de rappel utilisée pour gérer
     *                  le résultat de l'opération. Elle prend deux arguments :
     *                  - `error` : une instance d'Error si une erreur se produit, ou `null` si l'opération réussit.
     *                  - `affectedRows` : le nombre de lignes affectées par la requête (généralement `1` si la mise à jour réussit).
     * 
     * @throws {Error} Peut lever une exception si la connexion à la base de données échoue ou si une autre erreur 
     *                 non gérée survient.
     */
    public update(id: number, item: Partial<T>, callback: (error: Error | null, affectedRows?: number) => void): void {
        DB.init();
        const db = DB.getDb();
        const queryString: string = `UPDATE cx__${this.tableName} SET ? WHERE id_${this.tableName} = ?`;
        db.query(queryString, [item, id], (error, result) => {
            if (error) {
                return callback(error);
            }

            const { affectedRows } = result as ResultSetHeader;
            callback(null, affectedRows);
        });
        DB.close();
    }

    /**
     * Supprime un enregistrement de la table en fonction de son identifiant unique.
     *
     * Cette méthode exécute une requête SQL de type `DELETE` pour supprimer un enregistrement 
     * de la table correspondant à l'identifiant donné (`id`). Le résultat de l'opération est transmis 
     * via un callback.
     *
     * @param {number} id - L'identifiant unique de l'enregistrement à supprimer.
     * @param {(error: Error | null, affectedRows?: number) => void} callback - Une fonction de rappel utilisée pour gérer
     *                  le résultat de l'opération. Elle prend deux arguments :
     *                  - `error` : une instance d'Error si une erreur se produit, ou `null` si l'opération réussit.
     *                  - `affectedRows` : le nombre de lignes affectées par la requête, généralement `1` si la suppression réussit.
     * 
     * @throws {Error} Peut lever une exception si la connexion à la base de données échoue ou si une autre erreur 
     *                 non gérée survient.
     */
    public delete(id: number, callback: (error: Error | null, affectedRows?: number) => void): void {
        DB.init();
        const db = DB.getDb();
        const query: string = `DELETE FROM cx__${this.tableName} WHERE id_${this.tableName} = ?`;
        db.query(query, [id], (error, result) => {
            if (error) {
                return callback(error);
            }

            const { affectedRows } = result as ResultSetHeader;
            callback(null, affectedRows);
        });
        DB.close();
    }
}