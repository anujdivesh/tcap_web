import React, { useEffect, useRef,useState } from 'react';
import "leaflet-side-by-side";
import "./L.TileLayer.BetterWMS";
import "./testmap.css";
import {useNavigate} from 'react-router-dom';
import './drop.css'
import UploadFiles from "../components/satellite.files.componenet";
import axios from 'axios';
import {toast} from 'react-toastify';
import {
  Button,Modal
} from "react-bootstrap";

const Satellite = () => {
  const shorelineyears = useRef([]);
  const [show, setShow] = useState(false);
  const imageRef = useRef(null);
  const handleClose = () => {
    setShow(false)
  };

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => {
    setShow2(false)
  };

  const onClickShow2= async(e) => {

            if (siteRef.current != null){
         //     var x = ["Nanumaga","Nanumea","Funafuti","Niulakita","Niutao","Nui","Nukufetau","Nukulaelae","Vaitupu"];
              axios.get(`https://opmdata.gem.spc.int/shoreline/api/satellite_file`)
                .then(res => {
                  const file = res.data;
                //  var check = true;
                  for (var i=0; i<file.length; i++){
                    console.log(file[i].name)
                    var boo = file[i].name.includes(siteRef.current)
                  }
                  var count = file.length;
                  if(boo){
                    if (count !== 1){
                      toast.warning("1 Files are required.", {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
                    }
                    else{
                    setShow2(true) 
                    }
                  }
                  else{
                    toast.warning("Ensure Upload file name matches island name. Please refresh the page!", {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
                  }
                })
            }
            else{
              toast.warning('Please select island name!', {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
            }
      e.currentTarget.blur();
  }

  const onClickShow3= async(e) => {
            if (siteRef2.current != null && imageRef.current != null){

            
         setShow(true) 
            }
            else{
              toast.warning('Please select island name!', {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
            }
      e.currentTarget.blur();
  }


    const navigate = useNavigate();
    //const [message, setMessage] = useState("");
    const [list, setList] = useState([]);
  //  const dataref = useRef();
    const siteRef = useRef(null);
    const siteRef2= useRef(null);
 //   const siteRef2 = useRef(null);
    const handleLogout = () => {
          localStorage.removeItem("user");
          navigate("/tcap/login");
     
      };

      const handleProcessing = (e) => {
        if (siteRef.current != null ){
          const loggedInUser = localStorage.getItem("user");
        const obj = JSON.parse(loggedInUser)
        console.log(obj["accessToken"])
        
        axios.get(`https://opmdata.gem.spc.int/shoreline/api/satellite_file`)
        .then(res => {
          const file = res.data;
          var fname = "";
        //  var check = true;
          for (var i=0; i<file.length; i++){
            fname = file[i].name;
            var boo = file[i].name.includes(siteRef.current)
          }
          var count = file.length;
          if(boo){
            if (count !== 1){
              toast.warning("1 Files are required.", {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
            }
            else{
            console.log('continute uploading...')
            var data = {
              function:"insert",
              filename: fname,
              full_file_path:"https://opmdata.gem.spc.int/shoreline/api/satellite_file/"+fname,
              enabled:true
            }
            axios.post(`https://opmdata.gem.spc.int/shoreline/api/queue/add`,data,{
              headers:{
                "x-access-token": obj["accessToken"]
              }
            })
            .then(res => {
              console.log(res)
              var message = "Adding satellite imagery queued, Task will start in 5 minutes.";
              axios.get(`https://opm.gem.spc.int/cgi-bin/writelog.py?island=`+siteRef.current+`&message=`+message)
              .then(res => {
                
              toast.info("Insert queued.", {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
                
              })
            })
            }
          }
          else{
            toast.warning("Ensure Upload file name matches island name. Please refresh the page!", {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
          }
        })
        setShow2(false)
      }
      else{
        toast.warning('Please select island name!', {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
      }
        e.currentTarget.blur();
    };

    const handle_revert = (e) => {
      if (siteRef2.current != null && imageRef.current != null){
        const loggedInUser = localStorage.getItem("user");
      const obj = JSON.parse(loggedInUser)
      console.log(obj["accessToken"])
      var fname = "TV_"+siteRef2.current+"_"+imageRef.current+"_orthorectified.tif";
      var data = {
        function:"delete",
        filename: fname,
        full_file_path:"https://opmdata.gem.spc.int/shoreline/api/satellite/"+fname,
        enabled:true

      }

      axios.post(`https://opmdata.gem.spc.int/shoreline/api/queue/add`,data,{
            headers:{
              "x-access-token": obj["accessToken"]
            }
          })
      .then(res => {
        console.log(res)
        var message = "Delete satellite imagery queued, Task will start in 5 minutes.";
        axios.get(`https://opm.gem.spc.int/cgi-bin/writelog.py?island=`+siteRef2.current+`&message=`+message)
        .then(res => {
          
        toast.info("Delete queued.", {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
          
        })
      })
      handleClose()
    }
    else{
     // setMessage("Please select island name!")
    }
      e.currentTarget.blur();
  };

    const getlogs = async () => { 
      axios.get(`https://opm.gem.spc.int/cgi-bin/read_processing_log.py`)
      .then(res => {
        const file = res.data;
     //   const myJSON = JSON.stringify(file); 
        setList(file)
      })
    }

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
      const everything = async () =>{
        const response = await fetch('https://opm.gem.spc.int/cgi-bin/get_satellite_years.py');
        const data = await response.json();
        console.log(data)
        return data
    }
      const handleSite2=(e)=>{
        shorelineyears.current = [];
        console.log(e.target.value)
        siteRef2.current = e.target.value;
        everything().then((res)=>{
          var temp = [];
          temp.push(res)
          shorelineyears.current = temp;
         })
      }
      const handleImage2=(e)=>{
        imageRef.current = e.target.value;
        
      
      }
 
  return (
    <div className="container">
        <br></br>
        <div className="card">
  <div className="card-header" style={{ display: "flex" }}>
    Update Satellite Imagery
    <button style={{ marginLeft: "auto" }} className="btn btn-warning" onClick={handleLogout}>
        Logout
        </button>
  </div>
  <div className="card-body">
  <UploadFiles />
  <hr/>

  <div className="row">
  <p style={{color:'blue'}}>Upload Satellite Imagery:</p>
  <div className="col-2">
    <p>Island Name:</p>
    </div>
  <div className="col-6">
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
  <div className="col-4">
    
  <button type="button" className="btn btn-success" onClick={onClickShow2}>Submit for Processing</button>&nbsp;
  
  </div>
</div>
<hr/>
<div className="row">
  <p style={{color:'blue'}}>Delete Satellite Imagery:</p>
  <div className="col-2">
    <p>Island Name:</p>
    </div>
  <div className="col-3">
  <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleSite2} style={{fontSize:'13px', paddingLeft:1}}>
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
  <div className="col-3">
  <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleImage2} style={{fontSize:'13px', paddingLeft:1}}>
  <option value="">-- Select --</option>
  {shorelineyears.current.map((v, i) => (
                v[siteRef2.current].map((x,y)=>(
                    <option value={x.id} key={y}>TV_{siteRef2.current}_{x.id}_orthorectified.tif</option>
                ))

                ))
                  }
                  </select>
  </div>
  <div className="col-4">
    
    <button type="button" className="btn btn-danger" onClick={onClickShow3}>Delete Imagery</button>&nbsp;
    
    </div>
  </div>



  
<br/>
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
          <tr key={item.status} className="table-warning">
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
        <button style={{ marginLeft: "auto" }} className="btn btn-warning" onClick={handleLogout}>
        Logout
        </button>
    </div>
  </div>
  <Modal show={show2} onHide={handleClose2} size="lg" centered={true} >
    <Modal.Header className="btn btn-primary" >
      Confirm processing
    </Modal.Header>
        <Modal.Body>
        <br/>
       Are you sure you want to continue making changes to Satellite Imagery for <b>{siteRef.current}</b> island.
       <br/>
       <br/>
        </Modal.Body>
        <Modal.Footer>
        <button type="button" className="btn btn-success" onClick={handleProcessing}>Submit for processing</button>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose} size="lg" centered={true} >
    <Modal.Header className="btn btn-warning" >
      Confirm Delete
    </Modal.Header>
        <Modal.Body>
        <br/>
       Are you sure you want to delete <b>{imageRef.current}</b> Satellite Imagery for <b>{siteRef2.current}</b> island.
       <br/>
       <br/>
        </Modal.Body>
        <Modal.Footer>
        <button type="button" className="btn btn-danger" onClick={handle_revert}>Delete</button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>
</div>

  )
}
export default Satellite;
