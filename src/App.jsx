import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { CommissionProvider } from "./context/CommissionContext";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import DetailsPage from "./pages/DetailsPage";
import UpdatePage from "./pages/UpdatePage";
import SuccessPage from "./pages/SuccessPage";
import NotFoundPage from "./pages/NotFoundPage";

import "./styles/global.css";

export default function App() {
  return (
    <CommissionProvider>
      <Router>
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#e8e8e8",
              border: "1px solid #2a2a2a",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: { primary: "#27ae60", secondary: "#1a1a1a" },
            },
            error: {
              iconTheme: { primary: "#c0392b", secondary: "#1a1a1a" },
            },
          }}
        />
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/search"    element={<SearchPage />} />
          <Route path="/details"   element={<DetailsPage />} />
          <Route path="/update"    element={<UpdatePage />} />
          <Route path="/success"   element={<SuccessPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CommissionProvider>
  );
}