import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./features/products/context/CartContext";
import { ProductsPage } from "./features/products/pages/ProductsPage";
import PersonalizaPage from "./features/products/pages/PersonalizaPage";
import { ProductDetailPage } from "./features/products/pages/ProductDetailPage";
import { PedidoPage } from "./features/pedidos/pages/PedidoPage";
import { TrackingPage } from "./features/pedidos/pages/TrackingPage";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <main>
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/personaliza" element={<PersonalizaPage />} />
            <Route path="/pedido" element={<PedidoPage />} />
            <Route path="/seguimiento/:id" element={<TrackingPage />} />
          </Routes>
        </main>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
