import React, { useState, useEffect } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
  CodepenCircleOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Dropdown, message,Avatar } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import UploadCredit from "../pages/credit/creditUpload";
import CreditList from "../pages/credit/creditList";
import ExchangePoint from "../pages/points/pointsExchange";
import PointList from "../pages/points/pointsList";
import ExchangeNft from "../pages/nft/exchangeNft";
import Mynft from "../pages/nft/myNft";
import Marketinguplod from "../pages/marking/markingUpload";
import Marketinglist from "../pages/marking/markingList";
import Personallist from "../pages/personal/InformationList";
import UpdatePassw from "../pages/personal/UpdatePassw";
import icon from "../image/icon.png";
import logo from "../image/logo.png";
import axios from "axios"; // 引入 axios 库
const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: '/home/credit',
    icon: <CodepenCircleOutlined />,
    label: '信用管理',
    roles: ['admin', 'editor'],
    children: [
      {
        label: '上传信用凭证',
        key: '/home/credit/uploadCredit',
        element: <UploadCredit />,
        roles: ['admin'],
      },
      {
        label: '信用凭证列表',
        key: '/home/credit/creditList',
        element: <CreditList />,
        roles: ['admin', 'editor'],
      },
    ],
  },
  {
    key: '/home/points',
    icon: <PieChartOutlined />,
    label: '积分管理',
    roles: ['admin', 'editor'],
    children: [
      {
        label: '积分兑换',
        key: '/home/points/exchangePoint',
        element: <ExchangePoint />,
        roles: ['admin', 'editor'],
      },
      {
        label: '积分历史列表',
        key: '/home/points/pointList',
        element: <PointList />,
        roles: ['admin', 'editor'],
      },
    ],
  },
  {
    key: '/home/nft',
    icon: <DesktopOutlined/>,
    label: 'NFT勋章管理',
    roles: ['admin', 'editor'],
    children: [
      {
        label: '兑换勋章',
        key: '/home/nft/exchangeNft',
        element: <ExchangeNft />,
        roles: ['admin', 'editor'],
      },
      {
        label: '我的勋章',
        key: '/home/nft/Mynft',
        element: <Mynft />,
        roles: ['admin', 'editor'],
      },
    ],
  },
  {
    key: '/home/marketing',
    icon: <FileOutlined />,
    label: '营销信息管理',
    roles: ['admin', 'editor'],
    children: [
      {
        label: '上传营销信息',
        key: '/home/marketing/uplod',
        element: <Marketinguplod />,
        roles: ['admin', 'editor'],
      },
      {
        label: '营销信息列表',
        key: '/home/marketing/list',
        element: <Marketinglist />,
        roles: ['admin', 'editor'],
      },
    ],
  },
  {
    key: '/home/Personal',
    icon: <UserOutlined/>,
    label: '个人信息',
    roles: ['admin', 'editor'],
    children: [
      {
        label: '我的个人信息',
        key: '/home/Personal/list',
        element: <Personallist />,
        roles: ['admin', 'editor'],
      },
      {
        label: '修改密码',
        key: '/home/Personal/UpdatePassw',
        element: <UpdatePassw />,
        roles: ['admin', 'editor'],
      },
    ],
  },
];

const MyLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(icon); // 初始值为默认头像
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const username = sessionStorage.getItem('username')
  console.log(username)

  useEffect(() => {
    // 在组件挂载时或路径改变时，更新 username
    // const usernameFromLocation = location.state && location.state.username;
    // setUsername(usernameFromLocation);
  }, [location]);

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

  const pathname = location.pathname;

  const findBreadcrumbItems = (items, path)=> {
    const breadcrumbItems = [];
    for (const item of items) {
      if (item.key === path) {
        breadcrumbItems.push(item);
        return breadcrumbItems;
      }
      if (item.children) {
        const childBreadcrumbItems = findBreadcrumbItems(item.children, path);
        if (childBreadcrumbItems.length > 0) {
          breadcrumbItems.push(item);
          breadcrumbItems.push(...childBreadcrumbItems);
          return breadcrumbItems;
        }
      }
    }
    return breadcrumbItems;
  };

  const breadcrumbItems = findBreadcrumbItems(items, pathname);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical">
          <img src={logo} alt="Logo" style={{ width: "100%" }} />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={({ key }) => {
            navigate(key);
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <span
            className="app-title"
            style={{ float: "left", marginLeft: "20px" }}
          >
            基于区块链的营销信用系统
          </span>
          <div style={{ float: "right", marginRight: "20px" }}>
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <span
                        onClick={() => {
                          navigate("/home/Personal/list");
                          message.info("欢迎来到个人中心");
                        }}
                      >
                        个人中心
                      </span>
                    ),
                    key: "userCenter",
                  },
                  {
                    label: (
                      <span
                        onClick={() => {
                          navigate("/");
                          message.info("退出登录成功，欢迎来到登录页面");
                        }}
                      >
                        退出
                      </span>
                    ),
                    key: "logOut",
                  },
                ],
              }}
            >
              <div>
              <Avatar
                src={avatarSrc}
                alt="Avatar"
                style={{
                  width: "30px",
                  borderRadius: "60%",
                  float: "right",
                  marginTop: "16px",
                  marginRight: "20px",
                }}
              />
              <span>欢迎！{username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            {breadcrumbItems.map((item, index) => (
              <Breadcrumb.Item key={index}>
                <span
                  onClick={() => navigate(item.key)}
                  style={{ cursor: "pointer" }}
                >
                  {item.icon} {item.label}
                </span>
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>

          <div
            style={{
              padding: 24,
              minHeight: 540,
              background: colorBgContainer,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ©2023 基于区块链的营销信用系统
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MyLayout;
