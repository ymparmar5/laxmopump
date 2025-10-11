import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { fireDB } from "../../FireBase/FireBaseConfig";
import { useNavigate } from "react-router";
import myContext from '../../Context/myContext';
import "../../Style/AddProductPage.css";
import { uploadImage } from '../Admin/Cloudnary';

const AddProductPage = () => {
    const { categories, addNewCategory, deleteCategory, addNewSubcategory, deleteSubcategory } = useContext(myContext);
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        title: "",
        imgurl1: "",
        imgurl2: "",
        imgurl3: "",
        imgurl4: "",
        imgurl5: "",
        bestSell: "",
        review: "",
        star: "",
        category1: "",
        subcategory1: "",
        category2: "",
        subcategory2: "",
        category3: "",
        subcategory3: "",
        category4: "",
        subcategory4: "",
        description: "",
        specification: "",
        features: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    });
    const [newCategory, setNewCategory] = useState("");
    const [newSubcategory, setNewSubcategory] = useState("");
    const [selectedCategoryForSub, setSelectedCategoryForSub] = useState("");

    const addProduct = async () => {
        try {
            await addDoc(collection(fireDB, "products"), product);
            toast.success("Product added successfully!");
            navigate("/admin");
        } catch (error) {
            console.error("Error adding product: ", error);
            toast.error("Failed to add product.");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const url = await uploadImage(file);
                setProduct((prevProduct) => ({
                    ...prevProduct,
                    [e.target.name]: url,
                }));
            } catch (error) {
                toast.error('Image upload failed');
            }
        }
    };

    const handleCategoryChange = (index, value) => {
        const updatedProduct = { ...product, [`category${index}`]: value, [`subcategory${index}`]: '' };
        setProduct(updatedProduct);
    };

    const handleSubcategoryChange = (index, value) => {
        setProduct({ ...product, [`subcategory${index}`]: value });
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            addNewCategory(newCategory);
            setNewCategory("");
        } else {
            toast.error("Please enter a category name.");
        }
    };

    const handleDeleteCategory = () => {
        if (newCategory.trim()) {
            deleteCategory(newCategory);
            setNewCategory("");
        } else {
            toast.error("Please enter a category name to delete.");
        }
    };

    const handleAddSubcategory = () => {
        if (selectedCategoryForSub && newSubcategory.trim()) {
            addNewSubcategory(selectedCategoryForSub, newSubcategory);
            setNewSubcategory("");
            setSelectedCategoryForSub("");
        } else {
            toast.error("Please select a category and enter a subcategory name.");
        }
    };

    const handleDeleteSubcategory = () => {
        if (selectedCategoryForSub && newSubcategory.trim()) {
            deleteSubcategory(selectedCategoryForSub, newSubcategory);
            setNewSubcategory("");
            setSelectedCategoryForSub("");
        } else {
            toast.error("Please select a category and enter a subcategory name to delete.");
        }
    };

    return (
        <div className="add-product-container">
            <div className="add-product-form-wrapper">
                <div className="add-product-form-header">
                    <h2>Add Product</h2>
                </div>
                <div className="add-product-form">
                    <div className="add-product-form-row">
                        <div className="add-product-form-group">
                            <input
                                type="text"
                                placeholder="Title"
                                value={product.title}
                                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                            />
                        </div>
                    </div>
                   
                    <div className="add-product-form-row">
                        <div className="add-product-form-group">
                            <input
                                type="file"
                                name="imgurl1"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="add-product-form-group">
                            <input
                                type="file"
                                name="imgurl2"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="add-product-form-group">
                            <input
                                type="file"
                                name="imgurl3"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="add-product-form-group">
                            <input
                                type="file"
                                name="imgurl4"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="add-product-form-group">
                            <input
                                type="file"
                                name="imgurl5"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>
                    {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="add-product-form-row">
                            <div className="add-product-form-group">
                                <select
                                    value={product[`category${index}`]}
                                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                                >
                                    <option value="">Select Category {index}</option>
                                    {Object.keys(categories).map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="add-product-form-group">
                                <select
                                    value={product[`subcategory${index}`]}
                                    onChange={(e) => handleSubcategoryChange(index, e.target.value)}
                                    disabled={!product[`category${index}`]}
                                >
                                    <option value="">Select Subcategory {index}</option>
                                    {product[`category${index}`] &&
                                        categories[product[`category${index}`]].map((subcategory) => (
                                            <option key={subcategory} value={subcategory}>
                                                {subcategory}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    ))}
                    <div className="add-product-form-row">
                        <div className="add-product-form-group">
                            <textarea
                                placeholder="Features"
                                value={product.features}
                                onChange={(e) => setProduct({ ...product, features: e.target.value })}
                                rows={7}
                            />
                        </div>
                    </div>
                    <div className="add-product-form-row">
                        <div className="add-product-form-group">
                            <textarea
                                placeholder="Specification"
                                value={product.specification}
                                onChange={(e) => setProduct({ ...product, specification: e.target.value })}
                                rows={7}
                            />
                        </div>
                    </div>
                    <div className="add-product-form-row">
                        <div className="add-product-form-group">
                            <textarea
                                placeholder="Description"
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                rows={7}
                            />
                        </div>
                    </div>
                </div>

                {/* ✅ FIXED: Category Management Section with Better UI */}
                <div className="add-product-add-category-section">
                    <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>Manage Categories</h3>
                    <input
                        type="text"
                        placeholder="Enter Category Name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button className="add-product-add-btn" onClick={handleAddCategory}>
                            Add Category
                        </button>
                        <button 
                            className="add-product-add-btn" 
                            onClick={handleDeleteCategory}
                            style={{ backgroundColor: '#ef4444' }}
                        >
                            Delete Category
                        </button>
                    </div>
                </div>

                {/* ✅ FIXED: Subcategory Management Section with Better UI */}
                <div className="add-product-add-subcategory-section">
                    <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>Manage Subcategories</h3>
                    <select
                        value={selectedCategoryForSub}
                        onChange={(e) => setSelectedCategoryForSub(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {Object.keys(categories).map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Enter Subcategory Name"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button className="add-product-add-btn" onClick={handleAddSubcategory}>
                            Add Subcategory
                        </button>
                        <button 
                            className="add-product-add-btn" 
                            onClick={handleDeleteSubcategory}
                            style={{ backgroundColor: '#ef4444' }}
                        >
                            Delete Subcategory
                        </button>
                    </div>
                </div>

                {/* Add Product Button */}
                <div className="add-product-add-subcategory-section">
                    <button className="add-product-btn add-product-submit-btn" onClick={addProduct}>
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;