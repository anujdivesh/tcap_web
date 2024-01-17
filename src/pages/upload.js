import React, { useEffect, useRef,useState } from 'react';
import "leaflet-side-by-side";
import "./L.TileLayer.BetterWMS";
import "./testmap.css";
import {useNavigate} from 'react-router-dom';
import AuthService from '../services/auth.service';
import './drop.css'
import UploadFiles from "../components/upload.files.component";
import axios from 'axios';
import {toast} from 'react-toastify';

const Upload = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [list, setList] = useState([]);
    const dataref = useRef();
    const siteRef = useRef(null);
    const siteRef2 = useRef(null);
    const handleLogout = () => {
          localStorage.removeItem("user");
          navigate("/tcap/login");
     
      };

      const handleFileRemove = () => {
          const loggedInUser = localStorage.getItem("user");
          const obj = JSON.parse(loggedInUser)
          console.log(obj["accessToken"])

          axios.get(`https://opmdata.gem.spc.int/shoreline/api/files`)
          .then(res => {
            const file = res.data;
            for (var i=0; i<file.length; i++){
              console.log(file[i].name)
              axios.delete(`https://opmdata.gem.spc.int/shoreline/api/files/`+file[i].name,{
                headers:{
                  "x-access-token": obj["accessToken"]
                }
              })
              .then(res => {
                console.log(res);
                console.log(res.data);
              })
            }
          })
     
      };


      const handleProcessing = (e) => {
        if (siteRef.current != null){
        axios.get(`https://opm.gem.spc.int/cgi-bin/anuj.py?island=`+siteRef.current)
        .then(res => {
          const file = res.data;
          const myJSON = JSON.stringify(file); 
          console.log(file)
          setMessage("Files has been sent to be processed: "+myJSON)
        })
      }
      else{
        setMessage("Please select island name!")
      }
        e.currentTarget.blur();
    };

    const handle_revert = (e) => {
      if (siteRef.current != null){
      axios.get(`https://opm.gem.spc.int/cgi-bin/revert_shoreline.py?island=`+siteRef.current)
      .then(res => {
        const file = res.data;
        const myJSON = JSON.stringify(file); 
        console.log(file)
        setMessage("Files has been sent to be processed: "+myJSON)
      })
    }
    else{
      setMessage("Please select island name!")
    }
      e.currentTarget.blur();
  };

    const handleclear = (e) => {
      setList([])
      e.currentTarget.blur();
    }

    const getlogs = async () => { 
      axios.get(`http://opm.gem.spc.int/cgi-bin/read_processing_log.py`)
      .then(res => {
        const file = res.data;
        const myJSON = JSON.stringify(file); 
        setList(file)
      })
    }


    const handle_refresh = (e) => {
   setList([])

   axios.get(`http://opm.gem.spc.int/cgi-bin/read_processing_log.py`)
      .then(res => {
        const file = res.data;
        const myJSON = JSON.stringify(file); 
        setList(file)
      })




        let x = Math.random();
        var name2 = siteRef2.current;
        if (siteRef2.current === 'Nanumanga'){
          name2 = 'Nanumaga'
        }


        const newItem = [{id:1, filename:'TV_'+name2+"_SL", filedesc:"Shoreline change analysis shapefile", filetype:'.zip', link:"https://opm.gem.spc.int/geoserver_data/Shoreline/"+name2+"/TV_"+name2+"_SL.zip"},
        {id:2, filename:'TV_'+name2+"_T",  filedesc:"Transects Shapefile", filetype:'.zip', link:"https://opm.gem.spc.int/geoserver_data/Transects/"+name2+"/TV_"+name2+"_T.zip"},
        {id:3, filename:name2+'_GIS_stats_table_short.csv',  filedesc:"Output from shoreline change analysis", filetype:'.csv', link:"https://opm.gem.spc.int/scripts/"+name2+"/GIS_stats_table_short.csv"},
        {id:4, filename:name2+'_raw_positions.csv', filedesc:"Output from shoreline change analysis",filetype:'.csv', link:"https://opm.gem.spc.int/scripts/"+name2+"/raw_positions.csv"},
        {id:5, filename:name2+'_Image_error.csv', filedesc:"Output from shoreline change analysis",filetype:'.csv', link:"https://opm.gem.spc.int/scripts/"+name2+"/Image_error.csv"}];
      
       // setList(newItem)
        //setList([...list, newItem]);
   
      e.currentTarget.blur();
  };

  useEffect(()=>{
    const interval=setInterval(()=>{
      getlogs()
      },5000)

      return()=>clearInterval(interval)
  },[])
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        getlogs();
        if (loggedInUser) {
        }
        else{
            navigate('/tcap/login')
        }
      }, []);

      const handleSite=(e)=>{
        console.log(e.target.value)
        siteRef.current = e.target.value;
      }

 
  return (
    <div className="container">
        <br></br>
        <div className="card">
  <div className="card-header" style={{ display: "flex" }}>
    Data update center
    <button style={{ marginLeft: "auto" }} className="btn btn-primary" onClick={handleLogout}>
        Back
        </button>
  </div>
  <div className="card-body">
  <UploadFiles />
  <hr/>

  <div className="row">
  <div className="col-md-6">
  <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleSite} style={{fontSize:'13px', paddingLeft:1}}>
      <option value="0">-- Select --</option>
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
  <div className="col-md-3">
    
  <button type="button" className="btn btn-success  btn-sm" onClick={handleProcessing}>Submit for Processing</button>&nbsp;
  
  </div>
  <div className="col-md-3">
  <button type="button" className="btn btn-warning  btn-sm" onClick={handle_revert}>Revert</button>&nbsp;
    
    </div>
    <div className="col-md-3">
    <button type="button" className="btn btn-warning  btn-sm" onClick={handle_refresh}>Refresh</button>&nbsp;
    </div>
</div>



  
<br/>
  <div className="alert alert-info" role="alert">
          {message}
          </div>
          <div className="row">
<div className="col-md-12">
{list.length > 0 && (
<table className="table table-hover">
  <thead className="table-warning">
    <tr>
      <th scope="col">Logs</th>
    </tr>
  </thead>
  <tbody>
    {list.map((item) => (
          <tr key={item.status}>
      <td>{item.status}</td>
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
</div>

  )
}
export default Upload;
