import { useNavigate } from "react-router-dom";
import myContext from "../Context/myContext";
import { useContext, useEffect } from "react";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import "../Style/HomeProductCard.css";

const HomeProductCard = () => {
    const navigate = useNavigate();
    const context = useContext(myContext);
    const { loading, getAllProduct } = context;
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <div className="home-product-card">
            <div className="home-product-heading">
                <h1>Bestselling Products</h1>
            </div>
            <section className="home-product-section">
                <div className="home-product-container">
                    <div className="home-product-loader-container">{loading && <Loader />}</div>
                    <div className="home-product-grid">
                        {getAllProduct.filter(item => item.bestSell).slice(0, 8).map((item, index) => {
                            const { id, title, imgurl1 } = item;
                            return (
                                <div key={index} className="home-product-card-item">
                                    <div className="home-product-card-content" onClick={() => navigate(`/productinfo/${id}`)}>
                                        <img src={imgurl1} alt="product" className="home-product-image" />
                                        <div className="home-product-details">
                                            {/* <h2 className="home-product-brand">Laxmo pumps</h2> */}
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
