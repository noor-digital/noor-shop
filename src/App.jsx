import { Routes, Route, Navigate } from 'react-router-dom';
import MarketingLayout from './components/layouts/MarketingLayout.jsx';
import AuthLayout from './components/layouts/AuthLayout.jsx';
import StorefrontLayout from './components/layouts/StorefrontLayout.jsx';
import MerchantLayout from './components/layouts/MerchantLayout.jsx';
import PlatformLayout from './components/layouts/PlatformLayout.jsx';
import { Toast } from './components/ui/Toast.jsx';

// Marketing
import Landing from './pages/marketing/Landing.jsx';
import Features from './pages/marketing/Features.jsx';
import Pricing from './pages/marketing/Pricing.jsx';
import About from './pages/marketing/About.jsx';
import Contact from './pages/marketing/Contact.jsx';

// Auth
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import VerifyEmail from './pages/auth/VerifyEmail.jsx';

// Storefront
import StoreHome from './pages/storefront/StoreHome.jsx';
import StoreCategories from './pages/storefront/StoreCategories.jsx';
import StoreCatalog from './pages/storefront/StoreCatalog.jsx';
import StoreSearch from './pages/storefront/StoreSearch.jsx';
import StoreProduct from './pages/storefront/StoreProduct.jsx';
import StoreCart from './pages/storefront/StoreCart.jsx';
import StoreCheckout from './pages/storefront/StoreCheckout.jsx';
import StoreConfirmation from './pages/storefront/StoreConfirmation.jsx';
import StoreCategory from './pages/storefront/StoreCategory.jsx';

// Merchant
import MerchantDashboard from './pages/merchant/Dashboard.jsx';
import MerchantStores from './pages/merchant/Stores.jsx';
import MerchantStoreCreate from './pages/merchant/StoreCreate.jsx';
import MerchantProducts from './pages/merchant/Products.jsx';
import MerchantProductForm from './pages/merchant/ProductForm.jsx';
import MerchantCategories from './pages/merchant/Categories.jsx';
import MerchantOrders from './pages/merchant/Orders.jsx';
import MerchantOrderDetail from './pages/merchant/OrderDetail.jsx';
import MerchantCustomers from './pages/merchant/Customers.jsx';
import MerchantInventory from './pages/merchant/Inventory.jsx';
import MerchantAnalytics from './pages/merchant/Analytics.jsx';
import MerchantCustomization from './pages/merchant/Customization.jsx';
import MerchantPreview from './pages/merchant/Preview.jsx';
import MerchantDelivery from './pages/merchant/Delivery.jsx';
import MerchantSubscription from './pages/merchant/Subscription.jsx';
import MerchantSettings from './pages/merchant/Settings.jsx';

// Platform
import PlatformDashboard from './pages/platform/Dashboard.jsx';
import PlatformMerchants from './pages/platform/Merchants.jsx';
import PlatformMerchantDetail from './pages/platform/MerchantDetail.jsx';
import PlatformStores from './pages/platform/Stores.jsx';
import PlatformStoreDetail from './pages/platform/StoreDetail.jsx';
import PlatformSubscriptions from './pages/platform/Subscriptions.jsx';
import PlatformPlans from './pages/platform/Plans.jsx';
import PlatformAudit from './pages/platform/Audit.jsx';
import PlatformSettings from './pages/platform/Settings.jsx';

export default function App() {
  return (
    <>
      <Routes>
        {/* Marketing */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/fonctionnalites" element={<Features />} />
          <Route path="/tarifs" element={<Pricing />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
          <Route path="/verifier-email" element={<VerifyEmail />} />
        </Route>

        {/* Storefront */}
        <Route path="/boutique/:storeSlug" element={<StorefrontLayout />}>
          <Route index element={<StoreHome />} />
          <Route path="categories" element={<StoreCategories />} />
          <Route path="categorie/:categorySlug" element={<StoreCategory />} />
          <Route path="catalogue" element={<StoreCatalog />} />
          <Route path="recherche" element={<StoreSearch />} />
          <Route path="produit/:productSlug" element={<StoreProduct />} />
          <Route path="panier" element={<StoreCart />} />
          <Route path="commande" element={<StoreCheckout />} />
          <Route path="confirmation/:token" element={<StoreConfirmation />} />
        </Route>

        {/* Merchant */}
        <Route path="/merchant" element={<MerchantLayout />}>
          <Route index element={<MerchantDashboard />} />
          <Route path="boutiques" element={<MerchantStores />} />
          <Route path="boutiques/nouvelle" element={<MerchantStoreCreate />} />
          <Route path="produits" element={<MerchantProducts />} />
          <Route path="produits/nouveau" element={<MerchantProductForm mode="create" />} />
          <Route path="produits/:productId" element={<MerchantProductForm mode="edit" />} />
          <Route path="categories" element={<MerchantCategories />} />
          <Route path="commandes" element={<MerchantOrders />} />
          <Route path="commandes/:orderId" element={<MerchantOrderDetail />} />
          <Route path="clients" element={<MerchantCustomers />} />
          <Route path="stocks" element={<MerchantInventory />} />
          <Route path="statistiques" element={<MerchantAnalytics />} />
          <Route path="personnalisation" element={<MerchantCustomization />} />
          <Route path="apercu" element={<MerchantPreview />} />
          <Route path="livraison" element={<MerchantDelivery />} />
          <Route path="abonnement" element={<MerchantSubscription />} />
          <Route path="parametres" element={<MerchantSettings />} />
        </Route>

        {/* Platform */}
        <Route path="/platform" element={<PlatformLayout />}>
          <Route index element={<PlatformDashboard />} />
          <Route path="commercants" element={<PlatformMerchants />} />
          <Route path="commercants/:merchantId" element={<PlatformMerchantDetail />} />
          <Route path="boutiques" element={<PlatformStores />} />
          <Route path="boutiques/:storeId" element={<PlatformStoreDetail />} />
          <Route path="abonnements" element={<PlatformSubscriptions />} />
          <Route path="offres" element={<PlatformPlans />} />
          <Route path="journal" element={<PlatformAudit />} />
          <Route path="parametres" element={<PlatformSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
