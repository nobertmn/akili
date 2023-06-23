//nyd
//add as many standard departments as possible
//finish the descriptions
export default {
    departments: [{
        id: 1,
        name: "Human Resource (HR)",
        description: "Deals with employess wellfare and salaries"
    }, {
        id: 2,
        name: "Accounts",
        description: "Deals with managing company finances"
    }, {
        id: 3,
        name: "Marketing",
        description: ""
    }, {
        id: 4,
        name: "Sales",
        description: ""
    }, {
        id: 5,
        name: "IT",
        description: ""
    }, {
        id: 6,
        name: "Operations",
        description: ""
    }, {
        id: 7,
        name: "Managment",
        description: ""
    }, {
        id: 8,
        name: "Support",
        description: ""
    }],
    assetStatuses: [{
        id: 1,
        name: "In Store"
    }, {
        id: 2,
        name: "Allocated"
    }, {
        id: 3,
        name: "Under Maintenance"
    }, {
        id: 4,
        name: "Pending Transfer"
    }, {
        id: 5,
        name: "Needs Dispossal"
    }, {
        id: 6,
        name: "Pending Dispossal"
    }, {
        id: 7,
        name: "Disposed"
    }, {
        id: 8,
        name: "Lost Or Stolen"
    }],
    conditions: [
        {
            value: "excellent",
            label: "Excellent Condition",
        },
        {
            value: "good",
            label: "Good Condition",
        },
        {
            value: "fair",
            label: "Fair Condition",
        },
        {
            value: "bad",
            label: "Bad Condition",
        },
    ],
    disposalTypes:[
        {
            value: "End Of Life",
            label: "End Of Life",
        },
        {
            value: "Damaged Beyond Repair",
            label: "Damaged Beyond Repair",
        },
        {
            value: "Loss Or Theft",
            label: "Loss Or Theft",
        },
        {
            value: "Not In Use",
            label: "Not In Use",
        }
    ],
    dataTypes:[
        {
            value: "",
            label: "",
        },
        {
            value: "Text",
            label: "Text",
        },
        {
            value: "Number",
            label: "Numeric",
        },
        {
            value: "Money",
            label: "Money",
        },
        {
            value: "Date",
            label: "Date",
        }
    ],
    supplierTypes:[
        {
            value: "Business",
            label: "Business",
        },
        {
            value: "Manufacturer",
            label: "Manufacturer",
        },
        {
            value: "Organisation",
            label: "Organisation",
        },
        {
            value: "Individual",
            label: "Individual",
        }
    ],
    acquisitionTypes:[
        {
            value: "Procurement",
            label: "Procurement",
        },
        {
            value: "Manufacturing",
            label: "Manufacturing",
        },
        {
            value: "Construction",
            label: "Construction",
        },
        {
            value: "Donation",
            label: "Donation",
        }
    ],
    maintenanceTypes:[
        {
            value: "Scheduled",
            label: "Scheduled",
        },
        {
            value: "Emergency",
            label: "Emergency",
        }
    ],
    maintenanceStatuses:[
        {
            value: "pending",
            label: "Pending",
        },
        {
            value: "approved",
            label: "Approved",
        },
        {
            value: "rejected",
            label: "Rejected",
        },
        {
            value: "recalled",
            label: "Recalled",
        },
        {
            value: "returned",
            label: "Returned",
        },
        {
            value: "budgeted",
            label: "Budgeted",
        },
        {
            value: "budget approved",
            label: "Budget Approved",
        },
        {
            value: "budget rejected",
            label: "Budget Rejected",
        },
        {
            value: "finished",
            label: "Finished",
        }
    ],
    impairmentTypes: [
        {
            value: "PHYSICAL DAMAGE",
            label: "PHYSICAL DAMAGE",
        },
        {
            value: "DAMAGE BEYOND REPAIR",
            label: "DAMAGE BEYOND REPAIR",
        },
        {
            value: "LOSS OR THEFT",
            label: "LOSS OR THEFT",
        },
        {
            value: "CHANGE IN REGULATIONS",
            label: "CHANGE IN REGULATIONS",
        },
        {
            value: "OTHERS",
            label: "OTHERS",
        },
    ],
    warrantyTypes:[
        {
            value: "Express",
            label: "Express",
        },
        {
            value: "Implied",
            label: "Implied",
        }
    ],
    warrantyStatuses:[
        {
            value: "active",
            label: "Active",
        },
        {
            value: "utilized",
            label: "Utilized",
        },
        {
            value: "utilized & expired",
            label: "utilized & Expired",
        },
        {
            value: "expired",
            label: "Expired",
        }
    ], 
    accountTypes: [
        {
            value: "assets",
            label: "Assets", 
        },
        {
            value: "liabilities",
            label: "Liabilities", 
        },
        {
            value: "equity",
            label: "Equity", 
        },
        {
            value: "sales income",
            label: "Sales Income", 
        },
        {
            value: "cost of goods sold",
            label: "Cost Of Goods Sold", 
        },
        {
            value: "non operating or other income",
            label: "Non Operating or Other Income", 
        },
        {
            value: "selling expenses",
            label: "Selling Expenses", 
        },
        {
            value: "administrative expenses",
            label: "Administrative Expenses", 
        },
    ],
    finacialStatements: [
        {
            value: "balance sheet",
            label: "Balance Sheet", 
        },
        {
            value: "Income Statement",
            label: "Income Statement", 
        },
        {
            value: "cash flow statement",
            label: "Cash Flow Statement", 
        },
        {
            value: "statements of shareholder's equity",
            label: "Statements Of Shareholder's Equity", 
        }
    ],
    accountGroups: [
        {
            value: "cash",
            label: "Cash", 
        },
        {
            value: "accounts receivable",
            label: "Accounts Receivable", 
        },
        {
            value: "inventory",
            label: "Inventory", 
        },
        {
            value: "other current assets",
            label: "Other Current Assets", 
        },
        {
            value: "marketable securities",
            label: "Marketable Securities", 
        },
        {
            value: "property, plant and equipment, net",
            label: "Property, Plant and Equipment, net", 
        },
        {
            value: "other non-current assets",
            label: "Other Non-Current Assets", 
        },
        {
            value: "accounts payable",
            label: "Accounts Payable", 
        },
        {
            value: "deferred revenue",
            label: "Deferred Revenue", 
        },
        {
            value: "short-term debt",
            label: "Short-Term Debt", 
        },
        {
            value: "other current liabilities",
            label: "Other Current Liabilities", 
        },
        {
            value: "long-term debt",
            label: "Long-Term Debt", 
        },
        {
            value: "other non-current liabilities",
            label: "Other Non-Current Liabilities", 
        },
        {
            value: "common stock",
            label: "Common Stock", 
        },
        {
            value: "retained earnings",
            label: "Retained Earnings", 
        },
        {
            value: "accum comprehensive income",
            label: "Accum Comprehensive Income", 
        },
        {
            value: "fixed assets",
            label: "Fixed Assets -not sure 2b here", 
        },
        {
            value: "long-term assets",
            label: "Long-Term Assets -not sure 2b here", 
        },
        
    ],
    generalJournalExampleRows: [{
        id: 78,
        rowType: "year_row",
        formatedYear: "2011",
        formatedMonth: "",
        formatedDay: "",
        accountName: "",
        ref: "",
        formatedDebitAmount: "",
        formatedCreditAmount: "",
    },{
        id: 1,
        rowType: "debit_row",
        formatedYear: "",
        formatedMonth: "",
        formatedDay: "",
        accountName: "Cash",
        ref: "",
        formatedDebitAmount: "50,000",
        formatedCreditAmount: "",
    },{
        id: 2,
        rowType: "debit_row",
        formatedYear: "",
        formatedMonth: "Jan",
        formatedDay: "2",
        accountName: "Computer",
        ref: "",
        formatedDebitAmount: "20,000",
        formatedCreditAmount: "",
    },{
        id: 3,
        rowType: "credit_row",
        formatedYear: "",
        formatedMonth: "",
        formatedDay: "",
        accountName: "Owner's Equity_Miss Abida Masood",
        ref: "",
        formatedDebitAmount: "",
        formatedCreditAmount: "70,000",
    },{
        id: 4,
        rowType: "explain_row",
        formatedYear: "",
        formatedMonth: "",
        formatedDay: "",
        accountName: "Stared business with cash and computer",
        ref: "",
        formatedDebitAmount: "",
        formatedCreditAmount: "",
    },{
        id: 5,
        rowType: "debit_row",
        formatedYear: "",
        formatedMonth: "",
        formatedDay: "4",
        accountName: "Office Supplies",
        ref: "",
        formatedDebitAmount: "4,000",
        formatedCreditAmount: "",
    },{
        id: 6,
        rowType: "credit_row",
        formatedYear: "",
        formatedMonth: "",
        formatedDay: "4",
        accountName: "Accounts Payable",
        ref: "",
        formatedDebitAmount: "",
        formatedCreditAmount: "4,000",
    },{
        id: 7,
        rowType: "explain_row",
        formatedYear: "",
        formatedMonth: "",
        formatedDay: "",
        accountName: "Office Supplies purchase on credit",
        ref: "",
        formatedDebitAmount: "",
        formatedCreditAmount: "",
    }]
}