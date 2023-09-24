import React, { useEffect } from 'react';
import logo from './logo.svg';
import Header from './components/header';
import SkillGemInfoList from './components/SkillGemInfoList';
import CurrencyList from './components/CurrencyInfoList';
import Footer from './components/footer';
import './App.scss';
import Layout from './components/layout';
import { Routes, Route, HashRouter } from 'react-router-dom'
import NoMatch from './components/NoMatch';
import { connect } from 'react-redux';
import { SetSkillGem, SetCurrency, SetCurrencyDetails, SetSkillQuality } from './redux/actions';
import mockDataSkillGem from './test/mockDataSkillGem.json'
import mockDataCurrency from './test/mockDataCurrency.json'
import mockDataLeagueInfo from './test/mockDataLeagueInfo.json'
import mockDataSkillQuality from './test/mockDataSkillQuality.json'
import { Currency, CurrencyDetail, CurrencyInfoRoot } from './Type/CurrencyInfoType';
import { LeagueInfoRoot } from './Type/LeagueInfoType';
import Zoosewu from './components/Zoosewu';
import { SkillGem, SkillGemInfoRoot, SkillGemVariant } from './Type/SkillGemInfoType';
import { Image } from 'react-bootstrap';
interface AppProps {
  SetSkillGem: typeof SetSkillGem
  SetCurrency: typeof SetCurrency
  SetCurrencyDetails: typeof SetCurrencyDetails
}

const App: React.FC<AppProps> = ({ SetSkillGem, SetCurrency, SetCurrencyDetails }) => {
  useEffect(() => {
    const FetchAPI = async () => {
      let leagueJson: LeagueInfoRoot
      let leagueName: string;
      let skillGemJson: SkillGemInfoRoot
      let currencyJson: CurrencyInfoRoot

      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        leagueName = mockDataLeagueInfo.cargoquery[0].title['short name'];
        skillGemJson = mockDataSkillGem
        currencyJson = mockDataCurrency
      } else {
        const leagueData = await fetch('https://www.poewiki.net/w/api.php?action=cargoquery&tables=events&fields=name,ordinal,release_date,release_version,short_name&order_by=ordinal DESC&limit=1&format=json'
          , { method: "GET", })
        leagueJson = await leagueData.json();
        leagueName = leagueJson.cargoquery[0].title['short name'];
        const [skillGem, currency]: Response[] = await Promise.all([
          fetch('https://poe.ninja/api/data/itemoverview?league=' + leagueName + '&type=SkillGem'
            , { method: "GET", }),
          fetch('https://poe.ninja/api/data/currencyoverview?league=' + leagueName + '&type=Currency'
            , { method: "GET", })
        ])
        skillGemJson = await skillGem.json();
        currencyJson = await currency.json();
      }
      const currencyDetail = new Map<string, CurrencyDetail>()
      mockDataCurrency.currencyDetails.forEach(detail => currencyDetail.set(detail.name, detail))
      const CurrencyMap: Currency[] = []
      for (const info of currencyJson.lines) {
        const detail = currencyDetail.get(info.currencyTypeName)
        CurrencyMap.push({
          icon: (<Image src={detail?.icon} width="30px" height="30px" />),
          name: detail?.name,
          id: detail?.id,
          chaosEquivalent: info.chaosEquivalent,
          receiveChange: info.receiveSparkLine.totalChange,
          payChange: info.paySparkLine.totalChange
        } as Currency)
      }
      console.log('App useEffect, League:', leagueName)
      const skillGemMap: Map<string, SkillGem> = new Map<string, SkillGem>()
      for (const info of skillGemJson.lines) {
        let skillGem: SkillGem
        if (skillGemMap.has(info.baseType)) {
          skillGem = skillGemMap.get(info.baseType)!
        } else {
          skillGem = {
            icon: (<Image src={info?.icon} width="30px" height="30px" />),
            name: info.baseType,
            id: info.id,
            variant: []
          } as SkillGem
          skillGemMap.set(info.baseType, skillGem)
        }
        let qualityType: number
        if (info.name.includes('Anomalous')) qualityType = 2
        else if (info.name.includes('Divergent')) qualityType = 3
        else if (info.name.includes('Phantasmal')) qualityType = 4
        else qualityType = 1
        const variant: SkillGemVariant = {
          name: info.name,
          level: info.gemLevel,
          quality: info.gemQuality || 0,
          corrupted: info.corrupted || false,
          qualityType: qualityType,
          chaosValue: info.chaosValue,
          divineValue: info.divineValue,
          totalChange: info.sparkline.totalChange,
          listingCount: info.listingCount
        } as SkillGemVariant
        skillGem.variant.push(variant)
      }
      SetSkillGem(skillGemMap)
      SetCurrency(CurrencyMap)
      SetCurrencyDetails(currencyDetail)
    };
    FetchAPI()
  }, []);
  return (
    <div className="App">
      <HashRouter basename='poe-erl-asho/'>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/home' element={<SkillGemInfoList />} />
            <Route path='/currency' element={<CurrencyList />} />
            <Route path='/zoosewu' element={<Zoosewu />} />
            <Route index element={<SkillGemInfoList />} />
            <Route path='*' element={<NoMatch />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}
export default connect(null, { SetSkillGem, SetCurrency, SetCurrencyDetails })(App);
