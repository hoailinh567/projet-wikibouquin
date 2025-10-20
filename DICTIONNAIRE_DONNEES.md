# Dictionnaire de données - WikiBouquin

## Vue d'ensemble

Ce document présente le dictionnaire de données du projet WikiBouquin, détaillant toutes les entités et leurs attributs basé sur le MCD défini pour le MVP (Minimum Viable Product).

---

## 📊 Entités et attributs

### 👤 Entité : `utilisateur`
*Table principale des utilisateurs de la plateforme*

| Attribut | Type | Contraintes | Description |
|----------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique de l'utilisateur |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Adresse email de l'utilisateur (login) |
| `mot_de_passe_hash` | VARCHAR(255) | NOT NULL | Mot de passe chiffré (hash) |
| `nom_profil` | VARCHAR(50) | UNIQUE, NOT NULL | Nom de profil public de l'utilisateur |
| `date_creation` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création du compte |

**Règles métier :**
- L'email doit être unique dans le système
- Le nom_profil doit être unique et servir pour les URLs publiques
- Le mot de passe doit être hashé avant stockage

---

### 📁 Entité : `collection`
*Table des collections de livres des utilisateurs*

| Attribut | Type | Contraintes | Description |
|----------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique de la collection |
| `date_creation` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création de la collection |

**Règles métier :**
- Une collection appartient à un seul utilisateur (relation 1:1 avec POSSEDER)
- Dans le MVP, chaque utilisateur a une collection unique
- Extension possible : collections multiples par utilisateur

---

### 📚 Entité : `livre`

| Attribut | Type | Contraintes | Description |
|----------|------|-------------|-------------|
| `isbn` | VARCHAR(17) | PRIMARY KEY | ISBN du livre (format ISBN-10 ou ISBN-13) |

**Note :** Toutes les autres informations (titre, auteur, éditeur, etc.) sont récupérées dynamiquement via l'API externe [OpenLibrary](https://openlibrary.org/developers/api) lors de l'affichage ou de la recherche. Elles ne sont pas stockées dans la base locale.

**Règles métier :**
- L'ISBN sert de clé primaire selon le MCD
- Seul l'ISBN est obligatoire, les autres données sont enrichies depuis l'API
- Les données proviennent de l'API OpenLibrary
- Le cache permet d'optimiser les performances

---

## 🔗 Associations (tables de liaison)

### 🏠 Association : `posseder`
*Relation 1:1 entre utilisateur et collection*

| Attribut | Type | Contraintes | Description |
|----------|------|-------------|-------------|
| `utilisateur_id` | INT | FOREIGN KEY, UNIQUE, NOT NULL | Référence vers l'utilisateur |
| `collection_id` | INT | FOREIGN KEY, UNIQUE, NOT NULL | Référence vers la collection |

**Contraintes :**
- `FOREIGN KEY(utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE`
- `FOREIGN KEY(collection_id) REFERENCES collection(id) ON DELETE CASCADE`
- `UNIQUE(utilisateur_id)` : Un utilisateur ne peut posséder qu'une collection
- `UNIQUE(collection_id)` : Une collection n'appartient qu'à un utilisateur

---

### 📖 Association : `contenir`
*Relation 0:N entre collection et livre*

| Attribut | Type | Contraintes | Description |
|----------|------|-------------|-------------|
| `collection_id` | INT | FOREIGN KEY, NOT NULL | Référence vers la collection |
| `livre_isbn` | VARCHAR(17) | FOREIGN KEY, NOT NULL | Référence vers le livre (ISBN) |
| `date_ajout` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date d'ajout du livre à la collection |
| `is_visible` | BOOLEAN | NOT NULL, DEFAULT true | Livre visible dans la collection (true = public, false = privé) |

**Contraintes :**
- `PRIMARY KEY(collection_id, livre_isbn)` : Un livre ne peut être qu'une fois dans une collection
- `FOREIGN KEY(collection_id) REFERENCES collection(id) ON DELETE CASCADE`
- `FOREIGN KEY(livre_isbn) REFERENCES livre(isbn) ON DELETE CASCADE`

**Règles métier :**
- Une collection peut contenir 0 à N livres
- Un livre peut être dans plusieurs collections (différents utilisateurs)
- Par défaut, les livres sont visibles (is_visible = true)
- La date_ajout permet de trier par ordre d'ajout

---

## 🔗 Relations entre entités

### Relations principales selon le MCD

```
utilisateur (1) ←→ (1) collection via POSSEDER
collection (1) ←→ (N) livre via CONTENIR
utilisateur ←→ livre (relation indirecte via collection)
```


- Un **utilisateur** possède **exactement 1 collection** (relation 1:1)
- Une **collection** appartient à **exactement 1 utilisateur** (relation 1:1)
- Une **collection** peut contenir **0 à N livres**
- Un **livre** peut être dans **0 à N collections** (différents utilisateurs)

