import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { fireDB } from "../../FireBase/FireBaseConfig";
import { useNavigate } from "react-router";
import myContext from '../../Context/myContext';
import "../../Style/AddProductPage.css";
import { uploadImage } from '../Admin/Cloudnary';

const AddProductPage = () => {
    const { categories, addNewCategory, deleteCategory, addNewSubcategory, deleteSubcategory, updateCategory, updateSubcategory } = useContext(myContext);
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
    
    // Category Management States
    const [newCategory, setNewCategory] = useState("");
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState("");
    const [selectedCategoryToUpdate, setSelectedCategoryToUpdate] = useState("");
    const [updatedCategoryName, setUpdatedCategoryName] = useState("");
    
    // Subcategory Management States
    const [selectedCategoryForSub, setSelectedCategoryForSub] = useState("");
    const [newSubcategory, setNewSubcategory] = useState("");
    const [selectedCategoryForSubDelete, setSelectedCategoryForSubDelete] = useState("");
    const [selectedSubcategoryToDelete, setSelectedSubcategoryToDelete] = useState("");
    const [selectedCategoryForSubUpdate, setSelectedCategoryForSubUpdate] = useState("");
    const [selectedSubcategoryToUpdate, setSelectedSubcategoryToUpdate] = useState("");
    const [updatedSubcategoryName, setUpdatedSubcategoryName] = useState("");

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

    // Category Management Functions
    const handleAddCategory = async () => {
        if (newCategory.trim()) {
            try {
                await addNewCategory(newCategory);
                setNewCategory("");
                toast.success("Category added successfully!");
            } catch (error) {
                toast.error("Failed to add category.");
            }
        } else {
            toast.error("Please enter a category name.");
        }
    };

    const handleDeleteCategory = async () => {
        if (selectedCategoryToDelete) {
            try {
                await deleteCategory(selectedCategoryToDelete);
                setSelectedCategoryToDelete("");
                toast.success("Category deleted successfully!");
            } catch (error) {
                toast.error("Failed to delete category.");
            }
        } else {
            toast.error("Please select a category to delete.");
        }
    };

    const handleUpdateCategory = async () => {
        if (selectedCategoryToUpdate && updatedCategoryName.trim()) {
            if (selectedCategoryToUpdate === updatedCategoryName) {
                toast.error("New category name must be different from the old one.");
                return;
            }
            
            // Check if new category name already exists
            if (categories[updatedCategoryName]) {
                toast.error("A category with this name already exists.");
                return;
            }
            
            try {
                await updateCategory(selectedCategoryToUpdate, updatedCategoryName);
                setSelectedCategoryToUpdate("");
                setUpdatedCategoryName("");
                toast.success("Category updated successfully!");
            } catch (error) {
                console.error("Error updating category:", error);
                toast.error("Failed to update category.");
            }
        } else {
            toast.error("Please select a category and enter a new name.");
        }
    };

    // Subcategory Management Functions
    const handleAddSubcategory = async () => {
        if (selectedCategoryForSub && newSubcategory.trim()) {
            try {
                await addNewSubcategory(selectedCategoryForSub, newSubcategory);
                setNewSubcategory("");
                setSelectedCategoryForSub("");
                toast.success("Subcategory added successfully!");
            } catch (error) {
                toast.error("Failed to add subcategory.");
            }
        } else {
            toast.error("Please select a category and enter a subcategory name.");
        }
    };

    const handleDeleteSubcategory = async () => {
        if (selectedCategoryForSubDelete && selectedSubcategoryToDelete) {
            try {
                await deleteSubcategory(selectedCategoryForSubDelete, selectedSubcategoryToDelete);
                setSelectedCategoryForSubDelete("");
                setSelectedSubcategoryToDelete("");
                toast.success("Subcategory deleted successfully!");
            } catch (error) {
                toast.error("Failed to delete subcategory.");
            }
        } else {
            toast.error("Please select a category and subcategory to delete.");
        }
    };

    const handleUpdateSubcategory = async () => {
        if (selectedCategoryForSubUpdate && selectedSubcategoryToUpdate && updatedSubcategoryName.trim()) {
            if (selectedSubcategoryToUpdate === updatedSubcategoryName) {
                toast.error("New subcategory name must be different from the old one.");
                return;
            }
            
            try {
                await updateSubcategory(selectedCategoryForSubUpdate, selectedSubcategoryToUpdate, updatedSubcategoryName);
                setSelectedCategoryForSubUpdate("");
                setSelectedSubcategoryToUpdate("");
                setUpdatedSubcategoryName("");
                toast.success("Subcategory updated successfully!");
            } catch (error) {
                console.error("Error updating subcategory:", error);
                toast.error("Failed to update subcategory.");
            }
        } else {
            toast.error("Please select a category, subcategory, and enter a new name.");
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
{/* Add Product Button */}
                <div className="add-product-add-subcategory-section">
                    <button className="add-product-btn add-product-submit-btn" onClick={addProduct}>
                        Add Product
                    </button>
                </div>
                {/* Category Management Section */}
                <div className="add-product-add-category-section">
                    {/* <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>Manage Categories</h3> */}
                    
                    {/* Add Category */}
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '8px', fontSize: '16px', color: '#666' }}>Add New Category</h4>
                        <input
                            type="text"
                            placeholder="Enter Category Name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <button className="add-product-add-btn" onClick={handleAddCategory}>
                            Add Category
                        </button>
                    </div>

                   

                    {/* Delete Category */}
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '8px', fontSize: '16px', color: '#666' }}>Delete Category</h4>
                        <select
                            value={selectedCategoryToDelete}
                            onChange={(e) => setSelectedCategoryToDelete(e.target.value)}
                            style={{ marginBottom: '10px' }}
                        >
                            <option value="">Select Category to Delete</option>
                            {Object.keys(categories).map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <button 
                            className="add-product-add-btn" 
                            onClick={handleDeleteCategory}
                            style={{ backgroundColor: '#ef4444' }}
                        >
                            Delete Category
                        </button>
                    </div>
                </div>

                {/* Subcategory Management Section */}
                <div className="add-product-add-subcategory-section">
                    {/* <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>Manage Subcategories</h3> */}
                    
                    {/* Add Subcategory */}
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '8px', fontSize: '16px', color: '#666' }}>Add New Subcategory</h4>
                        <select
                            value={selectedCategoryForSub}
                            onChange={(e) => setSelectedCategoryForSub(e.target.value)}
                            style={{ marginBottom: '10px' }}
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
                            style={{ marginBottom: '10px' }}
                        />
                        <button className="add-product-add-btn" onClick={handleAddSubcategory}>
                            Add Subcategory
                        </button>
                    </div>

                   
                    {/* Delete Subcategory */}
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ marginBottom: '8px', fontSize: '16px', color: '#666' }}>Delete Subcategory</h4>
                        <select
                            value={selectedCategoryForSubDelete}
                            onChange={(e) => {
                                setSelectedCategoryForSubDelete(e.target.value);
                                setSelectedSubcategoryToDelete("");
                            }}
                            style={{ marginBottom: '10px' }}
                        >
                            <option value="">Select Category</option>
                            {Object.keys(categories).map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedSubcategoryToDelete}
                            onChange={(e) => setSelectedSubcategoryToDelete(e.target.value)}
                            disabled={!selectedCategoryForSubDelete}
                            style={{ marginBottom: '10px' }}
                        >
                            <option value="">Select Subcategory to Delete</option>
                            {selectedCategoryForSubDelete &&
                                categories[selectedCategoryForSubDelete].map((subcategory) => (
                                    <option key={subcategory} value={subcategory}>
                                        {subcategory}
                                    </option>
                                ))}
                        </select>
                        <button 
                            className="add-product-add-btn" 
                            onClick={handleDeleteSubcategory}
                            style={{ backgroundColor: '#ef4444' }}
                        >
                            Delete Subcategory
                        </button>
                    </div>
                </div>

                
            </div>
        </div>
    );
};

export default AddProductPage;