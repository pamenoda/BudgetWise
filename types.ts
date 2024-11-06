export interface ExpenseType {
  id: number; // Identifiant unique de la dépense (clé primaire, INTEGER AUTOINCREMENT).
  amount: number; // Montant en tant que nombre (REAL dans la DB).
  category: string; // Catégorie est une chaîne de caractères (TEXT dans la DB).
  date: string; // Date stockée sous forme de chaîne (TEXT dans la DB, généralement en format ISO).
  latitude: number; // Coordonnées géographiques en nombre (REAL dans la DB).
  longitude: number; // Coordonnées géographiques en nombre (REAL dans la DB).
}

