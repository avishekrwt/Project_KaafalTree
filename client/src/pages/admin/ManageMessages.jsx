import { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import AdminTable from '../../components/admin/AdminTable';
import StatusBadge from '../../components/admin/StatusBadge';
import './admin.css';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getMessages();
      setMessages(response.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading messages..." />;
  if (error) return <ErrorMessage message={error} actionLabel="Retry" onAction={load} />;

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Messages</h1>
          <p>Track guest contact form submissions and response status.</p>
        </div>
      </div>

      <AdminTable
        rows={messages}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'message', label: 'Message' },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="admin-actions">
                <button type="button" className="btn btn-outline" onClick={() => adminApi.updateMessage(row.id, { status: row.status === 'new' ? 'responded' : 'new' }).then(load)}>
                  {row.status === 'new' ? 'Mark Responded' : 'Mark New'}
                </button>
                <button type="button" className="btn btn-primary" onClick={() => adminApi.deleteMessage(row.id).then(load)}>Delete</button>
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
