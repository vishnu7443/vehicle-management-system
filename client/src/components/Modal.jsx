import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const Modal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmBtnClass = 'btn-danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={24} color="#ef4444" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{title}</h3>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className={`btn ${confirmBtnClass}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
