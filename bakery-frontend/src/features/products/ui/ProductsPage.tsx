import { ProductsList } from "./ProductsList";
import logo from '../../../assets/logo.jpeg';

export function ProductsPage() {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
            <img src={logo} alt="Coco Limon Logo" className="w-32 mx-auto mb-6" />
            <ProductsList />
        </div>
    )
}