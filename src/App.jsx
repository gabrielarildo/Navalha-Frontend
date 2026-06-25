import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </AuthProvider>
  );
}
