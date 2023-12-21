import React, { useState, useEffect } from "react";
import { Card, Col, Row, message } from "antd";
import axios from "axios";
const { Meta } = Card;

const MyNft = () => {
  const [merchantNFTs, setMerchantNFTs] = useState([]);
  const [data, setData] = useState([]);
  const [merchant, setMerchant] = useState({});
  const username = sessionStorage.getItem("username");
  console.log("用户username:", username);
  console.log("地址:", merchant);
  console.log("data11111:", data);  

  async function fetchData(jsonFileName) {
    const folderAddress = "QmZqUEkE9MQ6qSHwJuSuRK1CBzGysTVQ1jkahL3ekdna9j";
    const response = await fetch(
      `https://gateway.pinata.cloud/ipfs/${folderAddress}/${jsonFileName}`
    );
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData("_metadata.json");
      setData(data);
    };
    getData();
  }, []);

  const nftsWithImages = merchantNFTs.map((nft) => {
    const metadata = data.find((item) => item.edition === nft.id);
    console.log("Metadata for id", nft.id, ":", metadata);
    return {
      ...nft,
      name:  metadata ? metadata.name : null,
      image: metadata ? metadata.image : null,
      description:metadata ? metadata.description :null,
    };
  });

  console.log("111111111",nftsWithImages)

  // 在组件挂载时从数据库获取用户地址信息
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/users/getInfo?username=${username}`)
      .then((response) => {
        if (response.data.success) {
          setMerchant(response.data.address);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("用户地址获取失败:", error);
      });
  }, [username]);

  useEffect(() => {
    // 只有在 merchant 不为空的情况下才发起接口请求
    if (merchant) {
      const fetchMerchantNFTs = async () => {
        try {
          if (!merchant) {
            message.error("缺少必要的参数");
            return;
          }

          const response = await axios.post(
            "http://localhost:8080/api/nft/getMerchantNFT",
            {
              merchant,
            }
          );

          if (response.data.success) {
            console.log("代币信息", response.data.nftdataDetails);
            setMerchantNFTs(response.data.nftdataDetails);
          } else {
            message.error("展示失败");
            console.error(response.data.error);
          }
        } catch (error) {
          console.error("Error fetching merchant NFTs:", error);
        }
      };

      fetchMerchantNFTs();
    }
  }, [merchant]);

  return (
    <div>
      <Row gutter={16}>
        {nftsWithImages.map((nft) => (
          <Col key={nft.id} span={8} title="代币兑换">
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
                    nft.image
                  }
                />
              }
            >
              <span
                name={nft.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  padding: "8px",
                  background: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "bold",
                }}
              >
                {nft.id}
              </span>
              <Meta title={nft.name} description={nft.description} />
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#1890ff",
                  marginTop: "13px",
                }}
              >
                已拥有数量: {nft.amount}
              </span>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MyNft;
