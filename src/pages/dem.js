import React, { useEffect, useRef,useState } from 'react';
import L from 'leaflet';
import "leaflet-side-by-side";
import "./L.TileLayer.BetterWMS";
import { saveAs } from "file-saver";
import "./testmap.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line} from 'react-chartjs-2';
import "./radio.css";
import './reload';
import {mayFlyer, addLidar,addTVMarker,addHoverMarker} from "./helper";
//import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter';
import { setGlobalState, useGlobalState } from './globalstate';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../components/data/config.json'
//import { map } from 'leaflet';

toast.configure()

L.Draw.Polyline.prototype.addVertex = function (latlng) {
  var markersLength = this._markers.length;
  // markersLength must be greater than or equal to 2 before intersections can occur

  if (markersLength >= 2 && !this.options.allowIntersection && this._poly.newLatLngIntersects(latlng)) {
      this._showErrorTooltip();
      return;
  }
  else if (this._errorShown) {
      this._hideErrorTooltip();
  }

  this._markers.push(this._createMarker(latlng));

  this._poly.addLatLng(latlng);

  if (this._poly.getLatLngs().length === 2) {
      this._map.addLayer(this._poly);
  }

  this._vertexChanged(latlng, true);
  markersLength = this._markers.length;
  if (markersLength === 2) {
      this._fireCreatedEvent();
      this.disable();
  }
};

const Dem = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    {
      id: 'no_data_label',
      beforeDraw: function (chart, easing) {
        var ctx = chart.ctx;
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
  }
  );

  //VARIABLES
  const crossURL = useRef(null);
  const displayRef = useRef(false);
  const layer = useRef(null);
  const shorelineLayer = useRef(null);
  const baseLayer = useRef();
  const dummy = useRef();

  const legendColorRef = useRef();
  const layer3 = useRef(null);
  const layer4 = useRef(null);
  const _isMounted = useRef(true);
  const m_drawn_features = useRef();
  const mapContainer = React.useRef(null);
  const [bbox,setbbox] = useState('');

 const nameer = useGlobalState("island_name");
 const baseurl = config['thredds-address']
 const url = baseurl+"final/"
 // const url = "http://192.168.4.54:8080/thredds/wms/testAll/final/"
  const siteRef = useRef(nameer[0]);
  const siteRef2 = useRef(nameer[0]);
  const [cross, setCross] = useState([]);
  //const [data, setData] = useState({labels:[],datasets:[]});
  const [data, setData] = useState({
    labels :[],
  datasets: [
    {
      label: 'Elevation',
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      fill:'start',
      data: [],
      
    }
  ],
});


