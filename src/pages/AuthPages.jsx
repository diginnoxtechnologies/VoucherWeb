import { ArrowRight, Check, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { BrandMark, Button, ValidationState } from '../components/VoucherlyComponents';

function AuthFrame({ step, children }) {
  return <main className="auth-page">
    <div className="auth-aside">
      <BrandMark />
      <div className="auth-aside-copy">
        <span className="auth-kicker">THE PROCUREMENT DESK</span>
        <h1>Give good.<br /><em>Get remembered.</em></h1>
        <p>One dependable place for the moments that matter to your people.</p>
      </div>
      <div className="auth-aside-footer"><span className="auth-status-dot" /> Secure company wallet <span className="auth-footer-separator">/</span> North America</div>
    </div>
    <div className="auth-content">
      <div className="auth-mobile-brand"><BrandMark /></div>
      <div className="auth-form-wrap">
        <div className="auth-step"><span className={step === 1 ? 'is-active' : 'is-done'}>{step > 1 ? <Check size={12} /> : '01'}</span><i /><span className={step === 2 ? 'is-active' : ''}>02</span></div>
        {children}
      </div>
      <p className="auth-legal">Voucherly for business <span>·</span> Need a hand? <button data-testid="button-contact-support">Contact support</button></p>
    </div>
  </main>;
}

export function LoginPage() {
  const [, setLocation] = useLocation();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError('Enter your user ID and password to continue.');
      return;
    }
    localStorage.setItem('voucherly_pending_user', userId.trim());
    setLocation('/verify-otp');
  };
  return <AuthFrame step={1}>
    <div className="auth-heading"><span className="eyebrow">Welcome back</span><h2>Sign in to Voucherly</h2><p>Your company’s rewards, ready when you are.</p></div>
    {error && <ValidationState onDismiss={() => setError('')}>{error}</ValidationState>}
    <form className="auth-form" onSubmit={submit}>
      <label className="form-label">User ID<input value={userId} onChange={(event) => setUserId(event.target.value)} autoComplete="username" placeholder="e.g. maya.chen" data-testid="input-user-id" /></label>
      <label className="form-label">Password<div className="password-input"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Enter your password" data-testid="input-password" /><LockKeyhole size={16} /></div></label>
      <div className="form-helper"><label className="remember-check"><input type="checkbox" defaultChecked /> <span>Remember this device</span></label><button type="button" className="text-link" onClick={() => setError('Please contact your company administrator to reset your password.')} data-testid="button-forgot-password">Forgot password?</button></div>
      <Button type="submit" className="auth-submit" testId="button-login">Continue <ArrowRight size={17} /></Button>
    </form>
    <div className="auth-trust"><ShieldCheck size={16} /><span>Protected by company-grade security</span></div>
  </AuthFrame>;
}

export function VerifyOtpPage({ onVerified }) {
  const [, setLocation] = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const pendingUser = localStorage.getItem('voucherly_pending_user') || 'your account';
  const submit = (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code we sent to your verified device.');
      return;
    }
    localStorage.setItem('voucherly_auth', 'true');
    localStorage.removeItem('voucherly_pending_user');
    onVerified();
    setLocation('/');
  };
  return <AuthFrame step={2}>
    <div className="auth-heading"><span className="eyebrow">One more step</span><h2>Check your device</h2><p>We sent a 6-digit verification code for <strong>{pendingUser}</strong>.</p></div>
    {error && <ValidationState onDismiss={() => setError('')}>{error}</ValidationState>}
    <form className="auth-form" onSubmit={submit}>
      <label className="form-label">Verification code<input className="otp-input" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" data-testid="input-otp" /></label>
      <p className="otp-hint">For this demo, use <button type="button" className="text-link mono-font" onClick={() => setOtp('123456')} data-testid="button-use-demo-otp">123456</button></p>
      <Button type="submit" className="auth-submit" testId="button-verify-otp">Verify and enter <ArrowRight size={17} /></Button>
      <button type="button" className="back-link" onClick={() => setLocation('/login')} data-testid="button-back-login">Back to sign in</button>
    </form>
    <div className="auth-trust"><UserRound size={16} /><span>Signing in as {pendingUser}</span></div>
  </AuthFrame>;
}