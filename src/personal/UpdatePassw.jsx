import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

function UpdatePassw() {
  const [form] = Form.useForm(); // 使用Form.useForm()创建form实例
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [agnewpassword, setAgNewPassword] = useState("");
  const navigate = useNavigate();

  const onFinish = (e) => {
    const { oldpassword, newpassword, agnewpassword } = e.target;
    // 处理表单提交的值
    console.log("旧密码:", oldpassword);
    console.log("新密码:", newpassword);
    console.log("确认新密码:", agnewpassword);
    // if (name === "oldpassword") setOldPassword(value);
    // else if (name === "newpassword") setNewPassword(value);
    // else if (name === "agnewpassword") setAgNewPassword(value);
    setOldPassword(oldpassword);
    setNewPassword(newpassword);
    setAgNewPassword(agnewpassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 构建要发送的数据
      const inputs = {
        oldpassword,
        newpassword,
        agnewpassword,
      };

      // 发送请求
      const response = await axios.post(
        "http://localhost:8080/api/users/updatePassword",
        inputs
      );

      message.info("修改密码成功！");
      console.log("修改密码成功:", response.data);
      navigate("/home");
    } catch (error) {
      message.info("修改密码失败！请检查！");
      console.error("修改密码失败:", error);
    }
  };

  return (
    <div>
      <Form
        form={form}
        onSubmit={(e) => handleSubmit(e)}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="旧密码"
          name="oldpassword"
          value={oldpassword}
          onChange={(e) => setOldPassword(e.target.value)}
          rules={[
            {
              required: true,
              message: "请输入你的旧密码!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="新密码"
          name="newpassword"
          value={newpassword}
          onChange={(e) => setNewPassword(e.target.value)}
          rules={[
            {
              required: true,
              message: "请输入你的新密码!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="再次输入密码"
          name="agnewpassword"
          value={agnewpassword}
          onChange={(e) => setAgNewPassword(e.target.value)}
          rules={[
            {
              required: true,
              message: "请再次输入你的新密码!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>remember</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            onClick={(e) => handleSubmit(e)}
          >
            修改密码
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UpdatePassw;
