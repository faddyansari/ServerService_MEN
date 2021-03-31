
						var ans;
						
						window.onload = function() {
					  // setup the button click
					  timeDiv=document.getElementById("ans");
					  document.getElementById("Btn").onclick = function() {
						var iD = document.getElementById("Id").value;
						var data_send = {"Id" : iD};
						
						// prompt(data_send["Id"]);
					
						doWork(data_send);
					  };
					}
					
					function doWork(data) {
					  $.ajax({
					  type: "POST",
					  url: "http://127.0.0.1:5000/receiver",
					  data: data,
					  success: function(response){
						var res= JSON.parse(response);
						var speed= res["Spd"];
						var lat= res["Lat"];
						var longi= res["Long"];
						var to= res["To"];
						calculate(speed,lat,longi,to);
						
					  }
					  })
					  // stop link reloading the page
					 event.preventDefault();
					}
					
					
					//calculating distance
					
					function calculate(spd,lati,longi,to)
					{
						//converting speed from knots to m/s
						var speed = spd * 0.5144;
						var x=lati;
						var y=longi;
						myMap();
						
						//finding latitude and longitude of destination
						var geocoder =  new google.maps.Geocoder();
						geocoder.geocode( { 'address': to},    
						function(results, status) 
						{
							if (status == google.maps.GeocoderStatus.OK)
							{
								var a=results[0].geometry.location.lat();
								var b=results[0].geometry.location.lng();
								
								//calculating distance(m) b/w (x,y) and (a,b) using Heversine Formula
								var Radius = 6371e3; 
								var angle1 = (x*Math.PI)/180;
								var angle2 = (a*Math.PI)/180;
								var angle_diff1 = ((a-x)*Math.PI)/180;
								var angle_diff2 = ((b-y)*Math.PI)/180;
								var A = Math.sin(angle_diff1/2) * Math.sin(angle_diff1/2) +
								Math.cos(angle1) * Math.cos(angle2) *
								Math.sin(angle_diff2/2) * Math.sin(angle_diff2/2);
								var c = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1-A));
								distance = Radius * c;
								
								//calculating elapsed time(sec) to reach destination
								var time= distance/speed;
								
								//converting sec in standard format of time hh:mm:ss
								var MHSTime=new Date(time * 1000).toISOString().substr(11, 8)
								
								ans=MHSTime;
								marker(x,y);
								
								
							} 
							  else 
							{
								alert("Something got wrong " + status); 
							}	
							
						});
						
						
					}
					
							
						  function myMap() 
						  {
							var speed= 400.0*0.5144;    //here
							var distance=0;
							var x= 33.2232;           //here
							var y= 43.6793;           //here
							var myLatlng = new google.maps.LatLng(x,y);
							var mapProp= 
							{
							  center:myLatlng,
							  zoom:4
							 };
							var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
						  }
						 
						  
						  
						  function marker(lat,longi)
						  {
							var myLatlng = new google.maps.LatLng(lat,longi);
							
							var mapProp= 
							{
							  center:myLatlng,
							  zoom:7
							 };
							 
							var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
							
							
							var image = 
							{ 
							  url: "http://www.boeing.com/resources/boeingdotcom/commercial/777x/assets/images/hotspots/product-01_960x410-mobile.png", // url -->
							  scaledSize: new google.maps.Size(130, 130), // scaled size -->
							}; 
					
							var marker = new google.maps.Marker 
							({ 
								position: myLatlng,
								map: map, 
								icon: image 
							}); 
							
					
							 var contentString =document.getElementById("content");
							 
							 var infowindow = new google.maps.InfoWindow({content: "Time left: "+ ans });
							 infowindow.open(map, marker);
							 infowindow.close();  
							 infowindow.open(map, marker);
						//	 timeDiv.innerHTML = "Time left: "+ ans ;
							 
						  }