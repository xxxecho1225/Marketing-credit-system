import React,{useEffect,useState}from "react";
import { Form, Input, Button, Card, InputNumber, Tooltip,message } from "antd";
import axios from "axios";

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

function PointsExchange() {
  const [form] = Form.useForm();
  const [merchantAddress, setAddress] = useState({ address: "默认地址"}); // 初始值为空对象
  const username = sessionStorage.getItem("username");
  console.log("商户地址1:", merchantAddress);
  console.log("商户名:", username);

  useEffect(() => {
    // 在组件挂载时从数据库获取商户地址信息
    axios
      .get(`http://localhost:8080/api/users/getInfo?username=${username}`)
      .then((response) => {
        if (response.data.success) {
          console.log("11111111",response.data.address)
          setAddress(response.data.address);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("商户地址获取失败:", error);
      });
  }, [username])

  useEffect(() => {
    // 当merchantAddress变化时，设置表单的初始值
    form.setFieldsValue({ merchantAddress: merchantAddress });
  }, [merchantAddress, form]);


  const handleExchangeCredits = async (values) => {
    try {
      const { creditAmount, merchantAddress } = values;

      const response = await axios.post('http://localhost:8080/api/points/exchange-points', {
        creditAmount,
        merchantAddress,
      });
      message.success("兑换ETH成功!");
      console.log('Exchange Credits transaction details:', response.data);
    } catch (error) {
      message.error("没有上传信用凭证！积分不足!");
      console.error('Error exchanging credits for ETH:', error.message);
    }
  };

  return (
    <Card title="积分兑换">
      <Tooltip title="兑换规则">
        <span style={{ color: '#1677ff', fontSize: '16px'}} >100积分可以兑换1ETH</span>
      </Tooltip>
      <Form
        {...layout}
        name="nest-messages"
        style={{
          maxWidth: 600,
        }}
        validateMessages={validateMessages}
        form={form}
        onFinish={handleExchangeCredits}
      >
        <Form.Item
          name= "creditAmount"
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
          <InputNumber style={{ width: "109%" }} step={100} placeholder="请输入积分"/>
        </Form.Item>
        <Form.Item
          name="merchantAddress"
          label="商户地址"
          initialValue={merchantAddress}
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                if (value !== merchantAddress) {
                  throw new Error("地址验证失败");
                }
              },
            },
          ]}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button type="primary" htmlType="submit">
            兑换ETH
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PointsExchange;
