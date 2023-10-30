import React from "react";
import { Table, Button, Form, Input,message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "商户id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "商户名字",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "商户地址",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "信用评级",
    dataIndex: "rating",
    key: "rating",
  },
  {
    title: "财务陈述",
    key: "tag",
    dataIndex: "tag",
  },
];
const data = [
  {
    id: 1,
    name: "软件大师公司",
    address: "0x87873aB5ce6bED13eD886c48FDd552BDB7561adF",
    rating: "五星",
    tag: "130w+",
  },
  {
    id: 2,
    name: "云未来科技",
    address: "0x87873aB5ce6bED13eD886c48FDd552BDB7561adF",
    rating: "四星",
    tag: "13w+",
  },
  {
    id: 3,
    name: "萨摩医疗诊所",
    address: "0x87873aB5ce6bED13eD886c48FDd552BDB7561adF",
    rating: "三星",
    tag: "220w+",
  },
  {
    id: 4,
    name: "心脏关怀医疗中心",
    address: "0x87873aB5ce6bED13eD886c48FDd552BDB7561adF",
    rating: "三星",
    tag: "220w+",
  },
  {
    id: 5,
    name: "投资之星财务",
    address: "0x87873aB5ce6bED13eD886c48FDd552BDB7561adF",
    rating: "三星",
    tag: "220w+",
  },
];

function creditList() {
  return (
    <div>
      <Form
        layout="inline"
        onFinish={(v) => {
          message.success("查询成功");
        }}
        style={{ float: "left", marginLeft: "-10px" }}
      >
        <Form.Item label="名字" name="name">
          <Input placeholder="请输入关键字" />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="sumbit"
            style={{ float: "left", marginLeft: "270px", top: -30 }}
            type="primary"
            icon={<SearchOutlined />}
          />
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
export default creditList;
