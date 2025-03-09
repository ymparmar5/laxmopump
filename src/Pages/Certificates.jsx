import { useState } from "react";
import "../Style/imageScroll.css"; // Import the CSS file

const images = [
  "/certificate1.jpg","/certificate2.jpg","/certificate3.jpg","/certificate4.jpg","/certificate5.jpg","/certificate6.jpg","/certificate7.jpg",
];

export default function Certificates() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="image-scroll-container">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`A4 Document ${index + 1}`}
          className="image-item"
          // onClick={() => setSelectedImage(src)}
        />
      ))}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <img src={selectedImage} alt="Selected" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}