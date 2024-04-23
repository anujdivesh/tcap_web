import L from 'leaflet';
import config from '../components/data/config.json'
//const geoserverAddress = "http://services.gsd.spc.int:8089/";
const geoserverAddress = config['geoserver-address'];

const geoserverAddressLocal = 'https://opm.gem.spc.int/';

//const cgiAddress = "http://services.gsd.spc.int:8080/";

const cgiAddress = config["cgi-address"];

//const cgiAddress = "http://192.168.4.92/";

export function mayFlyer(map, site) {
//fly
map.eachLayer(function (lyr) {
    if (site === "Nanumanga"){
    map.flyTo([-6.287321, 176.320346], 15);
    }
    if (site === "Nanumaga"){
      map.flyTo([-6.287321, 176.320346], 15);
      }
    if (site === "Nanumea"){
    map.flyTo([-5.669055, 176.110211], 14);
    }
    if (site === "Niulakita"){
      map.flyTo([-10.788,179.476], 16);
      }
      if (site === "Funafuti"){
        map.flyTo([-8.541147, 179.196198], 12);
        }
        if (site === "Niutao"){
          map.flyTo([-6.10717, 177.34215], 15);
          }
          if (site === "Nui"){
            map.flyTo([-7.22247, 177.15205], 14);
            }
            if (site === "Nukufetau"){
              map.flyTo([-8.016946, 178.37589], 13);
              }
            if (site === "Nukulaelae"){
              map.flyTo([-9.38412, 179.84559], 14);
              }
              if (site === "Vaitupu"){
                map.flyTo([-7.4742, 178.67456], 14);
                }
                if (site === "Tuvalu"){
                  map.flyTo([-7.87321, 178.320346], 7);
                  }
});
}

export function addLayer(mapContainer, url, siteRef, yearRef,horizonRef,climateRef,presentBoolRef,pointerRef){
  var vv ="4p5";
  var senario="";
  if (climateRef === "SSP5"){
    vv = "8p5"
  }
  if(presentBoolRef){
    senario = "Present"
  }
  else{
  senario = climateRef+"-"+vv+"_"+horizonRef;
  }
  var mhws="";
  if (yearRef === "MHWS"){
    mhws = "MHWS_out"
  }
  else{
    mhws ="out"+yearRef+"-yearARI";
  }
   var newurl = url+""+senario+"/"+siteRef+"_"+mhws+".nc";
    var layer = L.tileLayer.betterWms(newurl, {
        layers: "Depth",
        format: 'image/png',
        transparent: true,
        opacity: pointerRef,
        styles: 'default-scalar/div-Spectral-inv',
        colorscalerange: '0, 2',
        abovemaxcolor: "extend",
        belowmincolor: "transparent",
        numcolorbands: 250,
        time: '2022-06-14T00:00:00.000Z',
    }).addTo(mapContainer);
    return layer;
}

export function getURL(map, site, url,assetRef,typeRef,siteRef,yearRef,climateRef,presentBoolRef,horizonRef,display3,country) {
  var urri="";
  if ((siteRef === "Tuvalu" && country === "tuvalu") && display3 === false){
  var vv ="4p5";
  var senario="";
  if (climateRef === "SSP5"){
    vv = "8p5"
  }
  if(presentBoolRef){
    senario = "Present"
  }
  else{
  senario = climateRef+"-"+vv+"_"+horizonRef;
  }
  var pp = "";
  if (assetRef === "population"){
    pp = "_percentage"
  }

  urri = url+"/"+assetRef+"_"+typeRef+"/"+siteRef+"_Islands_"+assetRef+"_"+typeRef+pp+"_"+senario+"_"+yearRef+".png";
  if (typeRef === "annualeconomic"){
    urri = url+"/Tuvalu_islands_annual_expected_economic_damage.png";
  }
}
else{
  if (assetRef === "population"){

    urri = url+"/PerIsland/"+assetRef+"/"+siteRef+"_"+typeRef+"_percentage_"+assetRef+".png";
  }
  else{
    var fold ="";
    var naming = "";
    if (typeRef === "exposed"){
      fold = "Percentage_Exposed";
      naming = "exposed_percentage_building";
    }
    else if (typeRef === "numexposed"){
      fold = "Number_Exposed";
      naming = "exposed_number_building";
    }
    else if (typeRef === "damanged"){
      fold = "Percentage_Damaged";
      naming = "damaged_percentage_building";
    }
    else{
      fold = "Expected_Economic_Damage";
      naming = "expected_economic_damage_building";
    }
    urri = url+"/PerIsland/"+assetRef+"/"+fold+"/"+siteRef+"_"+naming+".png";
  }
}

return urri;

}

