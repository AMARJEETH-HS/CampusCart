import axios from 'axios';
import { useEffect, useState } from 'react';

// Simulated current user ID (replace this with actual logic in real app)
const currentUserId = '67f936626f5e53efaedc9103';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState('');

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error.response?.data || error.message);
    }
  };

  const handlePost = async () => {
    try {
      if (!newAnnouncement.trim()) return;
      await axios.post('/api/announcements', { message: newAnnouncement });
      setNewAnnouncement('');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error posting announcement:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error.response?.data || error.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      if (!editMessage.trim()) return;
      await axios.put(`/api/announcements/${id}`, { message: editMessage });
      setEditId(null);
      setEditMessage('');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error editing announcement:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Announcements</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          placeholder="Write an announcement"
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={handlePost} style={{ padding: '8px 16px' }}>Post</button>
      </div>

      {announcements.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {announcements.map((a) => (
            <li
              key={a._id}
              style={{
                border: '1px solid #ccc',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
              }}
            >
              {editId === a._id ? (
                <>
                  <input
                    type="text"
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    style={{ padding: '6px', width: '70%' }}
                  />
                  <button onClick={() => handleEdit(a._id)} style={{ marginLeft: '10px' }}>Save</button>
                  <button onClick={() => setEditId(null)} style={{ marginLeft: '5px' }}>Cancel</button>
                </>
              ) : (
                <>
                  <p><strong>Message:</strong> {a.message}</p>
                  <p><strong>Posted by:</strong> {a.user?.name} ({a.user?.email})</p>

                  {a.user?._id === currentUserId && (
                    <>
                      <button
                        onClick={() => {
                          setEditId(a._id);
                          setEditMessage(a.message);
                        }}
                        style={{ marginRight: '8px', backgroundColor: '#2196F3', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        style={{ backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px' }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No announcements available.</p>
      )}
    </div>
  );
};

export default AnnouncementPage;