const options = {
  plugins: {
    tooltip: {
      callbacks: {
          label: function(context) {
              var label = context.dataset.label || '';
              var unit = ' m';
              if (context.parsed.y !== null) {
                  label += ' ' +context.parsed.y.toFixed(3) + unit;
              }
              return label;
          }
      }
  },
    title: {
      display: true,
      text: 'Cross Section Elevation Plot '+bbox
  }
},
scales: {
  x: {
    title: {
      display: true,
      text: 'Distance'
    }
  },
  y: {
    title: {
    display: true,
    text: 'Meters'
  }
}
},
elements: {
  point:{
      radius: 0
  }
},
  responsive: true,
  maintainAspectRatio: false,
  hover:{
    //mode: 'index',

    mode: 'nearest',
    intersect: false,
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
    onHover: function (event, active, chart) {
      
      if (active.length) {
        let first = active[0];
        let setIndex = first.datasetIndex;
        let index = first.index;
        let data = chart.data.datasets[setIndex].data[index];
        if (data !== dummy.current){
          fetchCrossSectionHover(crossURL.current,index);
        }
      dummy.current = chart.data.datasets[setIndex].data[index];
        
    }
    }/*
    onClick: function(c,i){
      var e = i[0];
      if (data.labels.length !== 0){
        
      fetchCrossSectionHover(crossURL.current,e.index);
      }
     },
     onHover: (event, chartElement) => {
      event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
  }*/
};
const fetchCrossSectionHover= async(url,index)=> {
 mapContainer.current.eachLayer(function (layer) {
  const layername = layer.options.id;
  if(layername === 629){
    mapContainer.current.removeLayer(layer);
  }
});
//add layer
  layer4.current = addHoverMarker(mapContainer.current, [cross.lattitude[index], cross.longitude[index]])

   
}

const fetchCrossSection= async(x1,y1,x2,y2)=> {
  
  const url = "https://opmmiddleware.gem.spc.int/cgi-bin/crossSection/crossSection.py?island="+siteRef.current+"&x1="+x1+"&x2="+x2+"&y1="+y1+"&y2="+y2;
  crossURL.current = url;
 setbbox("["+x1.toFixed(2)+","+y1.toFixed(2)+","+x2.toFixed(2)+","+y2.toFixed(2)+"]")
  var distance = [];
  var elev = [];
  var ind = [];
  var lat = [];
  var lon = [];
await fetch(url).then((data)=> {
    const res = data.json();
    return res
}).then((res) => {

  for (let i = 0; i < res.length; ++i){

    distance.push(res[i]['h_distance'].toFixed(1))
    elev.push(res[i]['Elevation'].toFixed(3))
    ind.push(i)
    lat.push(res[i]['Latitude'])
    lon.push(res[i]['Longitude'])
  }

  setCross({
    idx: ind,
    lattitude:lat,
    longitude: lon
  })
  
   setData({
    labels:distance,
    datasets:[{
      label:'Elevation',
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      fill:'start',
      data:elev
    
    }]
})

}).catch(e => {
       console.log("error", e)
   })
}
  
  function initMap(url){
 /*
    const BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L'
   
    baseLayer.current = L.tileLayer.bing(BING_KEY, {
      maxZoom: 5,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

*/
    baseLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; Pacific Community (OSM)',
      detectRetina: true
  });


  
  
  mapContainer.current = L.map('map', {
    zoom: 7,
    center: [-7.87321, 178.320346]
  });
  baseLayer.current.addTo(mapContainer.current); 
 

  m_drawn_features.current = new L.FeatureGroup();
     mapContainer.current.addLayer(m_drawn_features.current);

     let draw_control = new L.Control.Draw({
      position: 'topleft',
      draw: {
          polyline: {
            shapeOptions: {
              clickable: false,
              color: "red",
            }
          },
          polygon: false,
          circle: false,
          rectangle: false,
          circlemarker: false,
          marker: false,
      },
      edit: {
        featureGroup: m_drawn_features.current, //REQUIRED!!
        remove: true,
        edit: false,
    }
  });
  
  legendColorRef.current = L.control({ position: "topright", id:12 });
  legendColorRef.current.onAdd = function() {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML += "<h4>Legend</h4>";
          div.innerHTML += '<img src='+require('./DEM_legend.png')+' alt="Legend" style='+{width:"50px", height:'10px'}+'>';
         return div;
        };
        legendColorRef.current.addTo(mapContainer.current);

    
        //Legend Note
  legendColorRef.current = L.control({ position: "bottomleft", id:22 });
  legendColorRef.current.onAdd = function() {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML += "<img src="+require('./north.png')+" alt='Legend' width='50px' height='50px'>";
          div.style.backgroundColor = "transparent";
          //
         // div.style.width = '50px';
          
         return div;
        };
        legendColorRef.current.addTo(mapContainer.current);

  mapContainer.current.addControl(draw_control);
  
  layer4.current = null;
  mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.id;
    if(layername === 629){
      mapContainer.current.removeLayer(layer);
    }
  });
  mapContainer.current.on(L.Draw.Event.CREATED, function(e) {
    // Remove all layers (only show one location at a time)
    m_drawn_features.current.clearLayers();

    // Add layer with the new features
    let new_features_layer = e.layer;
    m_drawn_features.current.addLayer(new_features_layer);
    var x1 = e.layer._latlngs[0]['lng'];
    var y1 =  e.layer._latlngs[0]['lat'];
    var x2 = e.layer._latlngs[1]['lng'];
    var y2 = e.layer._latlngs[1]['lat'];

    mapContainer.current.eachLayer(function (layer) {
      const layername = layer.options.id;
      if(layername === 629){
        mapContainer.current.removeLayer(layer);
      }
    });
    fetchCrossSection(x1,y1,x2,y2);
});

  //Popup
  mapContainer.current.on('popupopen', function (e) {
  if(displayRef.current){
    mapContainer.current.closePopup();
  }
  
  });
/*
  mapContainer.current.on('zoomend',function(e){
   console.log(e.sourceTarget)
  });
*/
L.simpleMapScreenshoter().addTo(mapContainer.current);

//adding scale bar
L.control.scale().addTo(mapContainer.current);


if (nameer[0] === "Tuvalu"){


toast.info('Click on marker to zoom.', {position: toast.POSITION.BOTTOM_CENTER, autoClose:6000})
layer3.current = addTVMarker(mapContainer.current, "Nanumaga").on('click', function(e) {onClickShow2('Nanumaga')}).bindTooltip("Nanumaga", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Nanumea").on('click', function(e) {onClickShow2('Nanumea')}).bindTooltip("Nanumea", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Funafuti").on('click', function(e) {onClickShow2('Funafuti')}).bindTooltip("Funafuti", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Nui").on('click', function(e) {onClickShow2('Nui')}).bindTooltip("Nui", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Nukufetau").on('click', function(e) {onClickShow2('Nukufetau')}).bindTooltip("Nukufetau", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Niutao").on('click', function(e) {onClickShow2('Niutao')}).bindTooltip("Niutao", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Nukulaelae").on('click', function(e) {onClickShow2('Nukulaelae')}).bindTooltip("Nukulaelae", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Vaitupu").on('click', function(e) {onClickShow2('Vaitupu')}).bindTooltip("Vaitupu", {permanent:true,opacity:0.65});
layer3.current = addTVMarker(mapContainer.current, "Niulakita").on('click', function(e) {onClickShow2('Niulakita')}).bindTooltip("Niulakita", {permanent:true,opacity:0.65});

}
else{
  shorelineLayer.current = addLidar(mapContainer.current, siteRef.current)

   mayFlyer(mapContainer.current, siteRef.current);
}





}
useEffect(() => {  
  
if (_isMounted.current){
  initMap(url);
  
}  
return () => { _isMounted.current = false }; 
},[]);



