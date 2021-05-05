class Item {
	constructor(id, title, price, amount, img) {
		this._id = id;
		this._title = title;
		this._amount = amount;
		this._price = Number(price);
		this._count = 1;
		this._img = img;
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

		return this._amount;
	}

	get count() {
		return this._count
	}

	get img() {
		return this._img;
	}

	set count(newCount) {
		this._count = newCount;
	}


	render() {
		return `<li class="cart-item" id="${this.id}">

			<div class="cart-item-section cart-item-header">
				<figure> 
					<img class="cart-img" src="${this.img}" alt="${this.title}"/>
				</figure>
			</div>

			<div class="cart-item-section cart-item-body">

				<p class="item-title">${this.title} ${this.amount ? ' x ' + this.amount : ""}</p>

				<div class="cart-info"> 

					<div class="cart-inputs-section"> 
						<button class="update-btn" value="-1">-</button>
						<input  class="item-count" readonly type="number" value="${this.count}"/>
						<button class="update-btn" value="1">+</button>
					</div>

					<div class="cart-price-section">
						<button class="delete-item-btn" title="remove from cart", value="${this.id}">🗑</button>					
						<p class="item-price">$${this.price}</p>
					</div>

				</div>

				
			</div>
		</li>`;
	}

}

class Cart {

	constructor() {
		this._cart = [];
		this._htmlCart = document.querySelector("#shopping-cart");
		this._htmlTotal = document.querySelector("#total");
		this._htmlPopup = document.querySelector("#popup");
		this.anitamedPopup = false;
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
		this.showPopup(item.id);
	}

	deleteItem(id) {
		this._cart = this.cart.filter(item => item.id != id);
		this.removeHtmlItem(id);
		this.updateHtmlTotal();
	}

	updateItem(id, value = 1) {
		const index = this._cart.findIndex(item => item.id == id);
		this.cart[index].count += value;

		if (this.cart[index].count > 0) {
			this.updateHtmlItem(this.cart[index]);
			this.updateHtmlTotal();
		}

	}

	get total() {
		let total = 0;
		this.cart.map(item => total += item.price);
		return total;
	}

	renderHtmlItem(id) {
		const item = this.cart.find(item => item.id == id);
		this._htmlCart.innerHTML += item.render();

		console.log(item.render() );
	}

	removeHtmlItem(id) {
		this._htmlCart.querySelector(`#${id}`).remove();
	}

	updateHtmlItem(item) {
		this._htmlCart.querySelector(`#${item.id} .item-count`).value = item.count;
		this._htmlCart.querySelector(`#${item.id} .item-price`).textContent = `Subtotal: $${item.price}`
	}

	updateHtmlTotal() {
		this._htmlTotal.textContent = `Total a pagar: $${this.total}`;
	}

	hasItems() {
		return this.cart.length;
	}

	showPopup(productID) {
		const item = this.cart.find(item => item.id == productID);
		const title = this._htmlPopup.querySelector("#popup-title");
		const img = this._htmlPopup.querySelector("#popup-img");
		const info = this._htmlPopup.querySelector("#popup-info");
		const price = this._htmlPopup.querySelector("#popup-price");
		const count = this._htmlPopup.querySelector("#popup-count");

		const resetPopup = () => {
			this._htmlPopup.className = "invisible opacity-0";
			this.anitamedPopup = false;

		}

		title.textContent = item.title;

		img.src = item.img;
		img.alt = item.title;

		info.textContent = item.amount ? `${item.count} x ${item.amount}` : "";
		count.textContent = `Total (${item.count} ${item.count > 1 ? 'productos' : 'producto'}): `;
		price.textContent = `$ ${item.price}`;

		this._htmlPopup.className = "animate__animated animate__fadeIn";
		
		if (!this.anitamedPopup) {
			this.anitamedPopup = true;
			setTimeout(resetPopup, 5500);
		}
			

	}

}