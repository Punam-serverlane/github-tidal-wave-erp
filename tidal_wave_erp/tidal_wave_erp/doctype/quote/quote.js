// Copyright (c) 2024, Serverlane Technologies and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Quote", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Quote', {
    select_mapper_automation: function(frm) {
        if (frm.doc.select_mapper_automation) {
            frappe.call({
                method: 'tidal_wave_erp.tidal_wave_erp.doctype.quote.quote.fill_quote_table',
                args: {
                    mapper_automation_id: frm.doc.select_mapper_automation
                },
                callback: function(r) {
                    if (r.message) {
                        frm.clear_table('quote_table');
                        frm.clear_table('quote_table_for_sales_user'); // Clear the new table as well
                        $.each(r.message, function(_i, item) {
                            let row = frm.add_child('quote_table');
                            row.customer_line_item = item.customer_line_item;
                            row.customer_item_quantity = item.customer_item_quantity;
                            row.total_price = item.total_price;
                            row.total_cost = item.total_cost;
                            // Add other fields as needed

                            // Copy the same data to the new table
                            let new_row = frm.add_child('quote_table_for_sales_user');
                            new_row.customer_line_item = item.customer_line_item;
                            new_row.customer_item_quantity = item.customer_item_quantity;
                            new_row.total_price = item.total_price;
                            new_row.total_cost = item.total_cost;
                            // Add other fields as needed
                        });
                        frm.refresh_field('quote_table');
                        frm.refresh_field('quote_table_for_sales_user'); // Refresh the new table
                    }
                }
            });
        }
    }
});

