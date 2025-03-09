import { useState, useEffect } from 'react';
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
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
                extractCategories(productArray);
                setLoading(false);
            });
            return unsubscribe;
        } catch (error) {
            console.error("Error fetching products: ", error);
            setLoading(false);
        }
    };

    const extractCategories = (products) => {
        const categoryMap = {};
        products.forEach(product => {
            const { category1, subcategory1, category2, subcategory2, category3, subcategory3, category4, subcategory4 } = product;
            [category1, category2, category3, category4].forEach((cat, index) => {
                if (cat) {
                    if (!categoryMap[cat]) {
                        categoryMap[cat] = new Set();
                    }
                    const subcat = product[`subcategory${index + 1}`];
                    if (subcat) {
                        categoryMap[cat].add(subcat);
                    }
                }
            });
        });
        const finalCategories = {};
        for (let [category, subcategories] of Object.entries(categoryMap)) {
            finalCategories[category] = Array.from(subcategories);
        }
        setCategorie(finalCategories);
    };

    const addNewCategory = (newCategory) => {
        setCategorie((prevCategories) => ({
            ...prevCategories,
            [newCategory]: []
        }));
    };

    const addNewSubcategory = (category, newSubcategory) => {
        setCategorie((prevCategories) => ({
            ...prevCategories,
            [category]: [...prevCategories[category], newSubcategory]
        }));
    };

    useEffect(() => {
        const unsubscribeProducts = getAllProductFunction();

        return () => {
            if (unsubscribeProducts) unsubscribeProducts();
        };
    }, []);

    return (
        <MyContext.Provider value={{
            loading,
            setLoading,
            getAllProduct,
            categories,
            addNewCategory,
            addNewSubcategory,
        }}>
            {children}
        </MyContext.Provider>
    );
}

export default MyState;
