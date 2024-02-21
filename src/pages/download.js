import React, { useEffect, useRef,useState } from 'react';
import "leaflet-side-by-side";
import "./L.TileLayer.BetterWMS";
import "./testmap.css";
import {useNavigate} from 'react-router-dom';
//import AuthService from '../services/auth.service';
import './drop.css'
//import UploadFiles from "../components/upload.files.component";
//import axios from 'axios';
import {toast} from 'react-toastify';

const Download = () => {
    const navigate = useNavigate();
 //   const [message, setMessage] = useState("");
  //  const [data, setData] = useState("");
    const [list, setList] = useState([]);

    //const siteRef = useRef(null);
    const siteRef2 = useRef(null);
    const handleLogout = () => {
          localStorage.removeItem("user");
          navigate("/tcap/login");
     
      };

    


    const handleclear = (e) => {
      setList([])
      e.currentTarget.blur();
    }

    const handleProcessing2 = (e) => {
   setList([])

      if (siteRef2.current != null){
       // let x = Math.random();
        var name2 = siteRef2.current;
        if (siteRef2.current === 'Nanumanga'){
          name2 = 'Nanumaga'
        }


        const newItem = [{id:1, filename:'TV_'+name2+"_SL", filedesc:"Shoreline change analysis shapefile", filetype:'.zip', link:"https://opm.gem.spc.int/geoserver_data/Shoreline/"+name2+"/TV_"+name2+"_SL.zip"},
        {id:2, filename:'TV_'+name2+"_T",  filedesc:"Transects Shapefile", filetype:'.zip', link:"https://opm.gem.spc.int/geoserver_data/Transects/"+name2+"/TV_"+name2+"_T.zip"},
        {id:3, filename:name2+'_GIS_stats_table_short.csv',  filedesc:"Output from shoreline change analysis", filetype:'.csv', link:"https://opm.gem.spc.int/scripts/"+name2+"/GIS_stats_table_short.csv"},
        {id:4, filename:name2+'_raw_positions.csv', filedesc:"Output from shoreline change analysis",filetype:'.csv', link:"https://opm.gem.spc.int/scripts/"+name2+"/raw_positions.csv"},
        {id:5, filename:name2+'_Image_error.csv', filedesc:"Output from shoreline change analysis",filetype:'.csv', link:"https://opm.gem.spc.int/scripts/"+name2+"/Image_error.csv"}];
        setList(newItem)
        //setList([...list, newItem]);
      
    }
    else{
      toast.warning('Please select island name!', {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
    }
      e.currentTarget.blur();
  };

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
        }
        else{
            navigate('/tcap/login')
        }
      }, []);

      const handleSite2=(e)=>{
        console.log(e.target.value)
        siteRef2.current = e.target.value;
      }
 
  return (
    <div className="container">
      <div className="card">
  <div className="card-header">
    Data download center
  </div>
  <div className="card-body">
  <div className="row">
  <div className="col-md-10">
  <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleSite2} style={{fontSize:'13px', paddingLeft:1}}>
      <option value="0">-- Select --</option>
  <option value="Nanumanga">Nanumaga</option>
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
  <div className="col-md-2">
    
  <button type="button" className="btn btn-primary  btn-sm" onClick={handleProcessing2}>Search</button>&nbsp;

  <button type="button" className="btn btn-danger  btn-sm" onClick={handleclear}>Clear</button>&nbsp;
  
  </div>
</div>
<br/>
<div className="row">
<div className="col-md-12">
{list.length > 0 && (
<table className="table table-hover">
  <thead className="table-primary">
    <tr>
      <th scope="col">ID</th>
      <th scope="col">File name</th>
      <th scope="col">File Description</th>
      <th scope="col">File Type</th>
      <th scope="col">Link</th>
    </tr>
  </thead>
  <tbody>
    {list.map((item) => (
          <tr key={item.id}>
      <th scope="row">{item.id}</th>
      <td>{item.filename}</td>
      <td>{item.filedesc}</td>
      <td>{item.filetype}</td>
      <td>  <a href={item.link} target="_blank" rel="noopener noreferrer">Download</a></td>
    </tr>
        ))}
  </tbody>
</table>
)}
  </div>
</div>

  </div>
  <div className="card-footer" style={{ display: "flex" }}>
        <button style={{ marginLeft: "auto" }} className="btn btn-primary" onClick={handleLogout}>
        Back
        </button>
    </div>
  </div>
        <br></br>
</div>

  )
}
export default Download;
