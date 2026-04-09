import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import useForm from '@/hooks/useForm';
import Input  from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert  from '@/components/ui/Alert';

const validate = (v) => {
  const e = {};
  if (!v.name || v.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
  if (!v.email || !/\S+@\S+\.\S+/.test(v.email)) e.email = 'Valid email required';
  if (!v.password || v.password.length < 6) e.password = 'Password must be at least 6 characters';
  if (v.confirmPassword !== v.password) e.confirmPassword = 'Passwords do not match';
  return e;
};

const pwStrength = (p) => {
  if (!p) return null;
  if (p.length < 6) return { label: 'Too short', color: 'bg-red-400',    w: 'w-1/4' };
  if (p.length < 8) return { label: 'Weak',      color: 'bg-orange-400', w: 'w-2/4' };
  if (p.length < 12) return { label: 'Good',     color: 'bg-yellow-400', w: 'w-3/4' };
  return              { label: 'Strong',          color: 'bg-brand-500',  w: 'w-full' };
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw]     = useState(false);
  const [serverErr, setServerErr] = useState('');

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useForm({ name: '', email: '', password: '', confirmPassword: '', phone: '', city: '' }, validate, async (vals) => {
      setServerErr('');
      await register(vals);
      navigate('/dashboard', { replace: true });
    });

  const onSubmit = async (e) => {
    setServerErr('');
    try { await handleSubmit(e); }
    catch (err) { setServerErr(err.response?.data?.message || 'Registration failed. Please try again.'); }
  };

  const strength = pwStrength(values.password);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-sm text-gray-500 mt-1">Join Findly — free forever</p>
      </div>

      {serverErr && <Alert message={serverErr} className="mb-4" />}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Input label="Full name" name="name" placeholder="Rahul Sharma"
          value={values.name} onChange={handleChange} onBlur={handleBlur}
          error={touched.name && errors.name} required />

        <Input label="Email address" name="email" type="email" placeholder="rahul@example.com"
          value={values.email} onChange={handleChange} onBlur={handleBlur}
          error={touched.email && errors.email} required autoComplete="email" />

        <div>
          <Input label="Password" name="password" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
            value={values.password} onChange={handleChange} onBlur={handleBlur}
            error={touched.password && errors.password} required autoComplete="new-password"
            rightIcon={
              <button type="button" onClick={() => setShowPw(p => !p)} className="hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            }
          />
          {strength && (
            <div className="mt-2">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`} />
              </div>
              <p className="text-xs text-gray-400 mt-1">Strength: {strength.label}</p>
            </div>
          )}
        </div>

        <Input label="Confirm password" name="confirmPassword" type={showPw ? 'text' : 'password'} placeholder="Re-enter password"
          value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}
          error={touched.confirmPassword && errors.confirmPassword} required autoComplete="new-password" />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Phone (optional)" name="phone" placeholder="+91 98765 43210"
            value={values.phone} onChange={handleChange} />
          <Input label="City (optional)" name="city" placeholder="Ahmedabad"
            value={values.city} onChange={handleChange} />
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isSubmitting} loadingText="Creating account…">
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
      </p>
    </div>
  );
}
