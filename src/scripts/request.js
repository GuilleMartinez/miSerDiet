/* REQUEST DATA */

async function requestData({ database = null, table = null }) {

    try {
        const request = await fetch(database);
        const json = await request.json();

        return json[table];
    }
    catch (err) {
        return [];
    }

}

async function getProducts({ database = null }) {
    const products = await requestData({ database: database, table: "productos" });
    return products;
}


async function getCatalog({ database = null }) {
    const catalog = await requestData({ database: database, table: "catalogo" });
    return catalog;
}

async function getCategories({ categoriesURL = null, groupsURL = null }) {
    const categories = await requestData({ database: categoriesURL, table: "categorias" });
    const groups = await requestData({ database: groupsURL, table: "grupos" });


    return groups.map(group => createObject(group, categories));

    function createObject(group, categories) {

        const array = categories.filter(category => category.group_id == group.id);

        return {
            name: group.name,
            categories: array
        }

    }

}

