import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Navbar
import Mainnav from "./component/mainnav";
import Navbar from "./component/topnavbar";

// Home Components
import Hero from "./component/Hero";
import MarqueeSection from "./component/MarqueeSection";
import Category from "./component/Category";
import About from "./component/about";
import History from "./component/History";
import Hours from "./component/Hours";
import Testimonials from "./component/Testimonials";
import Contact from "./component/Contact";
import Footer from "./component/Footer";

// Authentication
import Register from "./component/Register";
import Login from "./component/login";
import Profile from "./component/Profile";

// Cart, Wishlist & Products
import Cart from "./component/Cart";
import Wishlist from "./component/Wishlist";
import Products from "./component/Products";
import ProductDetails from "./component/ProductDetails";
import Variant from "./component/Variant";
import Checkout from "./component/Checkout";
import Orders from "./component/Orders.jsx";

// ==========================================
// HOME
// ==========================================

function Home() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <Hero />
      <MarqueeSection />
      <About />
      <Category />
      <History />
      <Hours />
      <Testimonials />
      <Contact />

      <Footer />
    </>
  );
}

// ==========================================
// REGISTER
// ==========================================

function RegisterPage() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <Register />

      <Footer />
    </>
  );
}

// ==========================================
// LOGIN
// ==========================================

function LoginPage() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <Login />

      <Footer />
    </>
  );
}

// ==========================================
// PROFILE
// ==========================================

function ProfilePage() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <Profile />

      <Footer />
    </>
  );
}

// ==========================================
// CART
// ==========================================

function CartPage() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <Cart />

      <Footer />
    </>
  );
}

// ==========================================
// WISHLIST
// ==========================================

function WishlistPage() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <Wishlist />

      <Footer />
    </>
  );
}

// ==========================================
// PRODUCTS
// ==========================================

function ProductsPage() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <Products />

      <Footer />
    </>
  );
}

// ==========================================
// PRODUCT DETAILS
// ==========================================

function ProductDetailsPage() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <ProductDetails />

      <Footer />
    </>
  );
}

// ==========================================
// VARIANTS
// ==========================================

function VariantPage() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <Variant />

      <Footer />
    </>
  );
}

// ==========================================
// CATEGORY
// ==========================================

function CategoryPage() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <Category />

      <Footer />
    </>
  );
}

// ==========================================
// CHECKOUT
// ==========================================

function CheckoutPage() {
  return (
    <>
      <Navbar />
      <Mainnav />

      <Checkout />

      <Footer />
    </>
  );
}

// ==========================================
// APP
// ==========================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* AUTH */}

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        {/* CART */}

        <Route
          path="/cart"
          element={<CartPage />}
        />

        {/* WISHLIST */}

        <Route
          path="/wishlist"
          element={<WishlistPage />}
        />

        {/* PRODUCTS */}

        <Route
          path="/products"
          element={<ProductsPage />}
        />

        {/* PRODUCT DETAILS */}

        <Route
          path="/product/:id"
          element={<ProductDetailsPage />}
        />

        {/* PRODUCT VARIANTS */}

        <Route
          path="/product/:id/variants"
          element={<VariantPage />}
        />

        {/* CATEGORY */}

        <Route
          path="/category"
          element={<CategoryPage />}
        />

        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />

        {/* ORDERS */}

        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* 404 */}

        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <h2>
                Page Not Found
              </h2>

              <p>
                The page you are looking for
                does not exist.
              </p>
            </div>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
