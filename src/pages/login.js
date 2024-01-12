import React, { useEffect, useRef,useState } from 'react';
import "leaflet-side-by-side";
import "./L.TileLayer.BetterWMS";
import "./testmap.css";
import {useNavigate} from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {
  Button,Modal
} from "react-bootstrap";
import AuthService from '../services/auth.service';

const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">
        This field is required!
      </div>
    );
  }
};


const Login = () => {
    const navigate = useNavigate();
    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    if (username === '' || password === ''){
      setMessage('Username and Password cannot be empty!');
    }
    else{
      AuthService.login(username, password).then(
        () => {
          navigate("/tcap/upload");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );

      console.log(username, password);
    }
   // localStorage.setItem('access_token', 'bycrpt');
   // navigate('/tcap/upload')
   
   setLoading(false);
   e.currentTarget.blur();
  };


  return (
    <div className="container">
        <br></br>
        <div class="card">
  <div class="card-header">
    Login
  </div>
  <div class="card-body">
   
  <Form  onSubmit={handleSubmit} ref={form}>
  <div class="form-group">
    <label for="exampleInputEmail1">Username</label>
    <input type="text" class="form-control" id="exampleInputEmail1" name="username" value={username} placeholder="Enter email"  onChange={({ target }) => setUsername(target.value)} validations={[required]}/>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1"  name="password" value={password} placeholder="Password"  onChange={({ target }) => setPassword(target.value)} validations={[required]}/>
  </div>
  <br></br>
  <div className="form-group">
          <button className="btn btn-primary btn-block" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Login</span>
            </button>
          </div>
          <br></br>
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
           <CheckButton style={{ display: "none" }} ref={checkBtn} />
</Form>
  </div>
</div>
  </div>

  )
}
export default Login;
