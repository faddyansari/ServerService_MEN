import json
import pandas as pd

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
        print(charge)
        
        
        
To:  EDDT Berlin-Tegel, Berlin, Germany 
 From:  LOWW Vienna, Austria 
 count:  3
 
 
 To:  EIDW Dublin, Ireland 
 From:  EGLL London Heathrow, United Kingdom 
 count:  4
 
 To:  YSSY Sydney Kingsford Smith, Australia 
 From:  YPAD Adelaide, Australia 
 count:  4
 
 To:  ENGM Oslo Gardermoen, Norway 
 From:  EGLL London Heathrow, United Kingdom 
 count:  3
 
 
 To:  PANC Ted Stevens Anchorage, United States 
 From:  KSEA Seattle Tacoma, United States 
 count:  5
 
 To:  YMML Melbourne, Australia 
 From:  YPAD Adelaide, Australia 
 count:  7
 
 
 To:  EIDW Dublin, Ireland 
 From:  EGLL London Heathrow, United Kingdom 
 count:  4
 
 To:  EDDL Düsseldorf, Germany 
 From:  EGLL London Heathrow, United Kingdom 
 count:  4
 
 To:  EDDM Munich, Germany 
 From:  EGLL London Heathrow, United Kingdom 
 count:  5
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
