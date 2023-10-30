import React from "react";
import { Form, Input, Button, Card, InputNumber, Tooltip } from "antd";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const requiredMessage = "${label} 是必填的！";
const numberMessage = "${label} 不是有效的数字！";
const numberRangeMessage = "${label} 必须在 ${min} 和 ${max} 之间。";


const validateMessages = {
  
  required: requiredMessage,
  types: {
    number: numberMessage,
  },
  number: {
    range: numberRangeMessage,
  },
};



const onFinish = (values) => {
  console.log(values);
};

const PointsExchange = () => {
  return (
    <Card title="积分兑换">
      <Tooltip title="兑换规则">
        <span style={{ color: '#1677ff', fontSize: '16px'}} >100积分可以兑换1ETH</span>
      </Tooltip>
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={["user", "name"]}
          label="商户名"
          rules={[
            {
              required: true,
              type:"name"
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["user", "text"]}
          label="地址"
          rules={[
            {
              required: true,
              type: "address",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["user", "points"]}
          label="积分"
          rules={[
            {
              required: true,
              type: "number",
              min: 0,
              max: 1000,
            },
          ]}
        >
          <InputNumber step={100} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button type="primary" htmlType="submit">
            兑换
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PointsExchange;
