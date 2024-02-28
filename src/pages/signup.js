import React from 'react';
import { useNavigate} from 'react-router-dom';
const SignUp = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className="container-fluid" style={{width:'75%', paddingTop:'1%'}}>
    <div id="header">
      <h2>TCAP Dashboard</h2>
    </div>
    <p style={{fontSize:'15px'}}>This hazard and risk dashboard, developed under the GCF funded Tuvalu Coastal Adaptation Project (TCAP), showcases Tuvalu’s increased risk knowledge and provides decision makers with ready-made risk products to support the development of short- to long-term effective adaptation strategies. This open-source dashboard is designed as a living platform enabling the integration of new datasets by government. The dashboard offers an highly interactive access to key national-scale datasets including high resolution Digital Elevation Models (DEMs), inundation hazard and risk products as well as shoreline change layers and high-resolution imageries spanning over the last half a century. For more information, email <a href="mailto:oit@spc.int">oit@spc.int</a></p>

    <pre><code className="javascript" id="code"></code></pre>
   
    <div className="row" >
    <div className="col-sm-1">
</div>

<div className="col-sm-2">

<div className="card" style={{width: "100%"}}>

<img src={require('../images/bathy.PNG')} className="card-img-top" alt="Loading.." style={{height:'160px'}}/>
<div className="card-body">
<h5 className="card-title">DEM</h5>

<p className="card-text" style={{fontSize:'13px'}}>Hi-Res Bathymetry and Topography.</p>

<button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/DEM')}}>Browse {">"}</button>
</div>
</div>
</div>
    <div className="col-sm-2">

    <div className="card" style={{width: "100%"}}>

  <img src={require('../images/inund.png')} className="card-img-top" alt="Loading.."style={{height:'160px'}}/>
  <div className="card-body">
    <h5 className="card-title">Inundation</h5>
    <p className="card-text" style={{fontSize:'13px'}}>Inundation for different climate projections.</p>

    <button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/inundation')}}>Browse {">"}</button>
  </div>
</div>
</div>
<div className="col-sm-2">

<div className="card" style={{width: "100%"}}>

<img src={require('../images/shore.png')} className="card-img-top" alt="Loading.."style={{height:'160px'}}/>
<div className="card-body">
<h5 className="card-title">Shoreline</h5>

<p className="card-text" style={{fontSize:'13px'}}>Tool to analyze shoreline change overtime.</p>

<button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/shoreline')}}>Browse {">"}</button>
</div>
</div>
</div>
<div className="col-sm-2">

<div className="card" style={{width: "100%"}}>

<img src={require('../images/risk.png')} className="card-img-top" alt="Loading.." style={{height:'160px'}}/>
<div className="card-body">
<h5 className="card-title">Risk</h5>

<p className="card-text" style={{fontSize:'13px'}}>Shows risk level on different assets.</p>

<button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/risk')}}>Browse {">"}</button>
</div>
</div>
</div>
<div className="col-sm-2">

<div className="card" style={{width: "100%"}}>

<img src={require('../reports/JGR Oceans - 2023 - Wandres - Wave Climate Variability and Trends_in_Tuvalu_Based_on_a_44‐Year_High‐Resolution_Wave.png')} className="card-img-top" alt="Loading.." style={{height:'160px'}}/>
<div className="card-body">
<h5 className="card-title">Reports</h5>

<p className="card-text" style={{fontSize:'13px'}}>Reports and research papers published.</p>

<button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/reports')}}>Browse {">"}</button>
</div>
</div>
</div>
<div className="col-sm-1">
</div>

</div>
<pre><code className="javascript" id="code"></code></pre>
<pre><code className="javascript" id="code"></code></pre>
<pre><code className="javascript" id="code"></code></pre>
<div style={{textAlign: 'center', fontWeight:'bold', color:'#979797'}}>
  Developed and Funded by:
  <div className="row" >
    <div className="col-sm-12" >

    <img src={require('../images/spc1.svg')} className="card-img-top" alt="Loading.." style={{height:'80px', width:'100px', paddingRight:"8px"}}/>
    <img src={require('../images/tv.png')} className="card-img-top" alt="Loading.." style={{height:'50px', width:'50px', paddingRight:"8px"}}/>
     
    <img src={require('../images/UNDPlogo.png')} className="card-img-top" alt="Loading.."style={{height:'46px', width:'40px', paddingRight:"8px"}}/>
    <img src={require('../images/tcap.png')} className="card-img-top" alt="Loading.."style={{height:'46px', width:'50px', paddingRight:"8px"}}/>
    <img src={require('../images/logo_GCF2.png')} className="card-img-top" alt="Loading.."style={{height:'46px', width:'90px', paddingRight:"8px"}}/>
   
     </div>
      </div>
</div>

</div>
</>
  );

};

export default SignUp;
