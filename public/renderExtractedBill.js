
export function renderExtractedBill(containerEl,extractedJson){
containerEl.innerHTML=`
<h2>Importand Info</h2>
<h3>Invoice Details:</h3>
<p>Vendor:${extractedJson.invoice_details.vendor ?? "Unknown"}</p>
<p>Invoice Number:${extractedJson.invoice_details.invoice_number ?? "Unknown"}</p>
<p>Invoice Type:${extractedJson.invoice_details.invoice_type ?? "Unknown"}</p>
<p>Issue Date:${extractedJson.invoice_details.issue_date ?? "Unknown"}</p>
<p>Due Date:${extractedJson.invoice_details.due_date ?? "Unknown"}</p>
<p>Payment Password:${extractedJson.invoice_details.payment_password ?? "Unknown"}</p>
<p>Next Measurement Date:${extractedJson.invoice_details.next_measurement_date ?? "Unknown"}</p>
<p>Provider Number:${extractedJson.invoice_details.provider_number ?? "Unknown"}</p>
<p>Contract Number:${extractedJson.invoice_details.contract_number ?? "Unknown"}</p><br>

<h3>Customer Details:</h3>
<p>Full Name:${extractedJson.customer.full_name ?? "Unkown"}</p>
<p>Address:${extractedJson.customer.address ?? "Unkown"}</p>
<p>Property Address:${extractedJson.customer.property_address ?? "Unkown"}</p><br>

<h3>Financials:</h3>
<p>Total Payable Amount:${extractedJson.financials.total_payable_amount ?? "Unkown"} €</p>
<p>Net Consumption Amount:${extractedJson.financials.net_consumption_amount ?? "Unkown"} €</p>
<p>Total Taxes & Fees:${extractedJson.financials.total_taxes_and_fees ?? "Unkown"} €</p>
<p>Currency:${extractedJson.financials.currency ?? "Unkown"} </p><br>

<h3>Consumption Stats:</h3>
<p>Total Kwh:${extractedJson.consumption_stats.total_kwh ?? "Unkown"} </p>
<p>Period Days:${extractedJson.consumption_stats.period_days ?? "Unkown"} </p>
<p>Daily Average Kwh:${extractedJson.consumption_stats.daily_avg_kwh ?? "Unkown"} </p>
<p>Cost Per Kwh Net:${extractedJson.consumption_stats.cost_per_kwh_net ?? "Unkown"} </p>
<p>Cost Per Kwh Gross:${extractedJson.consumption_stats.cost_per_kwh_gross ?? "Unkown"} </p><br>

<h3>Ai Analysis:</h3>
<p id="ai_analysis" >${extractedJson.ai_analysis}</p>
`
}   

/*
{
  "invoice_details": {
    "vendor": "ΔΕΗ Α.Ε. (Public Power Corporation S.A.)",
    "invoice_number": "1481152881",
    "invoice_type": "Εκκαθαριστικός (Settlement Bill)",
    "issue_date": "04/03/2026",
    "due_date": "26/03/2026",
    "payment_password": "RF68907738000300015852167",
    "next_measurement_date": "01/04/2026",
    "provider_number": "3 31608537-01 4",
    "contract_number": "300015852167"
  },
  "customer": {
    "full_name": "KIRAOU MARTSEL LEON",
    "address": "CHALKIS 9-KYKLADON, 133 41 ANO LIOSIA",
    "property_address": "BESKAKI, 200 03 AG. THEODOROI"
  },
  "financials": {
    "total_payable_amount": 16,
    "net_consumption_amount": 19.67,
    "total_taxes_and_fees": 15.01,
    "currency": "EUR"
  },
  "consumption_stats": {
    "total_kwh": 53,
    "period_days": 62,
    "daily_avg_kwh": 0.85,
    "cost_per_kwh_net": 0.371,
    "cost_per_kwh_gross": 0.567
  },
  "ai_analysis": "This is a settlement bill (Εκκαθαριστικός) based on actual meter readings (2243 to 2296). 
  The consumption is very low (53 kWh over 62 days), suggesting a secondary residence or a period of minimal activity. 
  The final amount of €16.00 is reached after deducting a previous estimated payment (Έναντι) of €18.68. 
  The bill includes municipal taxes for the Loutraki - Ag. Theodoroi region and a 'Green Pass Home' surcharge. Payment is due by March 26, 2026."
  */