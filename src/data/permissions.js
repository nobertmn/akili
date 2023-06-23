import Settings from "./permissions/settings"
import Reports from "./permissions/reports"
import Accounts from "./permissions/accounts"
import Maintenance from "./permissions/maintenance"
import Purchases from "./permissions/purchases"
import Register from "./permissions/register"
import Dashboard from "./permissions/dashboard"
import Alerts from "./permissions/alerts"
///nyd
///edit the configs below to be correct after team agreements on who access what
export default {
    //super role
    1: {
        id: 1,
        name: "Super Role",
        description: "Has access to everything in the system, the super user",
        modules: {
            ...Settings
            .set()
            .configs("yes", "no", "yes", "no")
            .branches("yes", "yes", "yes", "yes")
            .sites("yes", "yes", "yes", "yes")
            .departments("no", "yes", "no", "no")
            .profile("yes", "no", "yes", "no")
            .users("yes", "yes", "yes", "yes")
            .permissions("no", "no", "no", "no")
            .roles("no", "no", "no", "no")
            .yield(),
            ...Reports
            .set()
            .assets("yes", "no", "no", "no")
            .assetsRegister("yes", "no", "no", "no")
            .assetsAcquisitions("yes", "no", "no", "no")
            .assetsImpairments("yes", "no", "no", "no")
            .assetsMaintenance("yes", "no", "no", "no")
            .financials("yes", "no", "no", "no")
            .financialsBalanceSheet("yes", "no", "no", "no")
            .financialsIncomeStatement("yes", "no", "no", "no")
            .financialsSales("yes", "no", "no", "no")
            .yield(),
            ...Accounts
            .set()
            .generalLedger("yes", "no", "no", "no")
            .chartOfAccounts("yes", "yes", "yes", "yes")
            .paymentTypes("yes", "yes", "yes", "yes")
            .yield(),
            ...Maintenance
            .set()
            .maintenance("yes", "yes", "yes", "yes")
            .insurance("yes", "yes", "yes", "yes")
            .warranty("yes", "yes", "yes", "yes")
            .impairment("yes", "yes", "yes", "yes")
            .verification("yes", "yes", "yes", "yes")
            .yield(),
            ...Purchases
            .set()
            .yield(),
            ...Register
            .set()
            .yield(),
            ...Dashboard
            .set()
            .yield(),
            ...Alerts
            .set()
            .yield()
        }
    },
    2: {
        id: 2,
        name: "Asset Manager",
        description: "Is in charge of managing the company's assets",
        modules: {
            ...Settings
            .set()
            .configs("yes", "no", "yes", "no")
            .branches("yes", "yes", "yes", "yes")
            .sites("yes", "yes", "yes", "yes")
            .departments("no", "yes", "no", "no")
            .profile("yes", "no", "yes", "no")
            .users("yes", "yes", "yes", "yes")
            .permissions("no", "no", "no", "no")
            .roles("no", "no", "no", "no")
            .yield(),
            ...Reports
            .set()
            .assets("yes", "no", "no", "no")
            .assetsRegister("yes", "no", "no", "no")
            .assetsAcquisitions("yes", "no", "no", "no")
            .assetsImpairments("yes", "no", "no", "no")
            .assetsMaintenance("yes", "no", "no", "no")
            .financials("yes", "no", "no", "no")
            .financialsBalanceSheet("yes", "no", "no", "no")
            .financialsIncomeStatement("yes", "no", "no", "no")
            .financialsSales("yes", "no", "no", "no")
            .yield(),
            ...Accounts
            .set()
            .generalLedger("yes", "no", "no", "no")
            .chartOfAccounts("yes", "yes", "yes", "yes")
            .paymentTypes("yes", "yes", "yes", "yes")
            .yield(),
            ...Maintenance
            .set()
            .maintenance("yes", "yes", "yes", "yes")
            .insurance("yes", "yes", "yes", "yes")
            .warranty("yes", "yes", "yes", "yes")
            .impairment("yes", "yes", "yes", "yes")
            .verification("yes", "yes", "yes", "yes")
            .yield(),
            ...Purchases
            .set()
            .yield(),
            ...Register
            .set()
            .yield(),
            ...Dashboard
            .set()
            .yield(),
            ...Alerts
            .set()
            .yield()
        }
    },
    3: {
        id: 3,
        name: "Head Of Accounts",
        description: "Usually an accountant, runs finacial related tasks",
        modules: {
            ...Settings
            .set()
            .configs("yes", "no", "yes", "no")
            .branches("yes", "yes", "yes", "yes")
            .sites("yes", "yes", "yes", "yes")
            .departments("no", "yes", "no", "no")
            .profile("yes", "no", "yes", "no")
            .users("yes", "yes", "yes", "yes")
            .permissions("no", "no", "no", "no")
            .roles("no", "no", "no", "no")
            .yield(),
            ...Reports
            .set()
            .assets("yes", "no", "no", "no")
            .assetsRegister("yes", "no", "no", "no")
            .assetsAcquisitions("yes", "no", "no", "no")
            .assetsImpairments("yes", "no", "no", "no")
            .assetsMaintenance("yes", "no", "no", "no")
            .financials("yes", "no", "no", "no")
            .financialsBalanceSheet("yes", "no", "no", "no")
            .financialsIncomeStatement("yes", "no", "no", "no")
            .financialsSales("yes", "no", "no", "no")
            .yield(),
            ...Accounts
            .set()
            .generalLedger("yes", "no", "no", "no")
            .chartOfAccounts("yes", "yes", "yes", "yes")
            .paymentTypes("yes", "yes", "yes", "yes")
            .yield(),
            ...Maintenance
            .set()
            .maintenance("yes", "yes", "yes", "yes")
            .insurance("yes", "yes", "yes", "yes")
            .warranty("yes", "yes", "yes", "yes")
            .impairment("yes", "yes", "yes", "yes")
            .verification("yes", "yes", "yes", "yes")
            .yield(),
            ...Purchases
            .set()
            .yield(),
            ...Register
            .set()
            .yield(),
            ...Dashboard
            .set()
            .yield(),
            ...Alerts
            .set()
            .yield()
        }
    },
    4: {
        id: 4,
        name: "Store Manager",
        description: "Manages the company's assets storage activities",
        modules: {
            ...Settings
            .set()
            .configs("yes", "no", "yes", "no")
            .branches("yes", "yes", "yes", "yes")
            .sites("yes", "yes", "yes", "yes")
            .departments("no", "yes", "no", "no")
            .profile("yes", "no", "yes", "no")
            .users("yes", "yes", "yes", "yes")
            .permissions("no", "no", "no", "no")
            .roles("no", "no", "no", "no")
            .yield(),
            ...Reports
            .set()
            .assets("yes", "no", "no", "no")
            .assetsRegister("yes", "no", "no", "no")
            .assetsAcquisitions("yes", "no", "no", "no")
            .assetsImpairments("yes", "no", "no", "no")
            .assetsMaintenance("yes", "no", "no", "no")
            .financials("yes", "no", "no", "no")
            .financialsBalanceSheet("yes", "no", "no", "no")
            .financialsIncomeStatement("yes", "no", "no", "no")
            .financialsSales("yes", "no", "no", "no")
            .yield(),
            ...Accounts
            .set()
            .generalLedger("yes", "no", "no", "no")
            .chartOfAccounts("yes", "yes", "yes", "yes")
            .paymentTypes("yes", "yes", "yes", "yes")
            .yield(),
            ...Maintenance
            .set()
            .maintenance("yes", "yes", "yes", "yes")
            .insurance("yes", "yes", "yes", "yes")
            .warranty("yes", "yes", "yes", "yes")
            .impairment("yes", "yes", "yes", "yes")
            .verification("yes", "yes", "yes", "yes")
            .yield(),
            ...Purchases
            .set()
            .yield(),
            ...Register
            .set()
            .yield(),
            ...Dashboard
            .set()
            .yield(),
            ...Alerts
            .set()
            .yield()
        }
    },
    5: {
        id: 5,
        name: "Company Staff",
        description: "Usally given to one who is just a custodian of an asset",
        modules: {
            ...Settings
            .set()
            .configs("yes", "no", "yes", "no")
            .branches("yes", "yes", "yes", "yes")
            .sites("yes", "yes", "yes", "yes")
            .departments("no", "yes", "no", "no")
            .profile("yes", "no", "yes", "no")
            .users("yes", "yes", "yes", "yes")
            .permissions("no", "no", "no", "no")
            .roles("no", "no", "no", "no")
            .yield(),
            ...Reports
            .set()
            .assets("yes", "no", "no", "no")
            .assetsRegister("yes", "no", "no", "no")
            .assetsAcquisitions("yes", "no", "no", "no")
            .assetsImpairments("yes", "no", "no", "no")
            .assetsMaintenance("yes", "no", "no", "no")
            .financials("yes", "no", "no", "no")
            .financialsBalanceSheet("yes", "no", "no", "no")
            .financialsIncomeStatement("yes", "no", "no", "no")
            .financialsSales("yes", "no", "no", "no")
            .yield(),
            ...Accounts
            .set()
            .generalLedger("yes", "no", "no", "no")
            .chartOfAccounts("yes", "yes", "yes", "yes")
            .paymentTypes("yes", "yes", "yes", "yes")
            .yield(),
            ...Maintenance
            .set()
            .maintenance("yes", "yes", "yes", "yes")
            .insurance("yes", "yes", "yes", "yes")
            .warranty("yes", "yes", "yes", "yes")
            .impairment("yes", "yes", "yes", "yes")
            .verification("yes", "yes", "yes", "yes")
            .yield(),
            ...Purchases
            .set()
            .yield(),
            ...Register
            .set()
            .yield(),
            ...Dashboard
            .set()
            .yield(),
            ...Alerts
            .set()
            .yield()
        }
    },
}