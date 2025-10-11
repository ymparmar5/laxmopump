import { useState, useEffect } from 'react';
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { fireDB } from "../FireBase/FireBaseConfig";
import toast from 'react-hot-toast';

function MyState({ children }) {
    const [loading, setLoading] = useState(false);
    const [getAllProduct, setGetAllProduct] = useState([]);
    const [categories, setCategorie] = useState({});

    const getAllProductFunction = () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, "products"), orderBy('time'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let productArray = [];
                querySnapshot.forEach((doc) => {
                    productArray.push({ ...doc.data(), id: doc.id });
                });
                setGetAllProduct(productArray);
                setLoading(false);
            }, (error) => {
                console.error("Error in products snapshot:", error);
                setLoading(false);
            });
            return unsubscribe;
        } catch (error) {
            console.error("Error fetching products: ", error);
            setLoading(false);
            return () => {}; // Return empty function on error
        }
    };

    // Fetch categories from Firestore
    const getCategoriesFromFirestore = () => {
        try {
            const q = query(collection(fireDB, "categories"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const categoryMap = {};
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    categoryMap[doc.id] = data.subcategories || [];
                });
                setCategorie(categoryMap);
                console.log("Categories loaded:", categoryMap);
            }, (error) => {
                console.error("Error in categories snapshot:", error);
            });
            return unsubscribe;
        } catch (error) {
            console.error("Error setting up categories listener:", error);
            return () => {};
        }
    };

    // Add New Category
    const addNewCategory = async (categoryName) => {
        console.log("🔵 addNewCategory called with:", categoryName);
        
        try {
            const formattedName = categoryName.trim();
            
            if (!formattedName) {
                console.log("❌ Empty category name");
                toast.error("Category name cannot be empty.");
                return;
            }

            console.log("🔵 Checking if category exists:", formattedName);
            const docRef = doc(fireDB, "categories", formattedName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("❌ Category already exists");
                toast.error(`Category "${formattedName}" already exists.`);
                return;
            }

            console.log("🔵 Creating new category document...");
            await setDoc(docRef, {
                id: formattedName,
                name: formattedName,
                image: '',
                subcategories: [],
                subcategoryImages: {}
            });

            console.log("✅ Category added successfully to Firestore");
            toast.success(`Category "${formattedName}" added successfully.`);
        } catch (error) {
            console.error("❌ Error adding category:", error);
            console.error("Error details:", error.message);
            toast.error(`Failed to add category: ${error.message}`);
        }
    };

    // Delete Category
    const deleteCategory = async (categoryToDelete) => {
        console.log("🔵 deleteCategory called with:", categoryToDelete);
        
        try {
            const formattedName = categoryToDelete.trim();
            if (!formattedName) {
                toast.error("Category name cannot be empty.");
                return;
            }

            const ref = doc(fireDB, "categories", formattedName);
            const docSnap = await getDoc(ref);
            
            if (!docSnap.exists()) {
                toast.error(`Category "${formattedName}" not found in database.`);
                return;
            }

            await deleteDoc(ref);
            console.log("✅ Category deleted successfully");
            toast.success(`Category "${formattedName}" deleted successfully.`);
        } catch (error) {
            console.error("❌ Error deleting category:", error);
            toast.error(`Failed to delete category: ${error.message}`);
        }
    };

    // Add New Subcategory
    const addNewSubcategory = async (category, subcategoryName) => {
        console.log("🔵 addNewSubcategory called:", subcategoryName, "to", category);
        
        try {
            const formattedSub = subcategoryName.trim();
            
            if (!formattedSub) {
                toast.error("Subcategory name cannot be empty.");
                return;
            }

            const categoryRef = doc(fireDB, "categories", category);
            const categoryDoc = await getDoc(categoryRef);
            
            if (!categoryDoc.exists()) {
                toast.error(`Category "${category}" not found in database.`);
                return;
            }

            const data = categoryDoc.data() || {};
            const currentSubs = data.subcategories || [];

            const exists = currentSubs.some((s) => s.toLowerCase() === formattedSub.toLowerCase());

            if (exists) {
                toast.error(`Subcategory "${formattedSub}" already exists in "${category}".`);
                return;
            }

            const updatedSubs = [...currentSubs, formattedSub];

            await updateDoc(categoryRef, {
                subcategories: updatedSubs
            });

            console.log("✅ Subcategory added successfully");
            toast.success(`Subcategory "${formattedSub}" added to "${category}".`);
        } catch (error) {
            console.error("❌ Error adding subcategory:", error);
            toast.error(`Failed to add subcategory: ${error.message}`);
        }
    };

    // Delete Subcategory
    const deleteSubcategory = async (category, subcategoryName) => {
        console.log("🔵 deleteSubcategory called:", subcategoryName, "from", category);
        
        try {
            const formattedSub = subcategoryName.trim();
            if (!formattedSub) {
                toast.error("Subcategory name cannot be empty.");
                return;
            }

            const categoryRef = doc(fireDB, "categories", category);
            const categoryDoc = await getDoc(categoryRef);
            
            if (!categoryDoc.exists()) {
                toast.error(`Category "${category}" not found in database.`);
                return;
            }

            const data = categoryDoc.data() || {};
            const currentSubs = data.subcategories || [];

            const exists = currentSubs.some((s) => s.toLowerCase() === formattedSub.toLowerCase());

            if (!exists) {
                toast.error(`Subcategory "${formattedSub}" not found in "${category}".`);
                return;
            }

            const updatedSubs = currentSubs.filter((s) => s.toLowerCase() !== formattedSub.toLowerCase());

            await updateDoc(categoryRef, {
                subcategories: updatedSubs
            });

            console.log("✅ Subcategory deleted successfully");
            toast.success(`Subcategory "${formattedSub}" deleted from "${category}".`);
        } catch (error) {
            console.error("❌ Error deleting subcategory:", error);
            toast.error(`Failed to delete subcategory: ${error.message}`);
        }
    };

    useEffect(() => {
        console.log("🟢 MyState useEffect running");
        let unsubscribeProducts = null;
        let unsubscribeCategories = null;

        try {
            unsubscribeProducts = getAllProductFunction();
            unsubscribeCategories = getCategoriesFromFirestore();
            console.log("✅ Listeners set up successfully");
        } catch (error) {
            console.error("❌ Error setting up listeners:", error);
        }

        return () => {
            console.log("🔴 MyState cleanup running");
            try {
                if (unsubscribeProducts && typeof unsubscribeProducts === 'function') {
                    unsubscribeProducts();
                }
                if (unsubscribeCategories && typeof unsubscribeCategories === 'function') {
                    unsubscribeCategories();
                }
            } catch (error) {
                console.error("Error during cleanup:", error);
            }
        };
    }, []);

    console.log("🟡 MyState rendering, categories:", categories);

    return (
        <MyContext.Provider value={{
            loading,
            setLoading,
            getAllProduct,
            categories,
            addNewCategory,
            addNewSubcategory,
            deleteCategory,
            deleteSubcategory
        }}>
            {children}
        </MyContext.Provider>
    );
}

export default MyState;