export function getArea(map, site) {
  
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  var latlng;
      if (site === "Nanumanga"){
        latlng = [-6.287321, 176.320346];
      }
      if (site === "Nanumaga"){
        latlng = [-6.287321, 176.320346];
        }
      if (site === "Nanumea"){
        latlng = [-5.669055, 176.110211];
      }
      if (site === "Niulakita"){
        latlng = [-10.788939, 179.472849];
        }
        if (site === "Funafuti"){
          latlng = [-8.518118, 179.118515];
          }

          if (site === "Fongafale"){
            latlng = [-8.521147, 179.196198];
            }
          if (site === "Niutao"){
            latlng = [-6.10717, 177.34215];
            }
            if (site === "Nui"){
              latlng = [-7.23247, 177.15205];
              }
              if (site === "Nukufetau"){
                latlng = [-8.017857, 178.362114];
                }
              if (site === "Nukulaelae"){
                latlng = [-9.38412, 179.84559];
                }
                if (site === "Vaitupu"){
                  latlng = [-7.4742, 178.67456];
                  }
                  if (site === "Tuvalu"){
                    latlng = [-8, 178.3053];
                    }
        var layer = L.marker(latlng,{icon:redIcon,id:999}).addTo(map);//.openPopup();
  return layer;


}

export function addHoverMarker(map, latlng) {
  
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var layer = L.marker(latlng,{icon:redIcon,id:629}).addTo(map);//.openPopup();
  return layer;

  }

export function addTVMarker(map, site) {
  
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  var latlng;
      if (site === "Nanumanga"){
        latlng = [-6.287321, 176.320346];
      }
      if (site === "Nanumaga"){
        latlng = [-6.287321, 176.320346];
        }
      if (site === "Nanumea"){
        latlng = [-5.669055, 176.110211];
      }
      if (site === "Niulakita"){
        latlng = [-10.788939, 179.472849];
        }
        if (site === "Funafuti"){
          latlng = [-8.518118, 179.118515];
          }

          if (site === "Fongafale"){
            latlng = [-8.521147, 179.196198];
            }
          if (site === "Niutao"){
            latlng = [-6.10717, 177.34215];
            }
            if (site === "Nui"){
              latlng = [-7.23247, 177.15205];
              }
              if (site === "Nukufetau"){
                latlng = [-8.017857, 178.362114];
                }
              if (site === "Nukulaelae"){
                latlng = [-9.38412, 179.84559];
                }
                if (site === "Vaitupu"){
                  latlng = [-7.4742, 178.67456];
                  }
                  if (site === "Tuvalu"){
                    latlng = [-8, 178.3053];
                    }
        var layer = L.marker(latlng,{icon:redIcon,id:777}).addTo(map);//.openPopup();
  return layer;

  }

