import json

data = {
    'wei_li':{
        'orderid1': 'true',
        'orderid2': 'true',
    },
    'kevin':{
        'orderid5': 'true',
    },
    'kian_seong':{
        'orderid3': 'true',
    },'an_ciat':{
        'orderid4': 'true',
    }
}

with open('orderid.txt', 'w') as outfile:  
    json.dump(data, outfile)
    
