import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth/ProtectedRoute';
import { FullScreenLoader } from '@/components/ui/FullScreenLoader';

const LoginPage = lazy(() => import('@/features/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const BoardPage = lazy(() => import('@/features/board/BoardPage').then((m) => ({ default: m.BoardPage })));
const AnalyticsPage = lazy(() =>
  import('@/features/analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
);

function PageSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<FullScreenLoader label="Loading page..." />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <PageSuspense>
              <LoginPage />
            </PageSuspense>
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <PageSuspense>
              <DashboardPage />
            </PageSuspense>
          }
        />
        <Route
          path="/board"
          element={
            <PageSuspense>
              <BoardPage />
            </PageSuspense>
          }
        />
        <Route
          path="/analytics"
          element={
            <PageSuspense>
              <AnalyticsPage />
            </PageSuspense>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
