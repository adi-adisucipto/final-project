"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockReport = getStockReport;
const prisma_1 = require("../lib/prisma");
const LOW_STOCK_THRESHOLD = 10;
const toMonthRange = (month) => {
    const [year, monthValue] = month.split("-").map(Number);
    const start = new Date(year, monthValue - 1, 1);
    const end = new Date(year, monthValue, 1);
    return { start, end };
};
async function getStockReport(params) {
    const { start, end } = toMonthRange(params.month);
    const now = new Date();
    const stocks = await prisma_1.prisma.productStock.findMany({
        where: params.storeId ? { storeId: params.storeId } : undefined,
        include: {
            store: { select: { id: true, name: true } },
            product: {
                select: { id: true, name: true, category: { select: { name: true } } },
            },
        },
    });
    const stockRows = [];
    for (const stock of stocks) {
        let categoryName = "Uncategorized";
        if (stock.product.category?.name)
            categoryName = stock.product.category.name;
        stockRows.push({
            id: stock.id,
            quantity: stock.quantity,
            storeId: stock.storeId,
            storeName: stock.store.name,
            productId: stock.productId,
            productName: stock.product.name,
            categoryName,
        });
    }
    const stockIds = [];
    for (const row of stockRows)
        stockIds.push(row.id);
    const journals = await prisma_1.prisma.stockJournal.findMany({
        where: {
            productStockId: { in: stockIds },
            createdAt: { gte: start, lt: now },
        },
        orderBy: { createdAt: "asc" },
    });
    const journalsByStock = new Map();
    for (const journal of journals) {
        let list = journalsByStock.get(journal.productStockId);
        if (!list) {
            list = [];
            journalsByStock.set(journal.productStockId, list);
        }
        list.push({
            id: journal.id,
            productStockId: journal.productStockId,
            action: journal.action,
            quantity: journal.quantity,
            note: journal.note,
            createdAt: journal.createdAt,
        });
    }
    const perStockSummary = [];
    for (const stock of stockRows) {
        const entries = journalsByStock.get(stock.id) || [];
        const entriesInMonth = [];
        let totalIn = 0;
        let totalOut = 0;
        let netAfterMonth = 0;
        let netDuringMonth = 0;
        for (const entry of entries) {
            let delta = 0;
            if (entry.action === "IN") {
                delta = entry.quantity;
            }
            else {
                delta = -entry.quantity;
            }
            if (entry.createdAt >= end) {
                netAfterMonth += delta;
            }
            else {
                entriesInMonth.push(entry);
                netDuringMonth += delta;
                if (entry.action === "IN") {
                    totalIn += entry.quantity;
                }
                else {
                    totalOut += entry.quantity;
                }
            }
        }
        const endStock = stock.quantity - netAfterMonth;
        const startStock = endStock - netDuringMonth;
        const status = endStock <= LOW_STOCK_THRESHOLD ? "LOW" : "SAFE";
        perStockSummary.push({
            ...stock,
            startStock,
            totalIn,
            totalOut,
            endStock,
            status,
            entries: entriesInMonth,
        });
    }
    let totalAdded = 0;
    let totalRemoved = 0;
    let endingStock = 0;
    for (const row of perStockSummary) {
        totalAdded += row.totalIn;
        totalRemoved += row.totalOut;
        endingStock += row.endStock;
    }
    let summaryRows;
    if (params.storeId) {
        summaryRows = perStockSummary.map((row) => ({
            ...row,
            status: row.endStock <= LOW_STOCK_THRESHOLD ? "LOW" : "SAFE",
        }));
    }
    else {
        const aggregated = new Map();
        for (const row of perStockSummary) {
            let existing = aggregated.get(row.productId);
            if (!existing) {
                existing = {
                    productId: row.productId,
                    productName: row.productName,
                    categoryName: row.categoryName,
                    startStock: 0,
                    totalIn: 0,
                    totalOut: 0,
                    endStock: 0,
                };
                aggregated.set(row.productId, existing);
            }
            existing.startStock += row.startStock;
            existing.totalIn += row.totalIn;
            existing.totalOut += row.totalOut;
            existing.endStock += row.endStock;
        }
        summaryRows = [];
        for (const row of aggregated.values()) {
            summaryRows.push({
                ...row,
                status: row.endStock <= LOW_STOCK_THRESHOLD ? "LOW" : "SAFE",
            });
        }
    }
    const history = [];
    for (const row of perStockSummary) {
        let runningStock = row.startStock;
        for (const entry of row.entries) {
            const before = runningStock;
            let delta = 0;
            if (entry.action === "IN") {
                delta = entry.quantity;
            }
            else {
                delta = -entry.quantity;
            }
            const after = before + delta;
            runningStock = after;
            let source = "Sales";
            if (entry.action === "IN") {
                source = "Restock";
            }
            if (entry.note) {
                source = entry.note;
            }
            history.push({
                id: entry.id,
                date: entry.createdAt,
                productId: row.productId,
                productName: row.productName,
                action: entry.action,
                quantity: entry.quantity,
                source,
                stockBefore: before,
                stockAfter: after,
                storeName: row.storeName,
            });
        }
    }
    return {
        month: params.month,
        summary: {
            totalAdded,
            totalRemoved,
            endingStock,
        },
        products: summaryRows,
        history,
    };
}
