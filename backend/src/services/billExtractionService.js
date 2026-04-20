import {processInvoice} from "../aiClient.js";
import {bucket} from "../config/firebaseAdmin.js"

// i will get the uid and storagePath from the controller:
export async function extractBillInfo(uid,storagePath){
    try{

        if(!storagePath.startsWith(`users/${uid}/`)) throw new Error('Problem with user');
        const file=bucket.file(storagePath);
        const [buffer]=await file.download();// buffer is binary
        const [metadata]=await file.getMetadata();
        // const ext=path.extname(storagePath).toLowerCase();
        const mimeType=metadata.contentType;
        const base64=buffer.toString("base64");// we turn binary into text, so we can use it in json
//here i will call the ai:
let jsonInfo= await processInvoice(base64,mimeType);
//we cleanup the ai output so we can use it as json format:
const jsonMatch = jsonInfo.match(/```json\s?([\s\S]*?)\s?```/) || jsonInfo.match(/```([\s\S]*?)\s?```/);
const cleanData = jsonMatch ? jsonMatch[1].trim() : jsonInfo.trim();

const obj=JSON.parse(cleanData);
obj.raw_data_snapshot = obj.raw_data_snapshot ?? {};
obj.raw_data_snapshot.raw_ai_response = jsonInfo;
obj.consumption = obj.consumption ?? {};
obj.financials = obj.financials ?? {};

//here we will do the math calculations:
if(obj && obj.category==="electricity"){
    // 1. Initialize the stats as null
obj.consumption.daily_average = null;
obj.consumption.cost_per_unit_net = null;
obj.consumption.cost_per_day_net = null;
obj.consumption.cost_per_day_gross = null;
// 1. Calculate Net Amount
const netAmount = (obj.financials.charges_supply_vendor + obj.financials.regulated_charges).toFixed(3);
obj.financials.net_consumption_amount = netAmount;
obj.financials.total_taxes_and_fees=obj.financials.municipality_fees+obj.financials.vat;
obj.financials.payable_amount=netAmount+obj.financials.total_taxes_and_fees-obj.financials.advance_charges;

// // 2. Safely calculate consumption stats (using your consumption object)
if (obj.consumption.total_usage > 0 && obj.consumption.period_days > 0) {
    
//     // Average amount consumed per day (e.g., 5 kWh/day)
    obj.consumption.daily_average = Number((obj.consumption.total_usage / obj.consumption.period_days).toFixed(3));
    
//     // How much the "thing" (kWh/m3) costs itself (Efficiency)
    obj.consumption.cost_per_unit_net = Number((netAmount / obj.consumption.total_usage).toFixed(3));
    obj.consumption.cost_per_unit_gross = Number((obj.financials.total_payable_amount / obj.consumption.total_usage).toFixed(3));
    
//     // How much you pay per day (Cost intensity)
    obj.consumption.cost_per_day_net = Number((netAmount / obj.consumption.period_days).toFixed(3));
    obj.consumption.cost_per_day_gross =Number( (obj.financials.total_payable_amount / obj.consumption.period_days).toFixed(3));

}
}

if(obj && obj.category==="water"){
const netAmount = Number(obj.financials.net_consumption_amount ?? 0);
obj.financials.total_taxes_and_fees=obj.financials.total_payable_amount-obj.financials.net_consumption_amount;
//     // Average amount consumed per day (e.g., 5 kWh/day)
obj.consumption.daily_average = Number((obj.consumption.total_usage / obj.consumption.period_days).toFixed(2));
//     // How much the "thing" (kWh/m3) costs itself (Efficiency)
obj.consumption.cost_per_unit_net = Number((netAmount / obj.consumption.total_usage).toFixed(2));
obj.consumption.cost_per_unit_gross = Number((obj.financials.total_payable_amount / obj.consumption.total_usage).toFixed(2));

//     // How much you pay per day (Cost intensity)
obj.consumption.cost_per_day_net = Number((netAmount / obj.consumption.period_days).toFixed(2));
obj.consumption.cost_per_day_gross =Number( (obj.financials.total_payable_amount / obj.consumption.period_days).toFixed(2));
}

console.log('output from extractBillInfo:',obj);


return obj;

    }catch(err){
        console.error('Error:',err.message)
        throw err;
    }


}
