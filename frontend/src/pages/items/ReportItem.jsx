import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItemAPI } from '@/services/item.service';
import { CATEGORIES } from '@/utils/constants';
import Button from '@/components/ui/Button';
import Alert  from '@/components/ui/Alert';
import toast  from 'react-hot-toast';

const Section = ({ title, children }) => (
  <div className="card card-body space-y-4">
    <h2 className="font-semibold text-gray-900 pb-3 border-b border-gray-100">{title}</h2>
    {children}
  </div>
);

export default function ReportItem() {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState('');
  const [previews, setPreviews] = useState([]);
  const [files,    setFiles]    = useState([]);

  const [form, setForm] = useState({
    type: 'lost', title: '', description: '', category: '',
    address: '', lat: '', lng: '',
    date: new Date().toISOString().split('T')[0],
    color: '', brand: '', reward: '',
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files).slice(0, 5);
    setFiles(picked);
    setPreviews(picked.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (i) => {
    setFiles((p) => p.filter((_, j) => j !== i));
    setPreviews((p) => p.filter((_, j) => j !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.address)
      return setError('Please fill all required fields.');
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append('images', f));
      const { data } = await createItemAPI(fd);
      const { item, potentialMatches } = data.data;
      if (potentialMatches?.length > 0)
        toast.success(`Item reported! Found ${potentialMatches.length} potential match(es) 🎯`);
      else
        toast.success('Item reported successfully!');
      navigate(`/items/${item._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div className="page-wrap max-w-2xl">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Report an Item</h1>
          <p className="text-gray-500 mt-1">Fill in the details to help us find a match</p>
        </div>

        {error && <Alert message={error} className="mb-5" />}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type */}
          <Section title="What are you reporting?">
            <div className="grid grid-cols-2 gap-3">
              {['lost', 'found'].map((t) => (
                <button key={t} type="button" onClick={() => setForm((p) => ({ ...p, type: t }))}
                  className={`p-5 rounded-2xl border-2 text-center transition-all ${form.type === t ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-3xl mb-2">{t === 'lost' ? '😟' : '😊'}</div>
                  <div className="font-semibold text-gray-900 capitalize">I {t} something</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t === 'lost' ? 'Report a lost item' : 'Report a found item'}</div>
                </button>
              ))}
            </div>
          </Section>

          {/* Item details */}
          <Section title="Item Details">
            <div>
              <label className="label">Title <span className="text-red-500">*</span></label>
              <input className="input" placeholder="e.g. Black leather wallet, Samsung Galaxy S21" value={form.title} onChange={set('title')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Category <span className="text-red-500">*</span></label>
                <select className="input" value={form.category} onChange={set('category')}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(({ value, label, icon }) => (
                    <option key={value} value={value}>{icon} {label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Date {form.type === 'lost' ? 'lost' : 'found'} <span className="text-red-500">*</span></label>
                <input className="input" type="date" value={form.date} onChange={set('date')} max={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div>
              <label className="label">Description <span className="text-red-500">*</span></label>
              <textarea className="input min-h-[90px] resize-y" placeholder="Describe the item — color, size, unique marks, what's inside…" value={form.description} onChange={set('description')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Color</label>
                <input className="input" placeholder="e.g. Black, Blue" value={form.color} onChange={set('color')} />
              </div>
              <div>
                <label className="label">Brand / Make</label>
                <input className="input" placeholder="e.g. Apple, Samsung" value={form.brand} onChange={set('brand')} />
              </div>
            </div>
            {form.type === 'lost' && (
              <div>
                <label className="label">Reward (optional)</label>
                <input className="input" placeholder="e.g. ₹500 reward for return" value={form.reward} onChange={set('reward')} />
              </div>
            )}
          </Section>

          {/* Location */}
          <Section title="Location">
            <div>
              <label className="label">Address / Area <span className="text-red-500">*</span></label>
              <input className="input" placeholder="e.g. Maninagar Bus Stand, Ahmedabad" value={form.address} onChange={set('address')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Latitude (optional)</label>
                <input className="input" type="number" step="any" placeholder="23.0225" value={form.lat} onChange={set('lat')} />
              </div>
              <div>
                <label className="label">Longitude (optional)</label>
                <input className="input" type="number" step="any" placeholder="72.5714" value={form.lng} onChange={set('lng')} />
              </div>
            </div>
          </Section>

          {/* Photos */}
          <Section title="Photos (optional)">
            <p className="text-sm text-gray-500 -mt-1">Upload up to 5 photos. Clear images increase recovery chances significantly.</p>
            <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-colors">
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              <span className="text-3xl">📷</span>
              <span className="text-sm font-medium text-gray-600">Click to upload images (JPG, PNG, max 5MB each)</span>
            </label>
            {previews.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-2">
                {previews.map((p, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={p} alt="" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                    <button type="button" onClick={() => removeFile(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">×</button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Button type="submit" className="w-full" size="lg" isLoading={loading} loadingText="Submitting report…">
            Submit {form.type === 'lost' ? 'Lost' : 'Found'} Item Report
          </Button>
        </form>
      </div>
    </div>
  );
}
