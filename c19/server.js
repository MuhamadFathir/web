const http = require('http')

const fs = require('fs')
const { log } = require('console')

const index = fs.readFileSync('index.html', 'utf-8')

const add = fs.readFileSync('add.html', 'utf-8')

const data = require('../c19/data.json')

const css = fs.readFileSync('style.css', 'utf-8')


const querystring = require('querystring');

http.createServer(function (req, res) {

	console.log(req.method);


	switch (req.url) {
		case '/':
			fs.readFile('data.json', 'utf-8', (err, data) => {
				if (err) return res.end('gagal')

				let html = ''
				const value = JSON.parse(data)

				value.forEach((item, index) => {
					html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.height}</td>
                        <td>${item.weight}</td>
                        <td>${item.birthdate}</td>
                        <td>${item.married}</td>
                        <td>
                            <a href="">update</a>
                            <a href="">delete</a>
                        </td>
                    </tr>
                    
                    `
				});

				let result = index.replace('{table content}', html)
				res.end(result)
			})
			break;
		case '/add':
			if (req.method == 'POST') {
				let body = '';
				req.on('data', chunk => {
					body += chunk.toString(); // Accumulate the request body data
				});
				req.on('end', () => {
					const params = querystring.parse(body)

					const hasil = ({
						name: params.name,
						height: Number(params.height),
						weight: Number(params.weight),
						birthdate: params.birthdate,
						married: params.married === 'true'
					})

					data.push(hasil)
					fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
						res.writeHead(300, { 'location': 'http://localhost:3000/' })
						res.end()
					})


				});
			} else {

				res.end(add)
			}
			break;

		case '/style.css':
			res.writeHead(200, { "Content-Type": "text/css" });
			res.end(css);
			break;

		default:
			res.end('404 error')
	}

}).listen(3000);