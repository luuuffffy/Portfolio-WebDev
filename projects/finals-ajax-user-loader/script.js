const btn3 = document.getElementById("loadbtn")
const status1 = document.getElementById("status")
const state1 = document.getElementById("state")
const result1 = document.getElementById("result")

btn3.addEventListener("click", function(){
    let ajaxRequest = new XMLHttpRequest()
    state1.innerHTML ="readyState:" + ajaxRequest.readyState

    ajaxRequest.onreadystatechange = function(){
        state1.innerHTML = "readyStatus" + ajaxRequest.readyState
        
        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            status1.innerHTML="readyState:" + ajaxRequest.status + "-" + ajaxRequest.statusText

            result1.innerHTML = ajaxRequest.responseText
        }
   }
    ajaxRequest.open("GET","https://jsonplaceholder.typicode.com/users/1",true);
    ajaxRequest.send();
})