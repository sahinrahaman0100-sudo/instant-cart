import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageLoader } from "../components/ui";

const HomePage = lazy(() => import("../pages/HomePage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const OtpVerificationPage = lazy(() => import("../pages/OtpVerificationPage"));
const OrderTrackingPage = lazy(() => import("../pages/OrderTrackingPage"));
const AuthPage = lazy(() => import("../pages/AuthPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/verify/:orderRef" element={<OtpVerificationPage />} />
        <Route path="/track/:orderRef" element={<OrderTrackingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
