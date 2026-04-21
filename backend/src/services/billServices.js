import Bill from "../models/billModel.js";

export function parseDate(dateStr){
    if(!dateStr)return null;
    const [day,month,year]=dateStr.split('/');
    return new Date(year,month-1,day)
}

export const saveOrUpdateBill=async(invoiceData)=>{
const filter={"invoice_details.invoice_number":invoiceData.invoice_details.invoice_number};
invoiceData.invoice_details.issue_date=  parseDate(invoiceData.invoice_details.issue_date)
invoiceData.invoice_details.due_date=  parseDate(invoiceData.invoice_details.due_date)
const update=invoiceData;
const bill=await Bill.findOneAndUpdate(filter,update,{
    new:true,
    upsert:true
})
return bill;
}

export const showAllBills=async()=>{
    const bills=await Bill.find();
    if(bills){

        console.log('bills:',bills);
    }
    return bills;
}