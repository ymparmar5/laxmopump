import { Timestamp, addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { fireDB } from "../../FireBase/FireBaseConfig";
import { useNavigate } from "react-router";
import "../../Style/AddProductPage.css";
import { uploadImage } from './CloudnaryImages';

const AddUpdateImage = () => {
  const navigate = useNavigate();

  const initialImageState = {
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
  };

  const [homeImages, setHomeImages] = useState(initialImageState);
  const [aboutImages, setAboutImages] = useState(initialImageState);
  const [previewHomeImages, setPreviewHomeImages] = useState([]);
  const [previewAboutImages, setPreviewAboutImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const [updatingImages, setUpdatingImages] = useState({});

  // Memoized function to create initial state with current timestamp
  const createInitialState = useCallback(() => ({
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
  }), []);

  const saveImages = async (type) => {
    const payload = type === 'home' ? homeImages : aboutImages;
    
    // Check if at least one image is uploaded
    const hasImages = Object.keys(payload).some(key => 
      key.startsWith('imgurl') && payload[key]
    );
    
    if (!hasImages) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(fireDB, "Images"), {
        ...payload,
        type,
      });
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} images added successfully!`);
      await fetchImages(); // refresh previews
      
      // Reset form with new timestamp
      const newInitialState = createInitialState();
      if (type === 'home') {
        setHomeImages(newInitialState);
      } else {
        setAboutImages(newInitialState);
      }
    } catch (error) {
      toast.error("Failed to add images. Please try again.");
      console.error("Firestore error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only JPEG, PNG, or WebP images");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const field = e.target.name;
    const uploadKey = `${type}-${field}`;
    
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));
    
    try {
      const url = await uploadImage(file);
      if (type === 'home') {
        setHomeImages((prev) => ({ ...prev, [field]: url }));
      } else {
        setAboutImages((prev) => ({ ...prev, [field]: url }));
      }
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const handleSavedImageUpdate = async (file, docId, field, type) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only JPEG, PNG, or WebP images");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const updateKey = `${docId}-${field}`;
    setUpdatingImages(prev => ({ ...prev, [updateKey]: true }));

    try {
      const url = await uploadImage(file);
      await updateDoc(doc(fireDB, "Images", docId), {
        [field]: url
      });
      toast.success("Image updated successfully!");
      await fetchImages(); // refresh previews
    } catch (error) {
      toast.error("Failed to update image. Please try again.");
      console.error("Update error:", error);
    } finally {
      setUpdatingImages(prev => ({ ...prev, [updateKey]: false }));
    }
  };

  const removeImage = (type, field) => {
    if (type === 'home') {
      setHomeImages(prev => ({ ...prev, [field]: "" }));
    } else {
      setAboutImages(prev => ({ ...prev, [field]: "" }));
    }
    toast.success("Image removed");
  };

  const deleteImageSet = async (docId, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} image set?`)) {
      return;
    }

    try {
      await deleteDoc(doc(fireDB, "Images", docId));
      toast.success("Image set deleted successfully!");
      await fetchImages();
    } catch (error) {
      toast.error("Failed to delete image set");
      console.error("Delete error:", error);
    }
  };

  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(fireDB, "Images"));
      const home = [];
      const about = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = { id: docSnapshot.id, ...docSnapshot.data() };
        if (data.type === "home") home.push(data);
        if (data.type === "about") about.push(data);
      });
      
      // Sort by timestamp (newest first)
      home.sort((a, b) => b.time?.seconds - a.time?.seconds);
      about.sort((a, b) => b.time?.seconds - a.time?.seconds);
      
      setPreviewHomeImages(home);
      setPreviewAboutImages(about);
    } catch (error) {
      toast.error("Failed to fetch images");
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const renderImageInputs = (type, imageState) =>
    [1, 2, 3, 4, 5].map((i) => {
      const field = `imgurl${i}`;
      const uploadKey = `${type}-${field}`;
      const isUploading = uploadingImages[uploadKey];
      
      return (
        <div className="add-product-form-group" key={i}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: '15px',
            border: '2px dashed #e2e8f0',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            transition: 'all 0.3s ease'
          }}>
            <label htmlFor={`${type}-${field}`} style={{ 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#4a5568',
              fontSize: '14px'
            }}>
              Image {i}
            </label>
            <input
              id={`${type}-${field}`}
              type="file"
              name={field}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => handleImageUpload(e, type)}
              disabled={isUploading}
              style={{ 
                marginBottom: '8px',
                padding: '8px',
                border: '1px solid #cbd5e0',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            />
            {isUploading && (
              <div style={{ 
                color: '#3182ce', 
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #3182ce',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Uploading...
              </div>
            )}
            {imageState[field] && (
              <div style={{ position: 'relative', marginTop: '8px' }}>
                <img
                  src={imageState[field]}
                  alt={`preview-${i}`}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(type, field)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      );
    });

  const renderPreviews = (images, type) =>
    images.map((item, index) => (
      <div key={item.id || index} style={{ 
        border: '1px solid #e2e8f0', 
        padding: '20px', 
        marginBottom: '20px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px',
          paddingBottom: '10px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div>
            <h4 style={{ 
              margin: '0 0 5px 0', 
              color: '#2d3748',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Images Set
            </h4>
            <small style={{ color: '#718096', fontSize: '12px' }}>
              Added on: {item.date}
            </small>
          </div>
          {item.id && (
            <button
              onClick={() => deleteImageSet(item.id, type)}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Delete Set
            </button>
          )}
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '15px' 
        }}>
          {[1, 2, 3, 4, 5].map((i) => {
            const field = `imgurl${i}`;
            const updateKey = `${item.id}-${field}`;
            const isUpdating = updatingImages[updateKey];
            
            return (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '15px',
                border: '2px dashed #e2e8f0',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                position: 'relative'
              }}>
                <label style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  Image {i}
                </label>
                
                {item[field] ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={item[field]}
                      alt={`saved-${i}`}
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #e2e8f0'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      padding: '5px',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0}
                    >
                      <label
                        htmlFor={`update-${item.id}-${field}`}
                        style={{
                          color: 'white',
                          fontSize: '10px',
                          cursor: 'pointer',    
                          fontWeight: '500'
                        }}
                      >
                        Click to update
                      </label>
                    </div>
                    <input
                      id={`update-${item.id}-${field}`}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => handleSavedImageUpdate(e.target.files[0], item.id, field, type)}
                      disabled={isUpdating}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    border: '2px dashed #cbd5e0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a0aec0',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}>
                    No image
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleSavedImageUpdate(e.target.files[0], item.id, field, type)}
                  disabled={isUpdating}
                  style={{
                    fontSize: '10px',
                    padding: '4px',
                    marginTop: '8px',
                    border: '1px solid #cbd5e0',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                />
                
                {isUpdating && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    padding: '10px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#3182ce'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #3182ce',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Updating...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ));

  return (
    <div className="add-product-container">
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Home Images */}
      <div className="add-product-form-wrapper">
        <div className="add-product-form-header">
          <h2>Add Home Page Images</h2>
          <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
            Upload images for the home page (JPEG, PNG, WebP - Max 5MB each)
          </p>
        </div>
        <div className="add-product-form">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            {renderImageInputs("home", homeImages)}
          </div>
       
        </div>
        
        <div className="preview-gallery" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#2d3748', fontSize: '18px' }}>
            Saved Home Images:
          </h3>
          {previewHomeImages.length > 0 ? (
            renderPreviews(previewHomeImages, 'home')
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#718096', 
              fontStyle: 'italic',
              backgroundColor: '#f7fafc',
              borderRadius: '8px',
              border: '2px dashed #e2e8f0'
            }}>
              No home images saved yet. Upload and save images above to see them here.
            </div>
          )}
        </div>
           <button 
            className="add-product-add-btn" 
            onClick={() => saveImages("home")}
            disabled={loading}
            style={{ 
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : 'Save Home Images'}
          </button>
      </div>

      {/* About Images */}
      <div className="add-product-form-wrapper" style={{ marginTop: '40px' }}>
        <div className="add-product-form-header">
          <h2>Add About Page Images</h2>
          <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
            Upload images for the about page (JPEG, PNG, WebP - Max 5MB each)
          </p>
        </div>
        <div className="add-product-form">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            {renderImageInputs("about", aboutImages)}
          </div>
         
        </div>
        
        <div className="preview-gallery" style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#2d3748', fontSize: '18px' }}>
            Saved About Images:
          </h3>
          {previewAboutImages.length > 0 ? (
            renderPreviews(previewAboutImages, 'about')
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#718096', 
              fontStyle: 'italic',
              backgroundColor: '#f7fafc',
              borderRadius: '8px',
              border: '2px dashed #e2e8f0'
            }}>
              No about images saved yet. Upload and save images above to see them here.
            </div>
          )}
        </div>
         <button 
            className="add-product-add-btn" 
            onClick={() => saveImages("about")}
            disabled={loading}
            style={{ 
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : 'Save About Images'}
          </button>
      </div>

    </div>
  );
};

export default AddUpdateImage;