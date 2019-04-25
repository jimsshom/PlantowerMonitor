#!/usr/bin/env python
import web
import getInfo

urls = (
    '/get_plantower_data', 'getData'
)

class getData:
    def GET(self):
        datas = getInfo.get_plantower_data()
        return '|'.join(map(lambda x:str(x), datas))

if __name__ == "__main__": 
    app = web.application(urls, globals())
    app.run()