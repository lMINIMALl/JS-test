const materials = require("../data/materials.json");

function getAllMaterials() {
	return materials;
}

function getMaterialById(id) {
	return materials.find((item) => item.id === id);
}

function getMaterialsByCategory(category) {
	return materials.filter(
		(item) => item.category === category
	);
}

function getCheapestMaterialInCategory(category, region) {
	const categoryMaterials = getMaterialsByCategory(category);

	if (categoryMaterials.length === 0) {
		return null;
	}

	return categoryMaterials.reduce((cheapest, current) =>
		current.prices[region] < cheapest.prices[region]
			? current
			: cheapest
	);
}

module.exports = {
	getAllMaterials,
	getMaterialById,
	getMaterialsByCategory,
	getCheapestMaterialInCategory,
};