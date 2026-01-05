# Routes WikiBouquin - MVP

## Routes Frontend (React Router)

### 🌐 Routes publiques
*Accessibles sans authentification*

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil avec recherche de livres |
| `/register` | Création de compte |
| `/login` | Connexion |
| `/search?q={query}` | Résultats de recherche par nom, auteur ou ISBN |
| `/book/:isbn` | Détail d'un livre (par ISBN) |
| `/user/:username` | Profil public d'un utilisateur |

### 🔒 Routes privées
*Nécessitent une authentification*

| Route | Description |
|-------|-------------|
| `/profile/password` | Changement de mot de passe |
| `/collection` | Ma collection de livres |

### 👑 Routes administrateur
*Nécessitent le rôle admin*

| Route | Description |
|-------|-------------|
| `/admin/users/:id/password` | Modification du mot de passe d'un utilisateur |
| `/admin/users/:id/profile` | Modification du nom de profil d'un utilisateur |

---

## 🔌 API REST Endpoints - MVP

### 📋 Table des matières API
- [🔐 Authentification](#authentification)
- [👤 Profils utilisateurs](#profils-utilisateurs)  
- [📚 Recherche de livres](#recherche-de-livres)
- [📖 Gestion des collections](#gestion-des-collections)
- [⚙️ Administration](#administration)

---

### 🔐 Authentification

#### Création de compte
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse",
  "username": "nom_utilisateur"
}

Response 201:
{
  "success": true,
  "message": "Compte créé avec succès",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "nom_utilisateur",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

#### Connexion
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse"
}

Response 200:
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "nom_utilisateur",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

#### Déconnexion
```http
POST /auth/logout
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

### 👤 Profils utilisateurs

#### Consulter un profil public
```http
GET /users/:username

Response 200:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "nom_utilisateur",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "publicBooksCount": 25
    }
  }
}
```

#### Modifier son mot de passe
```http
PUT /users/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "ancien_mot_de_passe",
  "newPassword": "nouveau_mot_de_passe"
}

Response 200:
{
  "success": true,
  "message": "Mot de passe modifié avec succès"
}
```

---

### 📚 Recherche de livres

#### Rechercher des livres
```http
GET /books/search?q={query}&page=1&limit=20

Response 200:
{
  "success": true,
  "data": {
    "books": [
      {
        "isbn": "9001708528",
        "title": "Le Petit Prince",
        "author": "Antoine de Saint-Exupéry",
        "publisher": "Gallimard",
        "publishedDate": "1943",
        "description": "Un conte poétique et philosophique...",
        "cover": "https://covers.example.com/cover.jpg",
        "pageCount": 96
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "limit": 20
    }
  }
}
```

#### Détail d'un livre
```http
GET /books/:isbn

Response 200:
{
  "success": true,
  "data": {
    "book": {
      "isbn": "9001708528",
      "title": "Le Petit Prince",
      "author": "Antoine de Saint-Exupéry",
      "publisher": "Gallimard",
      "publishedDate": "1943",
      "description": "Un conte poétique et philosophique...",
      "cover": "https://covers.example.com/cover.jpg",
      "pageCount": 100,
      "categories": ["Fiction", "Jeunesse"],
      "language": "fr"
    }
  }
}
```

---

### 📖 Gestion des collections

#### Ma collection personnelle
```http
GET /collections/my
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": {
    "collection": [
      {
        "id": 1,
        "isbn": "978-2-123456-78-9",
        "title": "Le Petit Prince",
        "author": "Antoine de Saint-Exupéry",
        "cover": "https://covers.example.com/cover.jpg",
        "isPublic": true,
        "addedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "totalBooks": 1
  }
}
```

#### Collection publique d'un utilisateur
```http
GET /collections/user/:username

Response 200:
{
  "success": true,
  "data": {
    "user": {
      "username": "nom_utilisateur"
    },
    "collection": [
      {
        "isbn": "9001708528",
        "title": "Le Petit Prince",
        "author": "Antoine de Saint-Exupéry",
        "cover": "https://covers.example.com/cover.jpg",
        "addedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "totalBooks": 1
  }
}
```

#### Ajouter un livre à sa collection
```http
POST /collections/books
Authorization: Bearer {token}
Content-Type: application/json

{
  "isbn": "9001708528",
  "isPublic": true
}

Response 201:
{
  "success": true,
  "message": "Livre ajouté à la collection",
  "data": {
    "collectionItem": {
      "id": 1,
      "isbn": "99001708528",
      "isPublic": true,
      "addedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
#### Modifier la visibilité d'un livre
```http
PUT /collections/books/:isbn
Authorization: Bearer {token}
Content-Type: application/json

{
  "isPublic": false
}

Response 200:
{
  "success": true,
  "message": "Visibilité du livre mise à jour"
}
```

#### Supprimer un livre de sa collection
```http
DELETE /collections/books/:isbn
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Livre retiré de la collection"
}
```

---

### ⚙️ Administration
*Réservé aux administrateurs*

#### Modifier le mot de passe d'un utilisateur
```http
PUT /admin/users/:id/password
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "newPassword": "nouveau_mot_de_passe"
}

Response 200:
{
  "success": true,
  "message": "Mot de passe utilisateur modifié"
}
```

#### Modifier le profil d'un utilisateur
```http
PUT /admin/users/:id/profile
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "username": "nouveau_nom"
}

Response 200:
{
  "success": true,
  "message": "Profil utilisateur modifié"
}
```

---

## ⚠️ Codes d'erreur standardisés

```http
400 Bad Request
{
  "success": false,
  "message": "Données invalides",
  "errors": [
    {
      "field": "email",
      "message": "Format d'email invalide"
    }
  ]
}

401 Unauthorized
{
  "success": false,
  "message": "Token d'authentification requis"
}

403 Forbidden
{
  "success": false,
  "message": "Permissions insuffisantes"
}

404 Not Found
{
  "success": false,
  "message": "Ressource non trouvée"
}

409 Conflict
{
  "success": false,
  "message": "Email déjà utilisé"
}

500 Internal Server Error
{
  "success": false,
  "message": "Erreur interne du serveur"
}
```

---

## 🔒 Sécurité et authentification

### Headers requis
```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### Validation des données
- Toutes les entrées utilisateur sont validées
- Protection contre les injections SQL
- Échappement des caractères HTML
- Validation des ISBN au format ISBN-10