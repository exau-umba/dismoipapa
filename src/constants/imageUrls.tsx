/**
 * URLs d'images : livres depuis public/livres, reste depuis le web (Unsplash, etc.)
 */

// Livres / couvertures — images locales dans public/livres
const livresBase = '/livres';
export const bookImages = [
  `${livresBase}/canard.jpg`,
  `${livresBase}/gestion_de_stock.jpg`,
  `${livresBase}/volkan.jpg`,
  `${livresBase}/canard.jpg`,
  `${livresBase}/gestion_de_stock.jpg`,
  `${livresBase}/volkan.jpg`,
  `${livresBase}/canard.jpg`,
  `${livresBase}/gestion_de_stock.jpg`,
  `${livresBase}/volkan.jpg`,
  `${livresBase}/canard.jpg`,
];

// Titres des livres (minuscules avec première lettre en majuscule)
export const bookTitles = [
  'Le canard', // Recueil de poèmes et fables
  'Gestion de stock des hydrocarbures liquides et/ou liquéfiés',
  'Volkan devait vite se marier', // Roman
];

// Tags par livre (pour affichage cohérent avec le contenu)
export const bookTags = [
  ['Poésie', 'Fables'],           // Le canard
  ['Technique', 'Énergie'],      // Gestion de stock...
  ['Roman', 'Fiction'],          // Volkan devait vite se marier
];

// Articles blog / actualités
export const blogImages = [
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1519682337053-aeb48d8af154?w=400&h=250&fit=crop',
];

// Profils / témoignages (carré)
export const profileImages = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
];

// À propos / bannières
export const aboutImages = [
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop',
];

// Arrière-plans
export const backgroundImages = {
  newsletter: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&h=600&fit=crop',
  contact: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=800&fit=crop',
  pageTitle: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1920&h=400&fit=crop',
};

// Panier / miniatures livres (petit format) — public/livres
export const cartBookImages = [
  `${livresBase}/canard.jpg`,
  `${livresBase}/gestion_de_stock.jpg`,
  `${livresBase}/volkan.jpg`,
];

// Bannières slider accueil (grand format) — public/livres
export const bannerBookImages = [
  `${livresBase}/canard.jpg`,
  `${livresBase}/gestion_de_stock.jpg`,
];
