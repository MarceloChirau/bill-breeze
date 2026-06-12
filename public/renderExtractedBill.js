export function renderExtractedBill(containerEl, extractedJson) {
  const category = extractedJson.category?.toLowerCase() ?? 'unknown';

  const units = { electricity: 'kWh', water: 'm³', internet: 'GB', telecom: 'min' };
  const unit = units[category] ?? 'units';

  const val = (v) => v ?? '—';
  const money = (v) => v != null ? `${v} €` : '—';
  const usage = (v) => v != null ? `${v} ${unit}` : '—';

  const field = (label, value) => `
      <div class="flex justify-between items-start py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
          <span class="text-sm text-gray-500 dark:text-gray-400">${label}</span>
          <span class="text-sm text-gray-900 dark:text-white font-medium text-right ml-4">${value}</span>
      </div>`;

  const section = (title, rows) => `
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-3">
          <div class="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">${title}</h3>
          </div>
          <div class="px-5 py-1">${rows}</div>
      </div>`;

  const i = extractedJson.invoice_details ?? {};
  const c = extractedJson.customer ?? {};
  const f = extractedJson.financials ?? {};
  const s = extractedJson.consumption ?? {};

  containerEl.innerHTML = `
      <div class="space-y-3 mb-6">
          <div class="flex items-center gap-2 mb-4">
              <span class="text-xs px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 font-medium">${extractedJson.category ?? 'Bill'}</span>
              <h2 class="text-base font-medium text-gray-900 dark:text-white">Extracted details</h2>
          </div>

          ${section('Invoice details',
              field('Vendor', val(i.vendor)) +
              field('Invoice number', val(i.invoice_number)) +
              field('Type', val(i.invoice_type)) +
              field('Issue date', val(i.issue_date)) +
              field('Due date', val(i.due_date)) +
              field('Contract number', val(i.contract_number)) +
              field('Provider number', val(i.provider_number)) +
              field('Payment reference', val(i.payment_password)) +
              field('Next measurement', val(i.next_measurement_date))
          )}

          ${section('Customer',
              field('Name', val(c.full_name)) +
              field('Address', val(c.address)) +
              field('Property address', val(c.property_address))
          )}

          ${section('Financials',
              field('Total payable', money(f.total_payable_amount)) +
              field('Net consumption', money(f.net_consumption_amount)) +
              field('Taxes & fees', money(f.total_taxes_and_fees)) +
              field('Currency', val(f.currency))
          )}

          ${section('Consumption',
              field('Total usage', usage(s.total_usage)) +
              field('Period', s.period_days != null ? `${s.period_days} days` : '—') +
              field('Daily average', usage(s.daily_average)) +
              field('Cost per unit (net)', money(s.cost_per_unit_net)) +
              field('Cost per unit (gross)', money(s.cost_per_unit_gross)) +
              field('Cost per day (net)', money(s.cost_per_day_net)) +
              field('Cost per day (gross)', money(s.cost_per_day_gross))
          )}

          <div class="bg-sky-50 dark:bg-sky-900/20 rounded-2xl border border-sky-100 dark:border-sky-800 p-5">
              <h3 class="text-sm font-medium text-sky-900 dark:text-sky-200 mb-2">AI analysis</h3>
              <p class="text-sm text-sky-800 dark:text-sky-300 leading-relaxed">${val(extractedJson.ai_analysis)}</p>
          </div>
      </div>`;
}