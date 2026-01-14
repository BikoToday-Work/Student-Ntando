import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, getRoleDashboard } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login({ email, password });
    
    if (result.success) {
      navigate(getRoleDashboard());
    } else {
      setError(result.error || t('auth.invalidCredentials'));
    }
    
    setIsLoading(false);
  };

  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full federation-gradient">
              <span className="font-heading text-2xl font-bold text-primary-foreground">B</span>
            </div>
            <CardTitle className="font-heading text-2xl">{t('auth.welcomeBack')}</CardTitle>
            <CardDescription>{t('auth.signInSubtitle')}</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('common.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@bifa.bi"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('common.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-input" />
                  {t('auth.rememberMe')}
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('auth.signIn')
                )}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                {t('auth.noAccount')}{' '}
                <Link to="/register" className="text-primary hover:underline">
                  {t('auth.signUp')}
                </Link>
              </p>
            </CardFooter>
          </form>

          {/* Demo credentials hint */}
          <div className="border-t px-6 py-4">
            <p className="text-xs text-muted-foreground text-center mb-2">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>admin@bifa.bi / admin123</div>
              <div>referee@bifa.bi / referee123</div>
              <div>manager@bifa.bi / manager123</div>
              <div>secretariat@bifa.bi / secret123</div>
            </div>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}
