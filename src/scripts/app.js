class App {

	constructor(products = [], categories = [], catalog = []) {
		this._products = products;
		this._categories = categories;
		this._catalog = catalog;
		this._htmlCatalog = document.querySelector("#product-list");
		this._htmlCategories = document.querySelector("#categories-list");
		this._catalogTitle = document.querySelector("#catalog-title");
		this._htmlSearchList = document.querySelector("#suggestions");
		this._htmlSearchBox = document.querySelector('#search-box [type="search"]');
		this.filtered = false;
	}

	get offerts() {
		return this._products.filter(product => product.offert == "TRUE");
	}

	get categories() {
		return this._categories;
	}

	get products() {
		return this._products;
	}

	get catalog() {
		return this._catalog
	}

	set title(newTtitle) {
		this._catalogTitle.textContent = newTtitle;
	}

	get categoryContainer() {
		return this._htmlCategories;
	}

	get searchList() {
		return this._htmlSearchList;
	}

	get searchBox() {
		return this._htmlSearchBox;
	}

	findProduct(productID) {
		return this._products.find(product => product.id == productID);
	}

	findItem(itemID) {
		return this._catalog.find(item => item.id == itemID);
	}

	filterByCategory(categoryID) {
		return this.products.filter(product => product.category_id == categoryID);
	}

	filterCatalog(products, count) {
		const query = this.catalog.filter(item => products.some(product => product.id == item.product_id));
		return count ? query.slice(0, count) : query;
	}

	createCatalog(catalogList) {

		const catalog = catalogList.map(item => createHTML(item, this.findProduct(item.product_id)));

		return catalog;

		function createHTML(item, product) {
			const amount = item.amount ? `${item.amount} x $${item.price}` : `$${item.price}`;
			return `
			<div class="product">
				<img src="./src/img/fff.png" alt="${product.name}"/>
				<p class="product-title">${product.name}</p>
				<p class="product-price">${amount}</p>
				<button class="add-cart-btn" title="Add to cart" value="${item.id}">+</button>
			</div>`
		}


	}


	/* RENDER METHODS */

	renderCategories() {
		this.categories.map(category => {
			this._htmlCategories.innerHTML +=
				`<li>
				<input id="${category.id}"  class="filter-input" type="radio" name="filter" value="${category.id}"/>
				<label for="${category.id}" class="filter-label">${category.name}</label>
			</li>`;
		});
	}

	renderSuggestions() {
		this.products.map(product => this.searchList.innerHTML += `<option value="${product.id}">${product.name}</option>`);
	}

	renderCatalog(list) {
		const catalog = this.createCatalog(list);

		this._htmlCatalog.innerHTML = "";
		this._htmlCatalog.classList.add("catalog-grid");

		catalog.map(div => this._htmlCatalog.innerHTML += div);
	}

	renderFrontCatalog() {

		this._htmlCatalog.innerHTML = "";
		this._htmlCatalog.classList.remove("catalog-grid");

		this.categories.map(categ => {
			this._htmlCatalog.innerHTML += `
			<section id="${categ.name}">
				<h2 class="title">${categ.name}</h2>
				<div class="product-container"> 
					${this.createCatalog(this.filterCatalog(this.filterByCategory(categ.id), 3))}
				</div>
			</section>
		`}
		)

	}

}