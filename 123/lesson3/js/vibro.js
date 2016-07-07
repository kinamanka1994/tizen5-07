function singleVibration(){

	navigator.vibrate(2000);	
	
}

function multiVibration(){
	
	navigator.vibrate([1000,2000,2000,1000]);
	
}


function stopVibration(){
	navigator.vibrate(0);
	
}



var adapter = null;
var CHECK_INTERVAL = 200;

(function checkBT() {
	try { if (tizen.bluetooth == undefined)
	{
		alert("не найден адаптер блютуз");
		
	} 
	else 
	{
	adapter = tizen.bluetooth.getDefaultAdapter(); 
	/*windows.setInterval(sliderBT,CHECK_INTERVAL);*/
	} 
	} 
	catch (e){  alert(e); }
	
}());

 
/*(function checkBT() {
try {
    adapter = tizen.bluetooth.getLEAdapter();
    adapter = tizen.bluetooth.getDefaultAdapter(); 
    windows.setInterval(sliderBT,CHECK_INTERVAL);} 
 catch (err) {
    console.log(err.name +": " + err.message);
}});

*/

function sliderBT(){	
	if (adapter.powered){ 
		$("#bluetoothSlider").val("on").slider('refresh');
	} else {
		$("#bluetoothSlider").val("off").slider('refresh');	
	}
}

function OnOffBT(){
	
	if ($("#bluetoothSlider").val()=="on")
		BTpoweron();
	else
		BTpoweroff();
}



/*
function BTpoweroff() {
    // If powered on
    if (adapter.powered) {
         // Initiates power off
         adapter.setPowered(false, function() {
             console.log("Bluetooth powered off successfully.");
         },
         function(e) {
             console.log("Failed to power off Bluetooth: " + e.message);
         });
    }
}*/




function BTpoweroff(){
	
	if (adapter.powered)
	{adapter.setPowered(false,null,null)};
}

function BTpoweron(){
	
	if (!adapter.powered){adapter.setPowered(true,null,null)};
}


