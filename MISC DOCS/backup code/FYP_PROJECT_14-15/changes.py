from flask import Flask, render_template, request
import json
from operator import itemgetter
import numpy as np
from collections import Counter
import pandas as pd

try:
    from urllib.request import Request, urlopen  # Python 3
except ImportError:
    from urllib2 import Request, urlopen  # Python 2

app = Flask(__name__)

@app.route("/")
def main():
    return render_template('Home.html')

@app.route('/showcharge')
def showCharge():
    return render_template('index2.html')

@app.route('/showmap')
def showMap():
    return render_template('index3.html')

@app.route('/showgt')
def showGT():
    return render_template('old gt.html')

@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')

@app.route('/showfuel')
def showfuel():
    return render_template('my.html')

@app.route('/comparision')
def showComparision():
    return render_template('index4.html')

def find_freqent(data,feature,to_match,res):
    a=[]
    keys=[]
    values=[]
    dic={}
    dic_send={"keys":[],"values":[]}
    for f in data["acList"]:
        if f[feature]==to_match:
            a.append(f[res])
    x=Counter(a)
    for key, value in x.items():
         keys.append(key)
         values.append(value)
    dic={"keys":keys,"values":values}
    
    y=np.argsort(dic["values"])[-15:]

    for i in y:
        dic_send["keys"].append(dic["keys"][i])
        dic_send["values"].append(dic["values"][i])    
    
    return dic_send

def find_avg_mile(data,airline):
    mile=0
    count=0
    for f in data["acList"]:
        if f["Op"]==airline:
            mile=mile+(f["Miles"])
            count=count+1
    x=mile/count
    return x


def file_open():
    with open("2018-01-17-D3.json",'r') as file:
        data=json.loads(file.read())
    file.close()
    return data

@app.route("/flights",methods=['POST'])
def find_to_from():
    data=file_open()
    print("Done")
    return json.dumps(data["acList"])


@app.route('/airline_wise',methods= ['POST'])
def airline_wise_method():
    seats=pd.read_csv('models.csv')
    models=list(seats["Models"])
    m_seats=list(seats["Seats"])
    data=file_open()
    mdls=[]
    data_store={"acList":[],"freq_dest":{},"freq_mdl":{},"freq_source":{},"data":[],"id":[]}
    airline = request.form.get('airline')
    print(airline)
    for i in data["acList"]:
        i["PassFuel"]=0;
        trace={"x":[],"y":[],"type":"bar","text":[]}
        if i["Op"]==airline:
            if i["Mdl"] in models:
                m_index= models.index(i["Mdl"])
                model_seat=m_seats[m_index]
                i["PassFuel"]=(i["Miles"]*5)/model_seat
            i["spd"]=0
            spd=0
            alt=0
            count=0
            for j in range(3,len(i["LatLongAltSpd"]),4):
                spd=spd+i["LatLongAltSpd"][j]
                alt=alt+i["LatLongAltSpd"][j-1]
                count=count+1
            i["avg_spd"]= spd/count
            i["avg_alt"]=alt/count
            data_store["acList"].append(i)
            trace["x"].append(i["Mdl"])
            trace["y"].append(i["Miles"]*5)
            show="ID: "+str(i["Id"])
            trace["text"].append(show)
            data_store["data"].append(trace)
            data_store["id"].append(i["Id"])
            mdls.append(i["Mdl"])

    data_store["freq_dest"]=find_freqent(data,"Op",airline,"To")
    data_store["freq_source"]=find_freqent(data,"Op",airline,"From")
    data_store["freq_mdl"]=find_freqent(data,"Op",airline,"Mdl")
    data_store["acList"] = sorted(data_store["acList"], key=itemgetter("Op")) 
    return json.dumps(data_store)

