import { useContext, useEffect, useState, useRef } from "react";
import myContext from "../Context/myContext";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../FireBase/FireBaseConfig";
import Loader from "../Components/Loader";
import "../Style/ProductInfo.css";
import Star from "../Components/Star"
import Popup from "../Components/Popup";

const ProductInfo = () => {
  const { loading, setLoading } = useContext(myContext);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const [isOpen, setIsOpen] = useState(false)
  const { id } = useParams();

  // Magnifier state/hooks at top level
  const [lensVisible, setLensVisible] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const lensSize = 500; // px (3x bigger)
  const zoom = 1.4; // magnification

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const imgWidth = imgRef.current.offsetWidth;
    const imgHeight = imgRef.current.offsetHeight;
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    // Only show lens if mouse is inside image
    if (x >= 0 && x <= imgWidth && y >= 0 && y <= imgHeight) {
      setLensVisible(true);
      setLensPos({ x, y });
    } else {
      setLensVisible(false);
    }
  };

  const handleMouseEnter = () => setLensVisible(true);
  const handleMouseLeave = () => setLensVisible(false);

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

  const handleClosePopup = () => {
    setIsOpen(false);
  };

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
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap' }}>
              <div className="product-image-magnifier-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  ref={imgRef}
                  className="product-image"
                  src={mainImage}
                  alt="Main"
                  style={{ cursor: 'zoom-in' }}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => window.open(mainImage, '_blank')}
                />
                {lensVisible && (
                  <div
                    className="image-magnifier-box"
                    style={{
                      position: 'absolute',
                      left: '100%',
                      top: 0,
                      marginLeft: 24,
                      width: 400,
                      height: 400,
                      backgroundImage: `url(${mainImage})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: `${imgRef.current?.offsetWidth * zoom}px ${imgRef.current?.offsetHeight * zoom}px`,
                      backgroundPosition: (() => {
                        const imgW = imgRef.current?.offsetWidth || 1;
                        const imgH = imgRef.current?.offsetHeight || 1;
                        const lensW = 400; // magnifier box width
                        const lensH = 400; // magnifier box height
                        const bgW = imgW * zoom;
                        const bgH = imgH * zoom;
                        // If lens center is less than half lens size from edge, show edge
                        let bgX = lensPos.x * zoom - lensW / 2;
                        let bgY = lensPos.y * zoom - lensH / 2;
                        if (lensPos.x < lensW / (2 * zoom)) bgX = 0;
                        else if (lensPos.x > imgW - lensW / (2 * zoom)) bgX = bgW - lensW;
                        else bgX = Math.max(0, Math.min(bgX, bgW - lensW));
                        if (lensPos.y < lensH / (2 * zoom)) bgY = 0;
                        else if (lensPos.y > imgH - lensH / (2 * zoom)) bgY = bgH - lensH;
                        else bgY = Math.max(0, Math.min(bgY, bgH - lensH));
                        return `-${bgX}px -${bgY}px`;
                      })(),
                      borderRadius: '12px',
                      boxShadow: '0 4px 24px 0 rgba(0,138,209,0.18)',
                      zIndex: 20,
                      backgroundColor: '#fff',
                      display: 'block',
                    }}
                  />
                )}
              </div>
            </div>
            <div className="right-side">
              <div className="product-description-container">
                <h2 className="product-title">{product.title}

                  <Star rating={product?.star} review={product?.review} />

                </h2>


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
              <Popup isVisible={isOpen} onClose={handleClosePopup} product={product?.title} />

              <button id="submit-btn" onClick={() => setIsOpen(true)} >Get Quote</button>

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
