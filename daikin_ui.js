var request_control_loading = 0;
var timer = 5000; //millisecond

var control_response;
var control_timeout;

function request_control() {
	var target="api.php";
	var request="GET";
	var parameters="uri=/v2.0/device/@sn@/ls2&unit=L1_103";
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			request_control_loading = 0;
			set_loading(0);
			if( xmlhttp.status==200 ){
				var response = JSON.parse(xmlhttp.responseText);
				control_response=response.data[0];
				control_response_handler(response.data[0]);
				control_timeout = setTimeout(request_control, timer);
			}else{
				console.log("Error: control ajax request failed");
				set_alert(1,"<b>Error:</b> control ajax request failed");
			}
		}else{
			//alert(xmlhttp.readyState);
		}
	}
	
	xmlhttp.open(request,target + "?" + parameters ,true);
	xmlhttp.send();
	request_control_loading = 1;
	set_loading(1);
}

function send_control(opts){
	var target="api.php";
	var request="POST";
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			if( xmlhttp.status==200 ){
				var response = JSON.parse(xmlhttp.responseText);
				request_control();
			}else{
				console.log("Error: send control request failed");
			}
		}else{
			//alert(xmlhttp.readyState);
		}
	}
	
	xmlhttp.open(request,target,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(opts);
		
}

function control_response_handler(response){
	reset_wing();
	reset_fan();
	reset_mode();
	
	//target temp
	
	var target_temp = parseInt(response.st);
	
	if(response.mode === "Auto"){	
		if(target_temp <= 18){
			set_target_temp_arrow( 1,true	);		
			set_target_temp_arrow(-1,false);
		}else if( target_temp >= 31 ){
			set_target_temp_arrow( 1,false);
			set_target_temp_arrow(-1,true	);
		}else{
			set_target_temp_arrow( 1,true);
			set_target_temp_arrow(-1,true	);	
		}
	}else if(response.mode === "Cool" || response.mode === "Dry"){
		if(target_temp <= 18){
			set_target_temp_arrow( 1,true	);		
			set_target_temp_arrow(-1,false);
		}else if( target_temp >= 33 ){
			set_target_temp_arrow( 1,false);
			set_target_temp_arrow(-1,true	);
		}else{
			set_target_temp_arrow( 1,true);
			set_target_temp_arrow(-1,true	);	
		}
	}else if(response.mode === "Heat"){
		if(target_temp <= 10){
			set_target_temp_arrow( 1,true	);		
			set_target_temp_arrow(-1,false);
		}else if( target_temp >= 31 ){
			set_target_temp_arrow( 1,false);
			set_target_temp_arrow(-1,true	);
		}else{
			set_target_temp_arrow( 1,true);
			set_target_temp_arrow(-1,true	);	
		}
	}else if(response.mode === "Fan"){
		set_target_temp_arrow( 1,false);		
		set_target_temp_arrow(-1,false);
	}else{
		set_target_temp_arrow( 1,true);
		set_target_temp_arrow(-1,true	);
	}
	
	if(response.mode === "Fan"){
		set_target_temp("~");
	} else {
		set_target_temp(target_temp);
	}
	
	
	set_power((response.onoff === "ON"));
	set_mode(response.mode);

	set_fan(response.fspeed);
	set_home_temp(parseInt(response.rt));
}


//----------ON CLICK FUNCTIONS------------


function mode_onclick(mode){
	if(!control_response) return;
	var parameters;
	var command;
	switch(mode){
		case "Auto":
			command = "auto";
			break;
		case "Dry":
			command = "dry";
			break;
		case "Cool":
			command = "cool";
			break;
		case "Heat":
			command = "heat";
			break;
		case "Fan":
			command = "fan";
			break;
		default:
			console.log("mode_onclick() switch: default case reached");
	}
	parameters="uri=/v1.0/device/@sn@/raw&command=" + command + "&unit=L1_103";
	send_control(parameters);
	update();
}

function power_onclick(){
	if(!control_response) return;
	var parameters;
	if (control_response.onoff == "ON") {
		parameters="uri=/v1.0/device/@sn@/raw&command=off&unit=L1_103";
	} else {
		parameters="uri=/v1.0/device/@sn@/raw&command=on&unit=L1_103";
	}
	send_control(parameters);
	update();
}

function fan_onclick(level){
	if(!control_response) return;
	var parameters;
	parameters="uri=/v1.0/device/@sn@/raw&command=fspeed&unit=L1_103&value=" + level;
	send_control(parameters);
	update();
}

function temp_onclick(inc){
	if(!control_response) return;
	var temp = (parseFloat(control_response.st) + inc).toString();
	var parameters;
	parameters="uri=/v1.0/device/@sn@/raw&command=temp&unit=L1_103&value=" + temp;
	send_control(parameters);
	update();
}


//---------GUI SET FUNCTIONS------------