@app.route('/source_wise',methods= ['POST'])
def source_wise_method():
    seats=pd.read_csv('models.csv')
    models=list(seats["Models"])
    m_seats=list(seats["Seats"])
    
    data=file_open()
    data_store={"acList":[],"freq_dest":{},"freq_airline":{},"freq_model":{},"data":[],"mdl":[]}
    source = request.form.get('airline')
    
    for i in data["acList"]:
        i["PassFuel"]=0;
        trace={"x":[],"y":[],"type":"bar","text":[]}
        if i["From"]==source:
            if i["Mdl"] in models:
                m_index= models.index(i["Mdl"])
                model_seat=m_seats[m_index]
                i["PassFuel"]=(i["Miles"]*5)/model_seat
            i["spd"]=0
            spd=0
            alt=0
            count=0
            for j in range(3,len(i["LatLongAltSpd"]),4):
                spd=spd+i["LatLongAltSpd"][j]
                alt=alt+i["LatLongAltSpd"][j-1]
                count=count+1
            i["avg_spd"]= spd/count
            i["avg_alt"]=alt/count
            data_store["acList"].append(i)
            trace["x"].append(i["Op"])
            trace["y"].append(i["Miles"]*5)
            show="MODEL: "+str(i["Mdl"]) + " ID: "+str(i["Id"])
            trace["text"].append(show)
            data_store["data"].append(trace)
            data_store["mdl"].append(i["Mdl"])
    data_store["freq_dest"]=find_freqent(data,"From",source,"To")
    data_store["freq_airline"]=find_freqent(data,"From",source,"Op")
    data_store["freq_model"]=find_freqent(data,"From",source,"Mdl")
    data_store["acList"] = sorted(data_store["acList"], key=itemgetter("Op")) 
    return json.dumps(data_store)


@app.route('/destination_wise',methods= ['POST'])
def dest_wise_method():
    seats=pd.read_csv('models.csv')
    models=list(seats["Models"])
    m_seats=list(seats["Seats"])
    
    data=file_open()
    data_store={"acList":[],"freq_source":{},"freq_airline":{},"freq_model":{},"data":[],"mdl":[]}
    dest = request.form.get('airline')

    for i in data["acList"]:
        i["PassFuel"]=0;
        trace={"x":[],"y":[],"type":"bar","text":[]}
        if i["To"]==dest:
            if i["Mdl"] in models:
                m_index= models.index(i["Mdl"])
                model_seat=m_seats[m_index]
                i["PassFuel"]=(i["Miles"]*5)/model_seat
            i["spd"]=0
            spd=0
            alt=0
            count=0
            for j in range(3,len(i["LatLongAltSpd"]),4):
                spd=spd+i["LatLongAltSpd"][j]
                alt=alt+i["LatLongAltSpd"][j-1]
                count=count+1
            i["avg_spd"]= spd/count
            i["avg_alt"]=alt/count
            data_store["acList"].append(i)
            trace["x"].append(i["Op"])
            trace["y"].append(i["Miles"]*5)
            show="MODEL: "+str(i["Mdl"]) + " ID: "+str(i["Id"])
            trace["text"].append(show)
            data_store["data"].append(trace)
            data_store["mdl"].append(i["Mdl"])
    print(data_store["data"])
    data_store["freq_source"]=find_freqent(data,"To",dest,"From")
    data_store["freq_airline"]=find_freqent(data,"To",dest,"Op")
    data_store["freq_model"]=find_freqent(data,"To",dest,"Mdl")
    data_store["acList"] = sorted(data_store["acList"], key=itemgetter("Op"))
    return json.dumps(data_store)

@app.route('/speed_wise',methods= ['POST'])
def speed_wise_method():
    seats=pd.read_csv('models.csv')
    models=list(seats["Models"])
    m_seats=list(seats["Seats"])
    
    data=file_open()
    data_store={"acList":[],"data":[],"mdl":[]}
    spd_low = float(request.form.get('low'))
    spd_high = float(request.form.get('high'))

    for i in data["acList"]:
        i["PassFuel"]=0;
        trace={"x":[],"y":[],"type":"bar","text":[]}
        
        i["spd"]=0
        spd=0
        alt=0
        count=0
        for j in range(3,len(i["LatLongAltSpd"]),4):
            spd=spd+i["LatLongAltSpd"][j]
            alt=alt+i["LatLongAltSpd"][j-1]
            count=count+1
        i["avg_spd"]= spd/count
        i["avg_alt"]=alt/count
        if i["avg_spd"]>=spd_low and i["avg_spd"]<=spd_high:
            if i["Mdl"] in models:
                m_index= models.index(i["Mdl"])
                model_seat=m_seats[m_index]
                i["PassFuel"]=(i["Miles"]*5)/model_seat
            data_store["acList"].append(i)
            trace["x"].append(i["Op"])
            trace["y"].append(i["avg_spd"])
            show="MODEL: "+str(i["Mdl"]) + " ID: "+str(i["Id"])
            trace["text"].append(show)
            data_store["data"].append(trace)
            data_store["mdl"].append(i["Mdl"])
    print(data_store["data"])
    data_store["acList"] = sorted(data_store["acList"], key=itemgetter("Op"))
    return json.dumps(data_store)

