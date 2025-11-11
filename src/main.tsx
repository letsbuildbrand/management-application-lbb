import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class">
    {/* BrowserRouter is now handled in App.tsx, so remove it here */}
    <App />
  </ThemeProvider>
);