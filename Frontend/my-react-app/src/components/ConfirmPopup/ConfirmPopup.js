import React from 'react';
import './ConfirmPopup.css'
const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h3>{message}</h3>
                <div className="popup-buttons">
                    <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPopup;