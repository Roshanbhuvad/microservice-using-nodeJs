const { products } = require("../api");
const {ProductRepository} = require("../database")
const {FormatData} =  require("../utils");
const {API, APIError, NotFoundError} = require("../utils/app-errors")


class ProductService {
    constructor() {
        this.repository = new ProductRepository()
    }

    async CreateProduct(productInputs) {
        try {
            const productResult = await this.repository.CreateProduct(productInputs);
            return FormatData(productResult);

        } catch (err) {
            throw new APIError("Data Not Found");
        }
    }


async GetProducts() {
    try {
        const products = await this.repository.Products();

        let categories = {};

        products.map(({type}) => {
            categories[type] = type;
        })
        return FormatData({
            products,
            categories: Object.keys(categories),
        })
    } catch (err) {
        throw new NotFoundError("Data Not Found");
    }
}

async GetProductDescription(productId) {
    try {
        const product = await this.repository.FindById(productId)
        return FormatData(product);
    } catch (err) {
        throw new NotFoundError("Data Not found");
    }
}

async GetProductsByCategory(category) {
    try {
        const products = await this.repository.FindByCategory(category)
        return FormatData(products);
    } catch (err) {
        throw new NotFoundError("Data Not Found")
    }
}

async GetSelectedProducts(selectedIds) {
    try {
        return await this.repository.FindSelectedProducts(selectedIds)
        return FormatData(products);
    }
    catch (err) {
        throw new APIError("Data Not Found")
    }
}
async GetProductById(productId) {
    try {
        return await this.repository.FindById(productId);
    } catch (err) {
        throw new NotFoundError("Data Not Found")
    }
}
async GetProductPayload(userId, {productId, qty} , event) {
    const product =await this.repository.FindById(productId)

    if (product) {
        const payload = {
            event: event,
            data: {userId, product, qty},
        };
        return FormatData(payload);
    } else {
        throw new NotFoundError("No product available")
    }
}
}

module.exports = ProductService;