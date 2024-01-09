import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import "./L.TileLayer.BetterWMS";
import "leaflet-side-by-side";
import './legend.css';
import { saveAs } from "file-saver";
import './checkbox.css';
import {mayFlyer, addShoreline, addTransact,getLegend,addShorelineImage, getArea,getChartOptionsShoreline, addTVMarker} from "./helper";
import {
  Button,Modal
} from "react-bootstrap";
//import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter';
import { useGlobalState,setGlobalState } from './globalstate';
import {toast} from 'react-toastify';
import config from '../components/data/config.json'
/*
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';*/
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Title
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


const Services = () => {
/*
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );*/

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Title,
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
  const [options, setOptions] = useState(getChartOptionsShoreline);
  const chartOptions = (title, minv, maxv) => {
    setOptions({
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Area of change "+title,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Years'
          }
        },
        y: {
          min: minv-0.06,
          max: maxv+0.06,
          ticks: {
            beginAtZero: false,
          },
          title: {
          display: true,
          text: 'sq Kilometers',
        }
      }
      }
    })
  };

const [data, setData] = useState( {
  labels: ['2010', '2011', '2012', '2013', '2014', '2015', '2016'],
  datasets: [
    {
      fill: false,
      label: 'Area of change',
      data: [1,22,3,40,50,6,74],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
});

const nameer = useGlobalState("island_name");
  
  //VARIABLES
  const [display, setDisplay] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const checkedRef = useRef(false);
  const [input, setInput] = useState(true);
  const displayRef = useRef(false);
  const displayRef2 = useRef(false);
  const layer = useRef(null);
  const layer2 = useRef(null);
  const layer3 = useRef(null);
  const staelliteLayer = useRef(null);
  const staelliteLayer2 = useRef(null);
  const sidebyside = useRef();
  const baseLayer = useRef();
  const legendRef = useRef();
  const legendColorRef = useRef();
  const _isMounted = useRef(true);
  const legend = useRef([]);
  const mapContainer = React.useRef(null);
  const url = "https://tds-test.pacificdata.org/thredds/wms/Oceans/TCAP/";
//  const baselayerurl = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  const siteRef = useRef(nameer[0]);
  const imageRef = useRef("2021");
  const [years, setYears] = useState([]);
  const shorelineyears = useRef([]);
  const [yearsCheck, setYearsCheck] = useState([]);
  const yearRef = useRef(2019);
  const baseurl = config['cgi-address'];

  //MOdel

  const everything = async () =>{
    const response = await fetch('https://opm.gem.spc.int/cgi-bin/get_shoreline_years.py');
    const data = await response.json();
    console.log(data)
    return data
}

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => {
    setShow2(false)
  console.log(show2)
  };

const [isCheckAll, setIsCheckAll] = useState(false);

const onClickShow2= async(siteName) => {

  //Dummy test start
  const url = baseurl+"cgi-bin/area/areaofchange.py?island="+siteName;
  

var SSP852060 = [];
var SSP852100 = [];
var minVal = 100;
var maxVal = 0;
await fetch(url).then((data)=> {
    const res = data.json();
    return res
}).then((res) => {
  
  for (let i = 0; i < res.length; ++i){
    var Scenario = res[i]['Date'];
    var sourcedat = res[i]['Value']
    SSP852100.push(Scenario)
    SSP852060.push(sourcedat)
    if (parseFloat(minVal) > parseFloat(sourcedat)){
      minVal = parseFloat(sourcedat)
    }
    if (parseFloat(maxVal) < parseFloat(sourcedat)){
      maxVal = parseFloat(sourcedat)
    }
  }

chartOptions(siteName, Math.round(minVal * 10) / 10, Math.round(maxVal * 10) / 10)
  setData( {
    labels: SSP852100,
    datasets: [
      {
        type: 'line',
        fill: false,
        label: 'Area of change - Line',
        data: SSP852060,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        type: 'bar',
        label: 'Area of change - Bar',
        backgroundColor: 'rgb(75, 192, 192)',
        data: SSP852060,
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  });

}).catch(e => {
       console.log("error", e)
   })

  //dummy ends
  setShow2(true) 
};
function constuctMap(){

  baseLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; Pacific Community (OSM)',
    detectRetina: true
});



mapContainer.current = L.map('map', {
  zoom: 7,
  center: [-7.87321, 178.320346]
});

mapContainer.current.createPane('left');
mapContainer.current.createPane('right');
baseLayer.current.addTo(mapContainer.current); 
return mapContainer.current;
}
  function initMap(url){
    
  if (nameer[0] === "Tuvalu"){

    displayRef2.current = false;
    toast.info('Click on marker to zoom.', {position: toast.POSITION.BOTTOM_CENTER, autoClose:6000})
    layer3.current = addTVMarker(mapContainer.current, "Nanumaga").on('click', function(e) {onClickShow3('Nanumaga')}).bindTooltip("Nanumaga", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nanumea").on('click', function(e) {onClickShow3('Nanumea')}).bindTooltip("Nanumea", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Funafuti").on('click', function(e) {onClickShow3('Funafuti')}).bindTooltip("Funafuti", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nui").on('click', function(e) {onClickShow3('Nui')}).bindTooltip("Nui", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nukufetau").on('click', function(e) {onClickShow3('Nukufetau')}).bindTooltip("Nukufetau", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Niutao").on('click', function(e) {onClickShow3('Niutao')}).bindTooltip("Niutao", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Nukulaelae").on('click', function(e) {onClickShow3('Nukulaelae')}).bindTooltip("Nukulaelae", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Vaitupu").on('click', function(e) {onClickShow3('Vaitupu')}).bindTooltip("Vaitupu", {permanent:true,opacity:0.65});
    layer3.current = addTVMarker(mapContainer.current, "Niulakita").on('click', function(e) {onClickShow3('Niulakita')}).bindTooltip("Niulakita", {permanent:true,opacity:0.65});
    }
    else{
      displayRef2.current = true;
      toast.success('Click on marker to view Area of Change Plot.', {position: toast.POSITION.BOTTOM_CENTER, autoClose:8000,style:{width: "130%"}})
     
  setYears(shorelineyears.current)

  setYearsCheck(shorelineyears.current)
    
  staelliteLayer.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left','2019')

  layer2.current = getArea(mapContainer.current, siteRef.current).on('click', function(e) {onClickShow2(siteRef.current)});
      mayFlyer(mapContainer.current, siteRef.current);
    } 


  mayFlyer(mapContainer.current, siteRef.current);
  //LEGENDD
  
  legendColorRef.current = L.control({ position: "bottomright", id:12 });
  legendColorRef.current.onAdd = function() {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML += "<h4>Legend (m/year)</h4>";
          div.innerHTML += '<i class="arrow-up"></i><span>>0.1</span><br>';
         // div.innerHTML += '<i style="background:  #2874a6"></i><span>>0.1</span><br>';
          div.innerHTML += '<i style="background: #a9cce3"></i><span>0.0 - 0.1</span><br>';
          div.innerHTML += '<i style="background: #fadbd8"></i><span>-0.1 - 0.0</span><br>';
          div.innerHTML += '<i style="background:  #f1948a"></i><span>-0.2 - -0.1</span><br>';
          div.innerHTML += '<i style="background: #e74c3c"></i><span>-0.3 - -0.2</span><br>';
         // div.innerHTML += '<i style="background: #c0392b"></i><span><-0.3</span><br>';
          div.innerHTML += '<i class="arrow-down"></i><span><-0.3</span><br>';
          div.innerHTML += '<i style="background: black"></i><span>Missing</span><br>';
          
         return div;
        };
        legendColorRef.current.addTo(mapContainer.current);

  //Legend Note
  legendColorRef.current = L.control({ position: "bottomleft", id:22 });
  legendColorRef.current.onAdd = function() {
          var div = L.DomUtil.create("div", "legend");
          div.innerHTML += "<h4>Note</h4>";
          div.innerHTML += '<i style="background:  #2874a6"></i><span>Denotes accretion</span><br>';
          div.innerHTML += '<i style="background: #c0392b"></i><span>Denotes erosion</span><br>';
          
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
    
  //Popup
  mapContainer.current.on('popupopen', function (e) {
  if(displayRef.current){
    mapContainer.current.closePopup();
  }


  
  });
L.simpleMapScreenshoter().addTo(mapContainer.current);
L.control.scale().addTo(mapContainer.current);
  }
useEffect(() => { 
if (_isMounted.current){
  async function loadDataAsync() {
    try {
      constuctMap();
     // console.log('anuj')
    await everything().then((res)=>{
     console.log(res)
     var temp = [];
     temp.push(res)
     shorelineyears.current = temp;
    })

      initMap(url);
    } catch (e) {
      console.warn(e);
    }
  }
  loadDataAsync();    
}
return () => { _isMounted.current = false }; 
},[input, isCheckAll]);


const [userinfo, setUserInfo] = useState({
  languages: [],
  response: [],
});

const handleChange = (e) => {
  // Destructuring
  const { value, checked } = e.target;
  const { languages } = userinfo;
  
  console.log(`${value} is ${checked}`);
  console.log(value);
  if (checked){

    legend.current.push(value)
    layer.current = addShoreline(mapContainer.current, siteRef.current, value, 'left')
    if (legendRef.current == null){
      legendRef.current = getLegend(legend);
      legendRef.current.addTo(mapContainer.current);
    
  }
  else{

    mapContainer.current.removeControl(legendRef.current);
    legendRef.current = getLegend(legend);
    legendRef.current.addTo(mapContainer.current);
  }
  }
  else{

var index = legend['current'].indexOf(value);
if (index >= 0) {
  legend['current'].splice( index, 1 );
}

//console.log(legend['current'])
    mapContainer.current.removeControl(legendRef.current);

    legendRef.current = getLegend(legend);
    legendRef.current.addTo(mapContainer.current);

    
    mapContainer.current.eachLayer(function (layer) {

      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === value){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
  }
  //Adding Transact
   if(legend['current'].length >= 2 ){

    mapContainer.current.eachLayer(function (layer) {
      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === "transact"){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
    layer.current = addTransact(mapContainer.current, siteRef.current, "transact", 'left', legend['current'],layer)
   }
   else{
    mapContainer.current.eachLayer(function (layer) {

      if (layer.defaultOptions != null){
        if (layer.defaultOptions.id === "transact"){
          mapContainer.current.removeLayer(layer);
        }
      }
   });
   }
  // Case 1 : The user checks the box
  if (checked) {
    setUserInfo({
      languages: [...languages, value],
      response: [...languages, value],
    });
  }

  // Case 2  : The user unchecks the box
  else {
    setUserInfo({
      languages: languages.filter((e) => e !== value),
      response: languages.filter((e) => e !== value),
    });
  }
  e.currentTarget.blur()
};

const onClickShow3= async(siteName) => {
  siteRef.current = siteName;
  displayRef2.current = true;
  
  toast.success('Click on marker to view Area of Change Plot.', {position: toast.POSITION.BOTTOM_CENTER, autoClose:8000,style:{width: "130%"}})
  if(layer.current !== null){
      mapContainer.current.removeLayer(layer.current);
  }
  if(layer2.current !== null){
      mapContainer.current.removeLayer(layer2.current);
  }
  if(staelliteLayer.current !== null){
      mapContainer.current.removeLayer(staelliteLayer.current);
  }
     
      if(checked === true){
        mapContainer.current.removeControl(sidebyside.current);
        mapContainer.current.removeLayer(layer2.current);
       }
  
    mayFlyer(mapContainer.current, siteName);


   mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.id;
    console.log(layername)
    if(layername === 777){
      mapContainer.current.removeLayer(layer);
    }
  });
  staelliteLayer.current = addShorelineImage(mapContainer.current, siteName, "image", 'left','2019')
//  console.log(shorelineyears.current)
  //console.log(sitesShoreline())
  setYears(shorelineyears.current)

  setYearsCheck(shorelineyears.current)
  //setYearsCheck(sitesShoreline2())
  layer2.current = getArea(mapContainer.current, siteName).on('click', function(e) {onClickShow2(siteName)});
   
   setGlobalState("island_name", siteName);
};


const handleSite=(e)=>{
  if (e.target.value === "Tuvalu"){
    displayRef2.current = false;
    toast.info('Click on marker to zoom.', {position: toast.POSITION.BOTTOM_CENTER, autoClose:6000})
    if(layer.current !== null){
        mapContainer.current.removeLayer(layer.current);
    }
    if(layer2.current !== null){
        mapContainer.current.removeLayer(layer2.current);
    }
    if(staelliteLayer.current !== null){
        mapContainer.current.removeLayer(staelliteLayer.current);
    }
        layer3.current = addTVMarker(mapContainer.current, "Nanumaga").on('click', function(e) {onClickShow3('Nanumaga')}).bindTooltip("Nanumaga", {permanent:true,opacity:0.65});
        layer3.current = addTVMarker(mapContainer.current, "Nanumea").on('click', function(e) {onClickShow3('Nanumea')}).bindTooltip("Nanumea", {permanent:true,opacity:0.65});
        layer3.current = addTVMarker(mapContainer.current, "Funafuti").on('click', function(e) {onClickShow3('Funafuti')}).bindTooltip("Funafuti", {permanent:true,opacity:0.65});
        layer3.current = addTVMarker(mapContainer.current, "Nui").on('click', function(e) {onClickShow3('Nui')}).bindTooltip("Nui", {permanent:true,opacity:0.65});
        layer3.current = addTVMarker(mapContainer.current, "Nukufetau").on('click', function(e) {onClickShow3('Nukufetau')}).bindTooltip("Nukufetau", {permanent:true,opacity:0.65});
        layer3.current = addTVMarker(mapContainer.current, "Niutao").on('click', function(e) {onClickShow3('Niutao')}).bindTooltip("Niutao", {permanent:true,opacity:0.65});
        layer3.current = addTVMarker(mapContainer.current, "Nukulaelae").on('click', function(e) {onClickShow3('Nukulaelae')}).bindTooltip("Nukulaelae", {permanent:true,opacity:0.65});
        layer3.current = addTVMarker(mapContainer.current, "Vaitupu").on('click', function(e) {onClickShow3('Vaitupu')}).bindTooltip("Vaitupu", {permanent:true,opacity:0.65});
        layer3.current = addTVMarker(mapContainer.current, "Niulakita").on('click', function(e) {onClickShow3('Niulakita')}).bindTooltip("Niulakita", {permanent:true,opacity:0.65});
    
        if(checked === true){
          mapContainer.current.removeControl(sidebyside.current);
          mapContainer.current.removeLayer(layer2.current);
         }
          setYears([])
          setYearsCheck([])
      mayFlyer(mapContainer.current, 'Tuvalu');
      }
  else{
    displayRef2.current = true;
    toast.success('Click marker to view Area of Change Plot.', {position: toast.POSITION.BOTTOM_CENTER, autoClose:8000, style:{width: "130%"}})
    mapContainer.current.eachLayer(function (layer) {
      const layername = layer.options.id;
      console.log(layername)
      if(layername === 777){
        mapContainer.current.removeLayer(layer);
      }
    });
  setYears(shorelineyears.current)
  setYearsCheck(shorelineyears.current)
  setIsCheckAll(false);
  setInput(!input);
  yearRef.current = 2019;
  siteRef.current = e.target.value;
  if (legendRef.current != null){
  mapContainer.current.removeControl(legendRef.current);
  legendRef.current = null;
  legend.current = [];
  }
  mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.pane;
    //console.log(layername);
    if(layername === "left"){
      mapContainer.current.removeLayer(layer);
    }
 });
 mapContainer.current.eachLayer(function (layer) {
  const layername = layer.options.id;
  console.log(layername)
  if(layername === 999){
    mapContainer.current.removeLayer(layer);
  }
});

 //mapContainer.current.removeLayer(layer2.current);
if(e.target.value === 'Funafuti'){
  layer2.current = getArea(mapContainer.current, 'Fongafale').on('click', function(e) {onClickShow2('Fongafale')});
  layer2.current = getArea(mapContainer.current, siteRef.current).on('click', function(e) {onClickShow2(siteRef.current)});
}
else{
 layer2.current = getArea(mapContainer.current, siteRef.current).on('click', function(e) {onClickShow2(siteRef.current)});
}
// layer.current = addShoreline(mapContainer.current, siteRef.current, "2018", 'left')
  mayFlyer(mapContainer.current, siteRef.current);
  staelliteLayer.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left','2019')
  }

  setGlobalState("island_name", e.target.value);
}


const handleImage=(e)=>{
  setInput(!input);
  if (checkedRef.current){
    mapContainer.current.removeControl(sidebyside.current);
    mapContainer.current.removeLayer(staelliteLayer.current);
    staelliteLayer.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left',e.target.value)
 sidebyside.current = L.control.sideBySide(staelliteLayer.current, staelliteLayer2.current).addTo(mapContainer.current);
  }
  else{
    yearRef.current = e.target.value
    console.log(e.target.value)
  imageRef.current = e.target.value;
  if (legendRef.current != null){
  mapContainer.current.removeControl(legendRef.current);
  legendRef.current = null;
  legend.current = [];
  }
  mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.pane;
    if(layername === "left"){
      mapContainer.current.removeLayer(layer);
    }
 });

 //Add Layer
 staelliteLayer.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left',e.target.value)
}
}

const handleImage2=(e)=>{
  setInput(!input);
  imageRef.current = e.target.value;
  if (legendRef.current != null){
  mapContainer.current.removeControl(legendRef.current);
  legendRef.current = null;
  legend.current = [];
  }
  mapContainer.current.removeControl(sidebyside.current);
 /* mapContainer.current.eachLayer(function (layer) {
    const layername = layer.options.pane;
    if(layername === "left"){
      mapContainer.current.removeLayer(layer);
    }
 });*/
 mapContainer.current.removeLayer(staelliteLayer2.current);
 staelliteLayer2.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left',e.target.value)
 sidebyside.current = L.control.sideBySide(staelliteLayer.current, staelliteLayer2.current).addTo(mapContainer.current);
 //Add Layer

}

const handleClick = (e) => {
  //Show layer
  setDisplay(!display)
  setChecked(!checked)
  setInput(!input);
  checkedRef.current = !checkedRef.current;
  if (checkedRef.current){
    //mapContainer.current.removeLayer(staelliteLayer.current);
    mapContainer.current.eachLayer(function (layer) {
      console.log(layer)
      if (layer.defaultOptions != null){
        var lay = layer.defaultOptions.id;
        var bol = lay.length;
        console.log(bol)
        if (bol === 4 || bol >= 4){
          mapContainer.current.removeLayer(layer);
        }
        console.log(layer.defaultOptions.id)
       /// if (layer.defaultOptions.id === value){
      //    mapContainer.current.removeLayer(layer);
       // }
      }
   });
   staelliteLayer2.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left','2021')
   sidebyside.current = L.control.sideBySide(staelliteLayer.current, staelliteLayer2.current).addTo(mapContainer.current);
  }
  else{
    mapContainer.current.removeControl(sidebyside.current);
    mapContainer.current.removeLayer(staelliteLayer2.current);
   // mapContainer.current.removeLayer(staelliteLayer.current);
    //staelliteLayer.current = addShorelineImage(mapContainer.current, siteRef.current, "image", 'left','2019')
  }

  mapContainer.current.closePopup();
  e.currentTarget.blur();
}

//selecting all
//const [isCheck, setIsCheck] = useState([]);
//const [list, setList] = useState([]);

const handleSelectAll = (e) => {
  setInput(!input);
  setIsCheckAll(!isCheckAll);
  console.log('anuj')
  console.log(isCheckAll)
  //setIsCheck(list.map(li => li.id));
  if (isCheckAll === false){
    if (legendRef.current != null){
    legend.current = [];
    mapContainer.current.removeControl(legendRef.current);

    mapContainer.current.eachLayer(function (layer) {
      if(isNaN(layer.options.id) === false){
       // console.log(layer)
        mapContainer.current.removeLayer(layer);
      }
      if(layer.options.id === "transact"){
        mapContainer.current.removeLayer(layer);
      }
   });

  }
  var dummy = years;
  var b = dummy[0];
  //console.log(b['Nanumaga'])
  var arrayLength = b[siteRef.current].length;
 
  var stringlegened="";
  for (var k = 0; k < arrayLength; k++) {
    stringlegened +=b[siteRef.current][k].id+",";
  }
  var stringlegened2 = stringlegened.substring(0, stringlegened.length-1);
  console.log(stringlegened2)
for (var i = 0; i < arrayLength; i++) {
  legend.current.push(b[siteRef.current][i].id)
  //b['Nanumaga'][i].checked = true;
  layer.current = addShoreline(mapContainer.current, siteRef.current, b[siteRef.current][i].id, 'left');
}

layer.current = addTransact(mapContainer.current, siteRef.current, "transact", 'left', stringlegened2)

legendRef.current = getLegend(legend);
legendRef.current.addTo(mapContainer.current);
setYears(dummy)
  }
  else{
    legend.current = [];
    mapContainer.current.removeControl(legendRef.current);

    mapContainer.current.eachLayer(function (layer) {
    //  var lay = layer.options.id;
      //const myArray = lay.split("_");
      //console.log(myArray)
   //   const layername = layer.options.id;
      if(isNaN(layer.options.id) === false){
       // console.log(layer)
        mapContainer.current.removeLayer(layer);
      }
      if(layer.options.id === "transact"){
        mapContainer.current.removeLayer(layer);
      }
   });
  }
  //console.log(!isCheckAll)
  //console.log(isCheckAll);
};

const handleSubmit=(e)=>{
  /*  saveAs(
      getURL(mapContainer.current, siteRef.current, url_risk,assetRef.current,typeRef.current,siteRef.current,yearRef.current,climateRef.current,presentBoolRef.current,horizonRef.current,display3,country),
      "risk.png"
    );
  */
  const canvasSave = document.getElementById('stack');
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
    <div className="row">
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
     
      {displayRef2.current ?
<>


<hr style={{marginTop:0}}/>
    <div className="row">
    <div className="col-sm-4">

    <p>Year:</p>
      </div>

      <div className="col-sm-8" >
        
      <div style={{paddingLeft:'5px'}} key={10}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="selectAll"
                      value="selectAll" 
                      id="selectAll"
                       key={input}
                      onChange={handleSelectAll}
                      defaultChecked={isCheckAll}
                      disabled={checkedRef.current}
                      
                    />
                    <label
                      className="form-check-label"
                      style={{paddingLeft:"3px", fontSize:"10px"}}
                    >
                        Select All
                    </label>
                  </div>
                  
              <div className="flex">
              
                {years.map((v, i) => (
                v[siteRef.current].map((x,y)=>(
                  <div className="item" key={y}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="languages"
                      value={x.id}
                      id={x.id}
                      onChange={handleChange}
                      key={input}
                      defaultChecked={x.checked || isCheckAll}
                      disabled={checkedRef.current}
                      
                    />
                    <label
                      className="form-check-label"
                      htmlFor={x.id}
                      style={{paddingLeft:"3px"}}
                    >
                        {x.id}
                    </label>
                  </div>
                ))

                  ))}
              </div>
  
</div>

      </div>



      <hr style={{marginTop:0}}/>

      <div className="row">
    <div className="col-sm-6">

    <p>Satellite Image:</p>
      </div>
      <div className="col-sm-6">
      <select defaultValue={yearRef.current} key={yearRef.current} className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleImage} style={{fontSize:'13px', paddingLeft:1}}>
      
  <option value="2019">2019 - Lidar</option>
      {yearsCheck.map((v, i) => (
                v[siteRef.current].map((x,y)=>(
                    <option value={x.id} key={y}>{x.id}</option>
                ))

                ))
                  }
  {/*
  <option value="2021">2021</option>
  <option value="2020">2020</option>
  <option value="2018">2018</option>*/}
</select>
      </div>
      </div>
      </>
: null}
      </div>
      </div>
      {displayRef2.current ?
<>

      <div className="form-check" style={{marginLeft:"20px", fontSize:"13px"}}>
  <input className="form-check-input" type="checkbox" id="fj_ezz" name="fj_ezz" value="fj_ezz" onChange={handleClick} defaultChecked={checked} />
  <label className="form-check-label">Activate Compare Layer</label>
</div>      
 </>
: null}

{display ?
 <div className="card">
 <div className="card-body" style={{fontSize:"13px"}}>
 <div className="row">
    <div className="col-sm-6">

    <p>Satellite Image:</p>
      </div>
      <div className="col-sm-6">
      <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleImage2} style={{fontSize:'13px', paddingLeft:1}}>
  <option value="2021">2021</option>
  {years.map((v, i) => (
                v[siteRef.current].map((x,y)=>(
                    <option value={x.id} key={y}>{x.id}</option>
                ))

                ))
                  }
</select>
      </div>
      </div>
 

 
 </div>
</div>



: null}
      </div>
      <div className="col-sm-10" style={{padding:0}}>
      <div id="map" ref={mapContainer} style={{width:"100%", height:"100%",Zindex: "auto"}}></div>
      </div>
    </div>
    <Modal show={show2} onHide={handleClose2} size="lg">
        <Modal.Body>
        <Bar  id="stack" options={options} data={data} />
        </Modal.Body>
        <Modal.Footer>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Export</button>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>

  </div>
  

  )
}


export default Services;
