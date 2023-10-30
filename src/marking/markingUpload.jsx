import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Upload } from "antd";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};


const onFinish = (values) => {
  console.log(values);
};

const { Dragger } = Upload;
const props = {
  name: "file",
  multiple: true,
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

function markingUpload() {
  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      style={{
        maxWidth: 500,
      }}
    >
      <Form.Item
        name={["user", "name"]}
        label="商户名字"
        rules={[
            {
              type: "name",
              required: true,
            },
          ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["user", "address"]}
        label="地址"
        rules={[
          {
            type: "address",
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["user", "address"]}
        label="信用评级"
        rules={[
          {
            type: "address",
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["user", "address"]}
        label="客户评价"
        rules={[
          {
            type: "address",
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击此区域上传财务报告</p>
        <p className="ant-upload-hint">支持单次或批量上传</p>
      </Dragger>
      <Form.Item
        wrapperCol={{
          ...layout.wrapperCol,
          offset: 8,
        }}
      >
        <Button type="primary" htmlType="submit"style={{
        maxWidth: 100,left: -25,top:10,
      }} >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}


export default markingUpload