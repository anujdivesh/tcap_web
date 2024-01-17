import React, { Component } from "react";
import Dropzone from "react-dropzone";
import axios from 'axios';
import UploadService from "../services/upload-files.service";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.upload = this.upload.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      selectedFiles: undefined,
      progressInfos: [],
      message: [],
      fileInfos: [],
    };
  }

  componentDidMount() {
    UploadService.getFiles().then((response) => {
    //  console.log(response.data)
      this.setState({
        fileInfos: response.data,
      });
    });
  }

  upload(idx, file) {
    let _progressInfos = [...this.state.progressInfos];

    UploadService.upload(file, (event) => {
      _progressInfos[idx].percentage = Math.round(
        (100 * event.loaded) / event.total
      );
      this.setState({
        _progressInfos,
      });
    })
      .then((response) => {
        this.setState((prev) => {
          let nextMessage = [
            ...prev.message,
            "Uploaded the file successfully: " + file.name,
          ];
          return {
            message: nextMessage,
          };
        });

        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
      })
      .catch(() => {
        _progressInfos[idx].percentage = 0;
        this.setState((prev) => {
          let nextMessage = [
            ...prev.message,
            "Could not upload the file: " + file.name,
          ];
          return {
            progressInfos: _progressInfos,
            message: nextMessage,
          };
        });
      });
  }

  uploadFiles() {
    const selectedFiles = this.state.selectedFiles;
    let process_flag = true;
    for (let i = 0; i < selectedFiles.length; i++) {
      var filename = selectedFiles[i].name;
      const myArray = filename.split(".");
      let file_ext = myArray[1];
      console.log(file_ext)
      if (file_ext === 'csv' || file_ext === 'zip'){
        process_flag = true;
      }
      else{
        process_flag = false;
      }
    }
    if (selectedFiles.length !== 4){
      process_flag = false
    }
    console.log(process_flag)
    if (process_flag){
      let _progressInfos = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        _progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name });
      }
  
      this.setState(
        {
          progressInfos: _progressInfos,
          message: [],
        },
        () => {
          for (let i = 0; i < selectedFiles.length; i++) {
            this.upload(i, selectedFiles[i]);
          }
        }
      );
    }
    else{
      this.setState({
      message: ["Supported File Extensions: .csv .zip, Total of 4 files are required."],
      });
    }

    /*
    let _progressInfos = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      _progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name });
    }

    this.setState(
      {
        progressInfos: _progressInfos,
        message: [],
      },
      () => {
        for (let i = 0; i < selectedFiles.length; i++) {
          this.upload(i, selectedFiles[i]);
        }
      }
    );*/
  }

  onDrop(files) {
    if (files.length > 0) {
      this.setState({ selectedFiles: files });
    }
  }

  
  render() {
    const { selectedFiles, progressInfos, message, fileInfos } = this.state;
    const handleFileRemove = (e) => {
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
            this.setState({
              fileInfos: [],
            });
            this.setState({
              message: ["Files Deleted Successfully!"],
            });
            this.setState({
              selectedFiles: [],
            });
            this.setState({
              progressInfos: [],
            });
            console.log(res);
            console.log(res.data);
          })
        }
      })
     
      e.currentTarget.blur();
    };
    
    return (
      <div>
        <div className="alert alert-info" role="alert">
          A Total of 4 files is required to be uploaded. Recommended file labelling:
            <ul>
               <li key={1}>AtollName_GIS_stats_table_short.csv</li>
               <li key={2}>AtollName_raw_positions.csv</li>
               <li key={3}>AtollName_Image_error.csv</li>
               <li key={4}>TV_AtollName_SL.zip</li>
            </ul>
          </div>

        {progressInfos &&
          progressInfos.map((progressInfo, index) => (
            <div className="mb-2" key={index}>
              <span>{progressInfo.fileName}</span>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-info"
                  role="progressbar"
                  aria-valuenow={progressInfo.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: progressInfo.percentage + "%" }}
                >
                  {progressInfo.percentage}%
                </div>
              </div>
            </div>
          ))}

        <div className="my-3">
          <Dropzone onDrop={this.onDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  {selectedFiles &&
                  Array.isArray(selectedFiles) &&
                  selectedFiles.length ? (
                    <div className="selected-file">
                      {selectedFiles.length > 3
                        ? `${selectedFiles.length} files`
                        : selectedFiles.map((file) => file.name).join(", ")}
                    </div>
                  ) : (
                    `Drag and drop files here, or click to select files`
                  )}
                </div>
                <aside className="selected-file-wrapper">
                  <button
                    className="btn btn-success"
                    disabled={!selectedFiles}
                    onClick={this.uploadFiles}
                  >
                    Upload
                  </button>
                </aside>
              </section>
            )}
          </Dropzone>
        </div>

        {message.length > 0 && (
          <div className="alert alert-secondary" role="alert">
            <ul>
              {message.map((item, i) => {
                return <li key={i}>{item}</li>;
              })}
            </ul>
          </div>
        )}

        {fileInfos.length > 0 && (
          <div className="card">
            <div className="card-header" style={{ display: "flex" }}>List of Files
            <button style={{ marginLeft: "auto" }} className="btn btn-danger" onClick={handleFileRemove}>
        Delete All
        </button></div>
            <ul className="list-group list-group-flush">
              {fileInfos &&
                fileInfos.map((file, index) => (
                  <li className="list-group-item" key={index}>
                    <a href={file.url}>{file.name}</a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
