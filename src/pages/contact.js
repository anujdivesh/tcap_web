import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import "leaflet-side-by-side";
import "./L.TileLayer.BetterWMS";
import {mayFlyer, addShorelineImagenoPaneGen, getMarker, addRisk} from "./helper";

const Contact = () => {

  //VARIABLES
  const shorelineLayer = useRef();
  const baseLayer = useRef();
  const layer2 = useRef();
  const _isMounted = useRef(true);
  const mapContainer = React.useRef(null);
  const url_risk = "https://opm.gem.spc.int/tcap/risk-plots";
 // const risk_uri =url_risk+"/Population_Exposed/Tuvalu_Islands_population_exposed_percentage_Present_5.png"
  const yearRef = useRef(5);
  const siteRef = useRef("Tuvalu");
  const horizonRef = useRef("2060");
  const climateRef = useRef("SSP2");
  const presentBoolRef = useRef(true);
  const [abool, setabool] = useState(false);
  const [economicbool, seteconomicbool] = useState(false);
  const [expo, setExpo] = useState(true);
  const assetRef = useRef("population");
  const typeRef = useRef("exposed");
  const siteRefBool = useRef(true);
  //const [display2, setDisplay2] = useState(false);
  const [displayShape, setDisplayShape] = useState(false);
  const risklayer = useRef();

  function initMap(url_risk){

    baseLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; Pacific Community (OSM)',
      detectRetina: true
  });

  
  mapContainer.current = L.map('map', {
    zoom: 7,
    center: [-8, 179.3053]
  });
  baseLayer.current.addTo(mapContainer.current); 
  mayFlyer(mapContainer.current, siteRef.current);

  
  layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current)
 // risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')

  }
useEffect(() => {  
  
if (_isMounted.current){
  initMap(url_risk);
  
}  
return () => { _isMounted.current = false }; 
},[]);



const handleSite=(e)=>{

  siteRef.current = e.target.value;
  setHorizon('present')
  if (e.target.value !== "Tuvalu"){
    setDisplayShape(true)
    if (assetRef.current === "population"){
      setExpo(true)
    }
    else{
      setExpo(false)
    }
  }
  else{
    setDisplayShape(false)
    setExpo(false)
  }
  if (e.target.value !== "Tuvalu"){
    //setDisplay2(true)
    siteRefBool.current = false;
   
  }
  else{
    //setDisplay2(false)
    siteRefBool.current = true;
    
  }

  seteconomicbool(false)
  if (shorelineLayer.current != null){
  mapContainer.current.removeLayer(shorelineLayer.current);
  }
  if (layer2.current != null){
    mapContainer.current.removeLayer(layer2.current);
    }
  shorelineLayer.current = addShorelineImagenoPaneGen(mapContainer.current, siteRef.current)
  layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current)
  mayFlyer(mapContainer.current, siteRef.current);

  if (e.target.value !== "Tuvalu"){
    risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
 
  }
  else{
    mapContainer.current.eachLayer(function (layer) {
      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === "risk"){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
  }
  
 
}

const [gender, setGender] = useState("SSP2");



const [horizon, setHorizon] = useState("present");



const [asset, setAsset] = useState("population");

const [type, setType] = useState("exposed");
function onChangeValueAsset(e) {
 // if (siteRef.current !== "Tuvalu"){
    if (e.target.value === "population"){
      setExpo(true)
      typeRef.current= 'exposed';
      setType("exposed")
    }
    else{
      setExpo(false)
    }
 
  setAsset(e.target.value);
  assetRef.current = e.target.value
mapContainer.current.removeLayer(layer2.current);
layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current)
//mayFlyer(mapContainer.current, siteRef.current);

 e.currentTarget.blur();
}


function onChangeValueType(e) {
  console.log(e.target.value)
  if (e.target.value === "annual"){
    setabool(true)
  }
  else{
    setabool(false)
  }
/*
  if (e.target.value === "annualeconomic"){
    seteconomicbool(true)
  }
  else{
    seteconomicbool(false)
  }*/
  setType(e.target.value);
    presentBoolRef.current = false;
    typeRef.current = e.target.value;
mapContainer.current.removeLayer(layer2.current);
layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current)
//mayFlyer(mapContainer.current, siteRef.current);
 e.currentTarget.blur();
}


//Buildings Shapefile *************************
const handleYearShape=(e)=>{
  yearRef.current = e.target.value;
  mapContainer.current.eachLayer(function (layer) {
    if (layer.defaultOptions != null){
      if (layer.defaultOptions.id === "risk"){
        mapContainer.current.removeLayer(layer);
      }
    }
 });
  risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
  
 
}


