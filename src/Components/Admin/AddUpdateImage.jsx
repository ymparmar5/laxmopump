import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { fireDB } from "../../FireBase/FireBaseConfig";
import { useNavigate } from "react-router";
import myContext from '../../Context/myContext';
import "../../Style/AddProductPage.css";
import { uploadImage } from './CloudnaryImages';

const AddUpdateImage = () => {

    const navigate = useNavigate();
    const [homeImages, setHomeImages] = useState({

        imgurl1: "",
        imgurl2: "",
        imgurl3: "",
        imgurl4: "",
        imgurl5: "",

        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    });


    const saveImages = async () => {
        try {
            await addDoc(collection(fireDB, "Images"), product);
            toast.success("image added successfully!");
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
                setHomeImages((prevImg) => ({
                    ...prevImg,
                    [e.target.name]: url,
                }));
            } catch (error) {
                toast.error('Image upload failed');
            }
        }
    };

    return (
        <div className="add-product-container">
            <div className="add-product-form-wrapper">
                <div className="add-product-form-header">
                    <h2>Add Home page Images</h2>
                </div>
                <div className="add-product-form">
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
                        <button className="add-product-add-btn" onClick={saveImages}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
            <div className="add-product-form-wrapper">
                <div className="add-product-form-header">
                    <h2>Add Contact page Images</h2>
                </div>
                <div className="add-product-form">
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
                        <button className="add-product-add-btn" onClick={saveImages}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
            <div className="add-product-form-wrapper">
                <div className="add-product-form-header">
                    <h2>Add About page Images</h2>
                </div>
                <div className="add-product-form">
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
                        <button className="add-product-add-btn" onClick={saveImages}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUpdateImage;

