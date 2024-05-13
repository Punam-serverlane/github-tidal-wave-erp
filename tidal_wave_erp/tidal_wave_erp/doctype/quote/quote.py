# Copyright (c) 2024, Serverlane Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Quote(Document):
	pass
    
	def validate(self):
		# Fetch the selected Customer Ask document
		mapper_automation_doc = frappe.get_doc("Mapper Automation", self.select_mapper_automation)
		
		# Clear existing entries in mapper_automation_table
		self.quote_table = []
		
		# Loop through each line item in mapper_automation_table child table
		for line_item in mapper_automation_doc.get('mapper_automation_table'):
			# Append each line item to mapper_automation_table
			self.append('quote_table', {
				'customer_line_item': line_item.customer_line_item,
				'customer_item_quantity': line_item.customer_item_quantity,
                # Add other fields as needed
            })
