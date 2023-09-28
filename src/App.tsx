import React, { useEffect } from 'react'
import SkillGemList from './components/SkillGem/SkillGemList'
import CurrencyList from './components/Currency/CurrencyList'
import './App.scss'
import Layout from './components/Layout/layout'
import { Route, RouterProvider, createHashRouter } from 'react-router-dom'
import NoMatch from './components/Layout/NoMatch'
import { connect } from 'react-redux'
import { SetSkillGem, SetCurrency, SetCurrencyDetails } from './redux/actions'
import mockDataSkillGem from './test/mockDataSkillGem.json'
import mockDataCurrency from './test/mockDataCurrency.json'
import mockDataLeagueInfo from './test/mockDataLeagueInfo.json'
import { CurrencyInfoRoot } from './Type/CurrencyInfoType'
import { LeagueInfoRoot } from './Type/LeagueInfoType'
import Zoosewu from './components/Zoosewu/Zoosewu'
import { SkillGemInfoRoot } from './Type/SkillGemInfoType'
import { POENinjaSkillGemAdapter } from './Adapter/POENinjaSkillGemAdapter'
import { POENinjaCurrencyAdapter } from './Adapter/POENinjaCurrencyAdapter'
import SkillQualityList from './components/SkillQuality/SkillQualityList'
import FetchError from './components/Layout/FetchError'
import { SkillQualityInfoCargoquery, SkillQualityInfoCountRoot, SkillQualityInfoRoot } from './Type/SkillQualityType'
import { FetchAllSkillQuality, FetchAllSkillQualityCount } from './Adapter/POEWikiSkillQualityAdapter'
interface AppProps {
  SetSkillGem: typeof SetSkillGem
  SetCurrency: typeof SetCurrency
  SetCurrencyDetails: typeof SetCurrencyDetails
}
const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <SkillGemList />, },
      { path: "skill-gem", element: <SkillGemList />, },
      { path: "currency", element: <CurrencyList />, },
      { path: "skill-quality", element: <SkillQualityList />, },
      { path: "calculate", element: <Zoosewu />, },
      { path: "fetch-error", element: <FetchError />, },
      { path: "*", element: <NoMatch />, },
    ],
  },
])
const App: React.FC<AppProps> = ({ SetSkillGem, SetCurrency, SetCurrencyDetails }) => {
  useEffect(() => {
    const FetchAPI = async () => {
      let leagueName: string
      let skillGemJson: SkillGemInfoRoot
      let currencyJson: CurrencyInfoRoot

      // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      if (false) {
        leagueName = mockDataLeagueInfo.cargoquery[0].title['short name']
        skillGemJson = mockDataSkillGem
        currencyJson = mockDataCurrency
      } else {
        try {
          const [leagueData, countData] = await Promise.all([
            fetch('https://www.poewiki.net/w/api.php?action=cargoquery&tables=events&fields=name,ordinal,release_date,release_version,short_name&order_by=ordinal DESC&limit=1&format=json', { method: 'GET' }),
            FetchAllSkillQualityCount(),
          ])

          const leagueJson: LeagueInfoRoot = await leagueData.json()
          leagueName = leagueJson.cargoquery[0].title['short name']

          const countJson: SkillQualityInfoCountRoot = await countData.json()
          const queryCount = parseInt(countJson.cargoquery[0].title.count)
          console.log('GetSkillQuality Count', queryCount)

          const [skillGem, currency, skillQualityResponses] = await Promise.all([
            fetch('https://poe.ninja/api/data/itemoverview?league=' + leagueName + '&type=SkillGem', { method: 'GET' }),
            fetch('https://poe.ninja/api/data/currencyoverview?league=' + leagueName + '&type=Currency', { method: 'GET' }),
            FetchAllSkillQuality(queryCount),
          ])
          skillGemJson = await skillGem.json()
          currencyJson = await currency.json()
          let skillQualityInfoCargoquery: SkillQualityInfoCargoquery[] = []
          for (const response of skillQualityResponses) {
            const jsonData: SkillQualityInfoRoot = await response.json()
            skillQualityInfoCargoquery = skillQualityInfoCargoquery.concat(jsonData.cargoquery)
          }
        } catch (error) {
          console.log(router?.state.location.pathname, ', is fetch-error', router?.state.location.pathname === '/fetch-error')
          if (error instanceof Error) console.log(error.message)
          if (router?.state.location.pathname !== '/fetch-error') router?.navigate("/fetch-error")
          leagueName = ''
          skillGemJson = mockDataSkillGem
          currencyJson = mockDataCurrency
        }
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
  // return (
  //   <div className='App'>
  //     <HashRouter>
  //       <Routes>
  //         <Route path='/' element={<Layout />}>
  //           <Route path='/home' element={<SkillGemList />} />
  //           <Route path='/currency' element={<CurrencyList />} />
  //           <Route path='/skillQuality' element={<SkillQualityList />} />SkillQualityList
  //           <Route path='/zoosewu' element={<Zoosewu />} />
  //           <Route path='/fetch-error' element={<FetchError />} />
  //           <Route index element={<SkillGemList />} />
  //           <Route path='*' element={<NoMatch />} />
  //         </Route>
  //       </Routes>
  //     </HashRouter>
  //   </div>
  // )
  if (!router) {
    return (<div className='App'></div>)
  }
  return (
    <div className='App'>
      <RouterProvider router={router!} />
    </div>
  )
}
export default connect(null, { SetSkillGem, SetCurrency, SetCurrencyDetails })(App)
