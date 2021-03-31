//****************************** UNIQUE FUNCTION FOR SELECTING UNIQUE VALUES ***************************//

		      Array.prototype.unique = function() {
		        return this.filter(function (value, index, self) { 
		          return self.indexOf(value) === index;
		        });
		      }

     //****************************** TO/FROM/AIRLINE ***************************//

              function find(id,arr)
              {
	              var sel = document.getElementById(id);
	              arr=arr.unique();
	              for(var i = 0; i < arr.length; i++) 
	              {
	                  var opt = document.createElement('OPTION');
	                  txt = document.createTextNode(arr[i]);
	                  opt.appendChild(txt);
	                  opt.setAttribute("value",arr[i]);
	                  id.insertBefore(opt,id.lastChild);
	              }
         		}		

     //****************************** GLOBAL VARIABLE ***************************//

		      var res;
		      var map;

     //****************************** MAP INITIALIZATION ***************************//

		        function initMap() 
			    {
				    map = new google.maps.Map(document.getElementById('map'), {
					zoom: 3,
					center: {lat: 0, lng: -180}
					});
				}

	 //****************************** PAGE INITIALIZATION ***************************//
		

      $(document).ready(function(){

      	

     //****************************** SETTING DROPDOWN VALUES ***************************//

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:5000/flights",
            success: function(response)
            {

     //****************************** FINDING from TO FILL SOURCE DROPDOWN ***************************//

              var from=[];

              res= JSON.parse(response);
              length=res.length;
              for (var i=0; i<length;i++)
                from.push(res[i]["From"]);

              find(sourcef,from)
  
     //****************************** DESTINATION AND AIRLINE DROPDOWN INITIALLY DISABLED ***************************//

               document.getElementById("destinationf").disabled=true;
               document.getElementById("airlinef").disabled=true;

     //****************************** WHEN SOURCE IS SELECTED ***************************//

               document.getElementById("sourcef").onchange=function()
               {
     //****************************** GETTING SELECTED VALUE FROM SOURCE DROPDOWN ***************************//

			 		var from_chkf=get_dropdown_value("sourcef");

     //****************************** FINDING DESTINATION W.R.T SOURCE ***************************//

     				tof=find_one_chk_dropdown_value(res,"From",from_chk,"To","Select Destination");


     //****************************** SETTING DESTINATION DROPDOWN ***************************//

		            empty_dropdown("destinationf")
               		find(destinationf,tof);

     //****************************** ENABELING DESTINATION DROPDOWN ***************************//

               		document.getElementById("destinationf").disabled=false;

               }

     //****************************** WHEN DESTINATION IS SELECTED ***************************//

                document.getElementById("destinationf").onchange=function()
               {

     //****************************** GETTING SELECTED VALUE FROM SOURCE DROPDOWN ***************************//

               		var from_chkf=get_dropdown_value("sourcef");	

     //****************************** GETTING SELECTED VALUE FROM DESTINATION DROPDOWN ***************************//

			 		var des_chkf=get_dropdown_value("destinationf");

     //****************************** FINDING AIRLINE W.R.T SOURCE AND DESTINATION ***************************//

     				airf=find_two_chk_dropdown_value(res,"From",from_chkf,"To",des_chkf,"Op","Select Airline");

     //****************************** SETTING AIRLINE DROPDOWN ***************************//

		            empty_dropdown("airlinef");
  					find(airlinef,airf);

      //****************************** ENABLING AIRLINE DROPDOWN ***************************//
       					
  					document.getElementById("airlinef").disabled=false;

		        }

      //****************************** WHEN SUBMIT BUTTON IS PRESSED ***************************//

		        document.getElementById("fuel_btn").onclick = function() 
        		{ 
					var data={};

	  //****************************** INITIALIZING MAP ***************************// 

					initMap();
	  
	      //****************************** GETTING VALUES OF SOURCE, DESTINATION AND AIRLINE ***************************//   
	           		
	        		data["airline"]=document.getElementById("airlinef").value;
	        		data["to"]=document.getElementById("destinationf").value;
	        		data["From"]=document.getElementById("sourcef").value;

	      //****************************** SENDING VALUES TO PYTHON TO GET RESPECTIVE RESULT ***************************//  

	        		
	        		$.ajax({
		            type: "POST",
		            url: "http://127.0.0.1:5000/fuel_result",
		            data: data,
		            success: function(response)
		            {

	      //****************************** GETTING RESULT IN res ***************************//

		            	var res= JSON.parse(response);
	              		
	      //****************************** CREATING TABLE ***************************//

				        var table = document.getElementById("flight_details");
				        table.innerHTML="";
				        length=res.length;
				        for(var i=0; i<length-1; i++)
				        {
				        	var row = table.insertRow(i);
				        	var cell0 = row.insertCell(0);
					    	var cell1 = row.insertCell(1);
					    	var cell2 = row.insertCell(2);
					    	var cell3 = row.insertCell(3);
					    	var cell4 = row.insertCell(4);
					    	var cell5 = row.insertCell(5);
					    	var cell6 = row.insertCell(6);
					    	var cell7 = row.insertCell(7);
					    	var cell8 = row.insertCell(8);
					    	cell0.innerHTML = res[i]["Id"];
					    	cell1.innerHTML = res[i]["Icao"];
					    	cell2.innerHTML = res[i]["Mdl"];
					    	cell3.innerHTML = res[i]["Cou"];
					    	cell4.innerHTML = res[i]["Spd"];
					    	cell5.innerHTML = res[i]["Alt"];
					    	cell6.innerHTML = res[i]["Miles"];
					    	cell7.innerHTML = res[i]["Fuel"];
					    	cell8.innerHTML = res[i]["BwCountries"];
				        }

	      //****************************** SHOWING RESULT IN PARAGRAPH ***************************//

				        para=document.getElementById("fuel_details");
				        para.innerHTML="Total Fuel is: " + res[res.length-1]["TFuel"] + " Total Miles is: " + res[res.length-1]["TMiles"];

	      //****************************** FINDING LAT, LONG FOR SHOWING PATH ON MAP ***************************//

						for (var i=0; i<res.length-1; i++)
						{	
							var coordinates=[];
							for(var j=0; j< res[i]["LatLongAltSpd"].length; j=j+4)
							{	
								var name={"lat": "", "lng": ""};
								var lat=res[i]["LatLongAltSpd"][j];
								var long=res[i]["LatLongAltSpd"][j+1];
								name["lat"]=lat;
								name["lng"]=long;
								coordinates.push(name);
							}

	      //****************************** CREATING PATH ON MAP ***************************//
	      						google.maps.event.trigger(map, 'resize');


									wavepoint(coordinates,map,i);
								
						}	//for loop

	      //****************************** CREATING DONUT CHART ***************************//	
	      					
				        plot_donut(res); 
				    }	//success
					});		//ajax req
        		}	//fuel btn
			}	//success of document.ready        
        })	//ajax of doc.ready
    });		//doc.ready


	      //****************************** MAP DRAWING FUNCTION ***************************//	

	function wavepoint(flightPlanCoordinates,map,color)
	{ 

	      //****************************** SELECTING COLOUR OF PATHS'S LINE ***************************//	

		if (color==0)
			colour="red";
		else
			colour="blue";

	      //****************************** LINE'S PROPERTIES ***************************//	

		var flightPath = new google.maps.Polyline({
	          path: flightPlanCoordinates,
	          geodesic: true,
	          strokeColor: colour,
	          strokeOpacity: 1.0,
	          strokeWeight: 2
	        });


	      //****************************** PLACING LINE ON MAP ***************************//	

	      flightPath.setMap(map);
	}

	      //****************************** CREATING DONUT CHART ***************************//	

	function plot_donut(res)
	{

	      //****************************** MAKING ARRAY FOR FUEL AND LEGEND ***************************//	

		var value=[];
		var label=[];
		for (var i=0; i<res.length-1; i++)
		{
			value.push(res[i]["Fuel"]);
			name= "ID: " + res[i]["Id"] +" , MODEL: "+ res[i]["Mdl"]
			label.push(name);
		}	

	      //****************************** SETTING DATA VARIABLE'S PROPERTIES ***************************//	

		var data = 
		[{
			  values: value,
			  labels: label,
			  domain: {
			    x: [0, .48]
			  },
			  name: 'Fuel Consumption',
			  hoverinfo: 'label+percent+name',
			  hole: .4,
			  type: 'pie'
		}];

	      //****************************** SETTING LAYOUT PROPERTIES ***************************//	

		var layout = 
		{
			  title: 'Fuel Consumption Estimation Pie Chart',
			  annotations: [
			    {
			      font: {
			        size: 20
			      },
			      showarrow: false,
			      text: 'Fuel',
			      x: 0.17,
			      y: 0.5
			    }
			  ],
			  height: 800,
			  width: 800
		};

	      //****************************** PLOTTING GRAPH ***************************//	

	Plotly.newPlot('fuel_details', data, layout);

	}