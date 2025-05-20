const http = require('http')

const fs = require('fs')

const index = fs.readFileSync('index.html', 'utf-8')

const add = fs.readFileSync('add.html', 'utf-8')

const data = fs.readFileSync('data.json', 'utf-8')

http.createServer(function (req, res) {
	res.writeHead(200, { "Content-type": "text/html" })

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
                            <a href="">edit</a>
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
			res.end(add)
			break;
		default:
			res.end('404 error')
	}

}).listen(3000);