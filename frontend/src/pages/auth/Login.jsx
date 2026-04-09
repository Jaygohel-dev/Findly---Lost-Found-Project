import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import useForm from '@/hooks/useForm';
import Input   from '@/components/ui/Input';
import Button  from '@/components/ui/Button';
import Alert   from '@/components/ui/Alert';

const validate = (v) => {
  const e = {};
  if (!v.email)                         e.email    = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(v.email)) e.email = 'Enter a valid email';
  if (!v.password)                      e.password = 'Password is required';
  return e;
};

const EyeIcon = ({ open }) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {open
      ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    }
  </svg>
);

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';
  const [showPw, setShowPw]   = useState(false);
  const [serverErr, setServerErr] = useState('');

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useForm({ email: '', password: '' }, validate, async (vals) => {
      setServerErr('');
      await login(vals);
      navigate(from, { replace: true });
    });

  const onSubmit = async (e) => {
    setServerErr('');
    try { await handleSubmit(e); }
    catch (err) { setServerErr(err.response?.data?.message || 'Login failed. Please try again.'); }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to your Findly account</p>
      </div>

      {serverErr && <Alert message={serverErr} className="mb-5" />}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input label="Email address" name="email" type="email" placeholder="you@example.com"
          value={values.email} onChange={handleChange} onBlur={handleBlur}
          error={touched.email && errors.email} required autoComplete="email"
          leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
        />
        <Input label="Password" name="password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
          value={values.password} onChange={handleChange} onBlur={handleBlur}
          error={touched.password && errors.password} required autoComplete="current-password"
          leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}
          rightIcon={<button type="button" onClick={() => setShowPw(p => !p)} className="hover:text-gray-600"><EyeIcon open={showPw} /></button>}
        />
        <Button type="submit" className="w-full mt-2" isLoading={isSubmitting} loadingText="Signing in…">Sign in</Button>
      </form>

      {/* Demo credentials */}
      {/* <div className="mt-5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Demo accounts</p>
        <div className="flex gap-2">
          {[{ label: '👤 User', email: 'rahul@demo.com', pw: 'User@1234' }, { label: '🛡 Admin', email: 'admin@findly.com', pw: 'Admin@123' }].map(d => (
            <button key={d.label} type="button"
              className="flex-1 text-xs py-2 px-3 bg-white border border-gray-200 rounded-lg hover:border-brand-400 hover:text-brand-700 transition-colors font-medium"
              onClick={() => { document.querySelector('[name=email]').value = d.email; document.querySelector('[name=password]').value = d.pw; handleChange({ target: { name: 'email', value: d.email } }); handleChange({ target: { name: 'password', value: d.pw } }); }}>
              {d.label}
            </button>
          ))}
        </div>
      </div> */}

      <p className="mt-5 text-center text-sm text-gray-500">
        No account?{' '}
        <Link to="/auth/register" className="font-semibold text-brand-600 hover:text-brand-700">Create one free</Link>
      </p>
    </div>
  );
}
