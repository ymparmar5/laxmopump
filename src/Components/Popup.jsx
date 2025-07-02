import React, { useState } from 'react';
import { X, Building2, Mail, Phone, FileText, User } from 'lucide-react';
import '../Style/Popup.css';

const Popup = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gstNumber: '',
    companyName: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
 
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
  const formErrors = validateForm();

  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  setIsSubmitting(true);

  // Prepare WhatsApp message
  const message = `New Inquiry:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.companyName}`;

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp link (you can open this in a new tab or the same window)
  const whatsappURL = `https://wa.me/919316755501?text=${encodedMessage}`;

  // Simulate form submission
  setTimeout(() => {
    console.log('Form submitted:', formData);

    // Open WhatsApp with pre-filled message
    window.open(whatsappURL, '_blank'); // open in new tab

    alert('Thank you for your interest! We will contact you soon.');
    onClose();
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      companyName: ''
    });
  }, 1500);
};

  if (!isVisible) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      {/* Popup Container */}
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="popup-header">
          <div className="popup-header-content">
            <div className="popup-header-info">
              <Building2 className="popup-header-icon" />
              <div>
                <h2 className="popup-title">Become a Dealer</h2>
                <p className="popup-subtitle">Join our network today</p>
              </div>
            </div>
            
            <button onClick={onClose} className="popup-close-btn">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="popup-form">
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label">
              <User className="form-label-icon" />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">
              <Mail className="form-label-icon" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label className="form-label">
              <Phone className="form-label-icon" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>

          {/* Company Name Field */}
          <div className="form-group">
            <label className="form-label">
              <Building2 className="form-label-icon" />
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={`form-input ${errors.companyName ? 'error' : ''}`}
              placeholder="Enter your company name"
            />
            {errors.companyName && <div className="form-error">{errors.companyName}</div>}
          </div>



          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="popup-submit-btn"
          >
            {isSubmitting ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Application'
            )}
          </button>

          <p className="popup-terms">
            By submitting, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Popup;