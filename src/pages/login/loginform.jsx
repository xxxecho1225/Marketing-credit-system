import React, { useState} from "react";
import axios from "axios";
import {  message } from "antd";
import { useNavigate } from "react-router-dom";
import  "./login.css";

function LoginForm() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "password") setPassword(value);
    else if (name === "passwordconfirm") setPasswordConfirm(value);
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    try {
      const inputs = {
        username: username,
        password: password,
        passwordconfirm: passwordconfirm, // 仅在注册时使用
      };

      let response;

      if (action === "register") {
        response = await axios.post(
          "http://localhost:8080/api/users/register",
          inputs
        );
        message.info("注册成功！");
        console.log("注册成功:", response.data);
        navigate("/login");
      } else if (action === "login") {
        response = await axios.post(
          "http://localhost:8080/api/users/login",
          inputs
        );
        message.info("登录成功！");
        console.log("登录成功:", response.data);
        sessionStorage.setItem('username',username)
        navigate("/home", { state: { username } } );
      }
    } catch (error) {
      message.info("登录、注册失败！请检查！");
      console.error(`${action}跳转失败:`, error);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
          <div className="forms-container">
            <div className="signin-signup">
              <form
                onSubmit={(e) => handleSubmit(e, "login")}
                action="#"
                className={`sign-in-form ${isSignUpMode ? "hidden" : ""}`}
              >
                <h2 className="title">登录</h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    name="username"
                    onChange={onChange}
                    value={username}
                    type="text"
                    placeholder="用户名"
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    name="password"
                    onChange={onChange}
                    value={password}
                    type="password"
                    placeholder="密码"
                  />
                </div>
                <button
                  onClick={(e) => handleSubmit(e, "login")}
                  type="submit"
                  value="登 录"
                  className="btn solid"
                >
                  登录
                </button>
              </form>

              <form
                onSubmit={(e) => handleSubmit(e, "login")}
                action="#"
                className={`sign-up-form ${isSignUpMode ? "" : "hidden"}`}
              >
                <h2 className="title">注册</h2>
                <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input
                    name="username"
                    onChange={onChange}
                    value={username}
                    type="text"
                    placeholder="用户名"
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    name="password"
                    onChange={onChange}
                    value={password}
                    type="password"
                    placeholder="密码"
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock"></i>
                  <input
                    name="passwordconfirm"
                    onChange={onChange}
                    value={passwordconfirm}
                    type="password"
                    placeholder="重复密码"
                  />
                </div>
                <button
                  onClick={(e) => handleSubmit(e, "register")}
                  type="submit"
                  value="注册"
                  className="btn solid"
                >
                  注册
                </button>
              </form>
            </div>
          </div>
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>新用户?</h3>
                <p>我们的网站就差你的加入了,点击下方注册按钮加入我们吧!</p>
                <button
                  className={`btn transparent ${isSignUpMode ? "hidden" : ""}`}
                  onClick={toggleMode}
                >
                  注册
                </button>
              </div>
              <img src="src/img/log.svg" className="image" alt="" />
            </div>
            <div className="panel right-panel">
              <div className="content">
                <h3>已经注册了吗?</h3>
                <p>点击登录按钮,登录到我们这优秀的系统里!</p>
                <button
                  className={`btn transparent ${isSignUpMode ? "" : "hidden"}`}
                  onClick={toggleMode}
                >
                  登 录
                </button>
              </div>
              <img src="src/img/register.svg" className="image" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
