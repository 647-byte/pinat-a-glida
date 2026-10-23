import Product from "../models/products.model.js";
import "../models/optionGroup.js"; 

const FLAVORS_TITLE = "טעמים";

const createError = (message) => {
    const error = new Error(message);
    error.status = 400;
    error.type = "bad_request";
    return error;
};

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

            const isFlavors = group.title === FLAVORS_TITLE && selectedSize?.maxChoices;
            if (isFlavors && chosen.length > selectedSize.maxChoices) {
                throw createError(`בגודל "${selectedSize.name}" ניתן לבחור עד ${selectedSize.maxChoices} טעמים`);
            }

            const included = isFlavors ? selectedSize.maxChoices : group.maxChoices;
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

const decreaseStock = async (neededQuantity) => {
    for (const [id, needed] of neededQuantity) {
        const product = await Product.findById(id);
        product.quantity -= needed;
        product.isAvailable = product.quantity > 0;
        await product.save();
    }
};

export { buildOrderItems, decreaseStock };