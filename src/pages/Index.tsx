import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import ScrollToTop2 from 'react-scroll-to-top';

// layouts
import Header from './../layouts/Header';
import Footer from './../layouts/Footer';
import ScrollToTop from './../layouts/ScrollToTop';

// Pages
import Home2 from './Home2';
import AboutUs from './AboutUs';
import Auteur from './Auteur';
import MyProfile from './MyProfile';
import MyBooks from './MyBooks';
import Faq from './Faq';
import HelpDesk from './HelpDesk';
// import Pricing from './Pricing';
// import PrivacyPolicy from './PrivacyPolicy';
import BooksGridView from './BooksGridView';
import ShopList from './ShopList';
import BooksGridViewSidebar from './BooksGridViewSidebar';
import BooksListViewSidebar from './BooksListViewSidebar';
import ShopCart from './ShopCart';
// import Wishlist from './Wishlist';
import Login from './Login';
import Registration from './Registration';
import ShopCheckout from './ShopCheckout';
import ShopDetail from './ShopDetail';
import ContactUs from './ContactUs';
import ActivateAccount from './ActivateAccount';
import ProtectedRoute from '../components/ProtectedRoute';
import BookReader from './BookReader';

import ErrorPage from './ErrorPage';
import UnderConstruction from './UnderConstruction';
import ComingSoon from './ComingSoon';

// Admin
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/pages/AdminDashboard';
import AdminBooks from '../admin/pages/AdminBooks';
import AdminBookForm from '../admin/pages/AdminBookForm';
import AdminBookReader from '../admin/pages/AdminBookReader';
import AdminOrders from '../admin/pages/AdminOrders';
import AdminOrderDetail from '../admin/pages/AdminOrderDetail';
import AdminUsers from '../admin/pages/AdminUsers';
import AdminSettings from '../admin/pages/AdminSettings';
import AdminCatalogs from '../admin/pages/AdminCatalogs';

// images
import logo from './../assets/images/logo.png';
import { CartProvider } from '../context/CartContext';

function Index() {
  return (
    <BrowserRouter basename="/">
      <CartProvider>
      <Routes>
        <Route path="/error-404" element={<ErrorPage />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/" element={<Home2 />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="catalogues" element={<AdminCatalogs />} />
          <Route path="livres" element={<AdminBooks />} />
          <Route path="livres/nouveau" element={<AdminBookForm />} />
          <Route path="livres/:id" element={<AdminBookForm />} />
          <Route path="livres/lecture/:id" element={<AdminBookReader />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="commandes/:id" element={<AdminOrderDetail />} />
          <Route path="utilisateurs" element={<AdminUsers />} />
          <Route path="parametres" element={<AdminSettings />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/auteur" element={<Auteur />} />
          <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/my-books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="/reader/:id" element={<ProtectedRoute><BookReader /></ProtectedRoute>} />
          {/* <Route path="/services" element={<Services />} /> */}
          <Route path="/faq" element={<Faq />} />
          <Route path="/help-desk" element={<HelpDesk />} />
          {/* <Route path="/pricing" element={<Pricing />} /> */}
          {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
          <Route path="/books-grid-view" element={<BooksGridView />} />
          <Route path="/books-list" element={<ShopList />} />
          <Route
            path="/books-grid-view-sidebar"
            element={<BooksGridViewSidebar />}
          />
          <Route
            path="/books-list-view-sidebar"
            element={<BooksListViewSidebar />}
          />
          <Route path="/shop-cart" element={<ProtectedRoute><ShopCart /></ProtectedRoute>} />
          {/* <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} /> */}
          <Route path="/shop-login" element={<Login />} />
          <Route path="/activate-account" element={<ActivateAccount />} />
          <Route path="/shop-registration" element={<Registration />} />
          <Route path="/shop-checkout" element={<ProtectedRoute><ShopCheckout /></ProtectedRoute>} />
          {/* <Route path="/books-detail" element={<ShopDetail />} /> */}
          <Route path="/books-detail/:id" element={<ShopDetail />} />
          {/* <Route path="/blog-grid" element={<BlogGrid />} /> */}
          {/* <Route path="/blog-large-sidebar" element={<BlogLargeSidebar />} /> */}
          {/* <Route path="/blog-list-sidebar" element={<BlogListSidebar />} /> */}
          {/* <Route path="/blog-detail" element={<BlogDetail />} /> */}
          <Route path="/contact-us" element={<ContactUs />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ScrollToTop />
      <ScrollToTop2 className="styles_scroll-to-top__2A70v  fas fa-arrow-up scroltop" smooth />
      </CartProvider>
    </BrowserRouter>
  );
}

function MainLayout() {
  return (
    <div className="page-wraper">
      <Header />
      <Outlet />
      <Footer footerChange="style-1" logoImage={logo} />
    </div>
  );
}

export default Index;

