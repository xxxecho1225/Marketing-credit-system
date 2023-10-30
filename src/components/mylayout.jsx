import React, { useState }  from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
  CodepenCircleOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Dropdown, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import icon from "../img/icon.png";
import logo from "../img/logo.png";
// import MyWeb3 from "./web3";
const { Header, Content, Footer, Sider } = Layout;


function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("信用管理", "/home/credit", <CodepenCircleOutlined />, [
    getItem("上传信用凭证", "/home/credit/uploadCredit"),
    getItem("信用凭证列表", "/home/credit/creditList"),
  ]),
  getItem("积分管理", "/home/points", <PieChartOutlined />, [
    getItem("积分兑换", "/home/points/exchangePoint"),
    getItem("积分历史列表", "/home/points/pointList"),
  ]),
  getItem("NFT勋章管理", "/home/nft", <DesktopOutlined />, [
    getItem("兑换勋章", "/home/nft/exchangeNft"),
    getItem("我的勋章", "/home/nft/MyNft"),
  ]),
  getItem("营销信息管理", "/home/marketing", <FileOutlined />, [
    getItem("上传营销信息", "/home/marketing/uplodMarket"),
    getItem("营销信息列表", "/home/marketing/marketList"),
  ]),
  getItem("个人信息", "/home/PersonalInformation", <UserOutlined />, [
    getItem("我的个人信息", "/home/PersonalInformation/InformationList"),
    getItem("修改密码", "/home/PersonalInformation/UpdatePassw"),
  ]),
];

const MyLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state && location.state.username;
  const pathname = location.pathname;

  const findBreadcrumbItems = (items, path) => {
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
          <span className="app-title" style={{ float: "left", marginLeft: "20px" }}>基于区块链的营销信用系统</span>
          <div style={{ float: "right", marginRight: "20px" }}>
            <Dropdown
              overlay={
                <Menu
                  onClick={({ key }) => {
                    if (key === "logout") {
                      navigate("/");
                    }
                    if (key === "userCenter") {
                      navigate("/home/PersonalInformation/InformationList");
                      message.info("欢迎来到个人中心");
                    } else {
                      message.info("退出登录成功，欢迎来到登录页面");
                    }
                  }}
                >
                  <Menu.Item key="userCenter">个人中心</Menu.Item>
                  <Menu.Item key="logout">退出</Menu.Item>
                </Menu>
              }
            >
              <div>
                <img
                  src={icon}
                  alt="Logo"
                  style={{
                    width: "30px",
                    borderRadius: "50%",
                    float: "right",
                    marginTop: "16px",
                    marginRight: "20px",
                  }}
                ></img>
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
                  {item.icon} {item.label} {/* 将 icon 移至这里 */}
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
