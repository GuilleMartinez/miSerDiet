class Item {
	constructor(id, title, price, amount) {
		this._id = id;
		this._title = title;
		this._amount = amount;
		this._price = Number(price);
		this._count = 1;
	}

	get id() {
		return `product-${this._id}`;
	}

	get title() {
		return this._title;
	}

	get price() {
		return this._price * this._count;
	}

	get amount() {
		const amountString = this._amount ? `x ${this._amount}` : ""
		return `${this.count} ${amountString}`;
	}

	get count() {
		return this._count;
	}

	set count(newCount) {
		this._count = newCount;
	}


	render() {
		return `<li class="cart-item" id="${this.id}"> 
			<p class="item-title">Producto: ${this.title}</p> 
			<p class="item-count">Cantidad: ${this.amount}</p> 
			<p class="item-price">Subtotal: $${this.price}</p>
			<button class="delete-item-btn" title="remove from cart", value="${this.id}">delete product</button>
		</li>`;
	}

}

class Cart {

	constructor() {
		this._cart = [];
		this._htmlCart = document.querySelector("#shopping-cart");
		this._htmlTotal = document.querySelector("#total");
	}

	get cart() {
		return this._cart;
	}


	addItem(item) {
		const exists = this.cart.some(el => el.id == item.id);

		if (exists) {
			this.updateItem(item.id);
		} else {
			this._cart.push(item);
			this.renderHtmlItem(item.id);
		}

		this.updateHtmlTotal();
	}

	deleteItem(id) {
		this._cart = this.cart.filter(item => item.id != id);
		this.removeHtmlItem(id);
		this.updateHtmlTotal();
	}

	updateItem(id) {
		const index = this._cart.findIndex(item => item.id == id);
		this.cart[index].count++;
		this.updateHtmlItem(this.cart[index]);
		this.updateHtmlTotal();
	}

	get total() {
		let total = 0;
		this.cart.map(item => total += item.price);
		return total;
	}

	renderHtmlItem(id) {
		const item = this.cart.find(item => item.id == id);
		this._htmlCart.innerHTML += item.render();
	}

	removeHtmlItem(id) {
		this._htmlCart.querySelector(`#${id}`).remove();
	}

	updateHtmlItem(item) {
		this._htmlCart.querySelector(`#${item.id} .item-count`).textContent = `Cantidad: ${item.amount}`;
		this._htmlCart.querySelector(`#${item.id} .item-price`).textContent = `Subtotal: $${item.price}`
	}

	updateHtmlTotal() {
		this._htmlTotal.textContent = `Total a pagar: $${this.total}`;
	}

	hasItems() {
		return this.cart.length;
	}

}