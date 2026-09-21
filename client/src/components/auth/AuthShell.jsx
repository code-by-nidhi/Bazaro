import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AUTH_IMAGE =
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80';

const HEADLINES = {
  login: 'Welcome back to your wardrobe at',
  register: 'Let’s bring your style home with',
};

// Animations only run from tablet width up; on mobile the forms just swap.
const SLIDE = 'md:transition-all md:duration-700 md:ease-in-out motion-reduce:transition-none';

// Login and sign-up share one card: the login form sits in the left half, the sign-up
// form in the right half, and a photo panel slides across to cover whichever one is
// not in use. On mobile there is no photo, and only the active form is shown.
const AuthShell = ({ mode, loginForm, registerForm }) => {
  const isLogin = mode === 'login';

  const formPane = (active, content) => (
    <div
      {...(active ? {} : { inert: '', 'aria-hidden': true })}
      className={`${active ? 'flex' : 'hidden md:flex'} flex-col justify-center p-6 sm:p-8 md:px-10 lg:px-12 ${SLIDE} ${
        active ? 'md:opacity-100 md:delay-200' : 'md:opacity-0'
      }`}
    >
      {content}
    </div>
  );

  return (
    // Mobile: the plain centred card from before. Tablet and up: fills the viewport below
    // the sticky navbar (~108px) and centres the split card in it.
    <div className="bg-slate-50 md:bg-[#f6eeea] px-4 py-12 md:py-6 min-h-[80vh] md:min-h-[calc(100dvh-108px)] flex items-center justify-center">
      <div className="relative w-full max-w-md md:max-w-5xl grid md:grid-cols-2 bg-white border border-slate-200 md:border-0 rounded-3xl overflow-hidden shadow-xl md:shadow-[#c9a086]/15">
        {formPane(isLogin, loginForm)}
        {formPane(!isLogin, registerForm)}

        {/* Sliding photo panel: over the sign-up half on login, over the login half on sign-up */}
        <div
          className={`hidden md:block absolute inset-y-0 left-0 w-1/2 z-10 bg-[#c9a086] overflow-hidden ${SLIDE} ${
            isLogin ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <img
            src={AUTH_IMAGE}
            alt="Colourful shirts hanging on a clothing rail"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#c9a086]/85 via-[#c9a086]/25 to-transparent" />
          {Object.entries(HEADLINES).map(([key, text]) => (
            <h2
              key={key}
              aria-hidden={key !== mode}
              className={`absolute inset-x-0 top-0 p-8 lg:p-10 text-3xl lg:text-4xl font-bold text-white font-heading leading-[1.12] tracking-tight ${SLIDE} ${
                key === mode ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 -translate-y-3'
              }`}
            >
              {text} <span className="text-[#7a2e0e]">Bazaro</span>
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
};

// Soft rounded field with a small label inside it and an icon (or custom control) on the right.
export const AuthField = ({ label, icon: Icon, trailing, ...inputProps }) => (
  <label className="flex items-center gap-3 bg-slate-100/80 rounded-2xl px-4 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-800 transition">
    <span className="flex-1 min-w-0">
      <span className="block text-[11px] font-medium text-slate-500">{label}</span>
      <input
        {...inputProps}
        className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden"
      />
    </span>
    {trailing || (Icon && <Icon size={18} className="text-slate-400 shrink-0" />)}
  </label>
);

// Password variant with a show / hide toggle.
export const PasswordField = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <AuthField
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer"
        >
          {visible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      }
    />
  );
};

export const authButtonClass =
  'w-full py-3.5 bg-[#2a3437] hover:bg-slate-950 disabled:opacity-60 text-white text-sm font-semibold rounded-2xl transition cursor-pointer';

export default AuthShell;
