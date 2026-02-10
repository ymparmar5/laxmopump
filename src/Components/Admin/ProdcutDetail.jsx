import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../Context/myContext";
import Loader from "../Loader";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../FireBase/FireBaseConfig";
import toast from "react-hot-toast";
import "../../Style/ProductDetail.css";
import { useState } from "react";

const ProductDetail = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProduct, getAllProductFunction } = context;

    const navigate = useNavigate();

    // State for delete confirmation popup
    const [deleteId, setDeleteId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const deleteProduct = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'products', id));
            toast.success('Product Deleted successfully');
            getAllProductFunction();
            setLoading(false);
        } catch (error) {
          
            setLoading(false);
        }
    }

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteProduct(deleteId);
        }
        setShowConfirm(false);
        setDeleteId(null);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setDeleteId(null);
    };

    return (
        <div>
            {showConfirm && (
                <div className="popup-overlay delete-confirm-overlay">
                    <div className="popup-container delete-confirm-container">
                        {/* Close button */}
                        <button className="delete-confirm-close" onClick={handleCancelDelete} aria-label="Close">&times;</button>
                        {/* Warning icon */}
                        <div className="delete-confirm-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12" fill="#FFF3CD"/>
                                <path d="M12 7V13" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="12" cy="16" r="1" fill="#FFA500"/>
                            </svg>
                        </div>
                        <h2 className="delete-confirm-title">Delete Product?</h2>
                        <p className="delete-confirm-message">This action cannot be undone. Are you sure you want to permanently delete this product?</p>
                        <div className="delete-confirm-actions">
                            <button className="delete-confirm-btn delete" onClick={handleConfirmDelete}>Yes, Delete</button>
                            <button className="delete-confirm-btn cancel" onClick={handleCancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
           
            {loading && (
                <div className="loader-container">
                    <Loader />
                </div>
            )}
            <div className="w-full overflow-x-auto mb-5">
                <table className="compact-table w-full text-left border border-collapse sm:border-separate border-indigo-100 text-indigo-400">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Image</th>
                            <th>Title</th>


                            <th colSpan="2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllProduct.map((item, index) => {
                            const { id, title,  category,  imgurl1 } = item;
                            return (
                                <tr key={index} className="text-indigo-300">
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="flex justify-center">
                                            <img src={imgurl1} alt={title} />
                                        </div>
                                    </td>
                                    <td>{title}</td>
                              
                                    
                                    <td className="actions">
                                        <button
                                            className="edit"
                                            onClick={() => navigate(`/update-product/${id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete"
                                            onClick={() => handleDeleteClick(id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductDetail;
