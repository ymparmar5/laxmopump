import React, { useContext } from 'react';
import ProductDetail from './ProdcutDetail';
import myContext from '../../Context/myContext';
import '../../Style/AdminDashboard.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { getAllProduct } = context;

    return (
        <div className="dashboard-container">
            <div className="user-info-container">
                <img className="user-photo" src="/admin.png" alt="User" />
                <div className="user-details">
                    <h1><span className="font-bold">Name: </span>{user?.name}</h1>
                    <h1><span className="font-bold">Email: </span>{user?.email}</h1>
                    <h1><span className="font-bold">Role: </span>{user?.role}</h1>
                </div>
                <Link  to={'/AddProductPage'}>
                    <button className="compact-button">Add Product</button>
                </Link>
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
