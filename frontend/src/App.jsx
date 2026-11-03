
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import GlobalSettingsSync from './context/GlobalSettingsSync';
import ProtectedRoute from './components/auth/ProtectedRoute';
import IntroVideo from './components/IntroVideo';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ScanningPage from './pages/ScanningPage';
import TrackManage from './pages/TrackManage';
import Home from './pages/Home';
import HistoryPage from './pages/History';
import Settings from './pages/Settings';
import ClassificationPage from './pages/ClassificationPage';
import Subscription from './pages/Subscription';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import ScanningResultPage from './pages/ScanningResultPage';
import ModelPerformancePage from './pages/ModelPerformancePage';
import ResetSuccessful from './pages/ResetSuccessful';
import ResetViaPhoneNumber from './pages/ResetViaPhoneNumber';
import ResetViaEmailOtp from './pages/ResetViaEmailOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import { DEMO_MODE } from './context/AuthContext';

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(() => {
    try {
      return sessionStorage.getItem('idp-intro-complete') === 'true';
    } catch {
      return false;
    }
  });

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('idp-intro-complete', 'true');
    } catch {
      // Continue even if session storage is unavailable.
    }

    setIntroComplete(true);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalSettingsSync />

        <div className="min-h-dvh bg-(color:--c-bg) text-(color:--c-fg) [--c-bg:#001933] [--c-panel:#00203e] [--c-inner:#032242] [--c-line:#003e73] [--c-dash:#1464aa] [--c-fg:#e6f0ff] [--c-muted:#8fb0d8] [--c-accent:#4da3ff] [--c-primary:#005ffe] [--c-secondary:#0145a4] [--c-grid:#0a2f57] [.light_&]:[--c-bg:#eef3fb] [.light_&]:[--c-panel:#ffffff] [.light_&]:[--c-inner:#f3f7fe] [.light_&]:[--c-line:#c9d8f0] [.light_&]:[--c-dash:#8fb3e8] [.light_&]:[--c-fg:#0f1f3d] [.light_&]:[--c-muted:#4b6490] [.light_&]:[--c-accent:#1d6fe8] [.light_&]:[--c-primary:#1565e0] [.light_&]:[--c-secondary:#1a4fa8] [.light_&]:[--c-grid:#dbe6f6]">

          {DEMO_MODE && (
            <div
              className="fixed bottom-3 right-3 z-[9999] max-w-[min(92vw,360px)] rounded-lg border border-amber-400/40 bg-slate-950/95 px-3 py-2 text-xs text-amber-200 shadow-xl"
              role="status"
            >
              Demo mode: backend is not connected. Pages are open for frontend preview only; data and authentication are not persisted.
            </div>
          )}

          {!introComplete ? (
            <IntroVideo onComplete={handleIntroComplete} />
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-phone" element={<ResetViaPhoneNumber />} />
              <Route path="/reset-email" element={<ResetViaEmailOtp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/reset-successful" element={<ResetSuccessful />} />

              <Route path="/home" element={<Protected><Home /></Protected>} />
              <Route path="/scanning" element={<Protected><ScanningPage /></Protected>} />
              <Route path="/track-manage" element={<Protected><TrackManage /></Protected>} />
              <Route path="/history" element={<Protected><HistoryPage /></Protected>} />
              <Route path="/settings" element={<Protected><Settings /></Protected>} />
              <Route path="/classification" element={<Protected><ClassificationPage /></Protected>} />
              <Route path="/subscription" element={<Protected><Subscription /></Protected>} />
              <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
              <Route path="/payment" element={<Protected><Payment /></Protected>} />
              <Route path="/scanning-result/:documentId" element={<Protected><ScanningResultPage /></Protected>} />
              <Route path="/model-performance" element={<Protected><ModelPerformancePage /></Protected>} />

              <Route path="/SignupPage" element={<Navigate to="/signup" replace />} />
              <Route path="/ScanningPage" element={<Navigate to="/scanning" replace />} />
              <Route path="/TrackManage" element={<Navigate to="/track-manage" replace />} />
              <Route path="/HistoryPage" element={<Navigate to="/history" replace />} />
              <Route path="/ClassificationPage" element={<Navigate to="/classification" replace />} />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}

        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