@app.route('/Compare',methods= ['POST'])
def comparision():
    src = request.form.get('source')
    dst = request.form.get('destination')
    airline1 = request.form.get('airline1')
    airline2 = request.form.get('airline2')
#    mdl1 = request.form.get('model1')
#    mdl2 = request.form.get('model2')


    data= file_open()
    data_store={"acList1":[],"acList2":[],"data":[]}

    for flight in data["acList"]:
        trace={"x":[],"y":[],"type":"bar","text":[]}
        d={}
        talt=0
        tspd=0
        alt=[]
        spd=[]
        count=0
        if flight["From"]==src and flight["To"]==dst:
            if flight["Op"]==airline1:
                trace["x"].append(flight["Op"])
                trace["y"].append(flight["Miles"]*5)
                show="MODEL: "+str(flight["Mdl"]) + " ID: "+str(flight["Id"])
                trace["text"].append(show)
                data_store["data"].append(trace)
                d["Id"]=flight["Id"]
                d["Op"]=flight["Op"]
                d["Miles"]=round(flight["Miles"],3)
                d["Icao"]=flight["Icao"]
                d["BwCountries"]=flight["BwCountries"]
                d["Cou"]=flight["Cou"]
                d["Mdl"]=flight["Mdl"]
                for i in range(2,len(flight["LatLongAltSpd"]),4):
                    talt=talt+flight["LatLongAltSpd"][i]
                    if flight["LatLongAltSpd"][i]>0:
                        alt.append(flight["LatLongAltSpd"][i])
                    tspd=tspd+flight["LatLongAltSpd"][i+1]
                    if flight["LatLongAltSpd"][i+1]>0:
                        spd.append(flight["LatLongAltSpd"][i+1])
                    count=count+1
                d["AvgAlt"]=round(talt/count,3)
                d["AvgSpd"]=round(tspd/count,3)
                d["Alt"]=alt
                d["Spd"]=spd
                data_store["acList1"].append(d)
        
            if flight["Op"]==airline2:
                trace["x"].append(flight["Op"])
                trace["y"].append(flight["Miles"]*5)
                show="MODEL: "+str(flight["Mdl"]) + " ID: "+str(flight["Id"])
                trace["text"].append(show)
                data_store["data"].append(trace)
                d["Id"]=flight["Id"]
                d["Op"]=flight["Op"]
                d["Icao"]=flight["Icao"]
                d["Miles"]=round(flight["Miles"],3)
                d["BwCountries"]=flight["BwCountries"]
                d["Cou"]=flight["Cou"]
                d["Mdl"]=flight["Mdl"]
                for i in range(2,len(flight["LatLongAltSpd"]),4):
                    talt=talt+flight["LatLongAltSpd"][i]
                    if flight["LatLongAltSpd"][i]>0:
                        alt.append(flight["LatLongAltSpd"][i])
                    tspd=tspd+flight["LatLongAltSpd"][i+1]
                    if flight["LatLongAltSpd"][i+1]>0:
                        spd.append(flight["LatLongAltSpd"][i+1])
                    count=count+1
                d["AvgAlt"]=round(talt/count,3)
                d["AvgSpd"]=round(tspd/count,3)
                d["Alt"]=alt
                d["Spd"]=spd
                data_store["acList2"].append(d)  
                
    first_list = sorted(data_store["acList1"], key=itemgetter('Miles'))
    second_list = sorted(data_store["acList2"], key=itemgetter('Miles'))
    data_send={"acList1":"","acList2":"","data":""}
    data_send["acList1"]=first_list
    data_send["acList2"]=second_list
    data_send["data"]=data_store["data"]
    print(data_send)                
    return json.dumps(data_send)