function set_power(boolean){
	power = document.getElementById("power")
	if(boolean){
		power.innerHTML = " ON";				
		document.getElementById("mode_power").className="btn btn-info";
	}else{
		power.innerHTML = " OFF";
		document.getElementById("mode_power").className="btn btn-default";
	}
}

function reset_mode(){
	var mode_list= document.getElementsByClassName("mode-btn btn-info");
	
	for(var i=0; i<mode_list.length; ++i){
		mode_list[i].className="btn btn-default mode-btn";
	}
}

function set_mode(mode){
	switch(mode){
		case "Auto":
			document.getElementById("mode_auto").className="btn btn-info mode-btn";
			break;
		case "Dry":
			document.getElementById("mode_dehum").className="btn btn-info mode-btn";
			break;
		case "Cool":
			document.getElementById("mode_cooling").className="btn btn-info mode-btn";
			break;
		case "Heat":
			document.getElementById("mode_heating").className="btn btn-info mode-btn";
			break;
		case "Fan":
			document.getElementById("mode_fan").className="btn btn-info mode-btn";
			break;
		default:
			console.log("set_mode() switch: default case reached");
	}
}

function set_home_temp(temp){
	document.getElementById("home_temp").innerHTML=" "+temp+"°C";	
}

function set_outside_temp(temp){
	document.getElementById("outside_temp").innerHTML=" "+temp+"°C";
}

function set_target_temp(temp){
	if(isNaN(temp)){
		show_target_temp(1);
		document.getElementById("target_temp").innerHTML="&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;";
	}else{
		document.getElementById("target_temp").innerHTML=" "+temp+"°C";
		show_target_temp(1);
	}
}

function show_target_temp(boolean){
	var tt_col = document.getElementById("target_temp_col");
	if(boolean){
		tt_col.classList.remove("sr-only");
	}else{
		tt_col.classList.add("sr-only");
	}
}

function set_target_temp_arrow(inc,boolean){
	var arrow_id;
	if(inc == 1) arrow_id = "target_temp_up";
	else if (inc == -1) arrow_id = "target_temp_down";
	else console.log("arrow inc not recognized");
	
	var arrow_node = document.getElementById(arrow_id);
	
	if(boolean)	arrow_node.classList.remove("disabled");
	else arrow_node.classList.add("disabled");
	
}

function set_fan(f_mode){				
	switch(f_mode){
		case "Auto":
			document.getElementById("fan_auto").className="btn btn-info fan-btn";
			break;
		case "Low":
			set_fan_img(1);
			break;
		case "Med":
			set_fan_img(2);
			break;
		case "High":
			set_fan_img(3);
			break;
		
		default:
			console.log("set_fan() switch: default case reached");
	}
}

function set_fan_img(num){
	var temp;
	for(var i=1; i<4; ++i){
		temp = document.getElementById("fan_lvl_" + i.toString());
		if(i <= num){
			temp.src="media/level_"+i.toString()+"_on.svg";
		}else{
			temp.src="media/level_"+i.toString()+"_off.svg";
		}
	}
}

function reset_fan(){
	var fan_list= document.getElementsByClassName("fan-btn");
	for(var i=0; i<fan_list.length; ++i){
		fan_list[i].classList.remove("btn-info");
		fan_list[i].classList.add("btn-default");
	}
	set_fan_img(0);
}

function reset_wing(){
	var wing_list = document.getElementsByClassName("wing-btn");
	for(var i=0; i<wing_list.length; ++i){
		wing_list[i].classList.remove("btn-info");
		wing_list[i].classList.add("btn-default");
	}
}

function set_wing(wing_mode){
	switch(wing_mode){
		case 0:
			reset_wing();
			break;
		case 1:
			var elem = document.getElementById("wing_v");
			elem.classList.remove("btn-default");
			elem.classList.add("btn-info");
			break;
		case 2:
			var elem = document.getElementById("wing_h");
			elem.classList.remove("btn-default");
			elem.classList.add("btn-info");
			break;
		case 3:
			var elem = document.getElementById("wing_b");
			elem.classList.remove("btn-default");
			elem.classList.add("btn-info");
			break;
		default:
			console.log("set_wing() switch: default case reached");
	}
}


function set_loading(boolean){
	var spinner = document.getElementById("spinner");
	if(boolean){
		spinner.classList.remove("sr-only");
	}else{
		spinner.classList.add("sr-only");
	}
}

function set_alert(boolean,mex){
	var alert = document.getElementById("alert");
	if(boolean){
		alert.classList.remove("sr-only")
		alert.className="alert alert-danger";
		alert.lastElementChild.innerHTML=mex;
		
	}else{
		alert.className="alert alert-danger sr-only";
		alert.classList.add("sr-only");
	
	}
}

function update(){
	clearTimeout(control_timeout);
	if( ! request_control_loading )
		request_control();
}

update();
