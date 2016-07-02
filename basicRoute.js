'use strict';
const http = require('http');
const url = require('url');
const qs = require('querystring');


http.createServer(router).listen(3000, function(){
	console.log('port 3000');
});

let routes = {
	'GET':{
		'/': function(request, response){
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end("<h1>Hello Router</h1>");
		},

		'/about': function(request, response){
					response.writeHead(200, {"Content-Type": "text/html"});
					response.end('<h1>This is a about page</h1>');
		},

		'/api/getinfo': function(request, response){
							response.writeHead(200, {"Content-Type": "text/html"});
							response.end(JSON.stringify(request.queryParams));
		}
	},

	'POST':{
		'/api/login': function(request, response){
			let body = '';
			request.on('data', function(data){
				body += data;
				if(body.length > 209715) {
					response.writeHead(413, {'Content-Type': 'text/html'});
					response.end('<h3>The file being uploaded exceeds 2MB limit</h3>', function(){
						request.connection.destroy();
					});
				}
			});

			request.on('end', function(){
				let params = qs.parse(body);
				console.log('username:', params['username']);
				console.log('password:', params['password']);
				//Query a data base about whether if the user exists


			});
		}
	},

	'NA': function(request, response){
		response.writeHead(404);
		response.end('Content not found');
	}
};

function router(request, response){
	let baseURL = url.parse(request.url, true); 
	let resolveRoute = routes[request.method][baseURL.pathname];
	if(resolveRoute != undefined){
		request.queryParams = baseURL.query;
		resolveRoute(request, response);
	}
	else{
		routes['NA'](request, response);
	}
}

