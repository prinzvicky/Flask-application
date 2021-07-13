function changeBg()
{
	var navbar= document.getElementById("navbar");
	var elt = document.getElementById("elt"); 
	var scrollbar= window.scrollY;
	if (scrollbar < 80){
		navbar.classList.remove("bgcolor");
		elt.classList.remove("alignment");
	}
	else{
		navbar.classList.add("bgcolor")
		elt.classList.add("alignment");
	}
}
async function getData(lati, long){
	console.log("hi");
	let div_icon = document.querySelector(".weather-icon");

	let climate = document.querySelector("#climate-value");
	let place = document.querySelector("#place-value");
	let current_temperature = document.querySelector("#curtemp-value");

	let humidity = document.querySelector("#humidity-value");
	let pressure = document.querySelector("#pressure-value");
	let feelslike = document.querySelector("#feelslike-value");
	let windspeed = document.querySelector("#windspeed-value");
	
	let elt_one = document.querySelector(".bottom-one");
	let elt_two = document.querySelector(".bottom-two");
	let elt_three = document.querySelector(".bottom-three");
	let elt_four = document.querySelector(".bottom-four");
	let elt_five = document.querySelector(".bottom-five");
	let elt_six = document.querySelector(".bottom-six");
	let elt_seven = document.querySelector(".bottom-seven");
	
	const arr = [elt_one, elt_two, elt_three, elt_four, elt_five, elt_six, elt_seven];
	
	let lat;
	let lon;
	if (arguments.length === 2){
		lat = lati;
		lon = long;
	}
	else{
		let locate = document.querySelector("#location-input");
		let location = locate.value;
		if (location === "")
			return;
		else{

			locate.value = "";
			const pos_url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=fa73f6b7c934d6144d5afc2d579a527c`;
			let loc_data;
			try{
				const loc = await fetch(pos_url);
				loc_data = await loc.json();
			}
			catch(err){
				console.error(err);
			}
			lat = loc_data["0"]["lat"];
			lon = loc_data["0"]["lon"];
			console.log(loc_data);
			console.log(lat);
			console.log(lon);
		}
	}
	const cur_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=fa73f6b7c934d6144d5afc2d579a527c`;
	const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=8&appid=fa73f6b7c934d6144d5afc2d579a527c`
	
	try{
		const cur_res = await fetch(cur_url);
		const cur_data = await cur_res.json();
		
		const res = await fetch(url);
		const data = await res.json();

		let c = cur_data["weather"][0]["main"];
		let pl = cur_data["name"];
		let ct = cur_data["main"]["temp"];
		
		let icon = cur_data["weather"][0]["icon"];
		let h = cur_data["main"]["humidity"] + "%";
		let p = cur_data["main"]["pressure"] + " hPa";
		let f = cur_data["main"]["feels_like"];
		let w= cur_data["wind"]["speed"] + " m/s";
			
		climate.innerText = c; 
		place.innerText = pl;
		current_temperature.innerHTML = `<h2>${ct}<span>&#8451;</span></h2>`;
		
		div_icon.innerHTML	= `<img src="/static/styles/icons/${icon}.png">`;
		humidity.innerText = h;
		pressure.innerText = p;
		feelslike.innerHTML = `${f}<span> &#8451;</span>`;
		windspeed.innerText = w;

		console.log(data);
		console.log(cur_data);
		for (let i=0; i<arr.length; i++){
			let temperature = data["list"][i]["main"]["temp"];
			let time = data["list"][i]["dt_txt"].split(" ")[1].split(":")[0];
			let feel = data["list"][i]["main"]["feels_like"];

			if (time > 12){
				time -= 12;
				time = "0" + time;
				time += " PM";
			}
			else if (time === "00"){
				time = "12 AM"
			}
			else{
				time += " AM";
			}
			arr[i].innerHTML = `<p>${time}<br></p><h1>${temperature}<span>&#8451;</span></h1><p class = "inv">Feels like ${feel}<span>&#8451;</span></p>`;
		}
	}
	catch(error){
		console.log(error);
	}
}
function successDisplay(){
		let bg = document.querySelector(".background");
		let success = document.querySelector(".popup");
		let register;
		try{
			register = document.querySelector(".content-section-register");
			register.style.opacity = 0.5;

		}catch(err){
			register = document.querySelector(".content-section");
			register.style.opacity = 0.5;
		}
		let overlay = document.querySelector("#overlayer");
		let nav = document.querySelector(".navigation-bar");
		let footer = document.querySelector("#foot");
		document.onkeydown = ()=>{
  			return false;
 		}
		overlay.classList.add("overlay-register");
		overlay.style.zIndex = 99; 

		nav.style.opacity = 0.5;

		footer.style.opacity = 0.7;
		footer.style.pointerEvents = "none";
		
		success.style.pointerEvents = "auto";
		success.style.opacity = 1;
		success.style.zIndex = 100;

		bg.style.pointerEvents = "none";
		bg.style.overflow = "hidden";
}
if (window.location.href === "http://localhost:5000/weather"){
	if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition((position)=>{
    		const lat = position.coords.latitude;
    		const long = position.coords.longitude;
    		console.log("hello");
    		getData(lat, long);
    	});
  	}
  	else{
  		console.log("hii");
  	} 
}
try{
	let flashed = flash;
	if (flashed == true){
	successDisplay();
	flashed = false;
}	
}
catch(err){}
try{
	const ok_button = document.querySelector("#ok");
	ok_button.addEventListener("click", ()=>{
	bg = document.querySelector(".background");
	success = document.querySelector(".popup");
	try{
		register = document.querySelector(".content-section-register");
		register.style.opacity = 1;
	}catch(err){
		register = document.querySelector(".content-section");
		register.style.opacity = 1;
	}
	overlay = document.querySelector("#overlayer");
	nav = document.querySelector(".navigation-bar");
	footer = document.querySelector("#foot");
	document.onkeydown = ()=>{
			return true;
	}
	overlay.classList.remove("overlay-register");
	overlay.style.zIndex = -1; 
	bg.style.pointerEvents = "auto";

	footer.style.opacity = 1;
	bg.style.pointerEvents = "auto";
	
	nav.style.opacity = 1;
	
	success.style.opacity = 0;
	success.style.zIndex = -1;
});	
} catch(err){
	console.log(err);
}
// farmer data
async function getData(){
	try{
		let v = await fetch("http://localhost:5000/farmer/get", {
			method:"GET",
			cache: "no-cache",
			headers: new Headers({
				"content-type":"application/json"
			})
		});
		const d = await v.json();
		console.log(d)
		const table = document.querySelector(".table-data");
		table.innerHTML = "";
		let th;
		let tr;
		let td;
		let edit_image;
		let delete_image;
		const headers = ["crop name", "crop type", "date sown", "disease", "fertilizers", "options"]
		tr = document.createElement("tr");
		for (let i=0; i<headers.length; i++){
			th = document.createElement("th");
			if (headers[i] === "options"){
				console.log(headers[i]);
				th.colSpan = "2";
			}
			th.innerText = headers[i]; 
			tr.append(th);
		}
		table.append(tr);
		for (let i in d){
			tr = document.createElement("tr");
			tr.setAttribute("id", "row-".concat(d[i]["crop_id"]));
			for (let j in d[i]){
				if (j !== "crop_id" && j !== "farmer_id"){
					td = document.createElement("td");
					td.innerText = d[i][j]
					tr.appendChild(td)
				}
			}
			edit_image = document.createElement("img");
			edit_image.src = "/static/img/edit.png" ;
			edit_image.setAttribute("id", "edit");
			delete_image = document.createElement("img");
			delete_image.src = "/static/img/delete.png" ;
			delete_image.setAttribute("id", "delete");
			td = document.createElement("td");
			td.append(edit_image);
			tr.append(td);
			td = document.createElement("td");
			td.append(delete_image);
			tr.append(td);
			table.appendChild(tr);
		}

	}catch(err){console.log(err);}
}
async function postData(data){
	try{
			await fetch("http://localhost:5000/farmer/post", {
			method:"POST",
			body: JSON.stringify(data),
			cache: "no-cache",
			headers: new Headers({
				"content-type":"application/json"
			})
		});
	}catch(err){console.log(err)}
}
document.addEventListener("click", e=>{
	if (e.target.matches("img")){
		if (e.target.id === "edit"){
			console.log("edit");
		}
		else{
			const remove = e.target.parentNode.parentNode;
			postData({"id":remove.id});
			remove.remove();
		}
	}
});
if (window.location.href === "http://localhost:5000/farmer"){
	getData();
}
try{
	const tables = document.querySelector(".table-data");
	const form = document.querySelector(".form-content");
	const add_button = document.querySelector("#add_button");
	add_button.addEventListener("click", ()=>{
		form.style.display = "block";
		tables.style.display = "none";
	});
}
catch(err){
	console.log(err);
}
//farmer data end

if (window.location.href === "http://localhost:5000/login"){
	if ( window.history.replaceState ) {
  		window.history.replaceState( null, null, window.location.href );
	}
}
window.addEventListener('scroll', changeBg);
try{
	let button = document.querySelector("#submiter");
button.addEventListener("click", () => {
	getData();
});
}
catch(err){}