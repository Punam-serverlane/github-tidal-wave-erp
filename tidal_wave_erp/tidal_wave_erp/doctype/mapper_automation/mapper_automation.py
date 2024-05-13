# Copyright (c) 2024, Serverlane Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class MapperAutomation(Document):
	pass

    
	def validate(self):
		# Fetch the selected Customer Ask document
		customer_ask_doc = frappe.get_doc("Customer Ask", self.select_customer_ask)
		
		# Clear existing entries in mapper_automation_table
		self.mapper_automation_table = []
		
		# Loop through each line item in customer_line_items child table
		for line_item in customer_ask_doc.get('customer_line_items'):
			# Append each line item to mapper_automation_table
			self.append('mapper_automation_table', {
				'customer_line_item': line_item.customer_line_item,
				'customer_item_quantity': line_item.customer_item_quantity,
                # Add other fields as needed
            })