import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import myContext from '../Context/myContext';
import { useDispatch, useSelector } from 'react-redux';
import '../Style/Products.css';

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
    const [openAccordion, setOpenAccordion] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, [location.search]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 800);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSort = (e) => {
        setSortOption(e.target.value);
    };

    
    const handleAccordionClick = (categoryName) => {
        setOpenAccordion(openAccordion === categoryName ? null : categoryName);
        setSelectedCategory(categoryName);
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
            {!isMobile && (
                <div className="shop-sidebar">
                    <h2>Categories</h2>
                    <ul className="category-list">
                        {Object.keys(categories).map((categoryName, index) => (
                            <li key={index} className="accordion-item">
                                <div
                                    className={`category-item ${selectedCategory === categoryName ? 'selected' : ''}`}
                                    onClick={() => handleAccordionClick(categoryName)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {categoryName}
                                    <span style={{ float: 'right', fontWeight: 'bold' }}>
                                        {openAccordion === categoryName ? '-' : '+'}
                                    </span>
                                </div>
                                {openAccordion === categoryName && categories[categoryName].length > 0 && (
                                    <ul className="subcategory-list accordion-content">
                                        {categories[categoryName].map((subcategory, subIndex) => (
                                            <li
                                                key={subIndex}
                                                className={`subcategory-item${selectedSubcategory === subcategory ? ' selected' : ''}`}
                                                onClick={() => handleSubcategoryClick(subcategory)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {subcategory}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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
                            currentProducts.map((item, index) => {
                                // Find first non-empty category
                                const category = item.category1 || item.category2 || item.category3 || item.category4 || '';
                                // Use rating/reviewCount if available, else placeholder
                                const rating = item.rating || '4.5';
                                const reviewCount = item.reviewCount || '23';
                                return (
                                    <div key={index} className="shop-card">
                                        <div
                                            className="flip-card"
                                            onClick={() => navigate(`/productinfo/${item.id}`)}
                                        >
                                            <div className="flip-card-inner">
                                                <div className="flip-card-front">
                                                    <img src={item.imgurl1} alt={item.title} className="shop-product-image" />
                                                </div>
                                                <div className="flip-card-back">
                                                    <img
                                                        src={item.imgurl2 ? item.imgurl2 : item.imgurl1}
                                                        alt={item.title}
                                                        className="shop-product-image"
                                                    />
                                                </div>
                                            </div>
                                            <div className="shop-product-details">
                                                <h1 className="shop-product-title">{item.title.substring(0, 25)}</h1>
                                                <div className="shop-button-container">
                                                    {/* Add buttons or additional details here */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    {isMobile && (
                        <div className="shop-mobile-categories">
                            <h2>Categories</h2>
                            <ul className="category-list">
                                {Object.keys(categories).map((categoryName, index) => (
                                    <li key={index} className="accordion-item">
                                        <div
                                            className={`category-item ${selectedCategory === categoryName ? 'selected' : ''}`}
                                            onClick={() => handleAccordionClick(categoryName)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {categoryName}
                                            <span style={{ float: 'right', fontWeight: 'bold' }}>
                                                {openAccordion === categoryName ? '-' : '+'}
                                            </span>
                                        </div>
                                        {openAccordion === categoryName && categories[categoryName].length > 0 && (
                                            <ul className="subcategory-list accordion-content">
                                                {categories[categoryName].map((subcategory, subIndex) => (
                                                    <li
                                                        key={subIndex}
                                                        className={`subcategory-item${selectedSubcategory === subcategory ? ' selected' : ''}`}
                                                        onClick={() => handleSubcategoryClick(subcategory)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {subcategory}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
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