import { useNavigate } from "react-router-dom";
import myContext from "../Context/myContext";
import { useContext, useEffect, useState } from "react";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import "../Style/HomeProductCard.css";

const HomeProductCard = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { loading, getAllProduct } = context;
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [loadedImages, setLoadedImages] = useState({});
    const [products, setProducts] = useState(() => {
        // Load cached products first
        const cached = localStorage.getItem("homeProducts");
        return cached ? JSON.parse(cached) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        // Cache products for next render
        if (getAllProduct.length > 0) {
            const bestProducts = getAllProduct
                .filter(item => item.bestSell)
                .slice(0, 8)
                .map(item => ({
                    ...item,
                    optimizedImage: `${item.imgurl1}?f_auto,q_auto:best,w_400,h_400,c_fill`,
                    placeholder: `${item.imgurl1}?f_auto,q_auto:low,w_20,h_20,c_fill`
                }));
            setProducts(bestProducts);
            localStorage.setItem("homeProducts", JSON.stringify(bestProducts));
        }
    }, [getAllProduct]);

    return (
        <div className="home-product-card">
            <div className="home-product-heading">
                <h1>Products Range</h1>
            </div>
            <section className="home-product-section">
                <div className="home-product-container">
                    <div className="home-product-loader-container">{loading && <Loader />}</div>
                    <div className="home-product-grid">
                        {products.map((item, index) => {
                            const { id, title, optimizedImage, placeholder } = item;
                            return (
                                <div key={index} className="home-product-card-item">
                                    <div className="home-product-card-content" onClick={() => navigate(`/productinfo/${id}`)}>
                                        <img
                                            src={optimizedImage}
                                            alt="product"
                                            loading="lazy"
                                            className="home-product-image"
                                            
                                            onLoad={() =>
                                                setLoadedImages((prev) => ({ ...prev, [index]: true }))
                                            }
                                        />
                                        <div className="home-product-details">
                                            <h1 className="home-product-title">{title.substring(0, 25)}</h1>
                                            <div className="home-product-button-container">
                                                {/* Add any buttons or additional details here if needed */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeProductCard;
