import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '@/app/queryClient';
import { AppRoutes } from '@/routes';
import { ToastViewport } from '@/components/ui/Toast';
import { FullScreenLoader } from '@/components/ui/FullScreenLoader';
import { useSessionBootstrap } from '@/hooks/useAuth';
import { useThemeSync } from '@/hooks/useThemeSync';

function AppShell() {
  const { isLoading } = useSessionBootstrap();
  useThemeSync();

  if (isLoading) {
    return <FullScreenLoader label="Validating your session..." />;
  }

  return (
    <>
      <AppRoutes />
      <ToastViewport />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
