import json

with open('orderid.txt') as json_file:  
    data = json.load(json_file)

#print (data)

name='wei_li'

orderKey = list()
for i in data[name].keys():
    orderKey.append(i)

print(orderKey)
