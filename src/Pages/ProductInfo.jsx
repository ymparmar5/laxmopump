import { useContext, useEffect, useState } from "react";
import myContext from "../Context/myContext";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../FireBase/FireBaseConfig";
import Loader from "../Components/Loader";
import "../Style/ProductInfo.css";

const ProductInfo = () => {
  const { loading, setLoading } = useContext(myContext);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const { id } = useParams();

  // getProductData
  const getProductData = async () => {
    setLoading(true);
    try {
      const productTemp = await getDoc(doc(fireDB, "products", id));
      if (productTemp.exists()) {
        setProduct({ ...productTemp.data(), id: productTemp.id });
        setMainImage(productTemp.data().imgurl1); // Set main image initially
      } else {
        console.log("No such Product!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  return (
    <section className="product-info-section">
      <div className="product-info-container">
        {product ? (
          <>
            <div className="image-gallery">
              {product?.imgurl1 && (
                <img
                  src={product.imgurl1}
                  alt="Thumbnail"
                  onClick={() => setMainImage(product.imgurl1)}
                />
              )}
              {product?.imgurl2 && (
                <img
                  src={product.imgurl2}
                  alt="Thumbnail"
                  onClick={() => setMainImage(product.imgurl2)}
                />
              )}
              {product?.imgurl3 && (
                <img
                  src={product.imgurl3}
                  alt="Thumbnail"
                  onClick={() => setMainImage(product.imgurl3)}
                />
              )}
              {product?.imgurl4 && (
                <img
                  src={product.imgurl4}
                  alt="Thumbnail"
                  onClick={() => setMainImage(product.imgurl4)}
                />
              )}
            </div>
            <div className="product-image-container">
              <img className="product-image" src={mainImage} alt="Main" />
            </div>
            <div className="right-side">
              <div className="product-description-container">
                <h2 className="product-title">{product.title}</h2>
                <div className="product-specification-and-features">
                  <div className="product-description">
                    <h2 className="description-title">Specification:</h2>
                    <ul>
                      {product.specification
                        ? product.specification
                            .split("\n")
                            .map((specification, index) => (
                              <li key={index}>{specification}</li>
                            ))
                        : "No specifications available"}
                    </ul>
                  </div>
                  <div className="product-description">
                    <h2 className="description-title">Features:</h2>
                    <ul>
                      {product.features
                        ? product.features
                            .split("\n")
                            .map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))
                        : "No features available"}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Product not found</p>
        )}
      </div>
      <div className="product-info-container">
        {product ? (
          <div className="product-description full-width">
            <h2 className="description-title">Description:</h2>
            <ul>
              {product.description
                ? product.description
                    .split("\n")
                    .map((description, index) => (
                      <li key={index}>{description}</li>
                    ))
                : "No description available"}
            </ul>
          </div>
        ) : (
          <p>Description not found</p>
        )}
      </div>
    </section>
  );
};

export default ProductInfo;
