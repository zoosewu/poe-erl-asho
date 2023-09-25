import React from 'react'
import Header from './header'
import Footer from './footer'
import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
// const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
//   console.log(children)
const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Container fluid>
        <Outlet />
      </Container>
      <Footer />
    </>
  )
}
export default Layout