export function getMarker(map, site, url,assetRef,typeRef,siteRef,yearRef,climateRef,presentBoolRef,horizonRef,display3,country) {
  var urri="";
  if ((siteRef === "Tuvalu" && country === "tuvalu") && display3 === false){
  var vv ="4p5";
  var senario="";
  if (climateRef === "SSP5"){
    vv = "8p5"
  }
  if(presentBoolRef){
    senario = "Present"
  }
  else{
  senario = climateRef+"-"+vv+"_"+horizonRef;
  }
  var pp = "";
  if (assetRef === "population"){
    pp = "_percentage"
  }

  urri = url+"/"+assetRef+"_"+typeRef+"/"+siteRef+"_Islands_"+assetRef+"_"+typeRef+pp+"_"+senario+"_"+yearRef+".png";
  if (typeRef === "annualeconomic"){
    urri = url+"/Tuvalu_islands_annual_expected_economic_damage.png";
  }
}
else{
  if (assetRef === "population"){

    urri = url+"/PerIsland/"+assetRef+"/"+siteRef+"_"+typeRef+"_percentage_"+assetRef+".png";
  }
  else{
    var fold ="";
    var naming = "";
    if (typeRef === "exposed"){
      fold = "Percentage_Exposed";
      naming = "exposed_percentage_building";
    }
    else if (typeRef === "numexposed"){
      fold = "Number_Exposed";
      naming = "exposed_number_building";
    }
    else if (typeRef === "damanged"){
      fold = "Percentage_Damaged";
      naming = "damaged_percentage_building";
    }
    else{
      fold = "Expected_Economic_Damage";
      naming = "expected_economic_damage_building";
    }
    urri = url+"/PerIsland/"+assetRef+"/"+fold+"/"+siteRef+"_"+naming+".png";
  }
}

console.log(urri)
//console.log('xxxx')
  //console.log(urri)
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  var latlng;
      if (site === "Nanumanga"){
        latlng = [-6.287321, 176.320346];
      }
      if (site === "Nanumaga"){
        latlng = [-6.287321, 176.320346];
        }
      if (site === "Nanumea"){
        latlng = [-5.669055, 176.110211];
      }
      if (site === "Niulakita"){
        latlng = [-10.788,179.476];
        }
        if (site === "Funafuti"){
          latlng = [-8.521147, 179.196198];
          }
          if (site === "Niutao"){
            latlng = [-6.10717, 177.34215];
            }
            if (site === "Nui"){
              latlng = [-7.23247, 177.15205];
              }
              if (site === "Nukufetau"){
                latlng = [-8.045946, 178.37589];
                }
              if (site === "Nukulaelae"){
                latlng = [-9.38412, 179.84559];
                }
                if (site === "Vaitupu"){
                  latlng = [-7.4742, 178.67456];
                  }
                  if (site === "Tuvalu"){
                    latlng = [-8, 178.3053];
                    }
                    var htmltag ="<img style='width: 700px; height: 400px;text-align: center;line-height: 500px;' alt='Loading...' src="+urri+">"
        var layer = L.marker(latlng,{icon:redIcon,id:1}).addTo(map).bindPopup(htmltag,{
      maxWidth: "auto"
  });//.openPopup();
  return layer;
  }
export async function addShoreline(mapContainer, siteRef, yearRef,pane){
  const geojsonStyle = {
      fillColor: getColor(yearRef),
      color: getColor(yearRef),
      weight: 3.5,
      opacity: 1,
      fillOpacity: 0,
    };
    var filter = getFilterPrefix(siteRef,yearRef);
   // console.log(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:TV_"+siteRef+"_SL&outputFormat=application/json&srsName=epsg:4326&cql_filter="+filter)
   // const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:"+siteRef+"_1971_2021_Lines&outputFormat=application/json&srsName=epsg:4326&cql_filter=id="+yearRef);
    const resp = await fetch(geoserverAddressLocal+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:TV_"+siteRef+"_SL&outputFormat=application/json&srsName=epsg:4326&cql_filter="+filter);
    const customData = await resp.json();
  //const customData = require('../shorelineDatasets/'+siteRef+'_shoreline_'+yearRef+'.json');
var layer = L.geoJson(customData, {
  pane: pane,
  id : yearRef,
  onEachFeature: function (f, l) {
  l.bindPopup("Name: " + f.properties);
   l.bindPopup("<div>"+yearRef+"</div>");
  },

  style: geojsonStyle,
}).addTo(mapContainer);
  return layer;
}

export async function addShorelineTransect(mapContainer, siteRef, yearRef,pane){
    const geojsonStyle = {
        fillColor: getColor(yearRef),
        color: getColor(yearRef),
        weight: 3.5,
        opacity: 1,
        fillOpacity: 0,
      };
     // const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:"+siteRef+"_1971_2021_Lines&outputFormat=application/json&srsName=epsg:4326&cql_filter=id="+yearRef);
      const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:TV_"+siteRef+"_T&outputFormat=application/json&srsName=epsg:4326");
      const customData = await resp.json();
    //const customData = require('../shorelineDatasets/'+siteRef+'_shoreline_'+yearRef+'.json');
  var layer = L.geoJson(customData, {
    pane: pane,
    id : yearRef,
    onEachFeature: function (f, l) {
    l.bindPopup("Name: " + f.properties);
     l.bindPopup("<div>"+yearRef+"</div>");
    },

    style: geojsonStyle,
  }).addTo(mapContainer);
    return layer;
}

export function sitesShoreline2(){
  const Nanumangaarr = [
    {"Nanumea":
    [
      {id:"2021", checked:false},
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"2003", checked:false},
      {id:"1982", checked:false},
      {id:"1971", checked:false}      
    ], 
    "Nanumaga":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2008", checked:false},
      {id:"2006", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}     
    ], 
    "Funafuti":
    [
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}     
    ], 
    "Niulakita":
    [
      {id:"2021", checked:false},
      {id:"2016", checked:false},
      {id:"2019", checked:false},
      {id:"2005", checked:false} 
    ], 
    "Niutao":
    [
      {id:"2021", checked:false},
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nui":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2011", checked:false},
      {id:"2007", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nukufetau":
    [
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nukulaelae":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2008", checked:false},
      {id:"2006", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Vaitupu":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"1971", checked:false}   
    ]}
  ];
  return Nanumangaarr;
}


