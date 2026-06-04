const readline = require("readline");

const {
	getAllMaterials,
	getMaterialById,
} = require("./catalog");

const {
	createOrder,
	saveOrder,
} = require("./order");

const {
	getRetentionOffer,
} = require("./retention");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const regions = {
	1: {
		code: "spb",
		name: "Санкт-Петербург",
	},
	2: {
		code: "msk",
		name: "Москва",
	},
	3: {
		code: "krd",
		name: "Краснодар",
	},
};

function ask(question) {
	return new Promise((resolve) => {
		rl.question(question, resolve);
	});
}

function showCatalog(materials, region) {
	console.log("\nДоступные товары:\n");

	materials.forEach((material) => {
		console.log(`${material.id}. ${material.name}`);
		console.log(`	Категория: ${material.category}`);
		console.log(
			`	Цена: ${material.prices[region.code]} ₽\n`
		);
	});
}

function showOrder(product, region) {
	console.log("\nВаш выбор:");
	console.log(`Товар: ${product.name}`);
	console.log(`Категория: ${product.category}`);
	console.log(`Цена: ${product.prices[region.code]} ₽`);
}

async function main() {
	console.log("=== Система оформления заявок ===\n");

	console.log("Выберите регион:");
	console.log("1. Санкт-Петербург");
	console.log("2. Москва");
	console.log("3. Краснодар");

	const regionChoice = await ask("\nВведите номер региона: ");
	const region = regions[regionChoice];

	if (!region) {
		console.log("Ошибка: некорректный выбор региона.");
		rl.close();
		return;
	}

	const materials = getAllMaterials();

	showCatalog(materials, region);

	const selectedId = Number(
		await ask("Введите ID товара: ")
	);

	const selectedProduct = getMaterialById(selectedId);

	if (!selectedProduct) {
		console.log("Ошибка: товар не найден.");
		rl.close();
		return;
	}

	showOrder(selectedProduct, region);

	const confirmation = await ask(
		"\nОформляем заявку? (y/n): "
	);

	if (confirmation.toLowerCase() === "y") {
		const order = createOrder(selectedProduct, region);
		const fileName = saveOrder(order);

		console.log("\nЗаявка успешно создана.");
		console.log(`Файл сохранён: ${fileName}`);
	} else if (confirmation.toLowerCase() === "n") {
		const offer = getRetentionOffer(selectedProduct, region);

		console.log(`\n${offer.message}`);
		console.log(`Товар: ${offer.product.name}`);
		console.log(`Цена: ${offer.price} ₽`);

		const secondConfirmation = await ask(
			"\nОформляем заявку? (y/n): "
		);

		if (secondConfirmation.toLowerCase() === "y") {
			const order = createOrder(offer.product, region);
			const fileName = saveOrder(order);

			console.log("\nЗаявка успешно создана.");
			console.log(`Файл сохранён: ${fileName}`);
		} else if (secondConfirmation.toLowerCase() === "n") {
		    console.log("\nПользователь отказался от всех предложений.");
		} else {
        console.log("\nОшибка ввода.");
        }
	} else {
        console.log("\nОшибка ввода.");
    }

	rl.close();
}

main();