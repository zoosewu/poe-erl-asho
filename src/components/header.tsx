import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import navLinks from './navLinks.json'
import { Link } from 'react-router-dom'
import pkg from '../../package.json'

const Header: React.FC = () => {
  return (
    <Navbar bg='light' expand='lg'>
      <Link className='navbar-brand' to='/'>{pkg.displayName}</Link>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='ml-auto'>
          {navLinks.map((item, index) => (
            // <Nav.Link key={index} href={'/' + item.href}>{item.label}</Nav.Link>
            <Link key={index} to={'/' + item.href} className='nav-link'>{item.label}</Link>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
export default Header
