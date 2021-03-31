 Array.prototype.unique = function() {
        return this.filter(function (value, index, self) { 
          return self.indexOf(value) === index;
        });
      }

        //******************************TO/FROM/AIRLINE***************************//
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

      
    $(document).ready(function()
    {
      	
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:5000/flights",
            success: function(response)
            {
              var data={}
              var from=[];


              var res= JSON.parse(response);
              length=res.length;
              for (var i=0; i<length;i++)
              {
                from.push(res[i]["From"]); 
              }

              find(source_comp,from);



      document.getElementById("destination_comp").disabled=true;
      document.getElementById("airline1_comp").disabled=true;
      document.getElementById("airline2_comp").disabled=true;
      document.getElementById("src_mdl").disabled=true;
      document.getElementById("dst_mdl").disabled=true;

     //****************************** WHEN SOURCE IS SELECTED ***************************//

               document.getElementById("source_comp").onchange=function()
               {
     //****************************** GETTING SELECTED VALUE FROM SOURCE DROPDOWN ***************************//

     				 var fromf=get_dropdown_value("source_comp");

     //****************************** FINDING DESTINATION W.R.T SOURCE ***************************//

			 		var tof=[];
			 		tof=find_one_chk_dropdown_value(res,"From",fromf,"To","Select Destination");

     //****************************** SETTING DESTINATION DROPDOWN ***************************//

		            empty_dropdown("destination_comp")
               		find(destination_comp,tof);


     //****************************** ENABELING DESTINATION/ SOURCE MODEL DROPDOWN ***************************//

               		document.getElementById("destination_comp").disabled=false;

               }


                   //****************************** WHEN DESTINATION IS SELECTED ***************************//

                document.getElementById("destination_comp").onchange=function()
               {

     //****************************** GETTING SELECTED VALUE FROM SOURCE DROPDOWN ***************************//

               		var airf=[];

               		var from_chk=get_dropdown_value("source_comp");

     //****************************** GETTING SELECTED VALUE FROM DESTINATION DROPDOWN ***************************//

			 		var des_chk= get_dropdown_value("destination_comp");

     //****************************** FINDING AIRLINE W.R.T SOURCE AND DESTINATION ***************************//

     				airf=find_two_chk_dropdown_value(res,"From",from_chk,"To",des_chk,"Op","Select First Airline");

     //****************************** SETTING AIRLINE DROPDOWN ***************************//

		            empty_dropdown("airline1_comp");
  					find(airline1_comp,airf);

  					airff=find_two_chk_dropdown_value(res,"From",from_chk,"To",des_chk,"Op","Select Second Airline");
  					empty_dropdown("airline2_comp");
  					find(airline2_comp,airff);

      //****************************** ENABLING AIRLINE DROPDOWN ***************************//
       					
  					document.getElementById("airline1_comp").disabled=false;
  					document.getElementById("airline2_comp").disabled=false;

		        }
			

	  //****************************** WHEN SOURCE ONE IS SELECTED ***************************//

                document.getElementById("airline1_comp").onchange=function()
               {
               		var model=[];
               		var from_chk=get_dropdown_value("source_comp");
               		var des_chk= get_dropdown_value("destination_comp");
               		var airline= get_dropdown_value("airline1_comp");
               		model=find_three_chk_dropdown_value(res,"Op",airline,"From",from_chk,"To",des_chk,"Mdl","Select Model of First Airline");
               		empty_dropdown("src_mdl");
               		find(src_mdl,model);
               		document.getElementById("src_mdl").disabled=false;
               }

      //****************************** WHEN SOURCE TWO IS SELECTED ***************************//

                document.getElementById("airline2_comp").onchange=function()
               {
               		var model=[];
               		var from_chk=get_dropdown_value("source_comp");
               		var des_chk= get_dropdown_value("destination_comp");
               		var airline= get_dropdown_value("airline2_comp");
               		model=find_three_chk_dropdown_value(res,"Op",airline,"From",from_chk,"To",des_chk,"Mdl","Select Model of Second Airline");
               		empty_dropdown("dst_mdl");
               		find(dst_mdl,model);
               		document.getElementById("dst_mdl").disabled=false;
               }

          }

      });


		document.getElementById("button_comp").onclick=function()
		{
			datas={};
			var src= get_dropdown_value("source_comp");
			var dst= get_dropdown_value("destination_comp");
			var air1= get_dropdown_value("airline1_comp");
			var air2= get_dropdown_value("airline2_comp");
			var mdl1= get_dropdown_value("src_mdl");
			var mdl2= get_dropdown_value("dst_mdl");


			var y = document.getElementsByClassName("heading");
			for (var i = 0; i < y.length; i++) 
			{
			  y[i].style.display = "block";
			}
			
			datas["source"]= src;
			datas[ "destination"]= dst; 
			datas["airline1"]= air1;
			datas["airline2"]= air2;
			datas["model1"]= mdl1;
			datas["model2"]= mdl2;

			$.ajax({
	            type: "POST",
	            url: "http://127.0.0.1:5000/Compare",
	            data: datas,
	            success: function(response)
	            {
	            	var res= JSON.parse(response);
	            	comp_table(res["acList1"],"table_body1");
				    comp_table(res["acList2"],"table_body2"); 
				    time_series_graph(res["acList1"][0]["Spd"]);  
	            }

       		})
		}
	});
 

function time_series_graph(y_data1,y_data2) {
	var x_data = [];
	for(var i=0; i< y_data1.length/2; i++)
	{
		x_data.push(i);
	}
	console.log(x_data);
	var trace1={
	  	type: "scatter",
  		mode: "lines",
	    x: x_data,
    	y: y_data1,
	    line: {color: '#17BECF'}
	  }

	var data = [trace1];  

Plotly.newPlot('time_series', data);
}

function comp_table(res,id)
{
	var table = document.getElementById(id);
	table.innerHTML="";
	length=res.length;
	for(var i=0; i<length; i++)
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
		cell0.innerHTML = res[i]["Id"];
		cell1.innerHTML = res[i]["Icao"];
		cell2.innerHTML = res[i]["Cou"];
		cell3.innerHTML = res[i]["Miles"];
		cell4.innerHTML = res[i]["AvgAlt"];
		cell5.innerHTML = res[i]["AvgSpd"];
		cell5.innerHTML = res[i]["Miles"]*5;
		cell7.innerHTML = res[i]["BwCountries"];
	}
}

function get_dropdown_value(name) 
{
	var res = document.getElementById(name);
	var result=res.options[res.selectedIndex].value;	
	return result
}

function find_two_chk_dropdown_value(data,chk1,value1,chk2,value2,find,first_value)
{	
	var res=[];
	res.push(first_value);
	for (var i=0; i<data.length;i++)
	{
		if(data[i][chk1]==value1 && data[i][chk2]==value2)
		    res.push(data[i][find]);
	}
	return res
}

function find_three_chk_dropdown_value(data,chk1,value1,chk2,value2,chk3,value3,find,first_value)
{	
	var res=[];
	res.push(first_value);
	for (var i=0; i<data.length;i++)
	{
		if(data[i][chk1]==value1 && data[i][chk2]==value2 && data[i][chk3]== value3)
		    res.push(data[i][find]);
	}
	return res
}

function find_one_chk_dropdown_value(data,chk1,value1,find,first_value)
{	
	var res=[]
	res.push(first_value);
	for (var i=0; i<data.length;i++)
	{
		if(data[i][chk1]==value1)
		    res.push(data[i][find]);
	}
	return res
}

function empty_dropdown(drp_dwn)
{
	var select = document.getElementById(drp_dwn);
  	select.innerHTML="";
}
