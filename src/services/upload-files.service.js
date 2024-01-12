import http from "./http-common";

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);
    const loggedInUser = localStorage.getItem("user");
    const obj = JSON.parse(loggedInUser)
    console.log(obj["accessToken"])
    return http.post("/shoreline/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-access-token": obj["accessToken"]
      },
      onUploadProgress,
    });
  }

  getFiles() {
    return http.get("/shoreline/api/files");
  }
}

export default new UploadFilesService();
