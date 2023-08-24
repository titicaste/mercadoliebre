const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');
const { Readable } = require('stream');


const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

async function ftp_upload(image_data, image_destiny_route){

		// Connect to the FTP server
		const client = new ftp.Client();
		await client.access({
		  host: 'ftp-cuchujero.alwaysdata.net', 
		  user: 'cuchujero',
		  password: 'Goku123!'
		});
	
		// Upload the file to the FTP server
		await client.uploadFrom(image_data, image_destiny_route);
	
		// Close the FTP connection
		client.close();

}


const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		res.render('products',{productos: products});
	},

	detail: (req, res) => {
		
		let idURL = req.params.id;
		let productoEncontrado;

		for (let p of products){
			if (p.id==idURL){
				productoEncontrado=p;
				break;
			}
		}

		res.render('detail',{productoEncontrado: productoEncontrado});

	},

	create: (req, res) => {
		res.render('product-create-form');
	},
	
	store: async (req, res) => {

		const file = req.file;
	
		const stream = new Readable();
		stream.push(file.buffer);
		stream.push(null); 


		await ftp_upload(stream , '/www/images/' + file.originalname);

		idNuevo=0;

		for (let s of products){
			if (idNuevo<s.id){
				idNuevo=s.id;
			}
		}

		idNuevo++;

		let nombreImagen = req.file.filename;


		let productoNuevo =  {
			id:   idNuevo,
			name: req.body.name ,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: nombreImagen
		};

		products.push(productoNuevo);

		fs.writeFileSync(productsFilePath, JSON.stringify(products,null,' '));

		res.redirect('/');

		
	},

	edit: (req, res) => {

		let id = req.params.id;
		let productoEncontrado;

		for (let s of products){
			if (id==s.id){
				productoEncontrado=s;
			}
		}

		res.render('product-edit-form',{ProductoaEditar: productoEncontrado});
	},

	update: (req, res) => {
		
		let id = req.params.id;
		let productoEncontrado;

		for (let s of products){
			if (id==s.id){
				s.name= req.body.name;
				s.price= req.body.price;
				s.discount= req.body.discount;
				s.category= req.body.category;
				s.description= req.body.description;
				break;
			}
		}

		fs.writeFileSync(productsFilePath, JSON.stringify(products,null,' '));

		res.redirect('/');
	},

	destroy : (req, res) => {

		let id = req.params.id;
		let ProductoEncontrado;

		let Nproducts = products.filter(function(e){
			return id!=e.id;
		})

		for (let producto of products){
			if (producto.id == id){
			    ProductoEncontrado=producto;
			}
		}

		fs.unlinkSync(path.join(__dirname, '../../public/images/products/', ProductoEncontrado.image));

		fs.writeFileSync(productsFilePath, JSON.stringify(Nproducts,null,' '));

		res.redirect('/');
	}
};

module.exports = controller;