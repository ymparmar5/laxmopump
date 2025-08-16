import React, { useContext } from 'react';
import ProductDetail from './ProdcutDetail';
import myContext from '../../Context/myContext';
import '../../Style/AdminDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const navigate = useNavigate();
    const auth = getAuth();

    // Logout handler
    const handleLogout = async () => {
        try {
            // Firebase sign out
            await signOut(auth);

            // Clear localStorage
            localStorage.removeItem('users');
            localStorage.removeItem('role');

            // Redirect to login page
            navigate('/sign-in');  // Adjust the route to your login page
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="user-info-container">
                <img className="user-photo" src="/admin.enc" alt="User" />
                <div className="user-details">
                    <h1><span className="font-bold">Name: </span>{user?.name}</h1>
                    <h1><span className="font-bold">Email: </span>{user?.email}</h1>
                    <h1><span className="font-bold">Role: </span>{user?.role}</h1>
                </div>
                <Link to={'/AddProductPage'}>
                    <button className="compact-button">Add Product</button>
                </Link>
                <Link to={'/AddUpdateImage'}>
                    <button className="compact-button">Add/Update Images</button>
                </Link>

                <button className="compact-button" onClick={handleLogout}> Logout </button>

            </div>

            <div className="product-info">
                <div className="add-product">
                    <ProductDetail />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
