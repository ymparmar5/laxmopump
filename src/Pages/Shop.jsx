import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import myContext from '../Context/myContext';
import { useDispatch, useSelector } from 'react-redux';
import '../Style/Shop.css';

const Shop = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getAllProduct, loading, categories } = useContext(myContext);
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const productsPerPage = 12;

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, [location.search]);

    const handleSort = (e) => {
        setSortOption(e.target.value);
    };

    
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory('');
    };

    const handleSubcategoryClick = (subcategory) => {
        setSelectedSubcategory(subcategory);
    };

    const sortedProducts = [...getAllProduct].sort((a, b) => {
        if (sortOption === 'price-low-high') {
            return a.price - b.price;
        } else if (sortOption === 'price-high-low') {
            return b.price - a.price;
        } else if (sortOption === 'name-az') {
            return a.title.localeCompare(b.title);
        } else if (sortOption === 'name-za') {
            return b.title.localeCompare(a.title);
        }
        return 0;
    });

    const filteredProducts = sortedProducts.filter(product => {
        if (selectedSubcategory) {
            return product.subcategory1 === selectedSubcategory || product.subcategory2 === selectedSubcategory || product.subcategory3 === selectedSubcategory || product.subcategory4 === selectedSubcategory;
        }
        if (selectedCategory) {
            return product.category1 === selectedCategory || product.category2 === selectedCategory || product.category3 === selectedCategory || product.category4 === selectedCategory;
        }
        return true;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    return (
        <div className="shop-main-content">
            <div className="shop-sidebar">
                <h2>Categories</h2>
                <ul className="category-list">
                    {Object.keys(categories).map((categoryName, index) => (
                        <li key={index}>
                            <div className={`category-item ${selectedCategory === categoryName ? 'selected' : ''}`} onClick={() => handleCategoryClick(categoryName)}>
                                {categoryName}
                            </div>
                            {categories[categoryName].length > 0 && (
                                <ul className="subcategory-list">
                                    {categories[categoryName].map((subcategory, subIndex) => (
                                        <li key={subIndex} className="subcategory-item" onClick={() => handleSubcategoryClick(subcategory)}>
                                            {subcategory}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="shop-products">
                <div className="shop-top">
                    <div className="shop-header">
                        <h1>{selectedSubcategory || selectedCategory || 'All Products'}</h1>
                    </div>
                    <div className="shop-sort-filter">
                        <select onChange={handleSort} value={sortOption} className="shop-filter">
                            <option value="">Filter</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                            <option value="name-az">Name: A to Z</option>
                            <option value="name-za">Name: Z to A</option>
                        </select>
                    </div>
                </div>
                <div className="shop-container">
                    <div className="shop-grid">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            currentProducts.map((item, index) => (
                                <div key={index} className="shop-card">
                                    <div className="shop-card-content" onClick={() => navigate(`/productinfo/${item.id}`)}>
                                        <img src={item.imgurl1} alt={item.title} className="shop-product-image" />
                                        <div className="shop-product-details">
                                            <h1 className="shop-product-title">{item.title.substring(0, 25)}</h1>
                                            <div className="shop-button-container">
                                                {/* Add buttons or additional details here */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="shop-pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button key={index} onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;