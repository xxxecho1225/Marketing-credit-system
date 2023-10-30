import React from "react";
import {
  Card,
  Avatar,
  Typography,
  Upload,
  Button,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./infomationList.css";
import icon from "../img/icon.png";

const { Title, Text } = Typography;

function InformationList() {
  const props = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <div>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>上传我的头像</Button>
      </Upload>
      <Row gutter={16}>
        <Col xs={24} sm={16} md={12} lg={8} xl={6}>
          <Card title="个人信息" style={{ width: "100%", marginLeft: 0 }}>
            <div style={{ textAlign: "center" }}>
              <Avatar size={128} src={icon} />
            </div>
            <Title level={4} style={{ textAlign: "center" }}>
              我的名字: zk
            </Title>
            <Text style={{ textAlign: "center" }}>
              0x87873aB5ce6bE......52BDB7561adF
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default InformationList;
