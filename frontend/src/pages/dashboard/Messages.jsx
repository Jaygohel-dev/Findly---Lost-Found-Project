import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchInboxAPI, fetchMessagesAPI, sendMessageAPI } from '@/services/message.service';
import { useAuth } from '@/context/AuthContext';
import { TypeBadge } from '@/components/ui/Badge';
import Avatar  from '@/components/ui/Avatar';
import Spinner from '@/components/ui/Spinner';
import { timeAgo } from '@/utils/helpers';

export default function Messages() {
  const { user } = useAuth();
  const [convs,    setConvs]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [msgs,     setMsgs]     = useState([]);
  const [newMsg,   setNewMsg]   = useState('');
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchInboxAPI()
      .then(({ data }) => {
        const list = data.data.conversations || [];
        setConvs(list);
        if (list.length > 0) selectConv(list[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const selectConv = async (conv) => {
    setSelected(conv);
    const { data } = await fetchMessagesAPI(conv.item._id);
    setMsgs(data.data.messages || []);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selected) return;
    const other = msgs.find((m) => m.sender._id !== user.id)?.sender;
    if (!other) return;
    setSending(true);
    try {
      const { data } = await sendMessageAPI({ itemId: selected.item._id, receiverId: other._id, content: newMsg });
      setMsgs((p) => [...p, data.data.message]);
      setNewMsg('');
    } finally { setSending(false); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  return (
    <div className="page-section">
      <div className="page-wrap">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        {convs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💬</div>
            <p className="font-semibold text-gray-700 mb-2">No conversations yet</p>
            <p className="text-sm text-gray-400 mb-6">Contact someone about a lost or found item to start a conversation.</p>
            <Link to="/items" className="btn-primary">Browse Items</Link>
          </div>
        ) : (
          <div className="card overflow-hidden" style={{ height: '600px' }}>
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-72 flex-shrink-0 border-r border-gray-100 overflow-y-auto scrollbar-hide">
                {convs.map((conv, i) => (
                  <button key={i} onClick={() => selectConv(conv)} className={`w-full text-left p-4 flex items-start gap-3 border-b border-gray-50 transition-colors hover:bg-gray-50 ${selected?.item._id === conv.item._id ? 'bg-brand-50' : ''}`}>
                    <div className="text-xl flex-shrink-0 mt-0.5">{conv.item.type === 'lost' ? '🔴' : '🟢'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{conv.item.title}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {conv.messages[0]?.content}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Chat window */}
              {selected ? (
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{selected.item.title}</p>
                      <Link to={`/items/${selected.item._id}`} className="text-xs text-brand-600 hover:underline">
                        View item →
                      </Link>
                    </div>
                    <TypeBadge type={selected.item.type} />
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-3">
                    {msgs.map((m) => {
                      const mine = m.sender._id === user.id;
                      return (
                        <div key={m._id} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
                          {!mine && <Avatar name={m.sender?.name} src={m.sender?.avatarUrl} size="xs" />}
                          <div>
                            {!mine && <p className="text-xs text-gray-400 mb-1 ml-1">{m.sender?.name}</p>}
                            <div className={`max-w-xs lg:max-w-md px-3.5 py-2.5 rounded-2xl text-sm ${mine ? 'bg-brand-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                              {m.content}
                            </div>
                            <p className={`text-xs text-gray-300 mt-1 ${mine ? 'text-right' : ''}`}>{timeAgo(m.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSend} className="flex gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0">
                    <input className="input flex-1 text-sm py-2.5" placeholder="Type a message…"
                      value={newMsg} onChange={(e) => setNewMsg(e.target.value)} />
                    <button type="submit" disabled={sending || !newMsg.trim()} className="btn-primary btn-sm px-5">
                      {sending ? '…' : 'Send'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  Select a conversation
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
