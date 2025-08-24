'use client'
import React from 'react';

const FloatingWhatsApp = () => {

  const handleWhatsAppClick = () => {
    const phoneNumber = "7480082596"; // Replace with your WhatsApp number
    const message = "Hello! I need assistance."; // Default message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="floating-whatsapp" onClick={handleWhatsAppClick}>
      <img
        src="/whatsapp-icon.svg" // Add a WhatsApp icon to your public folder
        alt="WhatsApp"
        className="whatsapp-icon"
      />
      
    </div>
  );
};

export default FloatingWhatsApp;