@app.route('/Fuel',methods= ['POST'])
def Fuels():
    print("Hello")
    data_store={}
    miles=0
    latlong=[]
    count=0
    _To = request.form['To']
    _From = request.form['From']
#    _Airline = request.form['Airline']
    
    
    data1=file_open()
    
    for flight in data1["acList"]:
#        if not _Airline:
            if flight["To"]== _To and flight["From"]== _From:
                miles=miles+flight["Miles"]
                count=count+1
                latlong.appned(flight["LatLongAltSpd"])
#        else:        
#            if flight["To"]== _To and flight["From"]== _From and flight["Op"]== _Airline:
#                miles=miles+flight["Miles"]
#                count=count+1
#                latlong.append(flight["LatLongAltSpd"])
    result=(miles/count)*5 
    
    data_store["result"]=result
    data_store["latlong"]=latlong 
    print(data_store)
    
    return json.dumps(data_store)

@app.route('/receiver', methods = ['POST'])
def worker():
	# read json + reply
    data = int(request.form.get('Id'))
    data_store={}
    count=0
    print("in request")
    print(data)
    q = Request('https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json')
    q.add_header('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11')
    a = urlopen(q).read() 
    json_file = json.loads(a)   
    for flight in json_file["acList"]:
        iD=flight["Id"]
        if iD==data:
            data_store=flight
            count=count+1
        if count==1:
            break
    print(str(data_store))
    return json.dumps(data_store)

@app.route('/charge_result',methods= ['POST'])
def charge_calc():
    with open("2018-01-17-D3.json",'r') as file:
        data=json.loads(file.read())
    file.close()
    
    x=pd.read_csv('weights.csv')
    
    dic={"acList":[]}
    
    for i in data["acList"]:
        if x[x["Model"]==i["Mdl"]].index.values!=-1:
            p=int(x[(x['Model'])==i["Mdl"]].index.values)
            mtow=x["MTOW (kg)"][p]
            s = ''.join(c for c in mtow if c.isnumeric())
            mtow=int(s)
            charge=14.25*int(i["Miles"])
            i["Charge"]=charge
            dic["acList"].append(i)
    return json.dumps(dic)   

@app.route('/fuel_result',methods= ['POST'])
def fuel_res():
    
#    airline = request.form['airline']
    to=request.form['to']
    From=request.form['From']
    
    
#    todate=request.form['to_date']
#    to_date=todate[0]+todate[1]
#    to_date=int(to_date)
#    fromdate=request.form['from_date']
#    from_date=fromdate[0]+fromdate[1]
#    from_date=int(from_date)
#    use this to from date to find data of these dates
    
    data=file_open()
    data_send={"acList":[],"data":[]}
    tmiles=0
    tfuel=0
    for x in data["acList"]:
        trace={"x":[],"y":[],"type":"bar","text":[]}
        data_store={}
        spd=0
        alt=0
        count=0
        if x["To"]==to and x["From"]==From:
            trace["x"].append(x["Op"])
            trace["y"].append(x["Miles"]*5)
            show="MODEL: "+str(x["Mdl"]) + " ID: "+str(x["Id"])
            trace["text"].append(show)
            data_send["data"].append(trace)
            
            data_store["Id"]=x["Id"]
            data_store["Icao"]=x["Icao"]
            data_store["Mdl"]=x["Mdl"]
            data_store["Cou"]=x["Cou"]
            data_store["Op"]=x["Op"]
            data_store["Miles"]=x["Miles"]
            data_store["LatLongAltSpd"]=x["LatLongAltSpd"]
            tmiles=tmiles+x["Miles"]
            data_store["Fuel"]=x["Miles"]*5
            tfuel=tfuel+data_store["Fuel"]
            data_store["BwCountries"]=x["BwCountries"]
            for sped in range(3,len(x["LatLongAltSpd"]),4):
                spd=spd+(x["LatLongAltSpd"][sped])
                alt=alt+x["LatLongAltSpd"][sped-1]
                count=count+1
            data_store["Spd"]=spd/count
            data_store["Alt"]=alt/count
            data_send["acList"].append(data_store)
    data_store["TMiles"]=tmiles
    data_store["TFuel"]=tfuel
    data_send["acList"].append(data_store)
    print(data_send)
    return json.dumps(data_send)


if __name__ == "__main__":
    app.run()