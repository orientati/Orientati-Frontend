const si = "SERVER_IP"
const ps = "PORTA SERVER"
const pl = "PORTA LOCALHOST"
const ep = "api/v1/"
let serverUrl;

if(location.origin == "file://") {
    serverUrl = `localhost:${pl}/${ep}`;
}else{
    serverUrl = `http://${si}:${ps}/${ep}`;
}