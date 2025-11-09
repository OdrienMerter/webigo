<div align="center">
  <h1>🌐 Webigo — Agence Digitale</h1>
  <p><em>Des sites web modernes, performants et sur mesure pour commerces, artisans et entreprises</em></p>
  
  ![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat&logo=typescript)
  ![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat&logo=vite)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CDN-06B6D4?style=flat&logo=tailwindcss)
</div>

---

## 📋 À Propos

**Webigo** est une application web moderne présentant les services d'une agence digitale spécialisée dans la création de sites internet. Cette Single Page Application (SPA) offre une expérience utilisateur fluide avec un design sombre néon, des animations progressives et un carrousel 3D immersif.

### 🎯 Mission
Transformer la présence digitale des commerces, artisans et entreprises en sites web qui attirent, convertissent et fidélisent.

---

## ✨ Fonctionnalités

### 🎨 Design & UX
- **Thème sombre néon** avec couleurs indigo/violet
- **Animations progressives** déclenchées par l'IntersectionObserver
- **Carrousel 3D** avec transformations CSS pour présenter les projets
- **Design responsive** optimisé mobile, tablette et desktop
- **Effets visuels** : ombres néon, hover states, transitions fluides

### 🧭 Navigation
- **Navigation hash-based** (`/#/page`) pour une SPA complète
- **Header sticky** avec effet backdrop blur au scroll
- **Menu mobile** avec overlay plein écran
- **Sous-menu dropdown** "Qui sommes-nous" (Desktop)
- **Indicateur de section active** dans la navigation
- **Bouton scroll-to-top** animé

### 📄 Pages & Sections

#### Page d'Accueil (`/#/`)
- [`Hero.tsx`](components/Hero.tsx) : Bannière avec titre, CTA et carrousel 3D
- [`About.tsx`](components/About.tsx) : Histoire et vision avec animation SVG
- [`WhyChooseUs.tsx`](components/WhyChooseUs.tsx) : 3 arguments différenciants
- [`Testimonials.tsx`](components/Testimonials.tsx) : Témoignages clients
- [`Services.tsx`](components/Services.tsx) : Liste des 4 services principaux
- [`Contact.tsx`](components/Contact.tsx) : CTA vers le formulaire de devis

#### Pages Dédiées
- **Offres** (`/#/offres`) : [`Offers.tsx`](components/Offers.tsx) - 3 formules tarifaires avec sélection
- **Projets** (`/#/projets`) : [`Projects.tsx`](components/Projects.tsx) - Galerie de 6 projets
- **Devis** (`/#/devis`) : [`Quote.tsx`](components/Quote.tsx) - Formulaire de demande de devis

### 📝 Formulaire de Devis
- **Validation complète** (nom, email, description min 10 caractères)
- **États de soumission** : idle, loading, success, error
- **Pré-remplissage** depuis les offres (paramètre `?offre=...`)
- **Endpoint API** : `POST http://localhost:3001/api/devis`
- **Retours visuels** pour l'utilisateur

---

## 🏗️ Structure du Projet

```
webigo/
├── index.html              # Point d'entrée HTML + meta SEO
├── index.tsx               # Point d'entrée React
├── App.tsx                 # Router hash + layout global
├── vite.config.ts          # Configuration Vite
├── tsconfig.json           # Configuration TypeScript
├── package.json            # Dépendances
├── metadata.json           # Métadonnées du projet
└── components/
    ├── Header.tsx          # Navigation principale
    ├── HomePage.tsx        # Agrégation des sections d'accueil
    ├── Hero.tsx            # Section hero + carrousel
    ├── Carousel3D.tsx      # Carrousel 3D personnalisé
    ├── About.tsx           # Section à propos
    ├── WhyChooseUs.tsx     # Arguments de vente
    ├── Testimonials.tsx    # Témoignages
    ├── Services.tsx        # Services + icônes
    ├── ServiceIcons.tsx    # Icônes SVG des services
    ├── Projects.tsx        # Galerie de projets
    ├── Offers.tsx          # Offres & tarifs
    ├── Quote.tsx           # Formulaire de devis
    ├── Contact.tsx         # Section contact
    ├── SectionTitle.tsx    # Composant titre réutilisable
    └── Logo.tsx            # Logo SVG animé
```

---

## 🚀 Installation & Lancement

### Prérequis
- **Node.js** 18+ 
- **npm** ou **yarn**

### Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd webigo

# Installer les dépendances
npm install
```

### Développement

```bash
# Lancer le serveur de développement
npm run dev

# Ouvre automatiquement sur http://localhost:3000
```

### Production

```bash
# Créer le build de production
npm run build

# Prévisualiser le build
npm run preview
```

Le dossier `dist/` contiendra les fichiers statiques optimisés.

---

## 🔌 Backend (Formulaire de Devis)

Le formulaire de devis envoie les données à `http://localhost:3001/api/devis`.

