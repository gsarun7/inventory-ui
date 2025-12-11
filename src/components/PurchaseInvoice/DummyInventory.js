// DummyInventory.js
// Simple in-memory inventory store for frontend testing.
// Replace calls with backend API when ready.

const inventory = [
  // sample existing item
  // { id: "1", name: "POLISHED GRANITE SLABS (18MM)", brand: "MONOLITH", hsn: "68022310", qty: 100, rate: 60.17, size: "1200x1800", grade: "PRE-I", unit: "Box", lastPurchase: "2025-01-01" }
];

let nextId = 1;

export function findInventoryItem(name, brand, size, grade) {
  return inventory.find(
    (it) =>
      it.name?.trim().toLowerCase() === (name || "").trim().toLowerCase() &&
      it.brand?.trim().toLowerCase() === (brand || "").trim().toLowerCase() &&
      it.size?.trim().toLowerCase() === (size || "").trim().toLowerCase() &&
      it.grade?.trim().toLowerCase() === (grade || "").trim().toLowerCase()
  );
}


export function upsertInventoryItem(purchaseItem, options = { rateMode: "average" }) {
  // purchaseItem: { name, brand, hsn, qty, rate, amount, size, grade, unit, invoiceDate }
  const existing = findInventoryItem(
  purchaseItem.name,
  purchaseItem.brand,
  purchaseItem.size,
  purchaseItem.grade
);
  const newQty = Number(purchaseItem.qty || 0);
  const purchaseRate = Number(purchaseItem.rate || 0);

  if (existing) {
    const oldQty = Number(existing.qty || 0);
    const oldRate = Number(existing.rate || 0);

    // calculate new qty
    const updatedQty = oldQty + newQty;

    // handle rate by mode
    let updatedRate = oldRate;
    if (options.rateMode === "overwrite") {
      updatedRate = purchaseRate;
    } else {
      // weighted average, guard division by zero
      if (updatedQty > 0) {
        updatedRate = ((oldQty * oldRate) + (newQty * purchaseRate)) / updatedQty;
      } else {
        updatedRate = purchaseRate;
      }
    }

    // update fields
    existing.qty = updatedQty;
    existing.rate = Number(updatedRate.toFixed(2));
    existing.hsn = purchaseItem.hsn || existing.hsn;
    existing.size = purchaseItem.size || existing.size;
    existing.grade = purchaseItem.grade || existing.grade;
    existing.unit = purchaseItem.unit || existing.unit;
    existing.lastPurchase = purchaseItem.invoiceDate || existing.lastPurchase;

    return { updated: true, item: existing };
  } else {
    // create new
    const newItem = {
      id: String(nextId++),
      name: purchaseItem.name || "",
      brand: purchaseItem.brand || "",
      hsn: purchaseItem.hsn || "",
      qty: newQty,
      rate: Number(purchaseRate.toFixed(2)),
      size: purchaseItem.size || "",
      grade: purchaseItem.grade || "",
      unit: purchaseItem.unit || "",
      lastPurchase: purchaseItem.invoiceDate || null,
    };
    inventory.push(newItem);
    return { updated: false, item: newItem };
  }
}

// for debugging / viewing
export function getInventorySnapshot() {
  return inventory.map((it) => ({ ...it }));
}
