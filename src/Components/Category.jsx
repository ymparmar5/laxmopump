import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Category.css";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { fireDB } from "../FireBase/FireBaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { uploadToCloudinary } from "./Admin/CloudnaryCategory"; // adjust path as needed

const Category = () => {
  const [category, setCategory] = useState(() => {
    const cached = localStorage.getItem("categories");
    return cached ? JSON.parse(cached) : [];
  });
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [loadedImages, setLoadedImages] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const auth = getAuth();

  // Check user auth and role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        
          setRole("admin");
          localStorage.setItem("role", "admin");
     
      } else {
        setRole("");
        setUserEmail("");
        localStorage.removeItem("role");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(fireDB, "categories"));
      const categoryList = querySnapshot.docs.map((doc) => {
        const data = { id: doc.id, ...doc.data() };
        return {
          ...data,
          image: `${data.image}?f_auto,q_auto:best,w_600,h_400,c_fill`,
          placeholder: `${data.image}?f_auto,q_auto:low,w_20,h_15,c_fill`,
        };
      });
      setCategory(categoryList);
      localStorage.setItem("categories", JSON.stringify(categoryList));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Upload image to Cloudinary & update Firestore
  const handleImageUpload = async (e, index) => {
    if (role !== "admin") {
      alert("Unauthorized!");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadToCloudinary(file);
      const categoryRef = doc(fireDB, "categories", category[index].id);
      await updateDoc(categoryRef, { image: imageUrl });

      fetchCategories();
      alert("Image uploaded & URL updated successfully.");
    } catch (error) {
      alert("Image upload failed: " + error.message);
    }
  };

  const handleCategoryClick = (name) => {
    navigate(`/shop?category=${name}`);
  };

  return (
    <>
      <div className="category-heading">
        <h1>Featured Categories</h1>
      </div>
      <div className="home-category" ref={containerRef}>
        {category.map((item, index) => (
          <div key={item.id + "-container"}>
            <div className="category-container">
              <div onClick={() => handleCategoryClick(item.name)}>
                <div className="category-imgs">
                  <img
                    className={`category-img ${loadedImages[index] ? "loaded" : "loading"}`}
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onLoad={() => setLoadedImages((prev) => ({ ...prev, [index]: true }))}
                    
                  />
                </div>
                <h1 className="category-names">{item.name}</h1>
                <p className="category-viewmore">View more..</p>
              </div>
            </div>

            {/* Show input only if role is admin and email matches */}
            {role === "admin" && userEmail === "tecsolution.in@gmail.com" && (
              <input
                style={{
                  width: "130px",
                  fontSize: "10px",
                  padding: "4px",
                  margin: "4px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
                type="file"
                onChange={(e) => handleImageUpload(e, index)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Category;
