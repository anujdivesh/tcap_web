import React, { useEffect, useRef } from 'react';
import Pdf from '../reports/JGR Oceans - 2023 - Wandres - Wave Climate Variability and Trends_in_Tuvalu_Based_on_a_44‐Year_High‐Resolution_Wave.pdf';
const Catalogue = () => {

  const _isMounted = useRef(true);

   useEffect(() => {  
     
   if (_isMounted.current){
     
   }  
   return () => { _isMounted.current = false }; 
   },[]);
   
  

  return (
    <>
    <div className="container">
    <div className="row" >
    <div className="col-sm-3">

    <div class="card" style={{width: "100%"}}>

  <img style={{height:'150px'}} src={require('../reports/JGR Oceans - 2023 - Wandres - Wave Climate Variability and Trends_in_Tuvalu_Based_on_a_44‐Year_High‐Resolution_Wave.png')} class="card-img-top" alt="Loading.."/>
  <div class="card-body">
    <h5 class="card-title">Research Paper</h5>
    <p class="card-text" style={{fontSize:'12px'}}>Wave Climate Variability and Trends in Tuvalu Based on a 44-Year High-Resolution Wave Hindcast.</p>
    <a href = {Pdf} target = "_blank" rel="noopener noreferrer"  type="button" className="btn btn-primary">Browse</a>
  </div>
</div>
</div>

</div>
</div>
</>
  );

};

export default Catalogue;
