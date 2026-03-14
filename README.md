🛡️ Nexus IMS: Predictive Warehouse Command Center

Nexus IMS is a high-performance Inventory Management System designed for the Indian electronics market. It bridges the gap between static ERP data and proactive warehouse operations by integrating real-time predictive analytics with Odoo-style operational logic.

🚀 Key Features

🔐 Enterprise Security
2FA OTP Authentication: Secure login flow requiring a 4-digit verification code to ensure data integrity.

Role-Based Identity: "Warehouse Lead" profile management, simulating multi-level permission structures.

📈 Decision Support & Analytics
Stock-Out Predictor: Smart algorithms that calculate "Days Remaining" based on sales velocity to prevent inventory gaps.

Price Volatility Engine: INR-localized monitoring that flags low-profit margins if supplier costs fluctuate in the Indian market.

📦 Operational Excellence
Closed-Loop Synchronization: A unified global state ensuring that Receipts and Deliveries instantly update the master ledger.

The Audit Mode: A dedicated reconciliation interface for physical-to-digital inventory checks with automated discrepancy logging.

Product Journey: A comprehensive "biography" of every SKU, tracking its movement from initial receipt to final delivery.

Warehouse Heatmap: A visual grid for shelf-location tracking (A-101, B-202) to optimize picking and packing efficiency.

🛠️ Technical Stack
Frontend: React.js + Vite

Styling: Tailwind CSS (Custom "Electric Lime" Theme)

State Management: React Context & Hooks (Simulating Odoo stock.move logic)

Animations: Framer Motion / CSS Transitions

Localization: Intl.NumberFormat (INR Currency & Indian Numbering System)

📦 Installation & Setup
Clone the repository:

git clone https://github.com/your-username/nexus-ims.git
Navigate to the frontend directory:

cd nexus-ims/frontend
Install dependencies:

npm install
Launch the Development Server:

npm run dev
Note: node_modules are excluded via .gitignore to maintain a lightweight repository. Ensure you run npm install after cloning.