function onChangeValueHorizonShape(e) {
  setHorizon(e.target.value);
  horizonRef.current = e.target.value

  if (e.target.value !== "present"){
    presentBoolRef.current = false;
    mapContainer.current.eachLayer(function (layer) {
      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === "risk"){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
    risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
    
   

}
else{
  presentBoolRef.current = true;
  mapContainer.current.eachLayer(function (layer) {
    if (layer.defaultOptions != null){
      if (layer.defaultOptions.id === "risk"){
        mapContainer.current.removeLayer(layer);
      }
    }
 });
  risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')
  
 

}
 e.currentTarget.blur();
}
function onChangeValueShape(e) {
  setGender(e.target.value);
  climateRef.current = e.target.value
    presentBoolRef.current = false;
//mapContainer.current.removeLayer(layer2.current);
//layer2.current =  getMarker(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current)
mapContainer.current.eachLayer(function (layer) {
  if (layer.defaultOptions != null){
    if (layer.defaultOptions.id === "risk"){
      mapContainer.current.removeLayer(layer);
    }
  }
});
risklayer.current = addRisk(mapContainer.current, siteRef.current, yearRef.current,climateRef.current, presentBoolRef.current, horizonRef.current, 'risk')



 e.currentTarget.blur();
}


  return (
    <div className="container-fluid">
    <div className="row" style={{height:"93.5vh"}}>
    <div className="col-sm-2"  style={{backgroundColor:"#efefef",padding:0}}>
    <div className="card">
    <div className="card-body" style={{fontSize:"13px"}}>
   
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Sites:</p>
      </div>
      <div className="col-sm-6">
      <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleSite} style={{fontSize:'13px', paddingLeft:1}}>
      <option value="Tuvalu">Tuvalu</option>
  <option value="Nanumaga">Nanumaga</option>
  <option value="Nanumea">Nanumea</option>
  <option value="Funafuti">Funafuti</option>
  <option value="Niulakita">Niulakita</option>
  <option value="Niutao">Niutao</option>
  <option value="Nui">Nui</option>
  <option value="Nukufetau">Nukufetau</option>
  <option value="Nukulaelae">Nukulaelae</option>
  <option value="Vaitupu">Vaitupu</option>
</select>
      </div>
      </div>
      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Asset:</p>
      </div>
      <div className="col-sm-6">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="population" id="population"
                name="asset" onChange={onChangeValueAsset} checked={asset === "population"} disabled={abool || economicbool} />
             <label>Population</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="building" id="building"
               name="asset" onChange={onChangeValueAsset} checked={asset === "building"} disabled={abool || economicbool} />
             <label>Buildings</label>
             </div>
      </div>
      </div>
      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Impact Type:</p>
      </div>
      <div className="col-sm-6">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="exposed" id="exposed"
                name="type" onChange={onChangeValueType} checked={type === "exposed"} />
             <label>% Exposed</label>
             </div>
             <>
              <div className="form-check">
                  <input type="radio" className="form-check-input" value="numexposed" id="numexposed"
                name="type" onChange={onChangeValueType} checked={type === "numexposed"} disabled={ expo}/>
             <label># Exposed</label>
             </div>
            
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="economicdamage" id="economicdamage"
               name="type" onChange={onChangeValueType} checked={type === "economicdamage"} disabled={ expo}/>
             <label>Economic Damage</label>
             </div>

              <div className="form-check">
              <input type="radio" className="form-check-input" value="damanged" id="damanged"
              name="type" onChange={onChangeValueType} checked={type === "damanged"} disabled={ expo}/>
              <label>% Damanged</label>
              </div>
              </>
             
             
             
      </div>
      </div>
     

     

 

    
     

    
    
    </div>
  </div>
  


      {displayShape ?
      <>
        <div className="row" style={{marginTop:'10px', marginBottom:'-15px'}}>
        <div className="col-sm-12" style={{marginLeft:'15px'}}>
          <p style={{fontSize:'13px'}}>Building Shapefile:</p>
          </div>
          </div>
  <div className="card"  style={{marginTop:"0px"}}>
    <div className="card-body" style={{fontSize:"13px"}}>
  
      <div className="row"style={{marginTop:'0px'}}>
<div className="col-sm-6">

<p>Return Period:</p>
  </div>

  <div className="col-sm-6">
  <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleYearShape} id="Year2" name="Year2" style={{fontSize:'13px', paddingLeft:1}}>
<option value="5">5 Year</option>
<option value="10">10 Year</option>
<option value="25">25 Year</option>
<option value="50">50 Year</option>
<option value="100">100 Year</option>
<option value="250">250 Year</option>
</select>

</div>

  </div>
  <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Climate Period:</p>
      </div>
      <div className="col-sm-6">

      <div className="form-check">
                  <input type="radio" className="form-check-input" value="present" id="present"
               name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "present"} disabled={ economicbool}/>
             <label>Present Climate </label>
             </div>
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="2060" id="2060"
                name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "2060"} disabled={ economicbool}/>
             <label>2060</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="2100" id="2100"
                name="horizonShape" onChange={onChangeValueHorizonShape} checked={horizon === "2100"} disabled={ economicbool}/>
             <label>2100</label>
             </div>
      </div>
      </div>
      <hr style={{marginTop:0}}/>
      <div className="row" style={{marginTop:'-10px'}}>
    <div className="col-sm-6">

    <p>Climate Change Scenario:</p>
      </div>
      <div className="col-sm-6">
      <div className="form-check">
                  <input type="radio" className="form-check-input" value="SSP2" id="SSP2"
                name="climateShape" onChange={onChangeValueShape} checked={gender === "SSP2"} disabled={presentBoolRef.current || economicbool }/>
             <label>SSP2 4.5</label>
             </div>
             <div className="form-check">
                  <input type="radio" className="form-check-input" value="SSP5" id="SSP5"
               name="climateShape" onChange={onChangeValueShape} checked={gender === "SSP5"} disabled={presentBoolRef.current || economicbool}/>
             <label>SSP5 8.5</label>
             </div>
      </div>
      </div>
      </div>
      </div>
      </>
 : null}
      </div>
      <div className="col-sm-10" style={{padding:0}}>
      <div id="map" ref={mapContainer} style={{width:"100%", height:"100%",Zindex: "auto"}}></div>
      </div>
    </div>
  </div>

  )
}
export default Contact;
