# Copyright (c) 2024, Serverlane Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Quote(Document):
    pass

@frappe.whitelist()
def fill_quote_table(mapper_automation_id):
    mapper_automation_doc = frappe.get_doc("Mapper Automation", mapper_automation_id)
    line_items = []

    for line_item in mapper_automation_doc.mapper_automation_table:
        if line_item.customer_item_quantity > 0:
            line_items.append({
                'customer_line_item': line_item.customer_line_item,
                'customer_item_quantity': line_item.customer_item_quantity,
                'total_price': line_item.total_price_of_customer_line_item,
                'total_cost': line_item.total_cost_of_customer_line_item
                # Add other fields as needed
            })
    
    return line_items

def update_quotes_from_mapper_automation(doc, method):
    # Get all quotes linked to this mapper_automation
    quotes = frappe.get_all("Quote", filters={"select_mapper_automation": doc.name})
    
    for quote in quotes:
        quote_doc = frappe.get_doc("Quote", quote.name)
        
        # Clear existing rows in the quote_table and quote_table_for_sales_user
        quote_doc.set("quote_table", [])
        quote_doc.set("quote_table_for_sales_user", [])
        
        # Add new rows from the updated mapper_automation_doc
        for line_item in doc.mapper_automation_table:
            if line_item.customer_item_quantity > 0:
                quote_doc.append("quote_table", {
                    'customer_line_item': line_item.customer_line_item,
                    'customer_item_quantity': line_item.customer_item_quantity,
                    'total_price': line_item.total_price_of_customer_line_item,
                    'total_cost': line_item.total_cost_of_customer_line_item
                    # Add other fields as needed
                })
                
                # Copy the same data to the new table
                quote_doc.append("quote_table_for_sales_user", {
                    'customer_line_item': line_item.customer_line_item,
                    'customer_item_quantity': line_item.customer_item_quantity,
                    'total_price': line_item.total_price_of_customer_line_item,
                    'total_cost': line_item.total_cost_of_customer_line_item
                    # Add other fields as needed
                })
        
        # Save and reload the updated quote document
        quote_doc.save()
        quote_doc.reload()
