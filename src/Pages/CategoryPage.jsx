// import { useNavigate, useParams } from "react-router-dom";
// import Loader from "../Components/Loader";
// import { useContext, useEffect, useState } from "react";
// import myContext from "../Context/myContext";
// import { useDispatch, useSelector } from "react-redux";
// import '../Style/Shop.css';

// const CategoryPage = () => {
//     const { categoryname } = useParams();
//     const { getAllProduct, loading } = useContext(myContext); 
//     const navigate = useNavigate();
//     const filterProduct = getAllProduct.filter((obj) => obj.category.includes(categoryname));
//     const cartItems = useSelector((state) => state.cart);
//     const dispatch = useDispatch();
//     const [sortOption, setSortOption] = useState('');


   

//     const handleSort = (e) => {
//         setSortOption(e.target.value);
//     };

//     useEffect(() => {
//         localStorage.setItem('cart', JSON.stringify(cartItems));
//     }, [cartItems]);

//     const categories = [
//         'Residential', 'Pressure', 'Agricultur', 'Industrial', 'Machinery', 'Solar'
//     ];

//     return (
//         <div className="shop-main-content">
//             <div className="shop-sidebar">
//                 <h2>Categories</h2>
//                 <ul className="category-list" >
//                     {categories.map((category, index) => (
//                         <li className="category-item" key={index} onClick={() => navigate(`/category/${category}`)}>{category}</li>
//                     ))}
//                 </ul>
//                 <h2>Sort By</h2>
//                 <select onChange={handleSort} value={sortOption} className="shop-filter">
//                     <option value="">Select</option>
//                     <option value="price-low-high">Price: Low to High</option>
//                     <option value="price-high-low">Price: High to Low</option>
//                     <option value="name-az">Name: A to Z</option>
//                     <option value="name-za">Name: Z to A</option>
//                 </select>
//             </div>
//             <div className="shop-products">
//                 <div className="shop-top">
//                     <h1>{categoryname}</h1>
//                 </div>
//                 {loading ? (
//                     <div className="category-loader">
//                         <Loader />
//                     </div>
//                 ) : (
//                     <div className="shop-container">
//                         <div className="shop-grid">
//                             {filterProduct.length > 0 ? (
//                                 filterProduct.map((item, index) => (
//                                     <div key={index} className="shop-card">
//                                         <div className="shop-card-content" onClick={() => navigate(`/productinfo/${item.id}`)}>
//                                             <img src={item.imgurl1}  alt={item.title} className="shop-product-image" />
//                                             <div className="shop-product-details">
//                                                 <h1 className="shop-product-title">{item.title.substring(0, 25)}</h1>
//                                                 <div className="shop-button-container">
                                                  
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="category-no-product">
//                                     <img src="https://cdn-icons-png.flaticon.com/128/2748/2748614.png" alt="No product found" />
//                                     <h1>No {categoryname} product found</h1>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default CategoryPage;
