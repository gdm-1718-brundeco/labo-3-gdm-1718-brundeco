// localStorage.clear();
let url = "https://randomuser.me/api/?results=10";
let person;
let fetchedProfiles = [];
let likedProfiles = [];
let skippedProfiles = [];
let screen = document.getElementById("screen");
let like = document.getElementById("like");
let skip = document.getElementById("skip");
let counter = 0;
let menu = document.querySelector('.bars-image');

let latitude;
let longitude;
let myLat;
let myLong;
let myPos;

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJ1bmVsbGkiLCJhIjoiY2puYWxudTl0NzF2ejN2bng2eXF0ZHBseiJ9.7P5TS1LrZrEOPgsjtbO--w';
let map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v10',
center: myPos

});

if(localStorage.getItem("liked") !== null){
  likedProfiles = JSON.parse(localStorage.getItem("liked"));
  console.log(likedProfiles)
}else{ console.log("kapot") }
if(localStorage.getItem("skipped") !== null){
  skippedProfiles = JSON.parse(localStorage.getItem("skipped"));
}

    function loadMoreProfiles(){
  fetch(url)
  .then(function (response) {
    return response.json();
  })

  .then(function (data) {

    if(localStorage.getItem("person") !== null){
      fetchedProfiles = JSON.parse(localStorage.getItem("person"))
    }else{
      for (let i = 0; i < 10; i++) {
        let randomUser = data.results[i];
  
        function personData() {
          person = {
            name: randomUser.name.first,
            address: randomUser.location.street +
              randomUser.location.city +
              randomUser.location.state,
            age: randomUser.dob.age,
            picture: randomUser.picture.medium,
            lat: randomUser.location.coordinates.latitude,
            long: randomUser.location.coordinates.longitude
          };
        }
  
        personData();
        localStorage.setItem("person" , JSON.stringify(fetchedProfiles));
        fetchedProfiles.push(person);

      }
      
  }

    console.log(fetchedProfiles);
    
    function printPerson() {
      let currentPerson = JSON.parse(localStorage.getItem("person"))[0];

      let userInfo2 = document.createElement('div');
      userInfo2.classList.add("center", "top-margin");
      userInfoPicture = document.createElement('img');
      userInfoPicture.src = currentPerson.picture;
      let userInfo = document.createElement("div");
      userInfo.classList.add("center");
      let userInfoName = document.createElement("h2");
      userInfoName.innerHTML = currentPerson.name;
      let userInfoAddress = document.createElement("h6");
      userInfoAddress.innerHTML = currentPerson.address;
      let userInfoAge = document.createElement("h4");
      userInfoAge.innerHTML = "Age: " + currentPerson.age;

      navigator.geolocation.getCurrentPosition(function(position) {
        myLat = position.coords.latitude;
        myLong = position.coords.longitude;
        personLat = fetchedProfiles[0].lat;
        personLong = fetchedProfiles[0].long;
        myPos = position.coords.latitude + position.coords.longitude;

        let lat1 = fetchedProfiles[0].lat;
        let lon1 = fetchedProfiles[0].long;
        let lat2 = myLat;
        let lon2 = myLong;

  
        var p = 0.017453292519943295; 
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;
        let x = Math.round(12742 * Math.asin(Math.sqrt(a)));
        console.log(x);
        document.getElementById('distance').innerHTML = "U bent " + x + " km verwijdert van deze persoon";
      });
      

      userInfo2.appendChild(userInfoPicture);
      userInfo.appendChild(userInfoName);
      userInfo.appendChild(userInfoAddress);
      userInfo.appendChild(userInfoAge);

      screen.innerHTML = "";
      screen.appendChild(userInfo2);
      screen.appendChild(userInfo);
    }
    printPerson();

    function addToLikes(e) {
      e.preventDefault();
      likedProfiles.push(fetchedProfiles[0]);
      localStorage.setItem("liked", JSON.stringify(likedProfiles));
      counter++;
      fetchedProfiles.shift();
      localStorage.setItem("person", JSON.stringify(fetchedProfiles));
      printPerson();
      console.log(fetchedProfiles);
      if (fetchedProfiles.length <= 1) {
        localStorage.removeItem('person');
        location.reload();
      }
      console.log(likedProfiles);
    }

    function addToSkips(e) {
      e.preventDefault();
      skippedProfiles.push(fetchedProfiles[0]);
      localStorage.setItem("skipped", JSON.stringify(skippedProfiles));
      counter++;
      fetchedProfiles.shift();
      localStorage.setItem("person", JSON.stringify(fetchedProfiles));
      printPerson();
      console.log(fetchedProfiles);
      if (fetchedProfiles.length <= 1) {
        localStorage.removeItem('person');
        location.reload();
      }
      console.log(skippedProfiles);
    }
    like.addEventListener("click", addToLikes);
    skip.addEventListener("click", addToSkips);
  });
}
let divList = document.createElement('div');
menu.addEventListener('click', function(e){
  e.preventDefault();
  let profileOverview = document.getElementById('profileOverview');
  divList.innerHTML = ''; 

  for(let i = 0; i < likedProfiles.length; i++){
    divList.classList.add('divlist');
    let listChilds = document.createElement('a');
    divList.appendChild(listChilds); 
    profileOverview.appendChild(divList);  
    listChilds.innerHTML = JSON.stringify(likedProfiles[i].name + ' - Age: ' + likedProfiles[i].age).slice(1,-1);
    profileOverview.style.display = 'block';
  }

  for(let i = 0; i < skippedProfiles.length; i++){
    divList.classList.add('divlist');
    let listChilds = document.createElement('a');
    divList.appendChild(listChilds); 
    profileOverview.appendChild(divList); 
    listChilds.innerHTML = JSON.stringify(skippedProfiles[i].name + ' - Age: ' + skippedProfiles[i].age).slice(1,-1);
    profileOverview.style.display = 'block';
  }
})

let close = document.getElementById('closeIt');
close.addEventListener('click', function(){
  profileOverview.style.display = 'none';
})
loadMoreProfiles();

if ("geolocation" in navigator) {
  console.log('Feest');
} else {
  console.log('Not supported');
}


