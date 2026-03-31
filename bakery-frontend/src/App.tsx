import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./features/products/context/CartContext";
import { ProductsPage } from "./features/products/pages/ProductsPage";
import PersonalizaPage from "./features/products/pages/PersonalizaPage";
import { ProductDetailPage } from "./features/products/pages/ProductDetailPage";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <main>
          <div className="bg-background w-screen h-screen p-8">
            <Routes>
              <Route path="/" element={<ProductsPage />} />
              <Route path="/personaliza" element={<PersonalizaPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
            </Routes>
          </div>
        </main>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
