export type MenuItemLink = {
  title: string;
  to: string;
};

export type MenuItemGroup = {
  title: string;
  classsChange?: string;
  content?: MenuItemLink[];
};

export type MenuItem = MenuItemLink | MenuItemGroup;

export const MenuListArray2: MenuItem[] = [
  {
    title: 'Accueil',
    to: '/',
  },
  {
    title: "L'auteur",
    to: '/auteur',
  },
  {
    title: 'À propos',
    to: '/about-us',
  },
  // {
  //   title: 'Pages',
  //   classsChange: 'sub-menu-down',
  //   content: [
  //     {
  //       title: 'Mon profil',
  //       to: '/my-profile',
  //     },
  //     {
  //       title: 'Services',
  //       to: '/services',
  //     },
  //     {
  //       title: 'FAQ',
  //       to: '/faq',
  //     },
  //     {
  //       title: 'Support',
  //       to: '/help-desk',
  //     },
  //     {
  //       title: 'Bientôt disponible',
  //       to: '/coming-soon',
  //     },
  //     {
  //       title: 'Tarifs',
  //       to: '/pricing',
  //     },
  //     {
  //       title: 'Politique de confidentialité',
  //       to: '/privacy-policy',
  //     },
  //     {
  //       title: 'En construction',
  //       to: '/under-construction',
  //     },
  //     {
  //       title: 'Erreur 404',
  //       to: '/error-404',
  //     },
  //   ],
  // },

  {
    title: 'Boutique',
    classsChange: 'sub-menu-down',
    to: '/books-grid-view',
    // content: [
    //   {
    //     title: 'Grille',
    //     to: '/books-grid-view',
    //   },
    //   {
    //     title: 'Grille avec barre latérale',
    //     to: '/books-grid-view-sidebar',
    //   },
    //   {
    //     title: 'Liste',
    //     to: '/books-list',
    //   },
    //   {
    //     title: 'Liste avec barre latérale',
    //     to: '/books-list-view-sidebar',
    //   },
    //   {
    //     title: 'Détail livre',
    //     to: '/books-detail',
    //   },
    //   {
    //     title: 'Panier',
    //     to: '/shop-cart',
    //   },
    //   {
    //     title: 'Paiement',
    //     to: '/shop-checkout',
    //   },
    //   {
    //     title: 'Favoris',
    //     to: '/wishlist',
    //   },
    //   {
    //     title: 'Connexion',
    //     to: '/shop-login',
    //   },
    //   {
    //     title: 'Inscription',
    //     to: '/shop-registration',
    //   },
    // ],
  },
  // {
  //   title: 'Blog',
  //   classsChange: 'sub-menu-down',
  //   content: [
  //     {
  //       title: 'Grille du blog',
  //       to: '/blog-grid',
  //     },
  //     {
  //       title: 'Blog grande barre latérale',
  //       to: '/blog-large-sidebar',
  //     },
  //     {
  //       title: 'Blog liste avec barre latérale',
  //       to: '/blog-list-sidebar',
  //     },
  //     {
  //       title: 'Article du blog',
  //       to: '/blog-detail',
  //     },
  //   ],
  // },
  {
    title: 'Contact',
    to: '/contact-us',
  },
];

