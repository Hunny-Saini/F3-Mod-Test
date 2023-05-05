//getting userip addres
let userIp;
let userDataFromAPI;
const getDataBtn = document.getElementById("getData");


//fetching user ip
fetch("https://api.ipify.org?format=json")
.then(response => response.json())
.then((data) =>{
    userIp = data.ip;
    // console.log(userIp);
    document.getElementById("ip-container").innerText +=` ${userIp}`
}).catch((err) => {
    alert("Error: ",err);
});

getDataBtn.addEventListener("click",() =>{
    if(userIp){
        //hiding getdata btn and showing afterclick content
        getDataBtn.style.display ="none";
        document.getElementById("after-click").style.display="flex";

        fetch(`https://ipinfo.io/${userIp}?token=9a5912f4cdf254`)
        .then(response => response.json())
        .then((data) =>{
            userDataFromAPI = data;
            renderData(userDataFromAPI);
            // console.log(userDataFromAPI);
            callApi();
        }).catch((err) => {
            console.log("Error: ",err);
        });

    }else{
        alert("Please wait getting your ip");
    }
    
    
})

//rendring data
function renderData(obj){
    //getting containers
    const lat = document.querySelector(".lat");
    const long = document.querySelector(".long");
    const city = document.querySelector(".city");
    const region = document.querySelector(".region");
    const org = document.querySelector(".org");
    const host = document.querySelector(".host");
    const timezone = document.querySelector(".timezone");
    const date = document.querySelector(".date");
    const pin = document.querySelector(".pin");
    

    //setting values
    lat.innerHTML += `<strong>Lat: </strong>${obj.loc.split(",")[0]}`;
    long.innerHTML += `<strong>Long: </strong>${obj.loc.split(",")[1]}`;
    city.innerHTML += `<strong>City: </strong>${obj.city}`;
    region.innerHTML += `<strong>Region: </strong>${obj.region}`;
    org.innerHTML += `<strong>Organisation: </strong>${obj.org}`;
    host.innerHTML += `<strong>Hostname: </strong>${obj.hostname}`;
    
    //setting value on map
    document.getElementById("map").setAttribute("src",`https://maps.google.com/maps?q=${obj.loc.split(",")[0]}, ${obj.loc.split(",")[1]}&z=15&output=embed`);

    //setting timzone
    timezone.innerHTML += obj.timezone;
    date.innerHTML += new Date().toLocaleString("en-US", { timeZone: `${obj.timezone}` });
    pin.innerHTML += obj.postal;
    // message.innerHTML += ;
};

// function to call Pin-Info Api
let postalData;
function callApi(){
    // let pinData;
    fetch(`https://api.postalpincode.in/pincode/${userDataFromAPI.postal}`)
    .then(response => response.json())
    .then((data) =>{
        const message = document.querySelector(".no-of-pins");
        message.innerHTML += data[0].Message;
        postalData = data[0].PostOffice;
        renderCards(postalData);
    })
    .catch((err) => {
        alert("Error: ",err);
    });
}

function renderCards(arr){
    //getting cards container
    let cardsContainer = document.getElementById("card-container");
    cardsContainer.innerText = "";
    // console.log(arr);    
    arr.forEach(ele => {
        cardsContainer.innerHTML += `<div class="card">
        <div class="name">Name: ${ele.Name}</div>
        <div class="branch">Branch Type: ${ele.BranchType}</div>
        <div class="delivery">Delivery Status: ${ele.DeliveryStatus}</div>
        <div class="dist">District: ${ele.District}</div>
        <div class="div">Division: ${ele.Division}</div>
    </div>`
    });
};

//search functionallity
let searchInput = document.getElementById("search-input");
searchInput.addEventListener("input",(e)=>{

    var input=e.target.value.trim().toLowerCase();
    var filteredArr = postalData.filter((i)=>i.Name.toLowerCase().includes(input) || i.BranchType.toLowerCase().includes(input))
    renderCards(filteredArr);
})