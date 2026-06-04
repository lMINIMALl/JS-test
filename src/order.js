const fs = require("fs");
const path = require("path");

function createOrder(product, region) {
	return {
		id: Date.now(),
		createdAt: new Date().toISOString(),
		region: region.name,
		product: {
			id: product.id,
			name: product.name,
			category: product.category,
			price: product.prices[region.code],
		},
	};
}

function saveOrder(order) {
	const fileName = `order-${order.id}.json`;

	const filePath = path.join(
		__dirname,
		"..",
		"orders",
		fileName
	);

	fs.writeFileSync(
		filePath,
		JSON.stringify(order, null, 2),
		"utf8"
	);

	return fileName;
}

module.exports = {
	createOrder,
	saveOrder,
};