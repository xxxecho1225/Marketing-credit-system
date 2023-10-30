import React from 'react';
import {
  Route,
  Routes,
} from "react-router-dom";
import MyLayout from './components/mylayout';
import MarkingList from './marking/markingList';
import MarkingUpload from './marking/markingUpload';
import InformationList from './personal/InformationList';
import UpdatePassw from './personal/UpdatePassw';
import CreditList from './credit/creditList';
import CreditUpload from './credit/creditUpload';
import PointsList from './points/pointsList';
import PointsExchange from './points/pointsExchange';
import MyNft from './nft/myNft';
import ExchangeNft from './nft/exchangeNft';


function App() {
  return (
  
      <MyLayout>
        <Routes>
        <Route path='marketing/marketList' element={<MarkingList/>} />
        <Route path='marketing/uplodMarket' element={<MarkingUpload/>} />
        <Route path='PersonalInformation/InformationList' element={<InformationList/>} />
        <Route path='PersonalInformation/UpdatePassw' element={<UpdatePassw/>} />
        <Route path='credit/creditList' element={<CreditList/>} />
        <Route path='credit/uploadCredit' element={<CreditUpload/>} />
        <Route path='points/pointList' element={<PointsList/>} />
        <Route path='points/exchangePoint' element={<PointsExchange/>} />
        <Route path='nft/exchangeNft' element={<ExchangeNft/>} />
        <Route path='nft/MyNft' element={<MyNft/>} />
        </Routes>
      </MyLayout>
   
   );
}

export default App;
