const LINKS = {
	categories: "src/json/categorias.json",
	groups: "src/json/grupos.json",
	products: "src/json/productos.json",
	catalog: "src/json/catalogo.json",
}

let app;
let cart;
const itemsCount = 1;

/* REQUEST AND PREPARE DATA */
async function getData(url) {
	const data = await fetch(url);
	const json = await data.json();
	return json;
}

async function prepareData() {
	const products = await getProducts({ database: LINKS.products });
	const categories = await getCategories({ categoriesURL: LINKS.categories, groupsURL: LINKS.groups });
	const catalog = await getCatalog({ database: LINKS.catalog });

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
	app.renderFrontCatalog(itemsCount);

	/* SET UP EVENTS */
	app.categoryContainer.oninput = filterByInput;
	app.searchBox.oninput = filterBySearch;
	document.querySelector("#main-container").onclick = setClickEvent;
	document.querySelector(".hover-dropdown").onmouseleave = closeDetailsEvent;

}

/* RENDER FUNCTIONS */

function filterByInput() {

	const input = app.categoryContainer.querySelector(".filter-input:checked").value;
	const category = app.categoryContainer.querySelector(".filter-input:checked + .filter-label").textContent;
	app.title = input ? category : "Nuestros Productos";

	if (input) {
		const products = app.filterCatalog(app.filterByCategory(input));
		app.clearHTML();
		app.renderCatalog(products);
		app.filtered = true;

	} else if (!input && app.filtered) {
		app.renderFrontCatalog(itemsCount);
		app.filtered = false;
	}

}

function filterBySearch(event) {

	const value = event.target.value;
	const product = app.findProduct(value) ? [app.findProduct(value)] : false;
	app.title = "Nuestros Productos";

	if (value && product) {
		const products = app.filterCatalog(product);
		app.clearHTML();
		app.renderCatalog(products);
		app.filtered = true;

	} else if (!value && app.filtered) {
		app.renderFrontCatalog(itemsCount);
		app.filtered = false;
	}

}

function setClickEvent(event) {
	const target = event.target;
	const className = target.className;

	if (className.includes("btn")) {

		switch (className) {
			case "add-cart-btn":
				insertProduct(target.value);
				break;

			case "delete-item-btn":
				cart.deleteItem(target.value);
				break;

			case "pay-btn":
				setPayment();
				break;

			case "update-btn":
				updateEvent(target);
				break;
		}
	}


	function insertProduct(itemID) {
		const { product_id, amount, price } = app.findItem(itemID);
		const { name, img_url} = app.findProduct(product_id);
		cart.addItem(new Item(itemID, name, price, amount, img_url));
	}

}

function closeDetailsEvent() {
	const details = [...document.querySelectorAll(".hover-dropdown details[open]")];
	details.map(tag => tag.open = false);
}


function updateEvent(target) {
	const productID = target.closest("li").id;
	const newCount = Number(target.value);
	cart.updateItem(productID, newCount);
}

/* SEND MESSAGE */

function setPayment() {
	if (cart.hasItems()) {
		const elements = cart.cart
			.map((item) => `Producto: ${item.title}\nCantidad: ${item.amount}\nSubtotal: $${item.price}`)
			.join("\n\n");
		const message = `Hola! Me gustaria hacer el siguiente pedido:\n\n${elements}\n\n*Total a pagar: $${cart.total}*`;
		const url = encodeURI(
			`https://api.whatsapp.com/send?phone=999-999-9999&text=${message}`
		);
		window.open(url, "_blank");
	}
}
