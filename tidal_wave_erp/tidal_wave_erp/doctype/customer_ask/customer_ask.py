# Copyright (c) 2024, Serverlane Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CustomerAsk(Document):
    def validate(self):
        self.create_mapper_automation()

    def create_mapper_automation(self):
        # Create a new Mapper Automation document
        new_mapper_automation = frappe.new_doc("Mapper Automation")
        
        # Set the link field and other fields
        new_mapper_automation.select_customer_ask = self.name
        new_mapper_automation.customer_name = self.customer_name
        new_mapper_automation.status = "In Progress"
        
        # Loop through the child table of customer_ask and add entries to mapper_automation's child table
        for item in self.customer_line_items:
            new_mapper_automation.append('mapper_automation_table', {
                'customer_line_item': item.customer_line_item,
                'customer_item_quantity': item.customer_item_quantity
            })
        
        # Insert the new Mapper Automation document into the database
        new_mapper_automation.insert()
        
        # Optionally, commit the transaction to save changes immediately
        # frappe.db.commit()
