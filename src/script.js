const productsHTML = document.querySelector("#product-list");
const form = document.querySelector("form");


const products = createList(DATABASE);

const shopping = new Cart();

function createList(database){
	const products = database.map( el => new Product(el.id, el.title, el.description, el.price, el.img) );
	return products;
}


document.body.onclick = buttonEvent;
form.onsubmit = setPayment;

renderProducts(DATABASE);

function buttonEvent (event) {
	const target = event.target;

 	switch(target.className) {
 		case "add-cart-btn": 
 				addProduct(target.value);
 				break;

 		case "delete-item-btn":
 			  deleteProduct(target.value);
 			  break;
 	}
}


function renderProducts(list) {
	products.map( item => {
		const addBtn = new Button("add-cart-btn", "+", "Add to cart", item.id);
		productsHTML.innerHTML += `<li> ${item.render() + addBtn.render()} </li>`;

	} ) ;
}


function addProduct (productID) {
	const product = products.find( item => item.id == productID );
 	const {id, title, price} = product;
 	shopping.addItem( new Item(id, title, price) );
}


function deleteProduct (productID) {
 	shopping.deleteItem(productID);
}



function setPayment(event) {
	event.preventDefault();
	const elements = shopping.cart.map( item => `${item.title} x ${item.count} = $${item.price}`).join("\n");
	const message =  `Hola! Me gustaria hacer el siguiente pedido:\n${elements}\n*Total a pagar: $${shopping.total}*`;
	const phone = document.querySelector("#telephone").value;

	const url = encodeURI(`https://api.whatsapp.com/send?phone=+54${phone}&text=${message}`);
	window.open(url, "_blank");
}