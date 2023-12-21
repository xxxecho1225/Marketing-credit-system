import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Modal,
  Form,
  InputNumber,
  message,
} from "antd";
import axios from "axios";
const { Meta } = Card;

const ExchangeNft = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [id, setExchangeEdition] = useState(null);
  const [amount, setAmount] = useState(100);
  const [creditAmount, setCreditAmount] = useState(100);
  const [merchantAddress, setMerchantAddress] = useState({});
  const [tokenURI,setTokenURI] = useState("元数据");
  const username = sessionStorage.getItem("username");
  console.log("用户username:", username);
  console.log("代币id:", id);
  console.log("代币数量:", amount);
  console.log("兑换积分:", creditAmount);
  console.log("地址:", merchantAddress);
  console.log("元数据:", tokenURI);

  async function fetchData(jsonFileName) {
    const folderAddress = "QmdNQbcnB8Q6yt8NDFhQkDbv8vhuRZjx6KGbNztJwzSwXv";
    const response = await fetch(
      `https://gateway.pinata.cloud/ipfs/${folderAddress}/${jsonFileName}`
    );
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const getData = async () => {
      const jsonFileNames = ["_metadata.json"];
      const newData = await Promise.all(jsonFileNames.map(fetchData));
      setData(newData);
    };

    getData();
  }, []);

  // 在组件挂载时从数据库获取用户地址信息
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/users/getInfo?username=${username}`)
      .then((response) => {
        if (response.data.success) {
          setMerchantAddress(response.data.address);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("用户地址获取失败:", error);
      });
  }, [username]);

  const handleInputChange = (value) => {
    // 将积分限制在100到300的范围内
    if (value >= 100 && value <= 300) {
      setCreditAmount(value);
    }
  };

  const handleInputChange2 = (value) => {
    // 将积分限制在100到300的范围内
    if (value >= 100 && value <= 800) {
      setAmount(value);
    }
  };

  const handleExchangeConfirm = async () => {
    try {
      // Validate if required fields are present
      if (!id || !amount || !merchantAddress || !creditAmount) {
        message.error("缺少必要的参数");
        return;
      }

      // 处理兑换确认逻辑
      console.log("兑换NFT编号:", id);
      console.log("兑换数量:", amount);
      console.log("兑换积分:", creditAmount);
      console.log("地址:", merchantAddress);
      console.log("元数据:", tokenURI);

      // Make a request to your backend API
      const response = await axios.post(
        "http://localhost:8080/api/nft/exchange",
        {
          id,
          amount,
          creditAmount,
          merchantAddress,
          tokenURI,
        }
      );

      //检查是否成功
      if (response.data.success) {
        message.success("兑换成功！");
        setVisible(false); // 关闭弹窗
      } else {
        message.error("兑换失败: " + response.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("兑换失败: 发生了一个错误");
    }
  };

  const handleExchangeCancel = () => {
    // 处理兑换取消逻辑
    setVisible(false); // 关闭弹窗
  };

  const showModal = (id) => {
    setExchangeEdition(id);
    let fixedAmount;
    switch (id) {
      case 1:
        fixedAmount = 100;
        message.warning(
          `ID为${id}的代币只应使用${fixedAmount}的积分进行兑换哦`
        );
        break;
      case 2:
        fixedAmount = 200;
        message.warning(
          `ID为${id}的代币只应使用${fixedAmount}的积分进行兑换哦`
        );
        break;
      case 3:
        fixedAmount = 300;
        message.warning(
          `ID为${id}的代币只应使用${fixedAmount}的积分进行兑换哦`
        );
        break;
      default:
        fixedAmount = 100;
    }

    setCreditAmount(fixedAmount);
    setVisible(true);
  };

  return (
    <div>
      <Row gutter={16}>
        {data[0]?.map((item, index) => (
          <Col key={index} span={8}>
            <Card
              hoverable
              style={{
                width: 240,
              }}
              cover={
                <img
                  alt=""
                  src={
                    "https://lime-efficient-guppy-179.mypinata.cloud/" +
                    item.image
                  }
                />
              }
            >
              <span
                data-name={item.edition}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  padding: "8px",
                  background: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "bold",
                }}
              >
                {item.edition}
              </span>
              <Meta title={item.name} description={item.description} />
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: "12px" }}
                onClick={() => showModal(item.edition)}
              >
                兑换
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="输入兑换的信息"
        visible={visible}
        onOk={handleExchangeConfirm}
        onCancel={handleExchangeCancel}
      >
        <Form>
          <Form.Item label="兑换数量">
            <InputNumber
              type="number"
              name="amount"
              placeholder="请输入兑换数量"
              value={amount}
              onChange={handleInputChange2}
              step={100}
            />
          </Form.Item>
          <Form.Item label="兑换积分">
            <InputNumber
              type="number"
              name="creditAmount"
              placeholder="请输入兑换积分"
              value={creditAmount}
              onChange={handleInputChange}
              step={100}
              min={100} // 设置最小值为100
              max={300} // 设置最大值为300
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExchangeNft;
