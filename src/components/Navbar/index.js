import React from 'react';
import {
  Nav,
  NavLink,
  NavMenu,
  NavLinkage
} from './NavbarElements';

const Navbar = () => {
  return (
    <>
      <Nav>

      <NavLinkage to='/tcap'>
          <img src={require('../../images/spx.png')} alt='logo' style={{width:"85px", height:"50px"}}/>
        </NavLinkage>

      <NavLinkage to='/tcap' >
          <img src={require('../../images/tv.png')} alt='logo' style={{width:"50px", height:"50px",marginTop:"-2px",marginLeft:'3px'}}/>
        </NavLinkage>
      <NavLinkage to='/tcap'>
          <img src={require('../../images/UNDPlogo.png')} alt='logo' style={{width:"30px", height:"45px",marginLeft:'3px'}}/>
        </NavLinkage>
      <NavLinkage to='/tcap' >
          <img src={require('../../images/tcap.png')} alt='logo' style={{width:"50px", height:"50px", marginTop:"-3px",marginLeft:'3px'}}/>
        </NavLinkage>
        
      <NavLinkage to='/tcap' >
          <img src={require('../../images/GCFLogo.png')} alt='logo' style={{width:"75px", height:"45px",marginLeft:'3px'}}/>
        </NavLinkage>
        <NavLink to='/tcap' style={{color:"white", fontWeight:"bold", fontSize:"18px", paddingLeft:'14%'}}>
        Tuvalu Coastal Adaptation Project
        </NavLink>
        <NavMenu style={{paddingLeft:'9%'}}>
        <NavLink to='/tcap/home'>
          Home
          </NavLink>

          <NavLink to='/tcap/DEM'>
          DEM
          </NavLink>
          <NavLink to='/tcap/shoreline'>
            Shoreline
          </NavLink>
          <NavLink to='/tcap/inundation'>
            Inundation
          </NavLink>
         
          <NavLink to='/tcap/risk'>
            Risks
          </NavLink>
          <NavLink to='/tcap/reports'>
          Reports
          </NavLink>
          <NavLink to='/tcap/login'>
          Login
          </NavLink>
          
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
