// Copyright (c) 2024, Serverlane Technologies and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Mapper Automation", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Mapper Automation', {
    refresh: function(frm) {
        // Calculate totals and copy data when the form is refreshed
        calculate_total_for_customer_line_items(frm);
        copy_data_to_sales_user_table(frm);
    },
    before_save: function(frm) {
        // Calculate totals and copy data before saving the form
        calculate_total_for_customer_line_items(frm);
        copy_data_to_sales_user_table(frm);
    }
});

frappe.ui.form.on('Mapper Automation Table', {
    quantity: function(frm, cdt, cdn) {
        calculate_totals(frm, cdt, cdn);
        calculate_total_for_customer_line_items(frm);
        copy_data_to_sales_user_table(frm);
    },
    price: function(frm, cdt, cdn) {
        calculate_totals(frm, cdt, cdn);
        calculate_total_for_customer_line_items(frm);
        copy_data_to_sales_user_table(frm);
    },
    cost: function(frm, cdt, cdn) {
        calculate_totals(frm, cdt, cdn);
        calculate_total_for_customer_line_items(frm);
        copy_data_to_sales_user_table(frm);
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

function copy_data_to_sales_user_table(frm) {
    // Clear the sales user table
    frm.clear_table('mapper_automation_table_for_sales_user');

    // Copy data from mapper_automation_table to mapper_automation_table_for_sales_user
    frm.doc.mapper_automation_table.forEach(row => {
        if (row.customer_item_quantity > 0) {
            let new_row = frm.add_child('mapper_automation_table_for_sales_user');
            new_row.customer_line_item = row.customer_line_item;
            new_row.customer_item_quantity = row.customer_item_quantity;
            new_row.product_id = row.product_id;
            new_row.quantity = row.quantity;
            new_row.price = row.price;
            // new_row.cost = row.cost;
            new_row.total_price = row.total_price;
            // new_row.total_cost = row.total_cost;
            new_row.total_price_of_customer_line_item = row.total_price_of_customer_line_item;
            // new_row.total_cost_of_customer_line_item = row.total_cost_of_customer_line_item;
            // Add more fields as required
        }
    });

    frm.refresh_field('mapper_automation_table_for_sales_user');
}
