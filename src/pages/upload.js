import React, { useEffect, useRef,useState } from 'react';
import "leaflet-side-by-side";
import "./L.TileLayer.BetterWMS";
import "./testmap.css";
import {useNavigate} from 'react-router-dom';
import AuthService from '../services/auth.service';
import './drop.css'
import UploadFiles from "../components/upload.files.component";
import axios from 'axios';

const Upload = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const siteRef = useRef(null);
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

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
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
        <div class="card">
  <div class="card-header">
    Shoreline layer update center
  </div>
  <div class="card-body">
  <UploadFiles />
  <hr/>

  <div class="row">
  <div class="col-md-6">
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
  <div class="col-md-3">
    
  <button type="button" class="btn btn-success  btn-sm" onClick={handleProcessing}>Submit for Processing</button>&nbsp;
  
  </div>
  <div class="col-md-3">
    
    
    </div>
</div>



  
<br/>
  <div className="alert alert-info" role="alert">
          {message}
          </div>
  </div>
  <div class="card-footer" style={{ display: "flex" }}>
        <button style={{ marginLeft: "auto" }} class="btn btn-primary" onClick={handleLogout}>
        Logout
        </button>
    </div>
  </div>
</div>

  )
}
export default Upload;
