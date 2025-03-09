import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Category.css";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { fireDB } from "../FireBase/FireBaseConfig";
import { getAuth } from "firebase/auth";

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
            }));
            setCategory(categoryList);
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
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "category"); // Replace with your Cloudinary upload preset

            const response = await fetch("https://api.cloudinary.com/v1_1/dn5vvxkra/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!data.secure_url) throw new Error("Cloudinary upload failed");
            console.log("Cloudinary Image URL:", data.secure_url);

            // Update Firestore with Cloudinary Image URL
            const categoryRef = doc(fireDB, "categories", category[index].id);
            await setDoc(categoryRef, { ...category[index], image: data.secure_url });

            // Refresh categories
            fetchCategories();
            console.log("Image uploaded & URL stored in Firestore successfully.");
        } catch (error) {
            console.error("Image upload failed", error);
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
                    <div>
                        <div key={item.id} className="category-container">
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