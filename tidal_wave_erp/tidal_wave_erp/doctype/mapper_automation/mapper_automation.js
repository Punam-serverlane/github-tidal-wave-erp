// Copyright (c) 2024, Serverlane Technologies and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Mapper Automation", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Mapper Automation', {
    refresh: function(frm) {
        calculate_total_for_customer_line_items(frm);
    }
});

frappe.ui.form.on('Mapper Automation Table', {
    quantity: function(frm, cdt, cdn) {
        calculate_totals(frm, cdt, cdn);
        calculate_total_for_customer_line_items(frm);
    },
    price: function(frm, cdt, cdn) {
        calculate_totals(frm, cdt, cdn);
        calculate_total_for_customer_line_items(frm);
    },
    cost: function(frm, cdt, cdn) {
        calculate_totals(frm, cdt, cdn);
        calculate_total_for_customer_line_items(frm);
    }
});

function calculate_totals(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (row.price && row.quantity) {
        row.total_price = row.price * row.quantity;
    }
    if (row.cost && row.quantity) {
        row.total_cost = row.cost * row.quantity;
    }
    frm.refresh_field('mapper_automation_table');
}

function calculate_total_for_customer_line_items(frm) {
    let total_by_customer = {};
    let first_row_index = {};

    // First pass: Calculate the total_price and total_cost for each customer_line_item
    frm.doc.mapper_automation_table.forEach((row, idx) => {
        if (row.customer_line_item) {
            let customer_line_item_lower = row.customer_line_item.toLowerCase(); // Convert to lowercase
            if (!total_by_customer[customer_line_item_lower]) {
                total_by_customer[customer_line_item_lower] = {
                    total_price: 0,
                    total_cost: 0
                };
                first_row_index[customer_line_item_lower] = idx; // Track the first occurrence
            }
            total_by_customer[customer_line_item_lower].total_price += row.total_price || 0;
            total_by_customer[customer_line_item_lower].total_cost += row.total_cost || 0;
        }
    });

    // Clear the total_price_of_customer_line_item and total_cost_of_customer_line_item for all rows first
    frm.doc.mapper_automation_table.forEach(row => {
        row.total_price_of_customer_line_item = null;
        row.total_cost_of_customer_line_item = null;
    });

    // Set the total_price_of_customer_line_item and total_cost_of_customer_line_item for the first occurrence of each customer_line_item
    for (let customer_line_item_lower in first_row_index) {
        let idx = first_row_index[customer_line_item_lower];
        frm.doc.mapper_automation_table[idx].total_price_of_customer_line_item = total_by_customer[customer_line_item_lower].total_price;
        frm.doc.mapper_automation_table[idx].total_cost_of_customer_line_item = total_by_customer[customer_line_item_lower].total_cost;
    }

    frm.refresh_field('mapper_automation_table');
}
