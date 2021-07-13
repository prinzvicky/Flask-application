import urllib.request, urllib.parse, urllib.error,json,re

address = "hosur"
api = 42
url = 'http://py4e-data.dr-chuck.net/json?'
para = dict()
para['address'] = address
para['key'] = api
print(urllib.parse.urlencode(para))
url = url + urllib.parse.urlencode(para)
print(url)
uh = urllib.request.urlopen(url)
print("\nGetting Location details from "+url+"...")
data = uh.read()
js = json.loads(data)
lat = js['results'][0]['geometry']['location']['lat']
lng = js['results'][0]['geometry']['location']['lng']
url="http://api.openweathermap.org/data/2.5/onecall?lat="+str(lat)+"&lon="+str(lng)+"&"+"exclude=hourly,daily&appid=e929f7770c27b976b41a23eed64636f5"
print("\nGetting weather details from "+url+"...")
loc=urllib.request.urlopen(url).read()
loc=json.loads(loc)
x0=" Location    : "+address
x1=" Temperature : "+str(int(loc["current"]["temp"])-273)+" Degree Celsius"
x2=" Humidity    : "+str(loc["current"]["humidity"])
x3=" Dew Point   : "+str(loc["current"]["dew_point"])
x4=" Weather     : "+str(loc["current"]["weather"][0]["main"])
x5=" Description : "+str(loc["current"]["weather"][0]["description"])
print(loc)
l=[x0,x1,x2,x3,x4,x5]
print(l)