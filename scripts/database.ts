import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseAsync('expenses.db');


db.then( databaseTable =>
    databaseTable.execAsync(`CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          amount REAL, 
          category TEXT, 
          date TEXT, 
          latitude REAL, 
          longitude REAL
        );`).then(() => {
            console.log('Table expenses créée avec succès ou existe déjà.');
          })
          .catch(error => {
            console.error('Erreur lors de la création de la table:', error);
          })
);

export default db;