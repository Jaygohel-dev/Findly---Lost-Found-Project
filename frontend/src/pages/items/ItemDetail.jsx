import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchItemAPI, deleteItemAPI, recoverItemAPI } from '@/services/item.service';
import { fetchMessagesAPI, sendMessageAPI } from '@/services/message.service';
import { useAuth } from '@/context/AuthContext';
import { TypeBadge, StatusBadge, CategoryBadge } from '@/components/ui/Badge';
import Avatar  from '@/components/ui/Avatar';
import Button  from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { formatDate, timeAgo } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [item,     setItem]    = useState(null);
  const [loading,  setLoading] = useState(true);
  const [msgs,     setMsgs]    = useState([]);
  const [newMsg,   setNewMsg]  = useState('');
  const [sending,  setSending] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchItemAPI(id)
      .then(({ data }) => setItem(data.data.item))
      .catch(() => { toast.error('Item not found'); navigate('/items'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (user && item && item.owner._id !== user.id) {
      fetchMessagesAPI(id).then(({ data }) => setMsgs(data.data.messages || []));
    }
  }, [user, item, id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      const { data } = await sendMessageAPI({ itemId: id, receiverId: item.owner._id, content: newMsg });
      setMsgs((p) => [...p, data.data.message]);
      setNewMsg('');
    } catch { toast.error('Failed to send message'); }
    finally { setSending(false); }
  };

  const handleRecover = async () => {
    try {
      await recoverItemAPI(id);
      setItem((p) => ({ ...p, status: 'recovered' }));
      toast.success('Marked as recovered! 🎉');
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this item?')) return;
    try { await deleteItemAPI(id); toast.success('Item deleted'); navigate('/my-items'); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size="xl" /></div>;
  if (!item)   return null;

  const isOwner    = user?.id === item.owner._id;
  const canMessage = user && !isOwner;

  return (
    <div className="page-section">
      <div className="page-wrap">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-5 flex items-center gap-1.5">
          <Link to="/items" className="hover:text-brand-600 transition-colors">Browse Items</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Image gallery */}
            <div className="card overflow-hidden">
              <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                {item.images?.length > 0
                  ? <img src={item.images[activeImg]} alt={item.title} className="w-full h-full object-cover" />
                  : <span className="text-8xl">📦</span>
                }
              </div>
              {item.images?.length > 1 && (
                <div className="flex gap-2 p-3">
                  {item.images.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 object-cover rounded-xl cursor-pointer border-2 transition-colors ${i === activeImg ? 'border-brand-500' : 'border-transparent opacity-60 hover:opacity-100'}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="card card-body">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <TypeBadge type={item.type} />
                <StatusBadge status={item.status} />
                <CategoryBadge category={item.category} />
              </div>
              <h1 className="font-serif text-2xl font-bold text-gray-900 mb-3">{item.title}</h1>
              <p className="text-gray-600 leading-relaxed mb-5">{item.description}</p>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4">
                {[
                  { label: '📍 Location', value: item.location?.address },
                  { label: '📅 Date',     value: formatDate(item.date) },
                  item.color && { label: '🎨 Color',  value: item.color },
                  item.brand && { label: '🏷 Brand',  value: item.brand },
                  item.reward && { label: '🎁 Reward', value: item.reward },
                  { label: '👁 Views',    value: item.views },
                ].filter(Boolean).map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              {isOwner && (
                <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
                  {item.status === 'active' && (
                    <Button size="sm" onClick={handleRecover}>✅ Mark as Recovered</Button>
                  )}
                  <Button variant="danger" size="sm" onClick={handleDelete}>🗑 Delete</Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Owner card */}
            <div className="card card-body">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {item.type === 'lost' ? 'Item Owner' : 'Found By'}
              </p>
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={item.owner.name} src={item.owner.avatar} size="md" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.owner.name}</p>
                  <p className="text-xs text-gray-500">
                    ⭐ {item.owner.rating || 0} · {item.owner.itemsRecovered || 0} recovered
                  </p>
                </div>
              </div>
              {item.owner.city && <p className="text-xs text-gray-400">📍 {item.owner.city}</p>}
              <p className="text-xs text-gray-300 mt-1">Posted {timeAgo(item.createdAt)}</p>
            </div>

            {/* Messaging */}
            {!user ? (
              <div className="card card-body text-center">
                <p className="text-sm text-gray-500 mb-4">Sign in to contact the {item.type === 'lost' ? 'owner' : 'finder'}</p>
                <Link to="/auth/login" className="btn-primary w-full text-sm">Sign in to message</Link>
              </div>
            ) : isOwner ? (
              <div className="card card-body">
                <p className="text-sm font-semibold text-gray-800 mb-3">📬 Incoming messages</p>
                {msgs.length === 0
                  ? <p className="text-sm text-gray-400">No messages yet.</p>
                  : <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                      {msgs.map((m) => (
                        <div key={m._id} className="flex items-start gap-2">
                          <Avatar name={m.sender?.name} size="xs" />
                          <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm flex-1">
                            <p className="font-medium text-xs text-gray-500 mb-0.5">{m.sender?.name}</p>
                            <p className="text-gray-700">{m.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            ) : canMessage ? (
              <div className="card card-body">
                <p className="text-sm font-semibold text-gray-800 mb-3">💬 Contact {item.type === 'lost' ? 'Owner' : 'Finder'}</p>
                <div className="max-h-56 overflow-y-auto scrollbar-hide space-y-2 mb-3">
                  {msgs.map((m) => (
                    <div key={m._id} className={`flex ${m.sender._id === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.sender._id === user.id ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input className="input flex-1 text-sm py-2" placeholder="Type a message…"
                    value={newMsg} onChange={(e) => setNewMsg(e.target.value)} />
                  <Button type="submit" size="sm" isLoading={sending} loadingText="">Send</Button>
                </form>
                <p className="text-xs text-gray-400 mt-2">Your identity is kept anonymous until recovery is confirmed.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
