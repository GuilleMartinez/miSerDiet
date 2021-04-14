const number = "0xB14EE0B1";

const LINKS = {
	categories: "../src/json/categorias.json",
	groups:  "../src/json/grupos.json",
	products: "../src/json/productos.json",
	catalog:  "../src/json/catalogo.json",
}

var app;
var cart;

/* REQUEST AND PREPARE DATA */
async function getData(url) {
	const data = await fetch(url);
	const json = await data.json();
	return json;
}

async function prepareData() {
	const products = await getProducts( {database: LINKS.products } );
	const categories = await getCategories({categoriesURL: LINKS.categories, groupsURL: LINKS.groups });
	const catalog = await getCatalog({database: LINKS.catalog } );

	app = new App(products, categories, catalog);
}

prepareData()
	.then(createApp)
	.catch((error) => console.log(error));


function createApp() {

	/* SET UP APP */
	cart = new Cart();


	/* RENDER ELEMENTS */
	app.renderCategories();
	app.renderSuggestions();
	app.renderFrontCatalog();

	/* SET UP EVENTS */
	app.categoryContainer.oninput = filterByInput;
	app.searchBox.oninput = filterBySearch;
	document.querySelector("#main-container").onclick = setClickEvent;

}

/* RENDER FUNCTIONS */

function filterByInput() {

	const input = app.categoryContainer.querySelector(".filter-input:checked").value;
	const category = app.categoryContainer.querySelector(".filter-input:checked + .filter-label").textContent;
	app.title = input ? category : "NUESTROS PRODUCTOS";

	if (input) {
		const products = app.filterCatalog(app.filterByCategory(input));
		app.renderCatalog(products);
		app.filtered = true;

	} else if (!input && app.filtered) {
		app.renderFrontCatalog();
		app.filtered = false;
	}
	
}

function filterBySearch(event) {

	const value = event.target.value;
	const product = app.findProduct(value) ? [app.findProduct(value)] : false;
	app.title = "NUESTROS PRODUCTOS";

	if (value && product) {
		const products = app.filterCatalog(product);
		app.renderCatalog(products);
		app.filtered = true;

	} else if (!value && app.filtered) {
		app.renderFrontCatalog();
		app.filtered = false;
	}

}

function setClickEvent(event) {
	const target = event.target;
	const className = target.className;

	if (className.includes("btn")) {

		switch (className) {
			case "add-cart-btn":
				console.log("Agregar producto");
				insertProduct(target.value);
				break;
			case "delete-item-btn":
				cart.deleteItem(target.value);
				break;
			case "pay-btn":
				setPayment();
				break;
		}
	}


	function insertProduct(itemID) {
		const { product_id, amount, price } = app.findItem(itemID);
		const { name } = app.findProduct(product_id);
		cart.addItem(new Item(itemID, name, price, amount));
	}

}


/* SEND MESSAGE */

function setPayment() {
	if (cart.hasItems()) {
		const elements = cart.cart
			.map((item) => `Producto: ${item.title}\nCantidad: ${item.amount}\nSubtotal: $${item.price}`)
			.join("\n\n");
		const message = `Hola! Me gustaria hacer el siguiente pedido:\n\n${elements}\n\n*Total a pagar: $${cart.total}*`;
		const url = encodeURI(
			`https://api.whatsapp.com/send?phone=+54${parseInt(
				number
			)}&text=${message}`
		);
		window.open(url, "_blank");
	}
}
