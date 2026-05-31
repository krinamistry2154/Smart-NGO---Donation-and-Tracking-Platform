import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    API.get("/contact")
      .then((res) => {
        const d = res.data;
        const rawList = Array.isArray(d) ? d : (d && Array.isArray(d.data) ? d.data : []);
        if (!Array.isArray(rawList)) console.warn('Unexpected /contact response', d);

        // Normalize fields so admin UI can handle different backend shapes
        const list = (rawList || []).map((m) => ({
          // ids: backend may use contactMessageId, id or _id
          id: m.id || m.contactMessageId || m._id,
          _id: m._id || m.contactMessageId || m.id,
          name: m.name || m.fullName || m.contactName,
          email: m.email,
          subject: m.subject,
          // content/message fields
          message: m.message || m.body || m.content,
          phone: m.phone || m.mobile,
          // timestamps: sentAt, createdAt, created_at, date
          createdAt: m.createdAt || m.sentAt || m.created_at || m.date,
          raw: m
        }));

        console.log('Messages loaded (normalized):', list);
        setMessages(list);
      })
      .catch((err) => {
        console.error(err);
        setMessages([]);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#333', marginBottom: '10px' }}>📬 Messages</h3>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>Total: <strong>{messages.length} message{messages.length !== 1 ? 's' : ''}</strong></p>
      </div>

      {messages.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📭</div>
          <h4 style={{ color: '#666' }}>No messages yet</h4>
          <p style={{ color: '#999' }}>Messages from contact forms will appear here</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {messages.map((m) => (
            <div
              key={m.id || m._id}
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedMessage?.id === m.id || selectedMessage?._id === m._id ? '2px solid #667eea' : '1px solid #e5e5e5'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => setSelectedMessage(m)}
            >
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #e8e68d 0%, #764ba2 100%)',
                color: 'white',
                padding: '16px',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
              }}>
                <h5 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '700',color: '#470547' }}>
                  {m.name || 'Anonymous'}
                </h5>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', opacity: 0.9, color: '#470547' }}>
                  ✉️ {m.email || 'N/A'}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.8, color: '#470547' }}>
                  📅 {formatDate(m.createdAt || m.created_at || m.date)}
                </p>
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                {m.subject && (
                  <p style={{
                    margin: '0 0 12px 0',
                    color: '#c3c1c3',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '8px'
                  }}>
                    <strong>Subject:</strong> {m.subject}
                  </p>
                )}
                <p style={{
                  margin: '0',
                  color: '#c3c1c1',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  maxHeight: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {m.message || m.content || m.body || 'N/A'}
                </p>
              </div>

              {/* Footer */}
              <div style={{
                background: '#f8f9fa',
                padding: '12px 16px',
                borderTop: '1px solid #e5e5e5',
                fontSize: '0.85rem',
                color: '#999'
              }}>
                {m.phone && <p style={{ margin: '5px 0 4px 0' }}>📱 {m.phone}</p>}
                <p style={{ margin: '5px 0 0 0' }}>Click to view full message</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail View Modal */}
      {selectedMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setSelectedMessage(null)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #e0ee68 0%, #764ba2 100%)',
              color: 'white',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start'
            }}>
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: '#410437', fontWeight: '700' }}>
                  {selectedMessage.name || 'Anonymous'}
                </h2>
                <p style={{ margin: '0 0 4px 0', opacity: 0.9 }}>✉️ {selectedMessage.email || 'N/A'}</p>
                <p style={{ margin: '0', opacity: 0.8 }}>📅 {formatDate(selectedMessage.createdAt || selectedMessage.created_at || selectedMessage.date)}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {selectedMessage.subject && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#96a5e8', margin: '0 0 8px 0' }}>Subject</h4>
                  <p style={{ margin: '0', color: '#c7c7c7', fontSize: '1rem' }}>
                    {selectedMessage.subject}
                  </p>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#96a5e8', margin: '0 0 8px 0' }}>Message</h4>
                <p style={{
                  margin: '0',
                  color: '#c7c7c7',
                  fontSize: '0.95rem',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}>
                  {selectedMessage.message || selectedMessage.content || selectedMessage.body || 'N/A'}
                </p>
              </div>

              {selectedMessage.phone && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#667eea', margin: '0 0 8px 0' }}>Contact</h4>
                  <p style={{ margin: '0', color: '#555' }}>📱 {selectedMessage.phone}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              background: '#f8f9fa',
              padding: '16px 24px',
              borderTop: '1px solid #e5e5e5',
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={() => setSelectedMessage(null)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #e0d269 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}