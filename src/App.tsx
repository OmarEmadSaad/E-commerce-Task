import { Provider } from "react-redux";
import ProductList from "./features/products/ProductList";
import { store } from "./store/store";
import CartSidebar from "./components/cart/CartSidebar";
import Header from "./components/layout/Header";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductList />
        </main>
        <CartSidebar />
      </div>
    </Provider>
  );
}

export default App;
