
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await login(email, password);
    }
  };
  
  // Helper para determinar o nível de acesso com base no email
  const getAccessLevelInfo = (email: string): { level: string, color: string } => {
    if (email.includes('admin') || email === 'resumovetorial@gmail.com') {
      return { level: 'Administrador', color: 'text-red-500' };
    } else if (email.includes('supervisor') || email.includes('coordenador')) {
      return { level: 'Supervisor', color: 'text-blue-500' };
    } else {
      return { level: 'Agente', color: 'text-green-500' };
    }
  };
  
  const accessInfo = email ? getAccessLevelInfo(email) : { level: '', color: '' };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          {email && (
            <div className="text-sm">
              <span>Nível de acesso: </span>
              <span className={accessInfo.color + " font-semibold"}>
                {accessInfo.level}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                * O nível de acesso é determinado automaticamente com base no seu email
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          * No modo de demonstração, qualquer senha é aceita
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
