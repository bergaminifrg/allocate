// This function allocates sales orders to purchase orders based on availability and receiving date.
function allocate(salesOrders, purchaseOrders) {
    if (salesOrders.length === 0 || purchaseOrders.length === 0){
        return [];
    }

    // Sort sales orders by creation date.
    const sortedSalesOrders = [...salesOrders].sort((a, b) => new Date(a.created) - new Date(b.created));
    // Sort purchase orders by receiving date.
    const sortedPurchaseOrders = [...purchaseOrders].sort((a, b) => new Date(a.receiving) - new Date(b.receiving));

    const result = [];
    let availableInventory = 0;
    let purchaseOrder;

    // Iterate over sales orders to estimate the delivery date
    for (const saleOrder of sortedSalesOrders) {
        const { quantity } = saleOrder;

        // Check if there is enough inventory.
        if (availableInventory < quantity) {
            // Search for supplies in remaining purchase orders.
            while (availableInventory < quantity && sortedPurchaseOrders.length > 0) {
                purchaseOrder = sortedPurchaseOrders.shift();
                availableInventory += purchaseOrder.quantity;
            }
        }
        if (purchaseOrder && availableInventory >= quantity){
            const deliveryDate = addDaysToDate(purchaseOrder.receiving, 7);

            const delivery = {
                id: saleOrder.id,
                date: deliveryDate.toISOString().split('T')[0],
            };
            result.push(delivery);
            availableInventory -= quantity;
        }
    }

    return result;
}

function addDaysToDate(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

module.exports = { allocate };