import { DAO } from "../DAO/DAO";
import bcrypt from 'bcrypt';

export class Security {

    /**
     * Vérifie de manière asynchrone si une adresse e-mail existe dans la table "users".
     *
     * @param {string} email - L'adresse e-mail à vérifier.
     * @returns {Promise<boolean>} - Une promesse qui retourne `true` si l'adresse e-mail existe, sinon `false`.
     * 
     * @throws {Error} - Lève une erreur en cas de problème lors de l'exécution.
     *
     * Exemple d'utilisation :
     * ```
     * const emailExiste = await checkEmail('exemple@exemple.com');
     * console.log(emailExiste); // true ou false
     * ```
     */
    public static async checkEmail(email: string): Promise<boolean> {
        try {
            const dao = new DAO('users');
            const where = `WHERE email = '${email}'`;
            const results = await dao.find(where, '"email"');
            
            return results.length > 0; 
        } catch (error) {
            console.error('Problem checking email:', error);
            throw new Error('Problem checking email');
        }
    }

    /**
     * Hache de manière asynchrone un mot de passe en utilisant bcrypt.
     *
     * @param {string} password - Le mot de passe à hacher.
     * @returns {Promise<string>} - Une promesse qui retourne le hash du mot de passe.
     * 
     * @throws {Error} - Lève une erreur si un problème survient lors du hachage.
     *
     * Remarque :
     * - Le nombre de "rounds" pour le sel est défini par la variable d'environnement `SALT`.
     * 
     * Exemple d'utilisation :
     * ```
     * const hash = await hashPassword('monMotDePasse');
     * console.log(hash); // Hash du mot de passe
     * ```
     */
    public static async hashPassword(password:string): Promise<string> {
        try {
           const passwordHash = await bcrypt.hash(password, Number(process.env.SALT))
           return passwordHash;
        } catch (error) {
            throw new Error('Problem hash');
        }
    }
}