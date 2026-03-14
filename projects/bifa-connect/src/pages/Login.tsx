import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Eye, EyeOff, Shield, Lock, User, AlertCircle, CheckCircle2, Smartphone } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [email, setEmail] = useState('fed@bifa.int');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { success, error: loginError } = await login(email, password);
    if (success) {
      // Simulate MFA for admin accounts
      if (email === 'admin@bifa.int' || email === 'fed@bifa.int') {
        setLoading(false);
        setMfaStep(true);
        return;
      }
      navigate('/dashboard');
    } else {
      setError(loginError || 'An unknown error occurred during login.');
    }
    setLoading(false);
  };

  const handleMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode === '123456' || mfaCode.length === 6) {
      navigate('/dashboard');
    } else {
      setMfaError('Invalid code.');
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* BG decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-5xl grid md:grid-cols-5 gap-6">
        {/* Left — Branding */}
        <div className="md:col-span-2 flex flex-col justify-between p-6">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-3 mb-10 group">
              <div className="w-12 h-12 gradient-green rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                <span className="text-primary-foreground font-display text-2xl">B</span>
              </div>
              <div>
                <div className="font-display text-2xl text-primary">BIFA</div>
                <div className="text-xs text-muted-foreground">Secure Portal</div>
              </div>
            </button>

            <h1 className="font-display text-4xl mb-3">Federation<br />Management<br />System</h1>
            <p className="text-muted-foreground text-sm mb-6">Role-Based Access Control • Multi-Factor Auth • Audit Logging </p>

            <div className="space-y-3">
              {[
             
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Language switcher */}
          <div className="mt-8">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Language / 语言 / भाषा</p>
            <LanguageSelector />
          </div>
        </div>

        {/* Right — Form + Demo accounts */}
        <div className="md:col-span-3 space-y-4">
          {/* Login card */}
          <div className="glass rounded-2xl p-6">
            {!mfaStep ? (
              <>
                <h2 className="font-semibold text-lg mb-1">{t('login')}</h2>
                <p className="text-xs text-muted-foreground mb-5">Enter details below to login</p>

                {error && (
                  <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">{t('email')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-muted border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-muted border border-border rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full gradient-green text-primary-foreground font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-glow"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Authenticating...
                      </span>
                    ) : t('login')}
                  </button>
                </form>

                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex-1 h-px bg-border"></div>
                  <span>HTTPS • TLS 1.3 • AES-256</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{' '}
                  <button onClick={() => navigate('/register')} className="text-primary hover:underline">
                    Register
                  </button>
                </p>
              </>
            ) : (
              /* MFA Step */
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-semibold text-lg mb-1">Two-Factor Authentication</h2>
                <p className="text-xs text-muted-foreground mb-5">Enter the 6-digit code from your authenticator app. <br/>For this demo, any 6-digit code works.</p>

                {mfaError && (
                  <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    {mfaError}
                  </div>
                )}

                <form onSubmit={handleMfa}>
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                    maxLength={6}
                    autoFocus
                  />
                  <button type="submit" className="w-full gradient-green text-primary-foreground font-semibold py-2.5 rounded-lg hover:opacity-90 shadow-glow">
                    Verify & Enter
                  </button>
                  <button type="button" onClick={() => setMfaStep(false)} className="mt-2 text-xs text-muted-foreground hover:text-foreground">
                    ← Back to login
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