export function sitesShoreline(){
  const Nanumangaarr = [
    {"Nanumea":
    [
      {id:"2021", checked:false},
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"2003", checked:false},
      {id:"1982", checked:false},
      {id:"1971", checked:false}      
    ], 
    "Nanumaga":
    [
      {id:"2021", checked:false},
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2008", checked:false},
      {id:"2006", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}     
    ], 
    "Funafuti":
    [
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}     
    ], 
    "Niulakita":
    [
      {id:"2021", checked:false},
      {id:"2016", checked:false},
      {id:"2019", checked:false},
      {id:"2005", checked:false} 
    ], 
    "Niutao":
    [
      {id:"2021", checked:false},
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nui":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2011", checked:false},
      {id:"2007", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nukufetau":
    [
      {id:"2020", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2004", checked:false},
      {id:"2003", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Nukulaelae":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2016", checked:false},
      {id:"2014", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2008", checked:false},
      {id:"2006", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ], 
    "Vaitupu":
    [
      {id:"2021", checked:false},
      {id:"2019", checked:false},
      {id:"2018", checked:false},
      {id:"2017", checked:false},
      {id:"2016", checked:false},
      {id:"2015", checked:false},
      {id:"2014", checked:false},
      {id:"2013", checked:false},
      {id:"2012", checked:false},
      {id:"2011", checked:false},
      {id:"2010", checked:false},
      {id:"2009", checked:false},
      {id:"2007", checked:false},
      {id:"2005", checked:false},
      {id:"1984", checked:false},
      {id:"1971", checked:false}   
    ]}
  ];
  return Nanumangaarr;
}


export async function addRisk(mapContainer, siteRef, yearRef,climateRef,presentBoolRef, horizonRef, name){

  var vv ="4p5";
  var senario="";
  if (climateRef === "SSP5"){
    vv = "8p5"
  }
  if(presentBoolRef){
    senario = "Present"
  }
  else{
  senario = climateRef+"-"+vv+"_"+horizonRef;
  }
   var newurl = siteRef+"_"+senario+"_out"+yearRef+'-year';
   console.log(newurl)

   const resp = await fetch(geoserverAddress+"geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:"+siteRef+"_risk&outputFormat=application/json&srsName=epsg:4326&cql_filter=id='"+newurl+"'");
    const customData = await resp.json();
   // console.log(customData)
var layer = L.geoJson(customData, {
  id : name,
  onEachFeature: function (f, l) {
    var color;
    if(parseFloat(f.properties.consequenc) >=parseFloat(1)){
      color = 'Exposed'
    }
    else{
      color = 'Not-Exposed'
    }

    //console.log(f.properties)
  l.bindPopup(color);
   //l.bindPopup("<div>"+yearRef+"</div>");
  },
  style: function (feature) {
    var color;
      if(parseFloat(feature.properties.consequenc) >=parseFloat(1)){
        color = "#BB3F3F"
      }
      else{
        color = "#484848"
      }
  
    return {
      fillColor: color,
      color: color,
      weight: 4,
      opacity: 0.9,
      fillOpacity: 0.5,
      };
}



}).addTo(mapContainer);
  return layer;
}


export async function addTransact(mapContainer, siteRef, yearRef,pane, legend){
  /*
  var result = legend.map(function (x) { 
    return parseInt(x, 10); 
  });
  result.sort();*/
  var urll = cgiAddress+"cgi-bin/shoreline/"+siteRef+"/get_transect_prod.py?y="+legend.toString();
  console.log(urll)
  const resp = await fetch(urll);
  const data = await resp.json();

  const resp2 = await fetch(geoserverAddressLocal+'geoserver/spc/wfs?service=wfs&version=2.0.0&request=GetFeature&typeNames=spc:TV_'+siteRef+'_T&outputFormat=application/json&srsName=epsg:4326');
  const customData = await resp2.json();
  var layer = L.geoJson(customData, {
    pane: pane,
    id : yearRef,
    onEachFeature: function (f, l) {
      var htmltag;
      for (let i = 0; i < data.length; ++i){
        var station = data[i]['id'];
        var high_low = data[i]['Value'];
        var counter = data[i]['len'];
        if (counter === undefined) {
          counter = legend.length
        }
        
        if (f.properties.Transect === parseInt(station)){
          if (parseInt(counter) === 0){
            htmltag ="<div style='width: 60px; height: 15px;text-align: center;line-height: 10px;'>No Data.</div>"
          }
          else if (parseInt(counter) === 1){
            htmltag ="<div style='width: 60px; height: 25px;text-align: center;line-height: 10px;'>Cannot compare one layer.</div>"
          }
          else if (parseInt(counter) === 2){
            var erosion = "Erosion";
            if(parseFloat(high_low) >=parseFloat(0)){
              erosion = "Accretion"
            }
            htmltag ="<div style='width: 80px; height: 15px;text-align: center;line-height: 10px;'>"+erosion+":" + high_low+"m</div>"
          }
          else{
            htmltag ="<img style='width: 700px; height: 500px;text-align: center;line-height: 500px;' alt='Loading...' src='"+cgiAddress+"cgi-bin/shoreline/"+siteRef+"/shoreline.py?t="+f.properties.Transect+"&y="+legend.toString()+"'>"
          }
          break
        }
        else{
          continue
        }
       }
       l.bindPopup(htmltag,{ maxWidth: "auto"});
/*
      if (legend.length <=2){
        var text = "";
     for (let i = 0; i < data.length; ++i){
      var station = data[i]['id'];
      var high_low = data[i]['Value'];
      if (f.properties.Transect === parseInt(station)){
        if (high_low <= -900){
          high_low = "No Data."
        }
        text = high_low;
        break
      }
      else{
        continue
      }
     }
        
      l.bindPopup("<div>EPR: " + text+"</div>");
      }
      else{
        l.bindPopup("<img style='width: 700px; height: 500px;text-align: center;line-height: 500px;' alt='Loading...' src='http://services.gsd.spc.int:8080/cgi-enabled/shoreline.py?t="+f.properties.Id+"&y="+legend.toString()+"'>",{
      maxWidth: "auto"
      });
    }
    */
    },

    style: function (feature) {
      var color;
      for (let i = 0; i < data.length; ++i){
        var station = data[i]['id'];
      var high_low = data[i]['Value'];
        if (feature.properties.Transect === parseInt(station)){
            if(parseFloat(high_low) >=parseFloat(0.1)){
              color = "#2874a6"
            }
            else if(parseFloat(high_low) >=0 && parseFloat(high_low) <0.1){
              color = "#2874a6"
            }
            else if(parseFloat(high_low) >=parseFloat(-0.1) && parseFloat(high_low) <parseFloat(0)){
              color = "#fadbd8"
            }
            else if(parseFloat(high_low) >=parseFloat(-0.2) && parseFloat(high_low) <parseFloat(-0.1)){
              color = "#f1948a"
            }
            else if(parseFloat(high_low) >=parseFloat(-0.3) && parseFloat(high_low) <-parseFloat(-0.2)){
              color = "#e74c3c"
            }
            else if(parseFloat(high_low) <= parseFloat(-0.3)){
              color = "#c0392b"
            }
            if(parseFloat(high_low) <= parseFloat(-900)){
              color = "black";
            }
         }
      }
      return {
        fillColor: color,
        color: color,
        weight: 4,
        opacity: 0.9,
        fillOpacity: 0,
        };
  },
  }).addTo(mapContainer);
    return layer;
}

export function getLegend(legend){
  var layer = L.control({ position: "topright", id:12 });
  layer.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Legend</h4>";
    for (var i =0; i<legend.current.length; i++){
      div.innerHTML += '<i style="background: '+getColor(legend.current[i])+'"></i><span>'+legend.current[i]+'</span><br>';
    }
    
   return div;
  };
  return layer;
}

export function getColor(yearRef){
  var colorhex;
  if (yearRef === "1971"){
    colorhex = "#ff7373"
  }
  else if (yearRef === "1982"){
    colorhex = "#ffc0cb"
  }
  else if (yearRef === "1984"){
    colorhex = "#40ff00"
  }
  else if (yearRef === "2003"){
    colorhex = "#e1dfd9"
  }
  else if (yearRef === "2004"){
    colorhex = "#00ffff"
  }
  else if (yearRef === "2005"){
    colorhex = "#9de26b"
  }
  else if (yearRef === "2006"){
    colorhex = "#ff00ff"
  }
  else if (yearRef === "2007"){
    colorhex = "#08E8DE"
  }
  else if (yearRef === "2008"){
    colorhex = "#ff0040"
  }
  else if (yearRef === "2009"){
    colorhex = "#FFF000"
  }
  else if (yearRef === "2010"){
    colorhex = "#FFAA1D"
  }
  else if (yearRef === "2011"){
    colorhex = "#FF007F"
  }
  else if (yearRef === "2012"){
    colorhex = "#512bca"
  }
  else if (yearRef === "2013"){
    colorhex = "#007500"
  }
  else if (yearRef === "2014"){
    colorhex = "#ff00ff"
  }
  else if (yearRef === "2015"){
    colorhex = "#bf4040"
  }
  else if (yearRef === "2015"){
    colorhex = "#ff5733 "
  }
  else if (yearRef === "2016"){
    colorhex = "#48c9b0 "
  }
  else if (yearRef === "2017"){
    colorhex = "#af7ac5 "
  }
  else if (yearRef === "2018"){
    colorhex = "#ec7063"
  }
  else if (yearRef === "2019"){
    colorhex = "#f4d03f"
  }
  else if (yearRef === "2020"){
    colorhex = "#45b39d"
  }
  else if (yearRef === "2021"){
    colorhex = "#FFC0CB"
  }
  
  return colorhex;
}


export function addShorelineImage(mapContainer, siteRef, yearRef,pane,year){
  var url = geoserverAddress+'geoserver/spc/wms';
  var layer = L.tileLayer.wms(url, {
    pane: pane,
    layers: 'spc:TV_'+siteRef+'_'+year+"_orthorectified",
    transparent: true,
    format: 'image/png'
  }).addTo(mapContainer);

  return layer;
}

export function addShorelineImagenoPane(mapContainer, siteRef, yearRef){

  var url = geoserverAddress+'geoserver/spc/wms';
    
  var layer = L.tileLayer.wms(url, {
    layers: 'spc:TuvNnmg_RGB_2019_1m_Clipped',
    transparent: true,
    format: 'image/png'
  }).addTo(mapContainer);

  return layer;
}

export function addShorelineImagenoPaneGen(mapContainer, siteRef){

  var url = geoserverAddress+'geoserver/spc/wms';
  var layer = L.tileLayer.wms(url, {
    layers: 'spc:TV_'+siteRef+'_2019_orthorectified',
    transparent: true,
    format: 'image/png'
  }).addTo(mapContainer);

  return layer;
}
export function addLidar(mapContainer, siteRef){

  var url = 'https://opmgeoserver.gem.spc.int/geoserver/spc/wms';
  var layer = L.tileLayer.wms(url, {
    //layers: 'spc:Niutao_MB_Lidar.tif,spc:hs',
    layers: 'TV_'+siteRef+'_MB_Lidar,TV_Hillshade_'+siteRef+'_MB_Lidar',
    //opacity:0.7,
    transparent: true,
    format: 'image/png'
  }).addTo(mapContainer);

  return layer;
}
export function addHillshade(mapContainer, siteRef){

  var url = 'https://opmgeoserver.gem.spc.int/geoserver/spc/wms';
  var layer = L.tileLayer.wms(url, {
    layers: 'spc:TV_Hillshade_Niutao_MB_Lidar.tif',
    transparent: true,
    format: 'image/png'
  }).addTo(mapContainer);

  return layer;
}
/*
export function addLidar(mapContainer, siteRef){

  var url = geoserverAddress+'geoserver/spc/wms';
  var layer = L.tileLayer.wms(url, {
    layers: 'spc:'+siteRef+'_MB_Lidar',
    transparent: true,
    format: 'image/png'
  }).addTo(mapContainer);

  return layer;
}
*/
export function getFilterPrefix(site,yearRef){
  var prefix;
  if (site === "Nanumanga"){
    prefix = "id="+yearRef;
    }
  else if (site === "Nanumaga"){
      prefix = "id="+yearRef;
      }
  else{
    prefix = "layer="+yearRef;
  }
   
    return prefix;

}

export async function fetchdatetime(){
  
  const resp = await fetch('https://opm.gem.spc.int/sample.json');
  const data = await resp.json();
    return data['timerange'];
}


export const getdata = async () =>{
  const response = await fetch('https://opm.gem.spc.int/eciks/result.geojson');
  const timerange = await response.json();
  return timerange
}

//CHARTS
export async function getChartData(presentArr, SSP452060Arr, SSP452100Arr, SSP852060Arr, SSP852100Arr){

  var data= {

    labels:["Total Income","Expenses","Current Balance"],
    datasets:[
      {
        label:'Present',
        backgroundColor: 'rgb(53, 162, 235)',
        stack: 'Stack 1',
        data:presentArr
      
      },
      {
      label:'SSP2-4.5(2060)',
      backgroundColor: 'rgb(255, 99, 132)',
      stack: 'Stack 0',
        data:SSP452060Arr
  
    },
    {
      label:'SSP2-4.5(2100)',
      backgroundColor: 'rgb(75, 192, 192)',
      stack: 'Stack 0',
      data:SSP452100Arr
  
  },
  {
    label:'SSP5-8.5(2060)',
    backgroundColor: 'rgb(153, 102, 255)',
    stack: 'Stack 2',
      data:SSP852060Arr
  
  },
  {
    label:'SSP5-8.5(2100)',
    backgroundColor: 'rgb(255, 159, 64)',
    stack: 'Stack 2',
    data:SSP852100Arr
  
  }
  ]
  }
  return data;
}

export async function getChartDataOnInit(){

  const data= [{

    labels:["Total Incomex","Expenses","Current Balance"],
    datasets:[
      {
        label:'Present',
        backgroundColor: 'rgb(53, 162, 235)',
        stack: 'Stack 1',
        data:[8,5,4]
      
      },
      {
      label:'SSP2-4.5(2060)',
      backgroundColor: 'rgb(255, 99, 132)',
      stack: 'Stack 0',
        data:[8,5,4]
  
    },
    {
      label:'SSP2-4.5(2100)',
      backgroundColor: 'rgb(75, 192, 192)',
      stack: 'Stack 0',
      data:[20,50,30]
  
  },
  {
    label:'SSP2-4.5(2060)',
    backgroundColor: 'rgb(153, 102, 255)',
    stack: 'Stack 2',
      data:[8,5,4]
  
  },
  {
    label:'SSP2-4.5(2100)',
    backgroundColor: 'rgb(255, 159, 64)',
    stack: 'Stack 2',
    data:[100,100,100]
  
  }
  ]
  }];
  return data;
}




export const getChartOptions ={
  plugins: {
    title: {
      display: true,
      text: 'Loading...'
  }
},
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  }


}

  export const chart1 = () => {
    return {
      
  labels:["Total Incomex","Expenses","Current Balance"],
  datasets:[
    {
      label:'Present',
      backgroundColor: 'rgb(53, 162, 235)',
      stack: 'Stack 1',
      data:[8,5,4]
    
    },
    {
    label:'SSP2-4.5(2060)',
    backgroundColor: 'rgb(255, 99, 132)',
    stack: 'Stack 0',
      data:[8,5,4]

  },
  {
    label:'SSP2-4.5(2100)',
    backgroundColor: 'rgb(75, 192, 192)',
    stack: 'Stack 0',
    data:[20,50,30]

},
{
  label:'SSP2-4.5(2060)',
  backgroundColor: 'rgb(153, 102, 255)',
  stack: 'Stack 2',
    data:[8,5,4]

},
{
  label:'SSP2-4.5(2100)',
  backgroundColor: 'rgb(255, 159, 64)',
  stack: 'Stack 2',
  data:[100,100,100]

}
]
    };
  };
