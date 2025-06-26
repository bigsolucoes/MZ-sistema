import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { Sun, Moon, Palette, Bell, KeyRound, Sparkles } from 'lucide-react'; // Added Sparkles for Inverted

type Theme = 'light' | 'dark' | 'inverted';

const themeIcons: Record<Theme, React.ElementType> = {
  light: Sun,
  dark: Moon,
  inverted: Sparkles,
};

const themeLabels: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Escuro',
  inverted: 'Invertido',
};

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  const cycleTheme = () => {
    let nextTheme: Theme;
    if (currentTheme === 'light') {
      nextTheme = 'dark';
    } else if (currentTheme === 'dark') {
      nextTheme = 'inverted';
    } else {
      nextTheme = 'light';
    }
    
    setCurrentTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    document.documentElement.classList.remove('dark', 'inverted');
    // Also update body class to ensure immediate background changes if necessary
    // Tailwind's JIT might not pick up body changes from html class alone without a refresh sometimes.
    // So, being explicit for body based on the new theme.
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-gray-900 text-gray-100'; // Match html.dark body style
    } else if (nextTheme === 'inverted') {
      document.documentElement.classList.add('inverted');
      // For inverted, we use CSS variables, so ensure body uses them
      document.body.className = 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]';
    } else { // Light theme
      document.body.className = 'bg-gray-50 text-gray-900'; // Default light body
    }
  };

  // Effect to apply initial theme to HTML element based on component's state
  // This ensures consistency if App.tsx's initial load somehow differs, though they should align.
  React.useEffect(() => {
    document.documentElement.classList.remove('dark', 'inverted');
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
       document.body.className = 'bg-gray-900 text-gray-100';
    } else if (currentTheme === 'inverted') {
      document.documentElement.classList.add('inverted');
      document.body.className = 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]';
    } else {
       document.body.className = 'bg-gray-50 text-gray-900';
    }
  }, [currentTheme]);


  const NextThemeIcon = currentTheme === 'light' ? themeIcons.dark : currentTheme === 'dark' ? themeIcons.inverted : themeIcons.light;
  const nextThemeLabel = currentTheme === 'light' ? themeLabels.dark : currentTheme === 'dark' ? themeLabels.inverted : themeLabels.light;


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Configurações</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
          <CardDescription>Gerencie as informações do seu perfil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="userName">Nome</Label>
            <Input id="userName" value={user?.name || ''} readOnly className="bg-gray-100 dark:bg-gray-700"/>
          </div>
          <div>
            <Label htmlFor="userEmail">Email</Label>
            <Input id="userEmail" type="email" value={user?.email || ''} readOnly className="bg-gray-100 dark:bg-gray-700"/>
          </div>
           {/* Add more profile fields if editable */}
          <Button variant="outline" disabled>Atualizar Perfil (Não implementado)</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências da Interface</CardTitle>
          <CardDescription>Personalize a aparência do sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Palette className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-300" />
              <Label>Tema Atual: {themeLabels[currentTheme]}</Label>
            </div>
            <Button variant="outline" onClick={cycleTheme} className="w-40">
              <NextThemeIcon className="mr-2 h-4 w-4" />
              Mudar para {nextThemeLabel}
            </Button>
          </div>
           {/* More preference settings can be added here */}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
           <CardDescription>Configure suas preferências de notificação (simulado).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <Label>Notificações por Email</Label>
                </div>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked disabled/> {/* Placeholder for a toggle switch component */}
            </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <Label>Notificações no App</Label>
                </div>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked disabled/>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
           <CardDescription>Opções de segurança da conta (simulado).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <KeyRound className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <Label>Autenticação de Dois Fatores (2FA)</Label>
                </div>
                <Button variant="outline" disabled>Ativar 2FA</Button>
            </div>
            <Button variant="destructive" disabled>Encerrar todas as outras sessões</Button>
        </CardContent>
      </Card>

    </div>
  );
};

export default SettingsPage;