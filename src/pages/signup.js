import React from 'react';
import { useNavigate} from 'react-router-dom';
const SignUp = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className="container">
    <div id="header">
      <h2>TCAP Dashboard</h2>
    </div>
    <p>This dashboard was developed under the Tuvalu Coastal Adaption Project (TCAP). The portal provides home for gridded and geospatial data produced by the project. </p>

    <pre><code className="javascript" id="code"></code></pre>
   
    <div className="row" >

<div className="col-sm-3">

<div className="card" style={{width: "100%"}}>

<img src={require('../images/bathy.PNG')} className="card-img-top" alt="Loading.." style={{height:'160px'}}/>
<div className="card-body">
<h5 className="card-title">DEM</h5>

<p className="card-text" style={{fontSize:'13px'}}>High Resolution Bathymetry and Topography.</p>

<button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/DEM')}}>Browse {">"}</button>
</div>
</div>
</div>
    <div className="col-sm-3">

    <div className="card" style={{width: "100%"}}>

  <img src={require('../images/inund.png')} className="card-img-top" alt="Loading.."style={{height:'160px'}}/>
  <div className="card-body">
    <h5 className="card-title">Inundation</h5>
    <p className="card-text" style={{fontSize:'13px'}}>Shows inundation for different climate projections.</p>

    <button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/inundation')}}>Browse {">"}</button>
  </div>
</div>
</div>
<div className="col-sm-3">

<div className="card" style={{width: "100%"}}>

<img src={require('../images/shore.png')} className="card-img-top" alt="Loading.."style={{height:'160px'}}/>
<div className="card-body">
<h5 className="card-title">Shoreline Change</h5>

<p className="card-text" style={{fontSize:'13px'}}>Tool to analyze shoreline change overtime.</p>

<button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/shoreline')}}>Browse {">"}</button>
</div>
</div>
</div>
<div className="col-sm-3">

<div className="card" style={{width: "100%"}}>

<img src={require('../images/risk.png')} className="card-img-top" alt="Loading.." style={{height:'160px'}}/>
<div className="card-body">
<h5 className="card-title">Risks</h5>

<p className="card-text" style={{fontSize:'13px'}}>Shows risk level on different assets.</p>

<button type="button" className="btn btn-primary" onClick={()=>{ navigate('/tcap/risk')}}>Browse {">"}</button>
</div>
</div>
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
