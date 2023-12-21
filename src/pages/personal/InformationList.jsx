import React,{useState,useEffect} from "react";
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
import axios from "axios"; // 引入 axios 库
import icon from "../../image/icon.png";

const { Title, Text } = Typography;

const InformationList = () => {
  const [avatarSrc, setAvatarSrc] = useState(icon); // 初始值为默认头像
  const [userAddress, setAddress] = useState({});
  const [ethbalance, setEthbalance] = useState(0);
  const username = sessionStorage.getItem("username");
  console.log("pinata地址:",avatarSrc)
  console.log("地址:", userAddress);
  console.log("username:", username);
  console.log("余额:", ethbalance);

  useEffect(() => {
    // 在组件挂载时从数据库获取头像信息
    axios.get(`http://localhost:8080/api/users/getIcon?username=${username}`)
      .then(response => {
        if (response.data.success) {
          setAvatarSrc(response.data.avatarUrl);
        }
      })
      .catch(error => {
        console.error("avatar获取失败:", error);
      });
  }, [username]);

  useEffect(() => {
    // 在组件挂载时从数据库获取用户地址信息
    axios.get(`http://localhost:8080/api/users/getInfo?username=${username}`)
      .then(response => {
        if (response.data.success) {
          console.log("地址",response.data.address)
          setAddress(response.data.address);
        } else {
          console.error(response.data.message);
        }
      })
      .catch(error => {
        console.error("用户地址获取失败:", error);
      });
  }, [username]);
  
  useEffect(() => {
    // 在组件挂载时，调用函数
    fetchDataFromBackend();
  }, [userAddress]);


  const fetchDataFromBackend = async () => {
    try {
      if (!userAddress) {
        message.error("缺少必要的参数");
        return;
      }
      
      const response = await axios.post(
        "http://localhost:8080/api/points/getEthBalance",
        {
          userAddress,
        }
      );

      if (response.data.success) {
        console.log("ETH余额:",response.data.ethbalancenumber);
        setEthbalance(response.data.ethbalancenumber);
      } else {
        //打印结果
        console.error("列表出错", response.data.error);
      }
    } catch (error) {
      console.error("获取data失败:", error);
    }
  };

  const props = {
    name: "file",
    action: "http://localhost:8080/api/image/upload",
    headers: {
      authorization:  encodeURIComponent("authorization-text"),
      username: encodeURIComponent(sessionStorage.getItem("username")),
    },

  
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      
      if (info.file.status === "done") {
        const response = info.file.response;
  
        if (response && response.success) {
          // 保存上传成功后的头像路径
          const uploadedFilePath = response.pinataFileUrl +`?t=${new Date().getTime()}`;
          console.log('Uploaded file path:', uploadedFilePath);
  
          // 设置 Avatar 组件的 src 属性
          setAvatarSrc(uploadedFilePath);
          message.success(`${info.file.name} 图片上传成功`);
        } else {
          message.error(`${info.file.name} 图片上传失败`);
        }
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 图片上传失败`);
      }
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
              <Avatar
                size={210}
                src={avatarSrc}
                alt="Avatar"
              />
            </div>
            <Title level={4} style={{ textAlign: "center" }}>
              我的名字: {username}
            </Title>
            <Text style={{ textAlign: "center" }}>
              我的地址：{JSON.stringify(userAddress).replace(/"/g, '')}
            </Text>
            <br />
            <Text style={{ textAlign: "center", color: "blue" }}>
              我的ETH余额:{ethbalance} ETH
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InformationList;
