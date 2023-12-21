import React,{useState,useEffect} from "react";
import { Table, Button, Form, Input,message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const columnsb = [
  {
    title: "商户id",
    dataIndex: "merchantId",
    key: "merchantId",
  },
  {
    title: "商户名字",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "商户地址",
    dataIndex: "merchantAddress",
    key: "merchantAddress",
  },
  {
    title: "积分余额",
    dataIndex: "creditScore",
    key: "creditScore",
  },
];

function PointsList({ dataSource, columns }) {
  const [allCreditDetails, setAllCreditDetails] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");

  const paginationConfig = {
    pageSize: 1, 
  };

  useEffect(() => {
    // 在组件挂载时，调用函数
    fetchDataFromBackend();
  }, [searchUsername]);
  
    const fetchDataFromBackend = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/points/all-list", {
          method: "GET",
        });
        const result = await response.json();
  
        if (result.success) {
          console.log("积分信息：", result.pointsDetails);
          setAllCreditDetails(result.pointsDetails);
        } else {
          //打印结果
          console.error("列表出错", result.error);
        }
      } catch (error) {
        console.error("获取data失败:", error);
      }
    };

  return (
    <div>
      <Form
        layout="inline"
        onFinish={(v) => {
          setSearchUsername(v.username);
          message.success("查询成功");
        }}
        style={{ float: "left", marginLeft: "-10px" }}
      >
        <Form.Item label="商户名字" name="username">
          <Input placeholder="请输入关键字" />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            style={{ float: "left", marginLeft: "280px", top: -30 }}
            type="primary"
            icon={<SearchOutlined />}
          />
        </Form.Item>
      </Form>
      <Table columns={columnsb} dataSource={allCreditDetails.filter(item => item.username.includes(searchUsername))} pagination={paginationConfig} rowKey="key"/>
    </div>
  );
}
export default PointsList;