const onClickShow2= async(siteName) => {
  siteRef.current = siteName;
  siteRef2.current = siteName;
setbbox('')
m_drawn_features.current.clearLayers();
 // mapContainer.current.removeLayer(layer.current);
 // mapContainer.current.removeLayer(shorelineLayer.current);

 //shorelineLayer.current = addHillshade(mapContainer.current, siteRef.current)
  shorelineLayer.current = addLidar(mapContainer.current, siteRef.current)
 // console.log(siteRef.current)
 
  mayFlyer(mapContainer.current, siteRef.current);

   mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.id;
    if(layername === 777){
      mapContainer.current.removeLayer(layer);
    }
  });
   
   setGlobalState("island_name", siteName);
};

const handleSite=(e)=>{
  setData({
    labels :[],
  datasets: [
    {
      label: 'Elevation',
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      fill:'start',
      data: [],
      
    }
  ],
});
setbbox('')

m_drawn_features.current.clearLayers();

  if (layer4.current != null){
    mapContainer.current.removeLayer(layer4.current)
  }
  if (e.target.value === "Tuvalu"){
    
  if (m_drawn_features.current != null){
  //  mapContainer.current.removeLayer(m_drawn_features.current);
    }
toast.info('Click on marker to zoom.', {position: toast.POSITION.BOTTOM_CENTER, autoClose:6000})
   
    mapContainer.current.removeLayer(shorelineLayer.current);
    layer3.current = addTVMarker(mapContainer.current, "Nanumaga").on('click', function(e) {onClickShow2('Nanumaga')}).bindTooltip("Nanumaga", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nanumea").on('click', function(e) {onClickShow2('Nanumea')}).bindTooltip("Nanumea", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Funafuti").on('click', function(e) {onClickShow2('Funafuti')}).bindTooltip("Funafuti", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nui").on('click', function(e) {onClickShow2('Nui')}).bindTooltip("Nui", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nukufetau").on('click', function(e) {onClickShow2('Nukufetau')}).bindTooltip("Nukufetau", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Niutao").on('click', function(e) {onClickShow2('Niutao')}).bindTooltip("Niutao", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nukulaelae").on('click', function(e) {onClickShow2('Nukulaelae')}).bindTooltip("Nukulaelae", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Vaitupu").on('click', function(e) {onClickShow2('Vaitupu')}).bindTooltip("Vaitupu", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Niulakita").on('click', function(e) {onClickShow2('Niulakita')}).bindTooltip("Niulakita", {permanent:true,opacity:0.65});


  mayFlyer(mapContainer.current, 'Tuvalu');
  }
  else{

  siteRef.current = e.target.value;
  siteRef2.current = e.target.value;
  if(layer.current !== null){
    mapContainer.current.removeLayer(layer.current);
  }
  if(shorelineLayer.current !== null){
    mapContainer.current.removeLayer(shorelineLayer.current);
  }
  mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.id;
    if(layername === 777){
      mapContainer.current.removeLayer(layer);
    }
  });
  shorelineLayer.current = addLidar(mapContainer.current, siteRef.current)

  mayFlyer(mapContainer.current, e.target.value);
  }

   setGlobalState("island_name", e.target.value);
}

const handleSubmit=(e)=>{
  /*  saveAs(
      getURL(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country),
      "risk.png"
    );
  */
  const canvasSave = document.getElementById('stack22');
  canvasSave.toBlob(function (blob) {
      saveAs(blob, "Export.png")
  })
  
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
      <select className="form-select form-select-sm" value={nameer[0]} aria-label=".form-select-sm example" onChange={handleSite} style={{fontSize:'13px', paddingLeft:1}}>
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
    </div>
  </div>

      </div>
      <div className="col-sm-10" style={{padding:0}}>
      <div id="map" ref={mapContainer} className="map2"></div>
      <div className="container">

<pre><code className="javascript" id="code"></code></pre>
<div className="row"style={{marginTop:'0px', height:'225px'}}>
{

<Line id="stack22" options={options} data={data}/>
}
</div>
<div className="row"style={{marginTop:'5px', textAlign:'center',height:'5px',marginBottom:'25px'}}>
<div className="col-sm-8">
<p style={{fontSize:"12px"}}><i>**Hover on the chart to view the location.</i></p>
</div>
<div className="col-sm-2">
</div>
<div className="col-sm-2">
<button type="button" className="btn btn-primary" onClick={handleSubmit}>Export PNG</button>
</div>
</div>
</div>
      </div>
    </div>
  </div>

  )
}
export default Dem;
