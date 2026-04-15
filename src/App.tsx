import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout>
          <AppRoutes />
        </Layout>
        <Toaster position="top-right" toastOptions={{ style: { background: "#1f2937", color: "#e2e8f0", border: "1px solid #334155" } }} />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
