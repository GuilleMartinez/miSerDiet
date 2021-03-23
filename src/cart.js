class Item {
	constructor(id, title, price) {
		this._id = id;
		this._title = title;
		this._price = price;
		this._count = 1;
	}

	get id () {
		return this._id;
	}

	get title () {
		return this._title;
	}

	get price () {
		return this._price;
	}

	get count() {
		return this._count;
	}

	set count (newCount) {
		this._count = newCount;
	}

	updatePrice() {
		this._price *= this._count;
	}

	render() {
		return `<tr id="product-${this.id}"> 
			<td class="item-title">${this.title}</td> 
			<td class="item-count">${this.count}</td> 
			<td class="item-price">$${this.price}</td>
			<td>${new Button("delete-item-btn", "X", "remove from cart", this.id).render() }</td> 
		</tr>` ;
	}
	
}

class Cart {

	constructor() {
		this._cart = [];
		this._htmlCart = document.querySelector("#shopping-cart");
		this._htmlTotal = document.querySelector("#total");
	}

	get cart () {
		return this._cart;
	}


	addItem(item) {
		const exists = this.cart.some( el => el.id == item.id );

		if (exists) {
			this.updateItem(item.id);
		} else {
			this._cart.push(item);
			this.renderHtmlItem(item.id);
		}

		this.updateHtmlTotal();
	}

	deleteItem(id) {
		this._cart = this.cart.filter( item => item.id != id);
		this.removeHtmlItem(id);
		this.updateHtmlTotal();
	}

	updateItem(id) {
		const index = this._cart.findIndex( item => item.id == id);
		this.cart[index].count++;
		this.cart[index].updatePrice();
		this.updateHtmlItem(this.cart[index]);
		this.updateHtmlTotal();
	}

	get total () {
		let total = 0;
		this.cart.map( item => total += item.price);
		return total;
	}


	renderHtmlItem(id) {
		const item = this.cart.find( item => item.id == id );
		this._htmlCart.innerHTML += item.render();
	}

	removeHtmlItem(id) {
		document.querySelector( `#product-${id}`).remove();
	}

	updateHtmlItem(item) {
	    document.querySelector( `#product-${item.id} .item-price`).textContent = `$${item.price}`
	    document.querySelector( `#product-${item.id} .item-count`).textContent = item.count;
	}

	updateHtmlTotal() {
		this._htmlTotal.textContent = `Total: $${this.total}`;
	}

	hasItems() {
		return this.cart.length;
	}

}