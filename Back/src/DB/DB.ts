import mysql, { Connection } from "mysql2";

export class DB {
    private static db: Connection | null = null;

    /**
    * Initialise la connexion à la base de données en utilisant les informations de configuration 
    * définies dans le fichier `.env`.
    *
    * Cette méthode vérifie d'abord si une connexion existe déjà. Si c'est le cas, elle affiche un avertissement 
    * dans la console et ne crée pas de nouvelle connexion. Sinon, elle initialise une connexion à la base de 
    * données MySQL avec les paramètres fournis.
    * 
    * @throws Affiche une erreur dans la console si la connexion échoue ou si l'initialisation est incorrecte.
    */
    public static init(): void {
        if (this.db) {
            console.warn('Database connection already');
            return;
        }
        try {
            this.db = mysql.createConnection({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
            this.db.connect((err) => {
                if (err) {
                    console.error('Error connection', err);
                    return;
                } 
                console.log('Connection establish successfully');
            })
        } catch (err) {
            console.error('Initialization failed: ' , err);
            return;
        }
    }

    /**
    * Retourne l'instance de connexion active à la base de données.
    *
    * Cette méthode doit être appelée après que la connexion a été initialisée avec `init()`. 
    * Si la connexion n'a pas été initialisée, elle lève une exception.
    * 
    * @returns {Connection} L'instance de connexion active à la base de données MySQL.
    * @throws {Error} Si la connexion n'est pas initialisée, une exception est levée.
    */
    public static getDb(): Connection {
        if (!this.db) {
            throw new Error('Connection not init');
        }
        return this.db;
    }

    /**
    * Ferme la connexion actuelle à la base de données.
    *
    * Si une connexion est active, cette méthode tente de la fermer proprement. En cas d'erreur, 
    * elle affiche un message d'erreur dans la console. Si aucune connexion n'est active, elle 
    * affiche un avertissement.
    * 
    * @returns {void}
    */
    public static close(): void {
        if (this.db) {
            this.db.end((err) => {
                if (err) {
                    console.error('Error closing the database:', err.message);
                } else {
                    console.log('Database connection closed.');
                }
            });
            this.db = null;
        } else {
            console.warn('No database connection to close.');
        }
    }
}