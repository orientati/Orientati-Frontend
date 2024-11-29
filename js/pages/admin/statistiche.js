window.addEventListener("DOMContentLoaded", function () {
    caricaDatiOrientati();
});

function caricaDatiOrientati() {
    vallauriRequest(`${serverUrl}admin/dashboard/orientati/statistiche`, "GET",
        {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
        })
        .then((response) => {
                console.log(response);
                const p = document.getElementById("output");
                p.innerText = "totali: " + response.totali + " presenti: " + response.presenti + " assenti: " + response.assenti;

            }
        )
        .catch((err) => {
                console.error(err);
            }
        )
}
