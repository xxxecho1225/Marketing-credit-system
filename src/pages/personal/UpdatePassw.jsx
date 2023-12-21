import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

function UpdatePassw() {
  const [form] = Form.useForm(); // 使用Form.useForm()创建form实例
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { username, oldpassword, newpassword, agnewpassword } = values;
    // 处理表单提交的值
    console.log("用户名:", username);
    console.log("旧密码:", oldpassword);
    console.log("新密码:", newpassword);
    console.log("确认新密码:", agnewpassword);

    // 添加密码验证逻辑
    if (values.oldpassword === values.newpassword) {
      message.error("新密码不能与旧密码相同");
      return;
    }

    if (values.newpassword !== values.agnewpassword) {
      message.error("新密码和再次输入的密码不一致");
      return;
    }

    handleSubmit(values);
  };

  const handleSubmit = async (values) => {
    try {
      // 构建要发送的数据
      const inputs = {
        username: values.username, // 包括用户名
        oldpassword: values.oldpassword, //旧密码
        newpassword: values.newpassword, //新密码
        agnewpassword: values.agnewpassword, //再次输入新密码
      };

      console.log(inputs);
      // 发送请求
      const response = await axios.post(
        "http://localhost:8080/api/users/updatePassword",
        inputs
      );

      message.info("修改密码成功！");
      console.log("修改密码成功:", response.data);
      navigate("/");
    } catch (error) {
      message.info("修改密码失败！请检查！");
      console.error("修改密码失败:", error);
    }
  };

  return (
    <div>
      <Form
        form={form}
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
          merchantName: "", // 设置初始值
          oldpassword: "",
          newpassword: "",
          agnewpassword: "",
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: "请输入你的用户名!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="旧密码"
          name="oldpassword"
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
          <Button type="primary" htmlType="submit">
            修改密码
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UpdatePassw;
