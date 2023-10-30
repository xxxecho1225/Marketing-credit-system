import React from "react";
import ReactDOM from "react-dom/client";
import {HashRouter as Router,Route,Routes,} from "react-router-dom";
import App from "./App";
import LoginForm from "./login/loginform"
import { ConfigProvider } from "antd";
import { AuthContexProvider } from "./context/authContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <ConfigProvider>
    <AuthContexProvider>
      <Routes>
        <Route  path="/" element={<LoginForm/>}/>
        <Route  path="/login" element={<LoginForm/>}/>
        <Route  path="/register" element={<LoginForm/>}/>
        <Route  path="/home/*" element={<App/>}/>
      </Routes>
    </AuthContexProvider>
  </ConfigProvider>
  </Router>
);



