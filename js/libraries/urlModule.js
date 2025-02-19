const ps = "8000"
const pl = "8000"
const ep = "api/v1/"
let serverUrl;

if(location.origin == "file://") {
    serverUrl = `https://localhost:${pl}/${ep}`;
}else{
    serverUrl = `https://${location.hostname}:${ps}/${ep}`;
}