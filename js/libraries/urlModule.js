const ps = "8000"
const pl = "8000"
const ep = "api/v1/"
let serverUrl;

if(location.origin == "file://") {
    serverUrl = `localhost:${pl}/${ep}`;
}else{
    serverUrl = `http://${location.hostname}:${ps}/${ep}`;
}