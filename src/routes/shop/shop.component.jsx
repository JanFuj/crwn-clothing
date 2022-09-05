import { Routes, Route } from "react-router-dom";
import "./shop.styles.scss";
import CategoriesPreviewComponent from "../categories-preview/categories-preview.component";
import Category from "../category/category.component";
const Shop = () => {
  return (
    <Routes>
      <Route index element={<CategoriesPreviewComponent />} />
      <Route path=":category" element={<Category />} />
    </Routes>
  );
};

export default Shop;
