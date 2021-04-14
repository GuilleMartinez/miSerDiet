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

		const catalog = catalogList.map(item => createHTML(item, this.findProduct(item.product_id)))

		return catalog;

		function createHTML(item, product) {
			const amount = item.amount ? `${item.amount} x $${item.price}` : `$${item.price}`;
			return `
			<div class="product">
				<img class="product-img" src="./src/img/product.svg" alt="${product.name}"/>
				<p class="product-title">${product.name}</p>
				<p class="product-price">${amount}</p>
				<button class="add-cart-btn" title="Add to cart" value="${item.id}">+</button>
			</div>`
		}


	}


	/* RENDER METHODS */

	renderCategories() {
		this.categories.map(group => this._htmlCategories.innerHTML += createHTML(group.name, group.categories));

		function createHTML(group, array) {

			const container = array.map(category => ` <div>
			<input class="filter-input" id="${category.id}" value="${category.id}" type="radio" name="filter" > 
			<label class="filter-label" for="${category.id}"> ${category.name} </label> \n </div>`).join("\n");

			return `<details> 
						<summary>${group}</summary>
						${container}
					</details>
					`
		}
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
		this.categories.map(group => {
			this._htmlCatalog.innerHTML += `
			<section id="${group.name}">
				<h2 class="title">${group.name}</h2>
				<div class="product-container"> 
					${this.createCatalog(this.filterCatalog(this.filterByCategory(group.categories[0].id), 3))}
				</div>
			</section>
		`}
		)

	}

}