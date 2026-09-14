/* ===== PRICING CALCULATION & QUOTATION ===== */

class PricingEngine {
  constructor() {
    this.pricing = MENU_DATA.pricing;
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    document
      .getElementById("print-quote")
      ?.addEventListener("click", () => this.printQuotation());
    document
      .getElementById("share-quote")
      ?.addEventListener("click", () => this.shareQuotation());
    document
      .getElementById("confirm-order")
      ?.addEventListener("click", () => this.confirmOrder());
  }

  calculatePricing() {
    const perPlateTotal = cart.getPerPlatePrice();
    const subtotal = perPlateTotal * cart.guestCount;
    const serviceCharge = subtotal * this.pricing.serviceCharge;
    const gstAmount = (subtotal + serviceCharge) * this.pricing.gstRate;
    const delivery = this.pricing.deliveryCharge;
    const grandTotal = subtotal + serviceCharge + gstAmount + delivery;

    return {
      perPlateTotal,
      subtotal,
      serviceCharge,
      gstAmount,
      delivery,
      grandTotal,
      itemsCount: cart.items.length,
    };
  }

  generateQuotationHTML() {
    const pricing = this.calculatePricing();
    const customerName =
      document.getElementById("customer-name")?.value || "Valued Customer";
    const customerPhone =
      document.getElementById("customer-phone")?.value || "N/A";
    const customerEmail =
      document.getElementById("customer-email")?.value || "N/A";
    const eventDate =
      document.getElementById("event-date")?.value || "To be decided";
    const venue = document.getElementById("venue")?.value || "N/A";

    let html = `
            <div class="quotation-document">
                <div class="quotation-header">
                    <h3>ANUBHAV CATERING & EVENT SERVICES</h3>
                    <p>Premium Indian Wedding & Event Catering</p>
                    <p>📞 +91-XXXX-XXXX-XX | 📧 info@anubhavcatering.com</p>
                </div>

                <div class="quotation-details">
                    <h4>QUOTATION</h4>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN")}</p>
                    <p><strong>Quotation ID:</strong> Q-${Date.now()}</p>
                </div>

                <div class="customer-details">
                    <h4>Customer Information</h4>
                    <div class="detail-row">
                        <span><strong>Name:</strong> ${customerName}</span>
                        <span><strong>Phone:</strong> ${customerPhone}</span>
                    </div>
                    <div class="detail-row">
                        <span><strong>Email:</strong> ${customerEmail}</span>
                    </div>
                </div>

                <div class="event-details">
                    <h4>Event Information</h4>
                    <div class="detail-row">
                        <span><strong>Guest Count:</strong> ${cart.guestCount}</span>
                        <span><strong>Date:</strong> ${eventDate}</span>
                    </div>
                    <div class="detail-row">
                        <span><strong>Venue:</strong> ${venue}</span>
                    </div>
                </div>

                <div class="menu-details">
                    <h4>Selected Menu (${pricing.itemsCount} Items)</h4>
                    <table class="menu-table">
                        <thead>
                            <tr>
                                <th>Dish</th>
                                <th>Qty</th>
                                <th>Price/Person</th>
                                <th>Per Guest</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cart.items
                              .map(
                                (item) => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>${formatCurrency(item.price)}</td>
                                    <td>${formatCurrency(item.price * item.quantity)}</td>
                                </tr>
                            `,
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>

                <div class="pricing-details">
                    <h4>Pricing Breakdown</h4>
                    <div class="pricing-item">
                        <span>Per Plate Price (Average)</span>
                        <strong>${formatCurrency(pricing.perPlateTotal)}</strong>
                    </div>
                    <div class="pricing-item">
                        <span>Subtotal (${cart.guestCount} Guests)</span>
                        <strong>${formatCurrency(pricing.subtotal)}</strong>
                    </div>
                    <div class="pricing-item">
                        <span>Service Charge (10%)</span>
                        <strong>${formatCurrency(pricing.serviceCharge)}</strong>
                    </div>
                    <div class="pricing-item">
                        <span>GST @ 5%</span>
                        <strong>${formatCurrency(pricing.gstAmount)}</strong>
                    </div>
                    <div class="pricing-item">
                        <span>Delivery Charge</span>
                        <strong>${formatCurrency(pricing.delivery)}</strong>
                    </div>
                    <hr>
                    <div class="pricing-item total">
                        <span>GRAND TOTAL</span>
                        <strong>${formatCurrency(pricing.grandTotal)}</strong>
                    </div>
                </div>

                <div class="quotation-footer">
                    <p><strong>Terms & Conditions:</strong></p>
                    <ul>
                        <li>50% advance required to confirm booking</li>
                        <li>Remaining payment due 3 days before event</li>
                        <li>Menu can be modified up to 7 days before event</li>
                        <li>Prices valid for 30 days from quotation date</li>
                    </ul>
                    <p style="text-align: center; margin-top: 2rem;">Thank you for choosing Anubhav Catering!</p>
                </div>
            </div>
        `;

    return html;
  }

  displayQuotation() {
    const container = document.getElementById("quotation-preview");
    if (container) {
      container.innerHTML = this.generateQuotationHTML();
    }
  }

  printQuotation() {
    const html = this.generateQuotationHTML();
    const printWindow = window.open("", "", "width=900,height=600");
    printWindow.document.write(`
            <html>
            <head>
                <title>Quotation - Anubhav Catering</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                    h3 { color: #f39c12; }
                    h4 { color: #121212; margin-top: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                    th { background-color: #f0f0f0; }
                    .pricing-item { display: flex; justify-content: space-between; padding: 8px 0; }
                    .pricing-item.total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #121212; }
                    .detail-row { display: flex; gap: 40px; margin: 5px 0; }
                </style>
            </head>
            <body>${html}</body>
            </html>
        `);
    printWindow.document.close();
    printWindow.print();
  }

  shareQuotation() {
    const customerEmail = document.getElementById("customer-email")?.value;
    if (!customerEmail) {
      showToast("⚠️ Please enter email address");
      return;
    }

    // In a real application, this would send via email or API
    showToast("📧 Quotation email feature coming soon!");
  }

  confirmOrder() {
    if (cart.items.length === 0) {
      showToast("⚠️ Please select dishes first");
      return;
    }

    const customerName = document.getElementById("customer-name")?.value;
    const customerPhone = document.getElementById("customer-phone")?.value;

    if (!customerName || !customerPhone) {
      showToast("⚠️ Please enter customer details");
      return;
    }

    showToast("✅ Order confirmed! Our team will contact you shortly.");
    // In a real application, this would submit to a backend service
  }
}

// Initialize pricing
const pricingEngine = new PricingEngine();
