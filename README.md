# Dis-moi Papa — Livre Online

Application web **React / TypeScript** pour la boutique en ligne **Dis-moi Papa** : catalogue de livres, vente d’**e-books** (PDF, EPUB) et de **versions physiques**, panier, commandes et espace d’administration.

## Fonctionnalités

### Boutique (visiteurs & clients)

- **Accueil** avec mise en avant des contenus
- **Catalogue** : grille / liste de livres, filtres (recherche, catégories)
- **Fiche livre** : détails, choix du format (e-book / physique, format de fichier si besoin)
- **Panier** persistant (contexte React) et **tunnel de commande** (utilisateur connecté)
- **Compte utilisateur** : inscription, connexion, activation de compte
- **Espace client** (connecté) : profil, **mes commandes**, **mes livres**, **lecteur** e-book (EPUB via epub.js)
- Pages **À propos**, **Auteur**, **FAQ**, **Aide**, **Contact** (dont envoi via EmailJS selon configuration)

### Administration (`/admin`)

- Tableau de bord, **catalogues**, **livres** (CRUD, détail, formulaire, prévisualisation lecture)
- **Commandes** et détail commande
- **Utilisateurs**, **paramètres**
- Connexion dédiée : `/admin/login` (routes protégées)

## Stack technique

| Élément | Détail |
|--------|--------|
| Framework | React 18, TypeScript |
| Routage | React Router v6 |
| UI | React Bootstrap, thème CSS personnalisé (`style.css`) |
| API | REST (`fetch`), JWT (access + refresh) |
| Autres | Swiper, Chart.js, SweetAlert2, EPUB.js, etc. |

L’URL de l’API est définie dans `src/api/client.ts` (voir configuration ci-dessous).

## Prérequis

- **Node.js** (LTS recommandé, ex. 18+)
- **npm** (fourni avec Node)

## Installation

```bash
git clone https://gitlab.com/exauce_umba/livre-online.git
cd livre-online
npm install
```

## Configuration

Variable d’environnement optionnelle (fichier `.env` à la racine du projet) :

```env
REACT_APP_API_BASE_URL=https://votre-api.example.com
```

Si elle est absente, le client utilise par défaut l’API configurée dans le code (`client.ts`).

## Scripts npm

| Commande | Description |
|----------|-------------|
| `npm start` | Serveur de développement (hot reload) |
| `npm run build` | Build de production dans `build/` |
| `npm test` | Tests Jest / React Testing Library |

## Structure du dépôt (aperçu)

```
src/
  api/           # Client HTTP, auth, endpoints métier
  admin/         # Layout et pages back-office
  components/    # Composants réutilisables
  context/       # Ex. CartContext (panier)
  layouts/       # Header, Footer, navigation
  pages/         # Pages publiques et espace client
  assets/        # CSS, images, polices / icônes
public/          # Fichiers statiques (ex. logo)
```

## Déploiement

Après `npm run build`, déployer le contenu du dossier **`build/`** sur votre hébergement statique (ou derrière un reverse proxy). Configurer `REACT_APP_API_BASE_URL` au moment du build pour pointer vers l’API de production.

## Licence

ISC (voir `package.json`).

---

*Projet : **dis-moi-papa** — plateforme de vente de livres en ligne.*
