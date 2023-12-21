import React, { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Upload } from "antd";
import axios from "axios"; // 引入 axios 库

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function CreditUpload() {
  const [form] = Form.useForm();
  const [merchantAddress, setAddress] = useState({}); // 初始值为空对象
  const username = sessionStorage.getItem("username");
  const [ipfsHash, setIpfsHash] = useState("");
  console.log("商户地址1:", merchantAddress);
  console.log("商户名:", username);
  console.log("上传文件的哈希111111111:", ipfsHash);

  useEffect(() => {
    // 在组件挂载时从数据库获取商户地址信息
    axios
      .get(`http://localhost:8080/api/users/getInfo?username=${username}`)
      .then((response) => {
        if (response.data.success) {
          setAddress(response.data.address);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("商户地址获取失败:", error);
      });
  }, [username]);

  const onFinish = (values) => {
    const { creditRating, customerReview, financialStatement } = values;
    // 处理表单提交的值
    console.log("信用评级:", creditRating);
    console.log("财务陈述:", customerReview);
    console.log("客户评价:", financialStatement);

    handleUploadCredit({ username, merchantAddress,...values, ipfsHash });
  };

  const handleUploadCredit = async (info) => {
    try {
      const file = info.file; // 从info对象中获取上传的文件
      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", info.username);
      formData.append("merchantAddress", info.merchantAddress);
      formData.append("creditRating", info.creditRating);
      formData.append("customerReview", info.customerReview);
      formData.append("financialStatement", info.financialStatement);
      formData.append("ipfsHash", info.ipfsHash);

      // Make a POST request to the backend
      const response = await fetch("http://localhost:8080/api/credit/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log("交易json:",result)
        message.success("上传信用凭证成功");
        //上传成功后导航到列表页面
        //navigate("/home/credit/creditList");
      } else {
        message.error(`没有上传信用凭证，上传信用凭证失败: ${result.error}`);
      }
    } catch (error) {
      console.error("JSON 解析错误:", error);
    }
  };
  //定义上传文件的组件
  const { Dragger } = Upload;
  const props = {
    name: "file",
    multiple: true,
    action: "http://localhost:8080/api/credit/fileupload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      if (status === "done") {
        const response = info.file.response;
        if (response && response.success) {
          // 保存上传成功后的文件路径
          console.log("Uploaded file path:", response.pinataFileUrl);
          console.log("上传文件的哈希:", response.filePath);
          // 保存 IPFS 哈希值
          setIpfsHash(response.filePath);
          message.success(`${info.file.name} 上传文件成功.`);
        } else {
          message.error(`${info.file.name} 上传文件失败.`);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} 上传文件失败.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      form={form}
      style={{
        maxWidth: 500,
      }}
      initialValues={{
        creditRating: "",
        customerReview: "",
        financialStatement: "",
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="creditRating"
        label="信用评级"
        rules={[
          {
            required: true,
            message: "请输入信用评级!",
          },
        ]}
      >
        <Input placeholder="请输入信用评级" />
      </Form.Item>
      <Form.Item
        name="customerReview"
        label="客户评价"
        rules={[
          {
            required: true,
            message: "请输入客户评价!",
          },
        ]}
      >
        <Input placeholder="请输入客户评价"/>
      </Form.Item>

      <Form.Item
        name="financialStatement"
        label="财务综述"
        rules={[
          {
            required: true,
            message: "请输入财务综述!",
          },
        ]}
      >
        <Input placeholder="请输入财务综述" />
      </Form.Item>

      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击此区域上传信用凭证</p>
        <p className="ant-upload-hint">支持单次或批量上传</p>
      </Dragger>
      <Form.Item
        wrapperCol={{
          ...layout.wrapperCol,
          offset: 8,
        }}
      >
        <Button
          type="primary"
          htmlType="submit"
          style={{
            maxWidth: 110,
            left: -25,
            top: 10,
          }}
        >
          上传信用凭证
        </Button>
      </Form.Item>
    </Form>
  );
}

export default CreditUpload;