### Exemple de serveur Node.js/Express

```js
// server.js
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/devis', (req, res) => {
  const { name, email, projectType, projectDescription } = req.body;
  
  console.log('📩 Nouveau devis reçu:', {
    name,
    email,
    projectType,
    description: projectDescription
  });

  // TODO: Envoyer un email, sauvegarder en BDD, etc.

  res.json({ 
    ok: true, 
    message: 'Devis enregistré avec succès' 
  });
});

app.listen(3001, () => {
  console.log('🚀 Serveur backend sur http://localhost:3001');
});
```

```bash
# Lancer le serveur backend
node server.js
```

---

## 🎨 Personnalisation

### Modifier les Couleurs
Les couleurs principales sont définies dans les classes Tailwind (actuellement via CDN) :
- `indigo-400`, `indigo-500`, `indigo-600` : Couleur principale
- `purple-500`, `purple-600` : Couleur secondaire
- `gray-800`, `gray-900` : Arrière-plans

Pour utiliser Tailwind en mode build avec configuration personnalisée, voir [Configuration Tailwind](#configuration-tailwind-optionnelle).

### Modifier le Contenu

| Élément | Fichier | Variable/Section |
|---------|---------|------------------|
| Offres & tarifs | [`Offers.tsx`](components/Offers.tsx) | Tableau `offers` |
| Projets | [`Projects.tsx`](components/Projects.tsx) | Tableau `projects` |
| Services | [`Services.tsx`](components/Services.tsx) | Tableau `services` |
| Témoignages | [`Testimonials.tsx`](components/Testimonials.tsx) | Tableau `testimonials` |
| Coordonnées | [`Header.tsx`](components/Header.tsx), [`Contact.tsx`](components/Contact.tsx), [`Quote.tsx`](components/Quote.tsx) | Liens email/tél |

### Modifier l'Endpoint du Formulaire

Dans [`Quote.tsx`](components/Quote.tsx), ligne ~88 :
```tsx
const response = await fetch('http://localhost:3001/api/devis', {
  // Remplacer par votre URL de production
```

---

## 📦 Technologies

| Catégorie | Technologie | Rôle |
|-----------|-------------|------|
| **Framework** | [React 19](https://react.dev/) | Bibliothèque UI |
| **Langage** | [TypeScript 5.8](https://www.typescriptlang.org/) | Typage statique |
| **Build** | [Vite 6.2](https://vitejs.dev/) | Bundler ultra-rapide |
| **Styles** | [Tailwind CSS](https://tailwindcss.com/) (CDN) | Framework CSS utilitaire |
| **Animations** | IntersectionObserver + CSS3 | Animations au scroll |
| **Navigation** | Hash-based routing | Navigation SPA |

---

## 🔧 Configuration Tailwind (Optionnelle)

Pour passer du CDN à une installation locale avec purge CSS :

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**`tailwind.config.js`** :
```js
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // indigo-500
        secondary: '#8b5cf6', // purple-500
      }
    },
  },
  plugins: [],
}
```

**`index.css`** :
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Retirer la ligne CDN de [`index.html`](index.html) et importer `index.css` dans [`index.tsx`](index.tsx).

---

## 🌍 Déploiement

### Plateformes Recommandées

#### Netlify
```bash
npm run build
# Glisser-déposer le dossier dist/ sur Netlify
```

**`netlify.toml`** :
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel
```bash
vercel --prod
```

#### GitHub Pages
Mettre à jour [`vite.config.ts`](vite.config.ts) :
```ts
export default defineConfig({
  base: '/nom-du-repo/',
  // ...
});
```

---

## 🧪 Améliorations Futures

- [ ] **Tests** : Vitest + React Testing Library
- [ ] **Linting** : ESLint + Prettier
- [ ] **Accessibilité** : Audit ARIA, focus management
- [ ] **i18n** : Support multilingue (FR/EN)
- [ ] **CMS** : Intégration Strapi ou Sanity pour contenu dynamique
- [ ] **Analytics** : Google Analytics / Matomo
- [ ] **Performance** : Lazy loading images, code splitting
- [ ] **Backend complet** : API REST + base de données
- [ ] **Email** : Envoi automatique des devis (Nodemailer, SendGrid)
- [ ] **Blog** : Section actualités avec MDX
- [ ] **PWA** : Service Worker pour mode offline

---

## 📄 Licence

Ce projet est fourni **tel quel** à des fins de démonstration.  
Pour une utilisation commerciale, veuillez ajouter une licence appropriée (ex: MIT).

---

## 👥 Contact

**Webigo** — Votre partenaire digital

- 📧 Email : []()
- 📱 Téléphone : []()
- 🌐 Site : En développement

---

<div align="center">
  <p><em>Créé avec ❤️ par l'équipe Webigo</em></p>
  <p>React • TypeScript • Vite • Tailwind CSS</p>
</div>