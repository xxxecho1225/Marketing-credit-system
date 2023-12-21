import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import App from "./App";
import LoginForm from "./pages/login/loginform";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <ConfigProvider>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<LoginForm />} />
        <Route path="/home/*" element={<App />} />
      </Routes>
    </ConfigProvider>
  </Router>
);
