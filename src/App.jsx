import React from "react";
import { Routes, Route } from "react-router-dom";
import MyLayout from "./components/mylayout";
import MarkingList from "./pages/marking/markingList";
import MarkingUpload from "./pages/marking/markingUpload";
import InformationList from "./pages/personal/InformationList";
import UpdatePassw from "./pages/personal/UpdatePassw";
import CreditList from "./pages/credit/creditList";
import CreditUpload from "./pages/credit/creditUpload";
import PointsList from "./pages/points/pointsList";
import PointsExchange from "./pages/points/pointsExchange";
import MyNft from "./pages/nft/myNft";
import ExchangeNft from "./pages/nft/exchangeNft";

function App() {

  return (
    <MyLayout>
      <Routes>
        <Route path="marketing/list" element={<MarkingList />} />
        <Route path="marketing/uplod" element={<MarkingUpload />} />
        <Route path="Personal/list" element={<InformationList />} />
        <Route path="Personal/UpdatePassw" element={<UpdatePassw />} />
        <Route path="credit/creditList" element={<CreditList />} />
        <Route path="credit/uploadCredit" element={<CreditUpload />} />
        <Route path="points/pointList" element={<PointsList />} />
        <Route path="points/exchangePoint" element={<PointsExchange />} />
        <Route path="nft/exchangeNft" element={<ExchangeNft />} />
        <Route path="nft/Mynft" element={<MyNft />} />
      </Routes>
    </MyLayout>
  );
}

export default App;
