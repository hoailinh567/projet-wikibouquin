# Routes WikiBouquin - MVP

## Routes Frontend (React Router)

### Routes publiques
*Accessibles sans authentification*

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil avec recherche de livres |
| `/signup` | Création de compte |
| `/signin` | Connexion |
| `/research?q={query}` | Résultats de recherche par nom, auteur ou ISBN |
| `/book/:isbn` | Détail d'un livre (par ISBN) |
| `/profile/:username` | Profil public d'un utilisateur |
| `/about-us` | Page de présentation globale |
| `/new-arrival` | Les nouveautés des livres |

### Routes privées
*Nécessitent une authentification*

| Route | Description |
|-------|-------------|
| `/account` | Changement de mot de passe |
| `/edit-my-collection` | Ma collection de livres |

---

## API REST Endpoints - MVP

### Table des matières API
- [Authentification](#authentification)
- [Livres](#livres)
- [Profils utilisateurs](#profils-utilisateurs)
- [Gestion des collections](#gestion-des-collections)

> Les JWT sont stockés dans des cookies HttpOnly (`accessToken` / `refreshToken`). Les routes protégées ne nécessitent pas de header `Authorization` — le cookie est envoyé automatiquement.

---

### Authentification

#### Création de compte
```http
POST /api/signup
Content-Type: application/json

{
  "username": "nom_utilisateur",
  "email": "user@example.com",
  "password": "motdepasse",
  "confirmPassword": "motdepasse"
}

Response 201:
{
  "message": "Utilisateur créé avec succès.",
  "user": {
    "id": 1,
    "username": "nom_utilisateur",
    "email": "user@example.com"
  },
  "collection": { ... }
}

Response 409:
{ "error": "Cet email est déjà pris." }
{ "error": "Ce nom d'utilisateur est déjà pris." }
```

#### Connexion
```http
POST /api/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse"
}

Response 200:
{
  "user": {
    "id": 1,
    "username": "nom_utilisateur",
    "email": "user@example.com",
    "role_id": 1,
    "collection_ids": [1]
  }
}
// + cookies HttpOnly : accessToken (15min), refreshToken (30j)

Response 403:
{ "error": "Mot de passe incorrect." }
```

#### Rafraîchir le token
```http
POST /api/refresh
// Cookie refreshToken envoyé automatiquement

Response 200:
{ "success": true }
// + nouveau cookie accessToken (15min)

Response 401:
{ "error": "invalid refresh token" }
```

#### Déconnexion
```http
POST /api/logout

Response 200:
{ "success": true, "message": "Déconnexion réussie" }
// Cookies accessToken et refreshToken supprimés
```

#### Mon compte
```http
GET /api/account
// Cookie accessToken requis

Response 200:
{
  "id": 1,
  "username": "nom_utilisateur",
  "email": "user@example.com",
  "role_id": 1,
  "collection_ids": [1]
}
```

#### Modifier son mot de passe
```http
PATCH /api/update-password
// Cookie accessToken requis
Content-Type: application/json

{
  "currentPassword": "ancien_mot_de_passe",
  "newPassword": "nouveau_mot_de_passe",
  "confirmNewPassword": "nouveau_mot_de_passe"
}

Response 200:
{ ...utilisateur mis à jour }

Response 403:
{ "error": "Mot de passe actuel incorrect." }
```

---

### Livres

#### Rechercher des livres
```http
GET /api/search?q={query}&limit=20&offset=0

Response 200:
{
  "numFound": 100,
  "docs": [
    {
      "title": "Le Petit Prince",
      "author_name": ["Antoine de Saint-Exupéry"],
      "isbn": ["2070612759"],
      "cover_i": 12345
    }
  ]
}
```

#### Détail d'un livre par ISBN
```http
GET /api/book/:isbn

Response 200:
{
  "title": "Le Petit Prince",
  "authors": ["Antoine de Saint-Exupéry"],
  "publish_date": "1943",
  "isbn": "2070612759",
  "number_of_pages": 96,
  "cover": "https://covers.openlibrary.org/b/id/12345-L.jpg",
  "description": "Un conte poétique et philosophique..."
}

Response 404:
{ "message": "Livre avec l'ISBN {isbn} introuvable" }
```

---

### Profils utilisateurs

#### Consulter un profil public
```http
GET /api/profile/:username

Response 200:
[
  {
    "id": 1,
    "title": "Le Petit Prince",
    "cover": "https://covers.openlibrary.org/b/id/12345-L.jpg",
    "isbn": "2070612759"
  }
]

Response 404:
{ "error": "User not found" }
```

---

### Gestion des collections

#### Ma collection (privée)
```http
GET /api/edit-my-collection
// Cookie accessToken requis

Response 200:
[
  {
    "id": 1,
    "title": "Le Petit Prince",
    "cover": "https://covers.openlibrary.org/b/id/12345-L.jpg",
    "isbn": "2070612759",
    "is_visible": true
  }
]
```

#### Ajouter un livre
```http
POST /api/edit-my-collection/add
// Cookie accessToken requis
Content-Type: application/json

{
  "isbn": "2070612759",
  "collection_id": 1
}

Response 200:
{ ...livre ajouté }

Response 401:
{ "error": "no" }
```

#### Supprimer un livre
```http
DELETE /api/edit-my-collection/delete
// Cookie accessToken requis
Content-Type: application/json

{
  "isbn": "2070612759",
  "collection_id": 1
}

Response 200:
{ ...résultat suppression }
```

#### Vérifier si un livre est dans ma collection
```http
GET /api/has-book/:isbn
// Cookie accessToken requis

Response 200:
true  // ou false
```

#### Modifier la visibilité d'un livre
```http
PATCH /api/edit-my-collection/update-visibility
// Cookie accessToken requis
Content-Type: application/json

{
  "isbn": "2070612759",
  "collection_id": 1,
  "is_visible": false
}

Response 200:
{ ...collection mise à jour }
```

---

## Codes d'erreur

| Code | Signification |
|------|--------------|
| 400 | Données invalides (validation Zod) |
| 401 | Token manquant ou invalide |
| 403 | Mot de passe incorrect / accès refusé |
| 404 | Ressource non trouvée |
| 409 | Email ou username déjà utilisé |
| 500 | Erreur interne du serveur |

---

## Sécurité

- JWT stockés en cookies **HttpOnly** (inaccessibles depuis JavaScript)
- `accessToken` : durée de vie **15 minutes**
- `refreshToken` : durée de vie **30 jours**
- Mots de passe hachés avec **Argon2**
- Validation des entrées avec **Zod** avant tout traitement
- ISBN validés au format **ISBN-10**
