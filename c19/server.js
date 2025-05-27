const http = require('http')

const fs = require('fs')
const { log } = require('console')

const index = fs.readFileSync('index.html', 'utf-8')

const form = fs.readFileSync('form.html', 'utf-8')

const data = require('./data.json')

const url = require('url')

const css = fs.readFileSync('style.css', 'utf-8')


const querystring = require('querystring');

http.createServer(function (req, res) {

	if (req.url == '/') {

		fs.readFile('data.json', 'utf-8', (err, data) => {
			if (err) return res.end('gagal')

			let html = ''
			const value = JSON.parse(data)

			value.forEach((item, index) => {
				html += `
					<tr id="content">
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.height}</td>
                        <td>${item.weight}</td>
                        <td>${item.birthdate}</td>
                        <td>${item.married ? 'Yes' : 'Not Yet'}</td>
                        <td>
							<a href="/edit?id=${index + 1}">update</a>
							<a href="/delete?id=${index + 1}" onclick="return confirm('apakah anda ingin menghapus ${item.name}')">delete</a>
                        </td>
					</tr>
						`
			});

			let result = index.replace('{table content}', html)
			res.writeHead(200, { "Content-type": "text/html" })
			res.end(result)
		})
	} else if (req.url == '/add') {

		if (req.method == 'POST') {
			let body = '';
			req.on('data', chunk => {
				body += chunk.toString();
			});
			req.on('end', () => {
				const params = querystring.parse(body)

				const hasil = ({
					name: params.name,
					height: Number(params.height),
					weight: Number(params.weight),
					birthdate: params.birthdate,
					married: JSON.parse(params.married)
				})

				data.push(hasil)
				fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
					if (err) return res.end('gagal tambah data')
					res.writeHead(302, { 'location': '/' });
					res.end();
				})
			});
		} else {
			res.writeHead(200, { "Content-Type": "text/html" })
			res.end(form.replace('{name}', '').replace('{married}', `
				<option value="true">Yes</option>
				<option value="false">Not Yet</option>
				`).replace('{title}', 'Create Data'));
		}
	} else if (req.url.startsWith('/delete')) {

		const params = querystring.parse(url.parse(req.url).query)


		data.splice(params.id - 1, 1)

		fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
			if (err) return res.end('gagal delete data')
			res.writeHead(302, { 'location': '/' });
			res.end();
		})
	} else if (req.url.startsWith('/edit')) {
		const { id } = querystring.parse(url.parse(req.url).query)
		if (req.method == 'POST') {
			let body = '';
			req.on('data', chunk => {
				body += chunk.toString();
			});
			req.on('end', () => {
				const params = querystring.parse(body)

				const hasil = ({
					name: params.name,
					height: Number(params.height),
					weight: Number(params.weight),
					birthdate: params.birthdate,
					married: JSON.parse(params.married)
				})
				console.log(params.married)

				data[id - 1] = hasil
				fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
					if (err) return res.end('gagal tambah data')
					res.writeHead(302, { 'location': '/' });
					res.end();
				})
			});
		} else {

			fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
				if (err) return res.end(`gagal ambil data untuk update ${id}`)


				res.writeHead(200, { "Content-Type": "text/html" })
				let html = form.replace('{name}', data[id - 1].name).replace('{height}', data[id - 1].height).replace('{weight}', data[id - 1].weight).replace('{birthdate}', data[id - 1].birthdate).replace('{title}', 'Update Data')
				if (data[id - 1].married) {
					html = html.replace('{married}', `
						<option value="true" selected>Yes</option>
            			<option value="false">Not Yet</option>
						`)
				} else {
					html = html.replace('{married}', `
						<option value="true">Yes</option>
            			<option value="false" selected>Not Yet</option>
						`)
				}
				res.end(html);

			})
		}
	} else if (req.url == '/style.css') {
		res.writeHead(200, { "Content-Type": "text/css" });
		res.end(css);
	} else {
		res.writeHead(400, { "Content-Type": "text/plain" })
		res.end('404 not found')
	}



}).listen(3000);



