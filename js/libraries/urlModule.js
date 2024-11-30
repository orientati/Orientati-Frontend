const ps = "8000"
const pl = "8000"
const ep = "api/v1/"
let serverUrl;

if(location.origin == "file://") {
    serverUrl = `http://10.0.5.81:${pl}/${ep}`;
}else{
    serverUrl = `http://${location.hostname}:${ps}/${ep}`;
}