import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../Context/myContext";
import Loader from "../Loader";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../FireBase/FireBaseConfig";
import toast from "react-hot-toast";
import "../../Style/ProductDetail.css";

const ProductDetail = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProduct, getAllProductFunction } = context;

    const navigate = useNavigate();

    const deleteProduct = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, 'products', id));
            toast.success('Product Deleted successfully');
            getAllProductFunction();
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div>
           
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
                                            onClick={() => deleteProduct(id)}
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
