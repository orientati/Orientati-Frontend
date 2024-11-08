window.addEventListener("DOMContentLoaded", function () {
  // Per uan futura navbar
  //createComponents("body", false);

  getStudenti()
  .then(res =>{
    console.log(res);
  });

  /*addStudente('gaga', 'gaga', false, false, false)
  .then(res=>{
    console.log(res)
  }).catch(rej=>{
    console.log("ERRORE:" + rej);
  })*/
});
