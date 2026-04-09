import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfileAPI, changePasswordAPI } from '@/services/user.service';
import Avatar from '@/components/ui/Avatar';
import Alert  from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import toast  from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [prof,  setProf]  = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.city || '', avatar: user?.avatar || '' });
  const [pw,    setPw]    = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [profErr, setProfErr] = useState('');
  const [pwErr,   setPwErr]   = useState('');
  const [pwOk,    setPwOk]    = useState('');
  const [profLoading, setProfLoading] = useState(false);
  const [pwLoading,   setPwLoading]   = useState(false);

  const handleProfSubmit = async (e) => {
    e.preventDefault();
    if (!prof.name.trim() || prof.name.trim().length < 2) return setProfErr('Name must be at least 2 characters.');
    setProfErr(''); setProfLoading(true);
    try {
      const { data } = await updateProfileAPI(prof);
      updateUser(data.data.user);
      toast.success('Profile updated!');
    } catch (err) { setProfErr(err.response?.data?.message || 'Failed to update.'); }
    finally { setProfLoading(false); }
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (!pw.currentPassword || !pw.newPassword) return setPwErr('All fields are required.');
    if (pw.newPassword.length < 6) return setPwErr('New password must be at least 6 characters.');
    if (pw.confirmNew !== pw.newPassword) return setPwErr('Passwords do not match.');
    setPwErr(''); setPwOk(''); setPwLoading(true);
    try {
      await changePasswordAPI({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: '', newPassword: '', confirmNew: '' });
      setPwOk('Password changed successfully!');
      toast.success('Password updated!');
    } catch (err) { setPwErr(err.response?.data?.message || 'Failed to change password.'); }
    finally { setPwLoading(false); }
  };

  return (
    <div className="page-section">
      <div className="page-wrap">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-1">Manage your profile and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar preview */}
          <div className="card card-body flex flex-col items-center text-center gap-3 h-fit">
            <Avatar name={prof.name || user?.name} src={prof.avatar || user?.avatar} size="xl" />
            <div>
              <p className="font-bold text-gray-900">{prof.name || user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className="badge badge-active mt-2 capitalize">{user?.role}</span>
            </div>
            <div className="w-full pt-3 border-t border-gray-100 text-xs text-gray-400 space-y-1">
              <p>📋 {user?.itemsReported || 0} items reported</p>
              <p>✅ {user?.itemsRecovered || 0} items recovered</p>
              {user?.rating > 0 && <p>⭐ {user.rating} rating ({user.totalRatings} reviews)</p>}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            {/* Profile form */}
            <div className="card card-body">
              <h2 className="font-semibold text-gray-900 mb-4">Profile Information</h2>
              {profErr && <Alert message={profErr} className="mb-4" />}
              <form onSubmit={handleProfSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full name *</label>
                    <input className="input" value={prof.name} onChange={(e) => setProf(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" required />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" value={prof.phone} onChange={(e) => setProf(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input className="input" value={prof.city} onChange={(e) => setProf(p => ({ ...p, city: e.target.value }))} placeholder="Ahmedabad" />
                  </div>
                  <div>
                    <label className="label">Avatar URL</label>
                    <input className="input" value={prof.avatar} onChange={(e) => setProf(p => ({ ...p, avatar: e.target.value }))} placeholder="https://…" />
                  </div>
                </div>
                <div>
                  <label className="label">Email address</label>
                  <input className="input bg-gray-50 cursor-not-allowed" value={user?.email || ''} disabled readOnly />
                  <p className="helper-text">Email cannot be changed.</p>
                </div>
                <Button type="submit" isLoading={profLoading} loadingText="Saving…">Save Changes</Button>
              </form>
            </div>

            {/* Password form */}
            <div className="card card-body">
              <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
              {pwErr && <Alert message={pwErr} className="mb-4" />}
              {pwOk  && <Alert message={pwOk}  variant="success" className="mb-4" />}
              <form onSubmit={handlePwSubmit} className="space-y-4">
                {[
                  { label: 'Current password',  key: 'currentPassword', autocomplete: 'current-password' },
                  { label: 'New password',       key: 'newPassword',     autocomplete: 'new-password', hint: 'Min. 6 characters' },
                  { label: 'Confirm new password', key: 'confirmNew',    autocomplete: 'new-password' },
                ].map(({ label, key, autocomplete, hint }) => (
                  <div key={key}>
                    <label className="label">{label}</label>
                    <input className="input" type="password" placeholder="••••••••"
                      value={pw[key]} onChange={(e) => setPw(p => ({ ...p, [key]: e.target.value }))}
                      autoComplete={autocomplete} />
                    {hint && <p className="helper-text">{hint}</p>}
                  </div>
                ))}
                <Button type="submit" isLoading={pwLoading} loadingText="Updating…">Update Password</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