export const data2 = {

};

export const getAPI = async () =>{
  const response = await fetch('https://opm.gem.spc.int/cgi-bin/Risk/test.py');
  const data = await response.json();
  return data;
}

export function getChartJson(res){
 
  var presentArr = [];
  var SSP452060 = [];
  var SSP452100 = [];
  var SSP852060 = [];
  var SSP852100 = [];

  getAPI().then((res)=>{
    var horizon = ['Present', 'SSP2-4.5(2060)', 'SSP2-4.5(2100)', 'SSP5-8.5(2060)', 'SSP5-8.5(2100)'];
    var return_periods = [5,10,25,50,100,250];

    for (let i = 0; i < res.length; ++i){
      var ARI = res[i]['ARI'];
      var Scenario = res[i]['Scenario'];
      var Percentage_Exposed_Population = res[i]['Percentage_Exposed_Population'];

   // presentArr.push(i)
      
      for (let j = 0; j < return_periods.length; ++j){
        if (ARI === return_periods[j]){

       //   presentArr.push(Percentage_Exposed_Population)
        }
        if (ARI === return_periods[j] && Scenario.replace(/\s/g, "") === horizon[1]){

          SSP452060.push(Percentage_Exposed_Population)
        }
        if (ARI === return_periods[j] && Scenario.replace(/\s/g, "") === horizon[2]){

          SSP452100.push(Percentage_Exposed_Population)
        }
        if (ARI === return_periods[j] && Scenario.replace(/\s/g, "") === horizon[3]){

          SSP852060.push(Percentage_Exposed_Population)
        }
        if (ARI === return_periods[j] && Scenario.replace(/\s/g, "") === horizon[4]){

          SSP852100.push(Percentage_Exposed_Population)
        }
      }
  
    }
  
  });


  return presentArr;

}