---

## 🕵️‍♂️ Rôles et permissions

### Entité : `role`

| Attribut | Type | Contraintes | Description |
|----------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique du rôle |
| `nom` | VARCHAR(50) | UNIQUE, NOT NULL | Nom du rôle (ex: admin, editeur, lecteur) |
| `date_creation` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création du rôle |

**Description :**
- L'entité `role` centralise les profils fonctionnels du système. Elle est liée aux utilisateurs via l'association `AVOIR_ROLE` (MCD : AVOIR_ROLE, 11 UTILISATEUR, 1N ROLE).

### Association : `avoir_role`
*Relation 1:N entre `utilisateur` et `role`*

| Attribut | Type | Contraintes | Description |
|----------|------|-------------|-------------|
| `date_attribution` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date d'attribution du rôle |
**Contraintes et règles métier :**
- `FOREIGN KEY(utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE`
- `FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE RESTRICT`
- Un utilisateur peut avoir 0..N rôles (ex : `editeur` + `moderateur`), mais le MCD indique 1N côté ROLE, donc l'implémentation permet plusieurs rôles par utilisateur pour plus de souplesse.
- Les rôles sont gérés par des administrateurs. Certains rôles (ex: `admin`) confèrent des permissions étendues et doivent être attribués avec précaution.

- `administrateur` : accès complet (gestion des utilisateurs, gestion des rôles, modération, configuration, etc.)
- `utilisateur` : rôle standard permettant la création et gestion de sa collection personnelle et la consultation des contenus publics

## 📋 Performances

### Index

```sql
-- Table utilisateur
CREATE INDEX idx_utilisateur_email ON utilisateur(email);
CREATE INDEX idx_utilisateur_nom_profil ON utilisateur(nom_profil);

-- Table collection
CREATE INDEX idx_collection_date_creation ON collection(date_creation);

-- Table livre
CREATE INDEX idx_livre_title ON livre(title);
CREATE INDEX idx_livre_author ON livre(author);
CREATE INDEX idx_livre_cached_at ON livre(cached_at);

-- Association posseder
CREATE INDEX idx_posseder_utilisateur_id ON posseder(utilisateur_id);
CREATE INDEX idx_posseder_collection_id ON posseder(collection_id);

-- Association contenir
CREATE INDEX idx_contenir_collection_id ON contenir(collection_id);
CREATE INDEX idx_contenir_livre_isbn ON contenir(livre_isbn);
CREATE INDEX idx_contenir_is_visible ON contenir(is_visible);
CREATE INDEX idx_contenir_date_ajout ON contenir(date_ajout);
```

---

## 🛡️ Contraintes de sécurité

### Validation des données

**Entité utilisateur :**
- Email : Format email valide, longueur max 255 caractères
- mot_de_passe_hash : Hash bcrypt, jamais stocké en clair
- nom_profil : Alphanumerique + underscore, 3-50 caractères

**Entité collection :**
- id : Entier positif auto-incrémenté
- date_creation : Timestamp UTC valide

**Entité livre :**
- isbn : Format ISBN-10 ou ISBN-13 valide
- Données optionnelles : Validation si présentes

**Association contenir :**
- is_visible : BOOLEAN (true = public, false = privé)
- Contraintes d'intégrité référentielle strictes

---

## 🔄 Évolutions potentielles

### Extensions prévues post-MVP

**Modifications du MCD :**
- **utilisateur** : Ajout d'attributs role (gestion des rôles utilisateur/admin), avatar_url, updated_at
- **collection** : Ajout d'attributs nom, description, visibilite_globale
- **livre** : Enrichissement avec rating, reviews_count
- **contenir** : Ajout de reading_status, reading_progress, notes_personnelles

**Nouvelles entités possibles :**
- `admin` : Entité spécialisée pour les administrateurs
- `book_reviews` : Avis et notes des utilisateurs
- `user_follows` : Système de suivi entre utilisateurs
- `categories` : Entité séparée pour les catégories de livres

**Nouvelles associations :**
- ADMINISTRER : relation entre admin et utilisateur
- NOTER : relation entre utilisateur et livre
- SUIVRE : relation réflexive entre utilisateurs

---

## 📝 Notes techniques

### Choix techniques justifiés selon le MCD

1. **Séparation collection** : Permet l'évolution vers collections multiples
2. **ISBN comme clé primaire** : Identifiant naturel unique des livres selon le MCD
3. **Relations 1:1 utilisateur-collection** : Simplicité pour le MVP
4. **Timestamps UTC** : Gestion cohérente des fuseaux horaires

### Considérations de performance

- Index sur les colonnes de recherche fréquente selon le MCD
- Jointures optimisées entre utilisateur, collection et livre
- Pagination obligatoire pour les contenus de collection
- Cache Redis complémentaire pour les requêtes complexes
- On peut ajouter un champ pour compter le nombre de livres dans chaque collection