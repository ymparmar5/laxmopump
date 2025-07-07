import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Category.css";
import { collection, doc, setDoc, getDocs, updateDoc } from "firebase/firestore";
import { fireDB } from "../FireBase/FireBaseConfig";
import { getAuth } from "firebase/auth";
import { uploadToCloudinary } from "./Admin/CloudnaryCategory"; // adjust path as needed

const Category = () => {
    const [category, setCategory] = useState([]);
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (user?.email) {
            setRole("admin");
        }
    }, [user]);

    // Fetch categories from Firestore
    const fetchCategories = async () => {
        try {
            const querySnapshot = await getDocs(collection(fireDB, "categories"));
            const categoryList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));       setCategory(categoryList);
            // Log all image URLs after fetching
            console.log("Fetched category images:", categoryList.map(cat => cat.image));
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Upload image to Cloudinary and update Firestore
    const handleImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!user) {
            alert("You must be logged in to upload images.");
            return;
        }

        try {
            const imageUrl = await uploadToCloudinary(file);

            // Update Firestore with Cloudinary Image URL
            const categoryRef = doc(fireDB, "categories", category[index].id);
            await updateDoc(categoryRef, { image: imageUrl });

            // Refresh categories
            fetchCategories();
            alert("Image uploaded & URL updated in Firestore successfully.");
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
                        {/* Log each image in render for extra visibility */}
                        {console.log("Rendering image:", item.image)}
                        <div className="category-container">
                            <div onClick={() => handleCategoryClick(item.name)}>
                                <div className="category-imgs">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <h1 className="category-names">{item.name}</h1>
                                <p className="category-viewmore">View more..</p>
                            </div>
                           
                        </div>
                        {role === "admin" && (
                                <input style={{
                                    width: "130px", // Smaller width
                                    height: "px", // Reduce height
                                    fontSize: "10px", // Adjust font size
                                    padding: "4px", // Add padding
                                    margin: "4px", // Add padding

                                    border: "1px solid #ccc", // Light border
                                    cursor: "pointer",
                                }} type="file" onChange={(e) => handleImageUpload(e, index)} />
                            )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Category;