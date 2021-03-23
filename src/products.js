class Product {
	constructor(id, title, description, price, imgURL) {
		this._id = id;
		this._title = title;
		this._description = description;
		this._price = price;
		this._imgURL = imgURL;
	}

	get id () {
		return this._id;
	}

	get title () {
		return this._title
	}

	get description () {
		return this._description;
	}

	get price () {
		return this._price;
	}

	get imageURL () {
		return this._imgURL;
	}

	render () {
		return `<div class="product"> 
			<h3 class="product-title">${this.title}</h3>
			<img src="${this.imageURL}" alt="Product Image"/>
			<b class="product-price">$${this.price}</b>
		</div>`;
	}

}


class Button{
	constructor(className, textContent, title, value) {
		this._className = className;
		this._text = textContent;
		this._title = title;
		this._value = value;
	}

	get nameClass () {
		return this._className;
	}

	get value () {
		return this._value;
	}

	get title () {
		return this._title;
	}

	get text () {
		return this._text;
	}

	render() {
		return `<button title="${this.title}" value="${this.value}" class="${this.nameClass}"> ${this.text} </button>`;	 
	}
}