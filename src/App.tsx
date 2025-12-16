
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-galaxy-gradient">
                <Routes>
                  {/* Admin routes - no navbar */}
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin/*" element={<Admin />} />
                  
                  {/* Regular routes with navbar */}
                  <Route path="/" element={
                    <>
                      <Navbar />
                      <main className="relative z-10">
                        <Home />
                      </main>
                    </>
                  } />
                  <Route path="/shop" element={
                    <>
                      <Navbar />
                      <main className="relative z-10">
                        <Shop />
                      </main>
                    </>
                  } />
                  <Route path="/product/:id" element={
                    <>
                      <Navbar />
                      <main className="relative z-10">
                        <ProductDetail />
                      </main>
                    </>
                  } />
                  <Route path="/cart" element={
                    <>
                      <Navbar />
                      <main className="relative z-10">
                        <Cart />
                      </main>
                    </>
                  } />
                  <Route path="/profile" element={
                    <>
                      <Navbar />
                      <main className="relative z-10">
                        <Profile />
                      </main>
                    </>
                  } />
                  <Route path="/orders" element={
                    <>
                      <Navbar />
                      <main className="relative z-10">
                        <Orders />
                      </main>
                    </>
                  } />
                  <Route path="/wishlist" element={
                    <>
                      <Navbar />
                      <main className="relative z-10">
                        <Wishlist />
                      </main>
                    </>
                  } />
                  <Route path="/about" element={
                    <>
                      <Navbar />
                      <main className="relative z-10">
                        <About />
                      </main>
                    </>
                  } />
                  <Route path="/contact" element={
                    <>
                      <Navbar />
                      <main className="relative z-10">
                        <Contact />
                      </main>
                    </>
                  } />
                  <Route path="*" element={
                    <>
                      <Navbar />
                      <main className="relative z-10">
                        <NotFound />
                      </main>
                    </>
                  } />
                </Routes>
              </div>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
