import { useState, useCallback } from 'react';

const useForm = (initial, validate, onSubmit) => {
  const [values,      setValues]      = useState(initial);
  const [errors,      setErrors]      = useState({});
  const [touched,     setTouched]     = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    if (validate) {
      const errs = validate(values);
      setErrors((p) => ({ ...p, [name]: errs[name] || '' }));
    }
  }, [validate, values]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(values).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    if (validate) {
      const errs = validate(values);
      if (Object.values(errs).some(Boolean)) { setErrors(errs); return; }
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (Array.isArray(serverErrors)) {
        const mapped = {};
        serverErrors.forEach(({ path, msg }) => { if (path) mapped[path] = msg; });
        setErrors(mapped);
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => { setValues(initial); setErrors({}); setTouched({}); }, [initial]);
  const setValue = useCallback((name, value) => setValues((p) => ({ ...p, [name]: value })), []);

  return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset, setValue };
};

export default useForm;
