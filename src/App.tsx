import React, { useEffect } from 'react'
import SkillGemInfoList from './components/SkillGemInfoList'
import CurrencyList from './components/CurrencyInfoList'
import './App.scss'
import Layout from './components/layout'
import { Routes, Route, HashRouter } from 'react-router-dom'
import NoMatch from './components/NoMatch'
import { connect } from 'react-redux'
import { SetSkillGem, SetCurrency, SetCurrencyDetails } from './redux/actions'
import mockDataSkillGem from './test/mockDataSkillGem.json'
import mockDataCurrency from './test/mockDataCurrency.json'
import mockDataLeagueInfo from './test/mockDataLeagueInfo.json'
import { CurrencyInfoRoot } from './Type/CurrencyInfoType'
import { LeagueInfoRoot } from './Type/LeagueInfoType'
import Zoosewu from './components/Zoosewu'
import { SkillGemInfoRoot } from './Type/SkillGemInfoType'
import { POENinjaSkillGemAdapter } from './Adapter/POENinjaSkillGemAdapter'
import { POENinjaCurrencyAdapter } from './Adapter/POENinjaCurrencyAdapter'
interface AppProps {
  SetSkillGem: typeof SetSkillGem
  SetCurrency: typeof SetCurrency
  SetCurrencyDetails: typeof SetCurrencyDetails
}

const App: React.FC<AppProps> = ({ SetSkillGem, SetCurrency, SetCurrencyDetails }) => {
  useEffect(() => {
    const FetchAPI = async () => {
      let leagueName: string
      let skillGemJson: SkillGemInfoRoot
      let currencyJson: CurrencyInfoRoot

      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        leagueName = mockDataLeagueInfo.cargoquery[0].title['short name']
        skillGemJson = mockDataSkillGem
        currencyJson = mockDataCurrency
      } else {
        const leagueData = await fetch('https://www.poewiki.net/w/api.php?action=cargoquery&tables=events&fields=name,ordinal,release_date,release_version,short_name&order_by=ordinal DESC&limit=1&format=json'
          , { method: 'GET' })
        const leagueJson: LeagueInfoRoot = await leagueData.json()
        leagueName = leagueJson.cargoquery[0].title['short name']
        const [skillGem, currency]: Response[] = await Promise.all([
          fetch('https://poe.ninja/api/data/itemoverview?league=' + leagueName + '&type=SkillGem'
            , { method: 'GET' }),
          fetch('https://poe.ninja/api/data/currencyoverview?league=' + leagueName + '&type=Currency'
            , { method: 'GET' })
        ])
        skillGemJson = await skillGem.json()
        currencyJson = await currency.json()
      }
      console.log('App useEffect, League:', leagueName)
      const skillGemMap = POENinjaSkillGemAdapter(skillGemJson)
      const [currencies, currencyDetails] = POENinjaCurrencyAdapter(currencyJson)

      SetSkillGem(skillGemMap)
      SetCurrency(currencies)
      SetCurrencyDetails(currencyDetails)
    }
    FetchAPI()
  })
  return (
    <div className='App'>
      <HashRouter>
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
  )
}
export default connect(null, { SetSkillGem, SetCurrency, SetCurrencyDetails })(App)
