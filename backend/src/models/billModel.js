import mongoose from 'mongoose'

const billSchema=new mongoose.Schema({
    "category":{
        type:String,
        enum:["electricity", "water", "internet", "telecom"]
    },
    "raw_data_snapshot":{
        "ai_model_used":String,
        "timestamp":Date,
        "raw_ai_response":String,
        "processing_latency_ms":Number
    },
    "invoice_details":{
        "vendor":String,
        "invoice_number":{
            type:String,
            unique:[true,"There is already another invoice with this number"],
            required:[true,'every invoice should have a number']

        },
        "invoice_type":String,
        "issue_date": Date,
    "due_date": Date,
    "payment_password": String,
    "next_measurement_date": Date,
    "provider_number": String,
    "contract_number": String
    },
"customer": {
    "full_name": String,
    "address": String,
    "property_address": String
  },
  "financials": {
    "charges_supply_vendor": Number,
    "regulated_charges": Number,
    "advance_charges": Number,
    "municipality_fees": Number,
    "vat": Number,
    "total_payable_amount": Number,
    "net_consumption_amount": Number,
    "total_taxes_and_fees": Number,
    "currency":{
        type:String,
        default:"EUR"
    }
  },
  "consumption": {
    "unit":{
        type:String,
        enum:['kwh','m3','GB','min']
    },            
    "total_usage": Number,         
    "period_days": Number,         
    "daily_average": Number,       
    "cost_per_unit_net": Number,   
    "cost_per_unit_gross": Number,
    "cost_per_day_net": Number,
    "cost_per_day_gross": Number
  },
  "ai_analysis": String

},{timestamps:true});

const Bill=new mongoose.model('Bill',billSchema);
export default Bill;