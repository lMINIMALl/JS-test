const {
	getCheapestMaterialInCategory,
} = require("./catalog");

function getRetentionOffer(product, region) {
	const cheapestProduct = getCheapestMaterialInCategory(
		product.category,
		region.code
	);

	if (cheapestProduct.id !== product.id) {
		return {
			type: "alternative",
			message: "Более выгодное предложение",
			product: cheapestProduct,
			price: cheapestProduct.prices[region.code],
		};
	}

	const discountedPrice = Math.round(
		product.prices[region.code] * 0.95
	);

	return {
		type: "discount",
		message: "Скидка 5% на выбранный товар",
		product,
		price: discountedPrice,
	};
}

module.exports = {
	getRetentionOffer,
};