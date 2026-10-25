/**
 * @file Order business logic: builds the order items from the client's
 * selections, validates them against the products in the database,
 * calculates all prices, and reduces stock after an order is saved.
 */
import Product from "../models/products.model.js";
import "../models/optionGroup.model.js";

/**
 * Creates a 400 error with a Hebrew message for the client.
 * @param {string} message - The message to show.
 * @returns {Error} The error, with status and type set.
 */
const createError = (message) => {
    const error = new Error(message);
    error.status = 400;
    error.type = "bad_request";
    return error;
};

/**
 * Returns how many choices a group allows for the selected size, or null
 * when the group is not limited by size (or the size sets no limit).
 * @param {Object} group - The option group.
 * @param {Object|null} size - The selected size.
 * @returns {number|null} The size's maxChoices, or null.
 */
const getSizeLimit = (group, size) =>
    group.limitedBySize && size?.maxChoices ? size.maxChoices : null;

/**
 * Validates the requested items and builds the items to save, with prices
 * taken from the database: size price, plus pricePer for every choice beyond
 * the number included in each group. Checks that each product exists and is
 * available, the size and choices exist, required groups are chosen, size
 * limits are kept, and there is enough stock.
 * @param {Array<Object>} requestedItems - Items from the request body.
 * @returns {Promise<{ items: Array<Object>, totalPrice: number, neededQuantity: Map<string, number> }>}
 *   The items to save, the order total, and the units needed per product with a managed quantity.
 * @throws {Error} A 400 error with a Hebrew message for any invalid item.
 */
const buildOrderItems = async (requestedItems) => {
    const items = [];
    let totalPrice = 0;
    const countedProducts = new Map();
    const neededQuantity = new Map();

    for (const reqItem of requestedItems) {
        const product = await Product.findById(reqItem.productId).populate('options');
        if (!product) {
            throw createError("אחד המוצרים בהזמנה אינו קיים");
        }
        if (!product.isAvailable) {
            throw createError(`המוצר "${product.name}" אינו זמין כרגע`);
        }

        let unitPrice = product.price;
        let selectedSize = null;
        if (product.size.length > 0) {
            if (!reqItem.size) {
                throw createError(`יש לבחור גודל עבור "${product.name}"`);
            }
            selectedSize = product.size.find(s => s.name === reqItem.size.name);
            if (!selectedSize) {
                throw createError(`הגודל "${reqItem.size.name}" אינו קיים במוצר "${product.name}"`);
            }
            unitPrice = selectedSize.price;
        } else if (reqItem.size) {
            throw createError(`למוצר "${product.name}" אין גדלים לבחירה`);
        }

        const productGroups = product.options.filter(group => group);
        const requestedOptions = reqItem.options || [];

        const unknownOption = requestedOptions.find(o => !productGroups.some(g => g._id.toString() === o.optionId));
        if (unknownOption) {
            throw createError(`אחת מקבוצות האפשרויות אינה שייכת למוצר "${product.name}"`);
        }

        const options = [];
        for (const group of productGroups) {
            const reqOption = requestedOptions.find(o => o.optionId === group._id.toString());
            const chosen = reqOption ? reqOption.selectedChoices : [];

            if (group.isMust && chosen.length === 0) {
                throw createError(`יש לבחור ${group.title} עבור "${product.name}"`);
            }
            const invalidChoice = chosen.find(c => !group.choices.includes(c));
            if (invalidChoice) {
                throw createError(`הבחירה "${invalidChoice}" אינה קיימת ב${group.title}`);
            }

            const sizeLimit = getSizeLimit(group, selectedSize);
            if (sizeLimit && chosen.length > sizeLimit) {
                throw createError(`בגודל "${selectedSize.name}" ניתן לבחור עד ${sizeLimit} ב${group.title}`);
            }

            const included = sizeLimit ?? group.maxChoices;
            const extra = Math.max(0, chosen.length - included);
            unitPrice += group.pricePer * extra;

            if (chosen.length > 0) {
                options.push({ title: group.title, pricePer: group.pricePer, selectedChoices: chosen });
            }
        }

        const quantity = reqItem.quantity;
        totalPrice += unitPrice * quantity;

        if (product.quantity != null) {
            countedProducts.set(product.id, product);
            neededQuantity.set(product.id, (neededQuantity.get(product.id) || 0) + quantity);
        }

        items.push({
            productId: product._id,
            nameItem: product.name,
            price: unitPrice,
            quantity,
            size: selectedSize ? { name: selectedSize.name, price: selectedSize.price } : undefined,
            options
        });
    }

    for (const [id, needed] of neededQuantity) {
        const product = countedProducts.get(id);
        if (product.quantity < needed) {
            throw createError(`נותרו רק ${product.quantity} יחידות מ"${product.name}"`);
        }
    }

    return { items, totalPrice, neededQuantity };
};

/**
 * Reduces the stock of each product by the units ordered, and marks a
 * product as unavailable when its stock reaches 0.
 * @param {Map<string, number>} neededQuantity - Units ordered per product id.
 */
const decreaseStock = async (neededQuantity) => {
    for (const [id, needed] of neededQuantity) {
        const product = await Product.findById(id);
        product.quantity -= needed;
        product.isAvailable = product.quantity > 0;
        await product.save();
    }
};

export { buildOrderItems, decreaseStock };