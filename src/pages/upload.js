import React, { useEffect, useRef,useState } from 'react';
import "leaflet-side-by-side";
import "./L.TileLayer.BetterWMS";
import "./testmap.css";
import {useNavigate} from 'react-router-dom';
import './drop.css'
import UploadFiles from "../components/upload.files.component";
import axios from 'axios';
import {toast} from 'react-toastify';
import {
  Button,Modal
} from "react-bootstrap";

const Upload = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false)
  };

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => {
    setShow2(false)
  };

  const onClickShow3= async(e) => {
    axios.get(`https://opm.gem.spc.int/cgi-bin/get_json_list.py`)
        .then(res => {
          const file = res.data;
          var check = false;
          for (var i=0; i<file.length; i++){
            console.log(file[i].file_name)
            check = file[i].file_name.includes('revert')
          }
          if (check){
            toast.warning("Some files are waiting to be processed.", {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
          }
          else{

          
    if (siteRef.current != null){
      axios.get(`https://opm.gem.spc.int/cgi-bin/check_revert.py?island=`+siteRef.current)
        .then(res => {
          const file = res.data;
          console.log(file.status)
          if (file.status === 'found'){
            setShow(true) 
          }
          else{
            toast.warning("Nothing to revert.", {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
          }
        })
    }
    else{
      toast.warning('Please select island name!', {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
    }
  }})
      e.currentTarget.blur();
  }

  const onClickShow2= async(e) => {
    axios.get(`https://opm.gem.spc.int/cgi-bin/get_json_list.py`)
        .then(res => {
          const file = res.data;
          var check = false;
          for (var i=0; i<file.length; i++){
            console.log(file[i].file_name)
            check = file[i].file_name.includes('data')
          }
          if (check){
            toast.warning("Some files are waiting to be processed.", {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
          }
          else{
            if (siteRef.current != null){
         //     var x = ["Nanumaga","Nanumea","Funafuti","Niulakita","Niutao","Nui","Nukufetau","Nukulaelae","Vaitupu"];
              axios.get(`https://opmdata.gem.spc.int/shoreline/api/files`)
                .then(res => {
                  const file = res.data;
                //  var check = true;
                  for (var i=0; i<file.length; i++){
                    console.log(file[i].name)
                    var boo = file[i].name.includes(siteRef.current)
                    if (!boo){
                      check = false
                    }
                  }
                  var count = file.length;
                  if(boo){
                    if (count !== 4){
                      toast.warning("4 Files are required.", {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
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
          }
        })
      e.currentTarget.blur();
  }

    const navigate = useNavigate();
    //const [message, setMessage] = useState("");
    const [list, setList] = useState([]);
  //  const dataref = useRef();
    const siteRef = useRef(null);
 //   const siteRef2 = useRef(null);
    const handleLogout = () => {
          localStorage.removeItem("user");
          navigate("/tcap/login");
     
      };
/*
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
*/

      const handleProcessing = (e) => {
        if (siteRef.current != null){
        axios.get(`https://opm.gem.spc.int/cgi-bin/handleprocessing.py?island=`+siteRef.current)
        .then(res => {
          const file = res.data;
          const myJSON = JSON.stringify(file); 
          console.log(file)
          //setMessage("Files has been sent to be processed: "+myJSON)
          toast.info("Files has been sent to be processed: "+myJSON, {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
          
        })
        setShow2(false)
      }
      else{
        toast.warning('Please select island name!', {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
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
        toast.info("Files has been sent to be rolled back: "+myJSON, {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000})
      })
      handleClose()
    }
    else{
     // setMessage("Please select island name!")
    }
      e.currentTarget.blur();
  };
/*
    const handleclear = (e) => {
      setList([])
      e.currentTarget.blur();
    }
*/
    const getlogs = async () => { 
      axios.get(`https://opm.gem.spc.int/cgi-bin/read_processing_log.py`)
      .then(res => {
        const file = res.data;
     //   const myJSON = JSON.stringify(file); 
        setList(file)
      })
    }

/*
    const handle_refresh = (e) => {
   setList([])

   axios.get(`https://opm.gem.spc.int/cgi-bin/read_processing_log.py`)
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
*/
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
    <button style={{ marginLeft: "auto" }} className="btn btn-warning" onClick={handleLogout}>
        Logout
        </button>
  </div>
  <div className="card-body">
  <UploadFiles />
  <hr/>

  <div className="row">
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
  <div className="col-2">
    
  <button type="button" className="btn btn-success" onClick={onClickShow2}>Submit for Processing</button>&nbsp;
  
  </div>
  <div className="col-2">
  <button type="button" className="btn btn-warning" onClick={onClickShow3}>Rollback to Previous</button>&nbsp;
    
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
       Are you sure you want to continue making changes to shoreline data for <b>{siteRef.current}</b> island.
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
      Confirm revert
    </Modal.Header>
        <Modal.Body>
        <br/>
       Are you sure you want to revert shoreline data changes for <b>{siteRef.current}</b> island.
       <br/>
       <br/>
        </Modal.Body>
        <Modal.Footer>
        <button type="button" className="btn btn-success" onClick={handle_revert}>Revert</button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>
</div>

  )
}
export default Upload;
