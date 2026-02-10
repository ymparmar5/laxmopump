import { useState, useEffect } from 'react';
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, getDoc, setDoc, getDocs } from 'firebase/firestore';
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
      
        
        try {
            const formattedName = categoryName.trim();
            
            if (!formattedName) {
              
                toast.error("Category name cannot be empty.");
                return;
            }

          
            const docRef = doc(fireDB, "categories", formattedName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
               
                toast.error(`Category "${formattedName}" already exists.`);
                return;
            }

          
            await setDoc(docRef, {
                id: formattedName,
                name: formattedName,
                image: '',
                subcategories: [],
                subcategoryImages: {}
            });

            toast.success(`Category "${formattedName}" added successfully.`);
        } catch (error) {
            console.error("❌ Error adding category:", error);
            console.error("Error details:", error.message);
            toast.error(`Failed to add category: ${error.message}`);
        }
    };

    // Delete Category
    const deleteCategory = async (categoryToDelete) => {
     
        
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
          
            toast.success(`Category "${formattedName}" deleted successfully.`);
        } catch (error) {
            console.error("❌ Error deleting category:", error);
            toast.error(`Failed to delete category: ${error.message}`);
        }
    };

    // Update Category
    const updateCategory = async (oldCategoryName, newCategoryName) => {
      
        
        try {
            const formattedOld = oldCategoryName.trim();
            const formattedNew = newCategoryName.trim();
            
            if (!formattedOld || !formattedNew) {
                toast.error("Category names cannot be empty.");
                return;
            }

            if (formattedOld === formattedNew) {
                toast.error("New category name must be different from the old one.");
                return;
            }

            // Check if old category exists
            const oldRef = doc(fireDB, "categories", formattedOld);
            const oldDocSnap = await getDoc(oldRef);
            
            if (!oldDocSnap.exists()) {
                toast.error(`Category "${formattedOld}" not found in database.`);
                return;
            }

            // Check if new category name already exists
            const newRef = doc(fireDB, "categories", formattedNew);
            const newDocSnap = await getDoc(newRef);
            
            if (newDocSnap.exists()) {
                toast.error(`Category "${formattedNew}" already exists.`);
                return;
            }

            // Get old category data
            const oldData = oldDocSnap.data();
            
            // Create new category with old category's data
            await setDoc(newRef, {
                id: formattedNew,
                name: formattedNew,
                image: oldData.image || '',
                subcategories: oldData.subcategories || [],
                subcategoryImages: oldData.subcategoryImages || {}
            });

            // Update all products that use the old category name
            const productsRef = collection(fireDB, "products");
            const productsSnapshot = await getDocs(productsRef);
            
            const updatePromises = [];
            productsSnapshot.forEach((productDoc) => {
                const productData = productDoc.data();
                const updates = {};
                let needsUpdate = false;

                // Check all 4 category fields
                for (let i = 1; i <= 4; i++) {
                    if (productData[`category${i}`] === formattedOld) {
                        updates[`category${i}`] = formattedNew;
                        needsUpdate = true;
                    }
                }

                if (needsUpdate) {
                    updatePromises.push(updateDoc(productDoc.ref, updates));
                }
            });

            await Promise.all(updatePromises);

            // Delete old category
            await deleteDoc(oldRef);

      
            toast.success(`Category updated from "${formattedOld}" to "${formattedNew}".`);
        } catch (error) {
            console.error("❌ Error updating category:", error);
            toast.error(`Failed to update category: ${error.message}`);
            throw error;
        }
    };

    // Add New Subcategory
    const addNewSubcategory = async (category, subcategoryName) => {
      
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

          
            toast.success(`Subcategory "${formattedSub}" added to "${category}".`);
        } catch (error) {
            console.error("❌ Error adding subcategory:", error);
            toast.error(`Failed to add subcategory: ${error.message}`);
        }
    };

    // Delete Subcategory
    const deleteSubcategory = async (category, subcategoryName) => {
    
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

         
            toast.success(`Subcategory "${formattedSub}" deleted from "${category}".`);
        } catch (error) {
            console.error("❌ Error deleting subcategory:", error);
            toast.error(`Failed to delete subcategory: ${error.message}`);
        }
    };

    // Update Subcategory
    const updateSubcategory = async (category, oldSubcategoryName, newSubcategoryName) => {
    
        try {
            const formattedOld = oldSubcategoryName.trim();
            const formattedNew = newSubcategoryName.trim();
            
            if (!formattedOld || !formattedNew) {
                toast.error("Subcategory names cannot be empty.");
                return;
            }

            if (formattedOld === formattedNew) {
                toast.error("New subcategory name must be different from the old one.");
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

            // Check if old subcategory exists
            const oldExists = currentSubs.some((s) => s.toLowerCase() === formattedOld.toLowerCase());
            if (!oldExists) {
                toast.error(`Subcategory "${formattedOld}" not found in "${category}".`);
                return;
            }

            // Check if new subcategory name already exists
            const newExists = currentSubs.some((s) => s.toLowerCase() === formattedNew.toLowerCase());
            if (newExists) {
                toast.error(`Subcategory "${formattedNew}" already exists in "${category}".`);
                return;
            }

            // Update subcategory name in the array
            const updatedSubs = currentSubs.map((s) => 
                s.toLowerCase() === formattedOld.toLowerCase() ? formattedNew : s
            );

            await updateDoc(categoryRef, {
                subcategories: updatedSubs
            });

            // Update all products that use this subcategory
            const productsRef = collection(fireDB, "products");
            const productsSnapshot = await getDocs(productsRef);
            
            const updatePromises = [];
            productsSnapshot.forEach((productDoc) => {
                const productData = productDoc.data();
                const updates = {};
                let needsUpdate = false;

                // Check all 4 subcategory fields
                for (let i = 1; i <= 4; i++) {
                    if (productData[`category${i}`] === category && 
                        productData[`subcategory${i}`] === formattedOld) {
                        updates[`subcategory${i}`] = formattedNew;
                        needsUpdate = true;
                    }
                }

                if (needsUpdate) {
                    updatePromises.push(updateDoc(productDoc.ref, updates));
                }
            });

            await Promise.all(updatePromises);

           
            toast.success(`Subcategory updated from "${formattedOld}" to "${formattedNew}" in "${category}".`);
        } catch (error) {
            console.error("❌ Error updating subcategory:", error);
            toast.error(`Failed to update subcategory: ${error.message}`);
            throw error;
        }
    };

    useEffect(() => {
       
        let unsubscribeProducts = null;
        let unsubscribeCategories = null;

        try {
            unsubscribeProducts = getAllProductFunction();
            unsubscribeCategories = getCategoriesFromFirestore();
        
        } catch (error) {
            console.error("❌ Error setting up listeners:", error);
        }

        return () => {
          
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

  
    return (
        <MyContext.Provider value={{
            loading,
            setLoading,
            getAllProduct,
            categories,
            addNewCategory,
            deleteCategory,
            updateCategory,
            addNewSubcategory,
            deleteSubcategory,
            updateSubcategory
        }}>
            {children}
        </MyContext.Provider>
    );
}

export default MyState;