export function getYaxis(site, asset, type){
  const arr=[]
  if (asset === "building"){
    if (type ==="exposed"){
      arr.push(site+' Percentage of '+asset+' Exposed')
      arr.push('Percentage of exposed '+asset+' (%)')
      arr.push('Annual recurrence interval (years)')
    }
    else if (type ==="numexposed"){
      arr.push(site+' number of '+asset+' exposed')
      arr.push('Number of exposed '+asset+' (#)')
      arr.push('Annual recurrence interval (years)')
    }
    else if (type ==="economicdamage"){
      arr.push(site+' Expected Damage')
      arr.push('Cost of Damage (Million US$)')
      arr.push('Annual recurrence interval (years)')
    }
    else if (type ==="annual"){
      arr.push(site+' Annual Economic Damage')
      arr.push('Cost of Damage (Million US$)')
      arr.push('')
    }
    else{
      arr.push(site+' Percentage of '+asset+' damaged')
      arr.push('Percentage of damaged '+asset+' (%)')
      arr.push('Annual recurrence interval (years)')
    }
  }
  else{
    arr.push(site+' Percentage of Population Exposed')
    arr.push('Percentage of exposed Population (%)')
    arr.push('Annual recurrence interval (years)')
  }

  return arr;

}

export const getChartOptionsShoreline ={
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Loading...',
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
      title: {
      display: true,
      text: 'sq Kilometers'
    }
  }
  }
}