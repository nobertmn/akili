import Bee from './Bee'
import Utils from './'
export default {
    accountTypes: {
        "STOCKHOLDERS EQUITY": {
            "group": "EQUITY",
            "statement_type": "BALANCE SHEET"
        },
        "PLANT, PROPERTY AND EQUIPMENT": {
            "group": "ASSETS",
            "statement_type": "BALANCE SHEET"
        },
        "OPERATING REVENUE": {
            "group": "OPERATING REVENUE",
            "statement_type": "INCOME STATEMENT"
        },
        "OPERATING EXPENSES": {
            "group": "LIABILITIES",
            "statement_type": "INCOME STATEMENT"
        },
        "NON-OPERATING REVENUE": {
            "group": "NON-OPERATING REVENUE",
            "statement_type": "INCOME STATEMENT"
        },
        "NON CURRENT ASSETS": {
            "group": "ASSETS",
            "statement_type": "BALANCE SHEET"
        },
        "LONGTERM LIABILITIES": {
            "group": "LIABILITIES",
            "statement_type": "BALANCE SHEET"
        },
        "CURRENT LIABILITIES": {
            "group": "LIABILITIES",
            "statement_type": "BALANCE SHEET"
        },
        "CURRENT ASSETS": {
            "group": "ASSETS",
            "statement_type": "BALANCE SHEET"
        },
    },
    clearSession() {
        //remove token and user
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("config");
    },
    delay(callback) {
        var vm = this;
        var delay = localStorage.getItem("delay");
        if (delay) {
            delay = parseInt(delay)
            if (isNaN(delay) == true) {
                delay = 0;
            }
        } else {
            delay = 0;
        }
        if (delay > 0) {
            setTimeout(() => {
                callback(vm)
            }, delay);
        } else {
            callback(vm)
        }
    },
    trail(data, onSuccess, onErrors, isMock = false, vm = null) {
        if (typeof onSuccess == 'undefined') {
            onSuccess = function (x) {
                return x;
            }
        }
        if (typeof onErrors == 'undefined') {
            onErrors = function (x) {
                return x;
            }
        }
        var user = localStorage.getItem("mpola_user");
        if (user) {
            user = JSON.parse(user);
        } else {
            user = {
                tenant_of: "system",
                name: "system",
                id: 0,
                user_roles: [{
                    id: 0,
                    role: {
                        id: 0,
                        name: "system"
                    }
                }]
            }
        }
        data.who = (!data.who) ? user.name : data.who;
        data.user_id = (!data.user_id) ? user.id : data.user_id;
        data.role = (!data.role) ? user.user_roles[0].role.name : data.role;
        data.role_id = (!data.role_id) ? user.user_roles[0].role.id : data.role_id;
        var db_name = (!data.db_name) ? user.tenant_of : data.db_name;
        var trail = {
            who: data.who,
            user_id: data.user_id,
            activity: data.activity,
            role: data.role,
            role_id: data.role_id,
            description: data.description,
        }


        if (data.main_only && data.main_only === true) {
            var data = {
                "_main_": {
                    trail: {
                        ...trail,
                        hive_name: db_name
                    }
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    onSuccess(res)
                })
                .catch((errors) => {
                    console.log("main trail errors ", errors);
                    onErrors(errors)
                });
        } else {
            var data = {
                trail: { ...trail }
            };
            Bee.post(data, isMock)
                .then((res) => {
                    var data = {
                        "_main_": {
                            trail: {
                                ...trail,
                                hive_name: db_name
                            }
                        }
                    };
                    Bee.post(data, isMock)
                        .then((res) => {
                            onSuccess(res)
                        })
                        .catch((errors) => {
                            console.log("main trail errors ", errors);
                            onErrors(errors)
                        });
                })
                .catch((errors) => {
                    console.log("trail errors ", errors);
                    onErrors(errors)
                });
        }
    },
    register(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.clearSession();
        this.delay(function (http) {
            var name = `${formData.firstName.value} ${formData.lastName.value}`
            var data = {
                _f_register: {
                    app_name: formData.companyName.value,
                    name: name,
                    email: formData.email.value,
                    country: formData.country.value,
                    phone_number: formData.phoneNumber.value,
                    password: formData.password.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    //{"_f_register":"OK","_errors":[]}'
                    //record audit trails to main and tenant
                    http.trail({
                        who: name,
                        user_id: 1,
                        activity: "registration",
                        role: "superadmin",
                        role_id: 1,
                        description: "registration was successfull",
                        main_only: true
                    });
                    onSuccess(res)
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    registerDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.clearSession();
        this.delay(function () {
            var data = {
                "_main_": {
                    countries: {}
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        countries: Utils.toValueLabelList(res.countries, "name", "name")
                    })
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        })
    },
    activate(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.clearSession();
        this.delay(function () {
            var data = {
                _f_activate: {
                    code: formData.code.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    //nyd
                    //auto subscribe to basic package for a year
                    //{_f_activate: 'OK', _errors: Array(0)}
                    onSuccess(res)
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    login(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.clearSession();
        this.delay(function (http) {
            var data = {
                _f_login: {
                    password: formData.password.value,
                    email: formData.email.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    //{_f_login: {token: "", user: {}}, _errors: Array(0)}
                    localStorage.setItem("user", JSON.stringify(res._f_login.user));
                    localStorage.setItem("token", res._f_login.token);
                    localStorage.setItem("config", JSON.stringify(res._f_login.config));
                    http.trail({
                        who: res._f_login.user.name,
                        user_id: res._f_login.user.id,
                        activity: "login",
                        role: res._f_login.user.user_roles[0].role.name,
                        role_id: res._f_login.user.user_roles[0].role.id,
                        description: "user logged into the system",
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    logout() {
        this.clearSession();
    },
    forgotPassword(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.clearSession();
        this.delay(function (http) {
            var data = {
                _f_forgot: {
                    email: formData.email.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: formData.email.value,
                        user_id: 0,
                        activity: "forgot",
                        role: "",
                        role_id: 0,
                        description: "user asked fro a password reset",
                        main_only: true
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    passwordResetCode(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.clearSession();
        this.delay(function (http) {
            var data = {
                _f_password_edit_multitenat: {
                    email: formData.email.value,
                    password: formData.password.value,
                    code: formData.passwordResetCode.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: formData.email.value,
                        user_id: 0,
                        activity: "reset",
                        role: "",
                        role_id: 0,
                        description: "user reset their password",
                        main_only: true
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingBranchesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                "_main_": {
                    company_types: {}
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    var companyTypes = Utils.toValueLabelList(
                        res.company_types,
                        "id",
                        "name"
                    );
                    var tenantDbData = {
                        branches: {},
                        config: {}
                    };
                    Bee.get(tenantDbData, isMock, vm)
                        .then((resTenantDb) => {
                            onSuccess({
                                companyTypes: companyTypes,
                                branches: resTenantDb.branches,
                                config: resTenantDb.config,
                            })
                        })
                        .catch((errors) => {
                            onErrors(errors)
                        });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addBranch(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                branch: {
                    name: formData.name.value,
                    location: formData.location.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "add branch",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted branch " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateBranch(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                branch: {
                    name: formData.name.value,
                    location: formData.location.value,
                    _w: [
                        ["id", "e", formData.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit branch " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated branch details " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteBranch(branch, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                branch: {
                    _w: [
                        ["id", "e", branch.id]
                    ]
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete branch " + branch.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed branch " + JSON.stringify(branch),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    saveOnBoardingStep1(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                config: {
                    company_type: formData.companyType.value,
                    onboarding_step1_branches: "done",
                    _w: [
                        ["id", "e", "1"]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "completed step1 onboarding ",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "completed step1 onboarding: " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingSitesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                "_main_": {
                    company_types: {}
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    var companyTypes = Utils.toValueLabelList(
                        res.company_types,
                        "id",
                        "name"
                    );
                    var tenantDbData = {
                        branches: {},
                        sites: {
                            branch: {
                                _a: "id name"
                            }
                        },
                        config: {}
                    };
                    Bee.get(tenantDbData, isMock, vm)
                        .then((resTenantDb) => {
                            var branches = Utils.toValueLabelList(
                                resTenantDb.branches,
                                "id",
                                "name"
                            );
                            onSuccess({
                                companyTypes: companyTypes,
                                branches: branches,
                                config: resTenantDb.config,
                                sites: resTenantDb.sites,
                            })
                        })
                        .catch((errors) => {
                            onErrors(errors)
                        });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addSitesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var query = {
                branches: {}
            };
            Bee.get(query, isMock, vm)
                .then((res) => {
                    var branches = Utils.toValueLabelList(
                        res.branches,
                        "id",
                        "name"
                    );
                    onSuccess({
                        branches: branches
                    })
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addSite(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                site: {
                    branch_id: formData.branchId.value,
                    name: formData.name.value,
                    location: formData.location.value,
                    remarks: formData.remarks ? formData.remarks.value : ""
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "add site",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted company site " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateSite(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                site: {
                    branch_id: formData.branchId.value,
                    name: formData.name.value,
                    location: formData.location.value,
                    remarks: formData.remarks ? formData.remarks.value : "",
                    _w: [
                        ["id", "e", formData.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit site " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated site details " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteSite(site, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                site: {
                    _w: [
                        ["id", "e", site.id]
                    ]
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete site " + site.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed site " + JSON.stringify(site),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    saveOnBoardingStep2(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                config: {
                    onboarding_step2_sites: "done",
                    _w: [
                        ["id", "e", "1"]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "completed step2 onboarding ",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "completed step2 onboarding: " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingUsersDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                "_main_": {
                    company_types: {}
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    var companyTypes = Utils.toValueLabelList(
                        res.company_types,
                        "id",
                        "name"
                    );
                    var tenantDbData = {
                        config: {},
                        users: {
                            user_roles: {}
                        }
                    };
                    Bee.get(tenantDbData, isMock, vm)
                        .then((resTenantDb) => {
                            onSuccess({
                                companyTypes: companyTypes,
                                config: resTenantDb.config,
                                users: resTenantDb.users
                            })
                        })
                        .catch((errors) => {
                            onErrors(errors)
                        });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    saveOnBoardingStep3(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //post the users
            var data = {
                _f_invite: [{
                    email: formData.assetManager.value,
                    name: formData.assetManagerName.value,
                    as: 2
                }, {
                    email: formData.headOfAccounts.value,
                    name: formData.headOfAccountsName.value,
                    as: 3
                }, {
                    email: formData.storeManager.value,
                    name: formData.storeManagersName.value,
                    as: 4
                }, {
                    email: formData.companyStaff.value,
                    name: formData.companyStaffsName.value,
                    as: 5
                }]
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "invited users during onboarding",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "invited users: " + JSON.stringify(data),
                    });
                    //complete step3
                    var data2 = {
                        config: {
                            onboarding_step3_system_users: "done",
                            _w: [
                                ["id", "e", "1"]
                            ]
                        }
                    };
                    Bee.update(data2, isMock, vm)
                        .then((res) => {
                            http.trail({
                                who: user.name,
                                user_id: user.id,
                                activity: "completed step3 onboarding ",
                                role: user.user_roles[0].role.name,
                                role_id: user.user_roles[0].role.id,
                                description: "completed step3 onboarding: " + JSON.stringify(data2),
                            });
                            onSuccess(res);
                        })
                        .catch((errors) => {
                            onErrors(errors)
                        });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingChartOfAccountsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                "_main_": {
                    company_types: {
                        accounts: {}
                    }
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    var tenantDbData = {
                        config: {},
                        accounts: {}
                    };
                    Bee.get(tenantDbData, isMock, vm)
                        .then((resTenantDb) => {
                            onSuccess({
                                companyTypes: res.company_types,
                                config: resTenantDb.config,
                                accounts: resTenantDb.accounts,
                            })
                        })
                        .catch((errors) => {
                            onErrors(errors)
                        });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingAddAccounts(formData, onSuccess, onErrors, isMock = false, vm = null) {
        var accountTypes = this.accountTypes;
        this.delay(function (http) {
            var accountConfig = accountTypes[formData.type.value];
            var data = {
                account: {
                    ref_no: formData.refNo.value,
                    name: formData.name.value,
                    type: formData.type.value,
                    group: accountConfig.group,
                    statement_type: accountConfig.statement_type
                }
            };
            if (vm && vm.customeAccounts && vm.customeAccounts.length == 0) {
                //this is the first time so we are gona copy over the accounts
                //nyd
                //check that the new account is not a repeatition
                var tampData = {
                    ...data.account
                };
                data = {
                    accounts: []
                };
                for (let index = 0; index < vm.standardAccounts.length; index++) {
                    const standardAccount = vm.standardAccounts[index];
                    data.accounts.push({
                        ref_no: standardAccount.ref_no,
                        name: standardAccount.name,
                        type: standardAccount.type,
                        group: standardAccount.group,
                        statement_type: standardAccount.statement_type
                    });
                }
                data.accounts.push(tampData);
            }
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "added accounts",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted accounts  " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingUpdateAccount(formData, onSuccess, onErrors, isMock = false, vm = null) {
        var accountTypes = this.accountTypes;
        this.delay(function (http) {
            var accountConfig = accountTypes[formData.type.value];
            if (vm && vm.customeAccounts && vm.customeAccounts.length == 0) {
                //this is the first time so we are gona copy over the accounts
                //in this case update the account before copying it over
                var data = {
                    accounts: []
                };
                for (let index = 0; index < vm.standardAccounts.length; index++) {
                    const standardAccount = vm.standardAccounts[index];
                    if (vm.itemToEdit && vm.itemToEdit.id.toString() == standardAccount.id.toString()) {
                        data.accounts.push({
                            ref_no: formData.refNo.value,
                            name: formData.name.value,
                            type: formData.type.value,
                            group: accountConfig.group,
                            statement_type: accountConfig.statement_type,
                        });
                    } else {
                        data.accounts.push({
                            ref_no: standardAccount.ref_no,
                            name: standardAccount.name,
                            type: standardAccount.type,
                            group: standardAccount.group,
                            statement_type: standardAccount.statement_type
                        });
                    }
                }
                //in this case we do a post
                Bee.post(data, isMock, vm)
                    .then((res) => {
                        var userStr = localStorage.getItem("user");
                        var user = JSON.parse(userStr);
                        http.trail({
                            who: user.name,
                            user_id: user.id,
                            activity: "added accounts",
                            role: user.user_roles[0].role.name,
                            role_id: user.user_roles[0].role.id,
                            description: "inserted accounts  " + JSON.stringify(data),
                        });
                        onSuccess(res);
                    })
                    .catch((errors) => {
                        onErrors(errors)
                    });
            } else {
                var data = {
                    account: {
                        ref_no: formData.refNo.value,
                        name: formData.name.value,
                        type: formData.type.value,
                        group: accountConfig.group,
                        statement_type: accountConfig.statement_type,
                        _w: [
                            ["id", "e", formData.id]
                        ]
                    }
                };

                Bee.update(data, isMock, vm)
                    .then((res) => {
                        var userStr = localStorage.getItem("user");
                        var user = JSON.parse(userStr);
                        http.trail({
                            who: user.name,
                            user_id: user.id,
                            activity: "edit account " + formData.id,
                            role: user.user_roles[0].role.name,
                            role_id: user.user_roles[0].role.id,
                            description: "updated account details " + JSON.stringify(data),
                        });
                        onSuccess(res);
                    })
                    .catch((errors) => {
                        onErrors(errors)
                    });
            }
        });
    },
    onBoardingDeleteAccount(account, onSuccess, onErrors, isMock = false, vm = null) {
        //nyd
        //i think with every delete, we need to present a comfirmation dialogue box
        //also we need to delte the other related attached data
        //we also need to introduce an archive mode
        this.delay(function (http) {
            if (vm && vm.customeAccounts && vm.customeAccounts.length == 0) {
                //this is the first time so we are gona copy over the accounts
                //in this case remove the account before copying it over
                var data = {
                    accounts: []
                };
                for (let index = 0; index < vm.standardAccounts.length; index++) {
                    const standardAccount = vm.standardAccounts[index];
                    if (account && account.id.toString() == standardAccount.id.toString()) {
                        //continue, we dont wanna include this account
                    } else {
                        data.accounts.push({
                            ref_no: standardAccount.ref_no,
                            name: standardAccount.name,
                            type: standardAccount.type,
                            group: standardAccount.group,
                            statement_type: standardAccount.statement_type
                        });
                    }
                }
                //in this case we do a post
                Bee.post(data, isMock, vm)
                    .then((res) => {
                        var userStr = localStorage.getItem("user");
                        var user = JSON.parse(userStr);
                        http.trail({
                            who: user.name,
                            user_id: user.id,
                            activity: "added accounts",
                            role: user.user_roles[0].role.name,
                            role_id: user.user_roles[0].role.id,
                            description: "inserted accounts  " + JSON.stringify(data),
                        });
                        onSuccess(res);
                    })
                    .catch((errors) => {
                        onErrors(errors)
                    });
            } else {
                var data = {
                    account: {
                        _w: [
                            ["id", "e", account.id]
                        ]
                    }
                };
                Bee.delete(data, isMock, vm)
                    .then((res) => {
                        var userStr = localStorage.getItem("user");
                        var user = JSON.parse(userStr);
                        http.trail({
                            who: user.name,
                            user_id: user.id,
                            activity: "delete account " + account.id,
                            role: user.user_roles[0].role.name,
                            role_id: user.user_roles[0].role.id,
                            description: "removed account " + JSON.stringify(account),
                        });
                        onSuccess(res);
                    })
                    .catch((errors) => {
                        onErrors(errors)
                    });
            }
        });
    },
    saveOnBoardingStep4(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            if (vm && vm.customeAccounts && vm.customeAccounts.length == 0) {
                var data = {
                    accounts: []
                };
                for (let index = 0; index < vm.standardAccounts.length; index++) {
                    const standardAccount = vm.standardAccounts[index];
                    data.accounts.push({
                        ref_no: standardAccount.ref_no,
                        name: standardAccount.name,
                        type: standardAccount.type,
                        group: standardAccount.group,
                        statement_type: standardAccount.statement_type
                    });
                }
                //in this case we do a post
                Bee.post(data, isMock, vm)
                    .then((res) => {
                        var userStr = localStorage.getItem("user");
                        var user = JSON.parse(userStr);
                        http.trail({
                            who: user.name,
                            user_id: user.id,
                            activity: "added accounts",
                            role: user.user_roles[0].role.name,
                            role_id: user.user_roles[0].role.id,
                            description: "inserted accounts  " + JSON.stringify(data),
                        });
                        //complete step4
                        var data2 = {
                            config: {
                                onboarding_step4_chart_of_accounts: "done",
                                _w: [
                                    ["id", "e", "1"]
                                ]
                            }
                        };
                        Bee.update(data2, isMock, vm)
                            .then((res) => {
                                http.trail({
                                    who: user.name,
                                    user_id: user.id,
                                    activity: "completed step4 onboarding ",
                                    role: user.user_roles[0].role.name,
                                    role_id: user.user_roles[0].role.id,
                                    description: "completed step4 onboarding: " + JSON.stringify(data2),
                                });
                                onSuccess(res);
                            })
                            .catch((errors) => {
                                onErrors(errors)
                            });
                    })
                    .catch((errors) => {
                        onErrors(errors)
                    });
            } else {
                //just complete this step
                var data2 = {
                    config: {
                        onboarding_step4_chart_of_accounts: "done",
                        _w: [
                            ["id", "e", "1"]
                        ]
                    }
                };
                Bee.update(data2, isMock, vm)
                    .then((res) => {
                        var userStr = localStorage.getItem("user");
                        var user = JSON.parse(userStr);
                        http.trail({
                            who: user.name,
                            user_id: user.id,
                            activity: "completed step4 onboarding ",
                            role: user.user_roles[0].role.name,
                            role_id: user.user_roles[0].role.id,
                            description: "completed step4 onboarding: " + JSON.stringify(data2),
                        });
                        onSuccess(res);
                    })
                    .catch((errors) => {
                        onErrors(errors)
                    });
            }
        });
    },
    onBoardingAsestCategoryDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                accounts: {},
                categories: {
                    _ob: ["name"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    var indexedAccounts = Utils.index(res.accounts, "id");
                    var categories = Utils.inject(res.categories, indexedAccounts, {
                        debitAccount: "debit_account_id",
                        debitAccount: {
                            prop: "debit_account_id",
                            default: {
                                id: 0,
                                name: "link account"
                            }
                        },
                        creditAccount: {
                            prop: "credit_account_id",
                            default: {
                                id: 0,
                                name: "link account"
                            }
                        },
                    });
                    onSuccess({
                        accounts: Utils.toValueLabelList(res.accounts, "id", "name"),
                        categories: categories
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingUpdateAssetCategory(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                category: {
                    debit_account_id: formData.debitAccount.value,
                    credit_account_id: formData.creditAccount.value,
                    name: formData.name.value,
                    short_name: formData.shortName.value,
                    useful_years: formData.usefulYears.value,
                    description: formData.description.value,
                    identifier: formData.identifier.value,
                    _w: [
                        ["id", "e", formData.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit asset category " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated asset category " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingAddAssetCategory(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                category: {
                    name: formData.name.value,
                    short_name: formData.shortName.value,
                    debit_account_id: formData.debitAccount.value,
                    credit_account_id: formData.creditAccount.value,
                    useful_years: formData.usefulYears.value,
                    description: formData.description.value,
                    identifier: formData.identifier.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "add asset category",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "created asset category " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingDeleteAssetCategory(category, onSuccess, onErrors, isMock = false, vm = null) {
        //nyd
        //i think with every delete, we need to present a comfirmation dialogue box
        //also we need to delte the other related attached data
        //we also need to introduce an archive mode
        this.delay(function (http) {
            var data = {
                category: {
                    _w: [
                        ["id", "e", category.id]
                    ]
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete asset category " + category.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed asset cateory " + JSON.stringify(category),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    saveOnBoardingStep5(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //just complete this step
            var data2 = {
                config: {
                    onboarding_step5_asset_categories: "done",
                    _w: [
                        ["id", "e", "1"]
                    ]
                }
            };
            Bee.update(data2, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "completed step5 onboarding ",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "completed step5 onboarding: " + JSON.stringify(data2),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingAssetsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                accounts: {},
                categories: {
                    _ob: ["name"]
                },
                branches: {
                    _ob: ["name"]
                },
                upload_assets: {
                    upload_asset_items: {},
                    _desc: ["id"],
                    _pg: 1
                },
                sites: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    var indexedAccounts = Utils.index(res.accounts, "id");
                    var categories = Utils.inject(res.categories, indexedAccounts, {
                        debitAccount: "debit_account_id",
                        debitAccount: {
                            prop: "debit_account_id",
                            default: {
                                id: 0,
                                name: "link account"
                            }
                        },
                        creditAccount: {
                            prop: "credit_account_id",
                            default: {
                                id: 0,
                                name: "link account"
                            }
                        },
                    });
                    onSuccess({
                        categories: categories,
                        upload_assets: res.upload_assets.length > 0 ? res.upload_assets[0] : null,
                        branches: res.branches,
                        sites: res.sites
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    saveUploadAsset(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                upload_asset: {
                    file_name: formData.fileName.value,
                    total_rows: formData.totalRows.value,
                    progess: 0,
                    status: "incomplete"
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "cached upload",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "cached onboarding asset upload file: " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    saveCacheItemAsset(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var excellRowObject = formData.excellRowObject.value;
            var data = {
                upload_asset_item: {
                    upload_asset_id: formData.uploadAssetId.value,
                    table_id: formData.tableId.value,
                    source: formData.source.value,
                    identifier: formData.identifier.value,
                    name: formData.name.value,
                    category_name: formData.categoryName.value,
                    upload_status: formData.uploadStatus.value,
                    upload_remarks: formData.uploadRemarks.value,
                    has_errors: formData.hasErrors.value,
                    excell_row_object: typeof excellRowObject == 'string' ? excellRowObject : JSON.stringify(excellRowObject)
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "cache asset uploaded item",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "cache asset uploaded item: " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    saveUploadedAssetItem(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            http.saveUploadedAssetItemHelper(formData, onSuccess, onErrors, isMock, vm);
        });
    },
    saveUploadedAssetItemHelper(formData, onSuccess, onErrors, isMock = false, vm = null) {
        var http = this;
        var purchaseDateObj = (new Date(formData.purchasedDate.value));
        var usefulYears = parseInt(formData.usefulYears.value);
        var outOfServiceDateObj = Utils.addYearsToDate(purchaseDateObj, usefulYears);
        var data = {
            asset: {
                category_id: formData.categoryId.value,
                identifier_number: formData.identifier.value,
                name: formData.name.value,
                is_shared: formData.isShared.value == "yes" ? 1 : 0,
                purchase_date: formData.purchasedDate.value,
                purchase_date_time: purchaseDateObj.getTime() / 1000,
                purchase_cost: formData.purchaseCost.value,
                useful_years: usefulYears,
                outof_service_date: Utils.dateToStandardDateString(outOfServiceDateObj),
                flag: 0,
                description: formData.description.value,
                condition: formData.condition.value,
                status: formData.usefulYears.value,
            }
        };
        //first get all custodians and extrafields so that we dont create dublicates
        var query = {
            custodians: {},
            extra_fields: {}
        };
        Bee.get(query, isMock, vm)
            .then((queryRes) => {
                var theCustodian = formData.others.value.custodian;
                var allocation = formData.others.value.allocation;
                var formExtraFields = formData.others.value.extraFields;
                var formAssetExtraFields = formData.others.value.assetExtraFields;
                //custodian
                var custodianAleadyExists = false;
                for (let index = 0; index < queryRes.custodians.length; index++) {
                    const custodian = queryRes.custodians[index];
                    if (custodian.name == theCustodian.name && custodian.contact == theCustodian.contact) {
                        custodianAleadyExists = true;
                        theCustodian = custodian;
                        break; //custodian already exists
                    }
                }
                if (!custodianAleadyExists) {
                    //add the new custodian to the post data
                    data["custodian"] = theCustodian;
                    delete allocation.custodian_id;
                    allocation["_fk_custodian_id"] = "custodian";
                } else {
                    allocation["custodian_id"] = theCustodian.id;
                }
                //allocation
                data["allocation"] = {
                    ...allocation,
                    _fk_asset_id: "asset",
                };
                //extra fields
                var newExtraFields = [];
                var dbIndexedExtraFields = {};
                for (let index = 0; index < queryRes.extra_fields.length; index++) {
                    const extraField = queryRes.extra_fields[index];
                    dbIndexedExtraFields[extraField.name] = extraField;
                }
                for (let j = 0; j < formExtraFields.length; j++) {
                    const formExtraField = formExtraFields[j];
                    if (!Object.hasOwnProperty.call(dbIndexedExtraFields, formExtraField.name)) {
                        //add new extra field
                        newExtraFields.push({
                            ...formExtraField,
                            category_id: data.asset.category_id,
                        });
                        dbIndexedExtraFields[formExtraField.name] = {
                            ...formExtraField,
                            id: "extra_fields@" + (newExtraFields.length - 1) //for reference sake when creating asset_extra_fields
                        };
                    }
                }
                if (newExtraFields.length > 0) {
                    data["extra_fields"] = newExtraFields;
                }
                //asset extra fields
                var newAssetEtraFields = [];
                for (let index = 0; index < formAssetExtraFields.length; index++) {
                    const formAssetExtraField = formAssetExtraFields[index];
                    var xfi = formAssetExtraField.extra_field_index;
                    var formExtraField = formExtraFields[xfi];
                    var extraFieldId = dbIndexedExtraFields[formExtraField.name].id;
                    let AssetEtraField = {
                        _fk_asset_id: "asset",
                        value: formAssetExtraField.value
                    };
                    if (extraFieldId.toString().indexOf("@") > -1) {
                        AssetEtraField["_fk_extra_field_id"] = extraFieldId;
                    } else {
                        AssetEtraField["extra_field_id"] = extraFieldId;
                    }
                    newAssetEtraFields.push(AssetEtraField);
                }
                if (newAssetEtraFields.length > 0) {
                    data["asset_extra_fields"] = newAssetEtraFields;
                }
                data["_lineup"] = ["asset", "custodian", "allocation", "extra_fields", "asset_extra_fields"];

                Bee.post(data, isMock, vm)
                    .then((res) => {
                        var userStr = localStorage.getItem("user");
                        var user = JSON.parse(userStr);
                        http.trail({
                            who: user.name,
                            user_id: user.id,
                            activity: "uploaded asset item",
                            role: user.user_roles[0].role.name,
                            role_id: user.user_roles[0].role.id,
                            description: "asset item uploaded: " + JSON.stringify(data),
                        });
                        onSuccess(res);
                    })
                    .catch((errors) => {
                        onErrors(errors)
                    });
            })
            .catch((errors) => {
                console.log("errorserrors", errors);
                onErrors(errors)
            });
    },
    updateCacheItemAsset(formData, onSuccess, onErrors, isMock = false, vm = null) {
        //nyd
        //update upload progress 
        console.log(formData.id);
        this.delay(function (http) {
            var xObj = formData.excellRowObject.value;
            var data = {
                upload_asset_item: {
                    identifier: formData.identifier.value,
                    name: formData.name.value,
                    category_name: formData.categoryName.value,
                    upload_status: formData.uploadStatus.value,
                    upload_remarks: formData.uploadRemarks.value,
                    has_errors: formData.hasErrors.value,
                    excell_row_object: (typeof xObj == 'string') ? xObj : JSON.stringify(xObj),
                    _w: [
                        ["id", "e", formData.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit cached asset uploaded item",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "edit cached asset uploaded item: " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    onBoardingUpdateCachedFailedItem(formData, onSuccess, onErrors, isMock = false, vm = null) {
        //after succefully editing
        //we also have to change the upload status and remarks
        //we also go ahead to create the asset
        //nyd
        //then update the percentage progress
        var excell_row_object = vm.extractExcellRowObjectFromFormData(formData);
        this.delay(function (http) {
            var data = {
                upload_asset_item: {
                    identifier: formData.identifier.value,
                    name: formData.name.value,
                    category_name: formData.categoryName.value,
                    excell_row_object: typeof excell_row_object == 'string' ? excell_row_object : JSON.stringify(excell_row_object),
                    _w: [
                        ["id", "e", formData.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit cached asset uploaded item",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "edit cached asset uploaded item: " + JSON.stringify(data),
                    });
                    //post the asset of the row
                    var assetForm = formData.newAsset.value;
                    var newAssetFormData = {
                        ...assetForm.asset,
                        others: {
                            value: {
                                extraFields: assetForm.extraFields,
                                assetExtraFields: assetForm.assetExtraFields,
                                allocation: assetForm.allocation,
                                custodian: assetForm.custodian
                            },
                            isValid: null,
                            validations: {},
                        }
                    };
                    http.saveUploadedAssetItemHelper(newAssetFormData, function () {
                        //update the excell row object with success status
                        var data = {
                            upload_asset_item: {
                                upload_status: "success",
                                name: formData.name.value,
                                category_name: formData.categoryName.value,
                                excell_row_object: typeof excell_row_object == 'string' ? excell_row_object : JSON.stringify(excell_row_object),
                                upload_remarks: "registered successfuly",
                                _w: [
                                    ["id", "e", formData.id]
                                ]
                            }
                        };
                        Bee.update(data, isMock, vm)
                            .then((res) => {
                                var userStr = localStorage.getItem("user");
                                var user = JSON.parse(userStr);
                                http.trail({
                                    who: user.name,
                                    user_id: user.id,
                                    activity: "edit cached asset uploaded item status",
                                    role: user.user_roles[0].role.name,
                                    role_id: user.user_roles[0].role.id,
                                    description: "edit cached asset uploaded item status: " + JSON.stringify(data),
                                });
                                onSuccess(res);
                            })
                            .catch((errors) => {
                                onErrors(errors)
                            });
                    }, function (errors) {
                        onErrors(errors);
                    },
                        isMock,
                        vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    saveOnBoardingStep6(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //just complete this step
            var data2 = {
                config: {
                    onboarding_step6_upload_assets: "done",
                    _w: [
                        ["id", "e", "1"]
                    ]
                }
            };
            Bee.update(data2, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "completed step6 onboarding ",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "completed step6 onboarding: " + JSON.stringify(data2),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    settingsRolesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                roles: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        roles: res.roles
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    settingsUsersDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                users: {
                    user_roles: {
                        role: {}
                    }
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocessing
                    var temp = [];
                    for (let index = 0; index < res.users.length; index++) {
                        const user = res.users[index];
                        var role = (user.user_roles.length > 0) ? user.user_roles[0].role : { id: 0, name: "", description: "" };
                        temp.push({
                            ...user,
                            role: role,
                            role_id: role.id,
                        });
                    }
                    onSuccess({
                        users: temp
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addUsersDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                roles: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    var roles = Utils.toValueLabelList(
                        res.roles,
                        "id",
                        "name"
                    );
                    onSuccess({
                        roles: roles
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    inviteUser(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //post the users
            var data = {
                _f_invite: [{
                    email: formData.email.value,
                    name: formData.name.value,
                    as: formData.as.value,
                }]
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "invited users under settings system users",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "invited users: " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    adminEditUserAccount(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //post the users
            var data = {
                _f_edit_user_role: [{
                    email: formData.email.value,
                    name: formData.name.value,
                    as: formData.as.value,
                    previous_email: formData.prevEmail.value,
                    user_id: formData.userId.value,
                    tenant: formData.tenant.value,
                }]
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edited system user",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "edit user: " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    adminDeactivateUserAccount(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //post the users
            var data = {
                user: {
                    status: "deactivated",
                    _w: [
                        ["id", "e", vm.accountToVate.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "deactivated system user",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "deactivated user: " + JSON.stringify(vm.accountToVate),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    adminActivateUserAccount(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //post the users
            var data = {
                user: {
                    status: "active",
                    code: "",
                    _w: [
                        ["id", "e", vm.accountToVate.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "activated system user",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "activated user: " + JSON.stringify(vm.accountToVate),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    adminDeleteUser(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                user: {
                    _w: [
                        ["id", "e", item.id]
                    ]
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete user " + item.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed user " + JSON.stringify(item),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    uploadFileToCloudinary(file, folder) {
        return new Promise(function (resolve, reject) {
            //Ideally these to lines would be in a .env file
            const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dvuueqmve/image/upload";
            const CLOUDINARY_UPLOAD_PRESET = "unsignedpreset";
            const CLOUDINARY_UPLOAD_DIRECTORY = "/mpola/";

            let formData = new FormData();
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
            formData.append("folder", CLOUDINARY_UPLOAD_DIRECTORY + folder);
            formData.append("file", file);

            let request = new XMLHttpRequest();
            request.open("POST", CLOUDINARY_URL, true);
            request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            request.onreadystatechange = () => {
                // File uploaded successfully
                if (request.readyState === 4 && request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    resolve(response);
                }

                // Not succesfull, let find our what happened
                if (request.status !== 200) {
                    if (request.responseText == "") {
                        reject([
                            "File upload failed, please check your internet connection and try again",
                        ]);
                    } else {
                        try {
                            //console.log("my res ", request);
                            let response = JSON.parse(request.responseText);
                            let error = response.error.message;
                            // alert("error, status code not 200 " + error);
                            reject([error]);
                        } catch (errorx) {
                            //console.log("my exception ", errorx);
                            reject([errorx.message]);
                        }
                    }
                }
            };

            request.onerror = (err) => {
                // alert("error: " + err);
                reject([err]);
            };

            request.send(formData);
        });
    },
    updateProfilePicture(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //post the users
            var data = {
                user: {
                    avatar: vm.user.avatar,
                    _w: [
                        ["id", "e", vm.user.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    user.avatar = vm.user.avatar;
                    localStorage.setItem("user", JSON.stringify(user));
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edited their profile picture",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "edited their profile picture: " + JSON.stringify(vm.user.avatar),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    settingsBranchesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                branches: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        branches: res.branches
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    settingsCustodiansDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                custodians: {
                    _pull_user: "user.user_id"
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        custodians: res.custodians
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    settingsSitesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                sites: {
                    branch: {}
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        sites: res.sites
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    editUserProfile(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //post the users
            var data = {
                _f_edit_user_profile: [{
                    email: formData.email.value,
                    name: formData.name.value,
                    previous_email: formData.prevEmail.value,
                    user_id: formData.userId.value,
                    tenant: formData.tenant.value,
                }]
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edited profile",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "edit profile: " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updatePassword(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //post the users
            var data = {
                _f_password: {
                    old_password: formData.oldPassword.value,
                    new_password: formData.newPassword.value
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    let user = res._f_password.user;
                    let token = res._f_password.token;
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("token", token);

                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edited password",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "edit password",
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateConfigs(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            //post the users
            var data = {
                config: {
                    upcomingrepair: formData.upcomingrepair.value,
                    missedrepair: formData.missedrepair.value,
                    depreciation: formData.depreciation.value,
                    currency: formData.currency.value,
                    _w: [
                        ["id", "e", 1]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    //update configs
                    let config = localStorage.getItem("config");
                    if (config) {
                        config = JSON.parse(config);
                        config.upcomingrepair = data.config.upcomingrepair;
                        config.missedrepair = data.config.missedrepair;
                        config.depreciation = data.config.depreciation;
                        config.currency = data.config.currency;
                        localStorage.setItem("config", JSON.stringify(config));
                    }
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edited config",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "edited config: " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    registryListsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {
                    category: {}
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addAssetsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                categories: {
                    extra_fields: {}
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        categories: res.categories
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addAsset(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var purchaseDateObj = (new Date(formData.purchaseDate.value));
            var usefulYears = parseInt(formData.usefulYears.value);
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var outOfServiceDateObj = Utils.addYearsToDate(purchaseDateObj, usefulYears);
            var data = {
                asset: {
                    category_id: formData.categoryId.value,
                    identifier_number: formData.identifierNumber.value,
                    name: formData.name.value,
                    is_shared: formData.isShared.value == "yes" ? 1 : 0,
                    purchase_date: formData.purchaseDate.value,
                    purchase_date_time: purchaseDateObj.getTime() / 1000,
                    purchase_cost: formData.purchaseCost.value,
                    useful_years: usefulYears,
                    outof_service_date: Utils.dateToStandardDateString(outOfServiceDateObj),
                    flag: 0,
                    description: formData.description.value,
                    condition: "unknown",
                    status: "In Store",
                },
            };
            var extraFields = [];
            if (vm.extraFieldsData.length > 0) {
                for (let index = 0; index < vm.extraFieldsData.length; index++) {
                    const xField = vm.extraFieldsData[index];
                    var entry = {
                        _fk_asset_id: "asset",
                        extra_field_id: xField.extra_field_id,
                        value: xField.value
                    };
                    if (xField.units) {
                        entry["units"] = xField.units;
                    }
                    extraFields.push(entry);
                }
                data["asset_extra_fields"] = extraFields;
            }
            //if its an acquired item
            if(vm.acquiredItem != null){
                data["order_recorded_asset"] = {
                    order_item_id: vm.acquiredItem.id,
                    _fk_asset_id: "asset",
                    _date_recorded_date: "",
                    _now_recorded_date_time: "",
                    recorded_by_user_id: user.id,
                    recorded_notes: ""
                };
            }

            Bee.post(data, isMock, vm)
                .then((res) => {
                    
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "add asset",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted asset " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateAssetsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                categories: {
                    extra_fields: {}
                },
                asset_extra_fields: {
                    extra_field: {},
                    _w: [
                        ["asset_id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        categories: res.categories,
                        assetExtraFields: res.asset_extra_fields
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateAsset(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var hasChangedCategory = formData.categoryId.value.toString() != vm.edits.category_id.toString();
            var purchaseDateObj = (new Date(formData.purchaseDate.value));
            var usefulYears = parseInt(formData.usefulYears.value);
            var outOfServiceDateObj = Utils.addYearsToDate(purchaseDateObj, usefulYears);
            var data = {
                asset: {
                    category_id: formData.categoryId.value,
                    identifier_number: formData.identifierNumber.value,
                    name: formData.name.value,
                    is_shared: formData.isShared.value == "yes" ? 1 : 0,
                    purchase_date: formData.purchaseDate.value,
                    purchase_date_time: purchaseDateObj.getTime() / 1000,
                    purchase_cost: formData.purchaseCost.value,
                    useful_years: usefulYears,
                    outof_service_date: Utils.dateToStandardDateString(outOfServiceDateObj),
                    description: formData.description.value,
                    _w: [
                        ["id", "e", formData.id]
                    ]
                },
            };
            var extraFields = [];
            if (hasChangedCategory == true ||
                (vm.extraFieldsData.length > 0 && vm.editAssetDbExtraFields.length == 0)
            ) {
                //we need to delete existing assets
                data["_pre_delete"] = {
                    asset_extra_field: {
                        _w: [
                            ["asset_id", "e", formData.id]
                        ]
                    }
                };
                //post new ones
                if (vm.extraFieldsData.length > 0) {
                    for (let index = 0; index < vm.extraFieldsData.length; index++) {
                        const xField = vm.extraFieldsData[index];
                        var entry = {
                            asset_id: formData.id,
                            extra_field_id: xField.extra_field_id,
                            value: xField.value
                        };
                        if (xField.units) {
                            entry["units"] = xField.units;
                        }
                        extraFields.push(entry);
                    }
                    data["_pre_post"] = {
                        asset_extra_fields: extraFields
                    }
                }
            } else {
                //update exisiting ones
                if (vm.extraFieldsData.length > 0 && vm.editAssetDbExtraFields.length > 0) {
                    for (let index = 0; index < vm.extraFieldsData.length; index++) {
                        const xField = vm.extraFieldsData[index];
                        var entry = {
                            value: xField.value,
                            _w: [
                                [
                                    ["asset_id", "e", formData.id],
                                    "AND",
                                    ["extra_field_id", "e", xField.extra_field_id]
                                ]
                            ]
                        };
                        extraFields.push(entry);
                    }
                    data["asset_extra_fields"] = extraFields;
                }
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit asset " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated asset details " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    comfirmDeleteAsset(seed, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var query = {
                _box: {
                    scan_limit: 11,
                    seeds: {
                        ...seed
                    }
                },
                _f_br: "dependence_report"
            };
            Bee.get(query, isMock, vm)
                .then((res) => {
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteItem(seed, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var query = {
                _box: {
                    seeds: {
                        ...seed
                    }
                },
                _f_br: "delete_items"
            }
            Bee.get(query, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "deleted record " + JSON.stringify(seed),
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed cascading records " + JSON.stringify(seed),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    clearAssetBatchUpload(nothing, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                upload_assets: {
                    _w: [
                        ["id", "gt", 0]
                    ]
                },
                upload_asset_items: {
                    _w: [
                        ["id", "gt", 0]
                    ]
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "resets batch file upload ",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "reseted batch file upload " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    registryRequisitionsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                requisitions: {
                    _a: "* time_inserted",
                    asset: {},
                    user: {},
                    // its possoble to have these as not being available
                    //so thats why its commented out
                    // allocation: {
                    //     custodian: {}
                    // }
                    _desc: ["time_inserted"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        requisitions: res.requisitions
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addRequisitionDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addRequisition(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var requiredBeforeDate = formData.requiredBeforeDate.value + " 00:00:00";
            var requiredBeforeDateObj = (new Date(requiredBeforeDate));
            var proposedReturnDate = formData.proposedReturnDate.value.trim();
            var proposedReturnTime = 0;
            if(proposedReturnDate.length > 0){
                proposedReturnDate = proposedReturnDate + " 00:00:00";
                proposedReturnTime = (new Date(proposedReturnDate)).getTime() / 1000;
            } 
            requiredBeforeDate = requiredBeforeDate.split(" ")[0];
            proposedReturnDate = proposedReturnDate.split(" ")[0];
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var data = {
                requisition: {
                    asset_id: formData.assetId.value,
                    user_id: user.id,
                    allocation_id: 0,
                    requesters_name: formData.requestersName.value,
                    requesters_contact: formData.requestersContact.value,
                    required_before_date: requiredBeforeDate,
                    required_before_date_time: requiredBeforeDateObj.getTime() / 1000,
                    proposed_return_date: proposedReturnDate,
                    proposed_return_date_time: proposedReturnTime,
                    reason: formData.reason.value,
                    status: "pending",
                    approved_date: "",
                    approved_date_time: 0,
                    approved_by_user_id: 0,
                    approval_notes: ""
                }
            };
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    supportDocuments.push({
                        _fk_requisition_id: "requisition",
                        name: uploadedDocument.name.value,
                        type: uploadedDocument.type.value,
                        link: uploadedDocument.link.value 
                    });
                }
                data["support_documents"] = supportDocuments;
            }
            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "posted requisition",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted a new requisition " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    requisitionViewDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                requisition: {
                    _a: "* time_inserted",
                    user: {},
                    asset: {},
                    _w: [
                        ["id", "e", item.id]
                    ]
                },
                allocations: {
                    custodian: {},
                    _w: [
                        [
                            ["asset_id", "e", item.asset_id],
                            "AND",
                            ["status", "e", "allocated"]
                        ]
                    ] 
                },
                support_documents: {
                    _w: [
                        ["requisition_id", "e", item.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        requisition: res.requisition,
                        allocations: res.allocations,
                        supportDocuments: res.support_documents
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    getWeavyUploadToken(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                _weavy_token: {
                    user_id: user.id
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        token: res._weavy_token.access_token
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    uploadFile(multipartFormData, onSuccess, onErrors, isMock = false, vm = null){
        this.delay(function (http) {
            Bee.upload(multipartFormData, isMock)
            .then(res => {
                var userStr = localStorage.getItem("user");
                var user = JSON.parse(userStr);
                http.trail({
                    who: user.name,
                    user_id: user.id,
                    activity: "uploaded temp file",
                    role: user.user_roles[0].role.name,
                    role_id: user.user_roles[0].role.id,
                    description: "the uploaded temp file is " + JSON.stringify(res),
                });
                onSuccess(res);
            })
            .catch(errors => {
              onErrors(errors);
            });
        });
    },
    deleteUploadedFile(selectedFile, onSuccess, onErrors, isMock = false, vm = null){
        this.delay(function (http) {
            var data = {
                _rmv_file_: selectedFile
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete upload file " + selectedFile,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed uploaded file " + selectedFile,
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    downloadFile(filePath){
        let url = Bee.baseUrl + (filePath.replace("/",""));
        // window.location.href = url;
        window.open(url, "_blank") || window.location.replace(url);
    },
    rejectRequisition(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                requisition: {
                    status: "rejected",
                    _date_rejected_date: "",
                    _now_rejected_date_time: "",
                    rejected_by_user_id: user.id,
                    rejected_notes: formData.rejectedNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "reject requisition " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "rejected requisition" + JSON.stringify(vm.edits),
                    });
                    http.requisitionViewDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    approveRequisition(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                requisition: {
                    status: "approved",
                    _date_approved_date: "",
                    _now_approved_date_time: "",
                    approved_by_user_id: user.id,
                    approval_notes: formData.approvalNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "approve requisition " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "approved requisition" + JSON.stringify(vm.edits),
                    });
                    http.requisitionViewDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    collectRequisitionDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                branches: {},
                sites: {},
                departments: {},
                custodians: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        branches: res.branches,
                        sites: res.sites,
                        departments: res.departments,
                        custodians: res.custodians
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    collectRequisition(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                asset: {
                    condition: formData.condition.value,
                    status: "Allocated",
                    _w: [
                        ["id", "e", vm.edits.asset_id]
                    ]
                },
                allocation: {
                    status: "rellocated",
                    _date_return_date: "",
                    _w: [
                        [
                            ["asset_id", "e", vm.edits.asset_id],
                            "AND",
                            ["status", "e", "allocated"]
                        ]
                    ]
                },
                requisition: {
                    status: "collected",
                    _date_collection_date: "",
                    _now_collection_date_time: "",
                    collection_issued_by_user_id: user.id,
                    collection_notes: formData.collectionNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                },
                _pst_post: {
                    allocation: {
                        asset_id: vm.edits.asset_id,
                        branch_id: formData.branchId.value,
                        site_id: formData.siteId.value,
                        department_id: formData.departmentId.value,
                        custodian_id: formData.custodianId.value,
                        return_date: "",
                        allocation_condition: formData.condition.value,
                        status: "allocated"
                    },
                },
                _pst_update: {
                    requisition: {
                        _fk_allocation_id: "_pst_post.allocation",
                        _w: [
                            ["id", "e", vm.edits.id]
                        ]
                    },
                }
            };
            Bee.update(data, isMock, vm)
                .then((updateRes) => {
                    //nyd send a notification(email and or sms) to the requester that the 
                    //request has been accepted/approved 
                    
                    //post 
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "approve requisition " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "approved requisition" + JSON.stringify(vm.edits),
                    });
                    http.requisitionViewDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addRequesterAsCustodian(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                custodian: {
                    user_id: 0,
                    name: formData.name.value,
                    contact: formData.contact.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "added collection requisition custodian ",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted a new custodian " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateRequisitionDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                support_documents: {
                    _w:[
                        ["requisition_id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        supportDocuments: res.support_documents
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteSupportingDocument(uploadFormDataInput, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                support_document: {
                    _w: [
                        ["id", "e", uploadFormDataInput.id.value]
                    ]
                },
                _pst_post: {
                    _rmv_file_: uploadFormDataInput.link.value
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete supporting document " + uploadFormDataInput.id.value,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed supporting document " + JSON.stringify(uploadFormDataInput),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateRequsition(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var requiredBeforeDate = formData.requiredBeforeDate.value + " 00:00:00";
            var requiredBeforeDateObj = (new Date(requiredBeforeDate));
            var proposedReturnDate = formData.proposedReturnDate.value.trim();
            var proposedReturnTime = 0;
            if(proposedReturnDate.length > 0){
                proposedReturnDate = proposedReturnDate + " 00:00:00";
                proposedReturnTime = (new Date(proposedReturnDate)).getTime() / 1000;
            } 
            requiredBeforeDate = requiredBeforeDate.split(" ")[0];
            proposedReturnDate = proposedReturnDate.split(" ")[0];

            var data = {
                requisition: {
                    asset_id: formData.assetId.value,
                    requesters_name: formData.requestersName.value,
                    requesters_contact: formData.requestersContact.value,
                    required_before_date: requiredBeforeDate,
                    required_before_date_time: requiredBeforeDateObj.getTime() / 1000,
                    proposed_return_date: proposedReturnDate,
                    proposed_return_date_time: proposedReturnTime,
                    reason: formData.reason.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                }
            };
            //if any new supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    if(uploadedDocument.requisitionId.value == ""){
                        supportDocuments.push({
                            requisition_id: formData.id,
                            name: uploadedDocument.name.value,
                            type: uploadedDocument.type.value,
                            link: uploadedDocument.link.value 
                        });
                    }
                }
                if(supportDocuments.length > 0){
                    data["_pst_post"] = {
                        support_documents: supportDocuments
                    }
                }
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit requisition " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated requisition details " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    returnRequisitionDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                allocation: {
                    custodian: {},
                    _w: [
                        ["id", "e", vm.edits.allocation_id]
                    ]
                },
                custodians: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        allocation: res.allocation,
                        custodians: res.custodians
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    returnRequisition(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                requisition: {
                    returned_date: formData.returnedDate.value,
                    _time_returned_date_time: formData.returnedDate.value,
                    returned_recorded_by_user_id: user.id,
                    returned_by_custodian_id: formData.custodianId.value,
                    returned_notes: formData.returnedNotes.value,
                    status: "returned",
                    _w:[
                        ["id", "e", formData.id]
                    ]
                },
                asset: {
                    condition: formData.condition.value,
                    status: "In Store",
                    _w:[
                        ["id", "e", vm.edits.asset_id]
                    ]
                },
                allocation: {
                    return_condition: formData.condition.value,
                    status: "returned",
                    _w:[
                        ["id", "e", vm.edits.allocation_id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    //nyd send a notification(email and or sms) to the requester that the 
                    //request has been returned by the returner

                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "returned requisitioned asset " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "returned requisitioned asset " + JSON.stringify(data),
                    });
                    http.requisitionViewDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addCustodianDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                users: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        users: res.users
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addCustodian(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            let userid = formData.userId.value.trim();
            if(userid.length == ""){
                userid = 0;
            }
            var data = {
                custodian: {
                    user_id: userid,
                    name: formData.name.value,
                    contact: formData.contact.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "add custodian",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted new custodian " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateCustodian(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            let userid = formData.userId.value?formData.userId.value.toString().trim():"";
            if(userid.length == ""){
                userid = 0;
            }
            var data = {
                custodian: {
                    user_id: userid,
                    name: formData.name.value,
                    contact: formData.contact.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edites custodian",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated custodian information s" + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    transferAssetsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                transfers: {
                    _desc: ["id"]
                },
                branches: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess
                    let branchRefs = {};
                    for(var i=0; i < res.branches.length; i++){
                        var branch = res.branches[i];
                        branchRefs[branch.id.toString()] = branch;
                    }
                    for (let index = 0; index < res.transfers.length; index++) {
                        const transfer = res.transfers[index];
                        transfer["fromBranch"] = branchRefs[transfer.issuing_branch_id.toString()]
                        transfer["toBranch"] = branchRefs[transfer.receiving_branch_id.toString()]
                        res.transfers[index] = transfer;
                    }
                    onSuccess({
                        transfers: res.transfers
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addTransferAssetsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                branches: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        branches: res.branches
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addTransfer(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var transferDate = formData.transferDate.value.trim();
            var transferDateTime = 0;
            if(transferDate.length > 0){
                var temp = transferDate + " 00:00:00";
                transferDateTime = (new Date(temp)).getTime() / 1000;
            }

            var data = {
                transfer: {
                    title: formData.title.value,
                    issuing_branch_id: formData.issuingBranchId.value,
                    receiving_branch_id: formData.receivingBranchId.value,
                    scheduled_tansfer_date: formData.scheduledTansferDate.value,
                    _time_scheduled_tansfer_date_time: formData.scheduledTansferDate.value,
                    transfer_date: transferDate,
                    transfer_date_time: transferDateTime,
                    transfer_notes: formData.transferNotes.value,
                    no_of_assets: 0,
                    status: "pending"
                },
            }
            //transfer_assets
            if(vm.selectedAssets.length > 0){
                var transferAssets = [];
                for (let index = 0; index < vm.selectedAssets.length; index++) {
                    const selectedAsset = vm.selectedAssets[index];
                    transferAssets.push({
                        _fk_transfer_id: "transfer",
                        asset_id: selectedAsset.assetId.value,
                        transfer_condition: "",
                        receiving_condition: "" 
                    });
                }
                data["transfer_assets"] = transferAssets;
                data.transfer.no_of_assets = transferAssets.length;
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    supportDocuments.push({
                        _fk_transfer_id: "transfer",
                        name: uploadedDocument.name.value,
                        type: uploadedDocument.type.value,
                        link: uploadedDocument.link.value 
                    });
                }
                data["transfer_support_documents"] = supportDocuments;
            }
            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "posted asset transfer",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted a new asset transfer " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    transferDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                transfer: {
                    _a: "* time_inserted",
                    _w: [
                        ["id", "e", item.id]
                    ]
                },
                branches: {},
                transfer_assets: {
                    asset: {},
                    _w: [
                        ["transfer_id", "e", item.id]
                    ]
                },
                transfer_support_documents: {
                    _w: [
                        ["transfer_id", "e", item.id]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess
                    let branchRefs = {};
                    for(var i=0; i < res.branches.length; i++){
                        var branch = res.branches[i];
                        branchRefs[branch.id.toString()] = branch;
                    }
                    const transfer = res.transfer;
                    transfer["fromBranch"] = branchRefs[transfer.issuing_branch_id.toString()];
                    transfer["toBranch"] = branchRefs[transfer.receiving_branch_id.toString()];
                    onSuccess({
                        transfer: res.transfer,
                        transferAssets: res.transfer_assets,
                        transferSupportDocuments:  res.transfer_support_documents
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    rejectTransfer(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                transfer: {
                    status: "rejected",
                    _date_rejected_date: "",
                    _now_rejected_date_time: "",
                    rejected_by_user_id: user.id,
                    rejected_notes: formData.rejectedNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "reject asset transfer " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "rejected asset transfer" + JSON.stringify(vm.edits),
                    });
                    http.transferDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    approveTransfer(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                transfer: {
                    status: "approved",
                    _date_approved_date: "",
                    _now_approved_date_time: "",
                    approved_by_user_id: user.id,
                    approval_notes: formData.approvalNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "approve asset transfer " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "approved asset transfer" + JSON.stringify(vm.edits),
                    });
                    http.transferDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    issueTransferAssetsDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                transfer_assets: {
                    asset: {},
                    _w: [
                        ["transfer_id", "e", item.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        transferAssets: res.transfer_assets
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    issueTransfer(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var transferStatus = "issued";
            var data = {
                transfer: {
                    status: "issued",
                    _date_issued_date: "",
                    _now_issued_date_time: "",
                    issued_by_user_id: user.id,
                    issued_notes: formData.issuedNotes.value,
                    transfer_date: formData.transferDate.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            if(vm.context == 'receive'){
                data = {
                    transfer: {
                        status: "received",
                        received_date: formData.transferDate.value,
                        _time_received_date_time: formData.transferDate.value,
                        received_notes: formData.issuedNotes.value,
                        received_by_user_id: user.id,
                        _w: [
                            ["id", "e", vm.edits.id]
                        ]
                    }
                };
            }
            //update selected assets transfer conditions
            //all assets must be of status pending transer
            var temp = [];
            var assetsTemp = [];
            for (const prop in vm.formDataAssets) {
                if (Object.hasOwnProperty.call(vm.formDataAssets, prop)) {
                    const assetConditionFormData = vm.formDataAssets[prop];
                    if(vm.context == 'issue'){
                        temp.push({
                            transfer_condition: assetConditionFormData.value,
                            _w: [
                                ["id", "e", assetConditionFormData.transferAssetId]
                            ]
                        });
                        assetsTemp.push({
                            status: "Pending Transfer",
                            _w: [
                                ["id", "e", assetConditionFormData.assetId]
                            ]
                        });
                    }else{
                        temp.push({
                            receiving_condition: assetConditionFormData.value,
                            _w: [
                                ["id", "e", assetConditionFormData.transferAssetId]
                            ]
                        });
                        assetsTemp.push({
                            status: "In Store",
                            _w: [
                                ["id", "e", assetConditionFormData.assetId]
                            ]
                        });
                    }
                }
            }
            data["transfer_assets"] = temp;
            data["assets"] = assetsTemp;
            var activity = "issue asset transfer " + vm.edits.id;
            var description = "issued asset transfer" + JSON.stringify(data);
            if(vm.context == 'receive'){
                activity = "receive asset transfer " + vm.edits.id;
                description = "received asset transfer" + JSON.stringify(data);
            }

            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: activity,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: description
                    });
                    http.transferDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateAssetsTransferDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                branches: {},
                transfer_assets: {
                    _w:[
                        ["transfer_id", "e", vm.edits.id]
                    ]
                },
                transfer_support_documents: {
                    _w:[
                        ["transfer_id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess data
                    //indexed assets
                    var indexAssets = Utils.index(res.assets, "id");
                    var transferAssets = Utils.inject(res.transfer_assets, indexAssets, {
                        asset: "asset_id",
                    });
                    onSuccess({
                        assets: res.assets,
                        branches: res.branches,
                        transferAssets: transferAssets,
                        transferSupportDocuments: res.transfer_support_documents
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteTransferSupportingDocument(uploadFormDataInput, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                transfer_support_document: {
                    _w: [
                        ["id", "e", uploadFormDataInput.id.value]
                    ]
                },
                _pst_post: {
                    _rmv_file_: uploadFormDataInput.link.value
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete asset transfer supporting document " + uploadFormDataInput.id.value,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed asset transfer supporting document " + JSON.stringify(uploadFormDataInput),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateAssetTransfer(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {

            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var transferDate = formData.transferDate.value.trim();
            var transferDateTime = 0;
            if(transferDate.length > 0){
                var temp = transferDate + " 00:00:00";
                transferDateTime = (new Date(temp)).getTime() / 1000;
            }


            var data = {
                transfer: {
                    title: formData.title.value,
                    issuing_branch_id: formData.issuingBranchId.value,
                    receiving_branch_id: formData.receivingBranchId.value,
                    scheduled_tansfer_date: formData.scheduledTansferDate.value,
                    _time_scheduled_tansfer_date_time: formData.scheduledTansferDate.value,
                    transfer_date: transferDate,
                    transfer_date_time: transferDateTime,
                    transfer_notes: formData.transferNotes.value,
                    no_of_assets: 0, //to be updated from below
                    _w:[
                        ["id", "e", formData.id]
                    ]
                },
                //delete any previous selected assets and 
                //as for the supported documents we shall detect in the code below
                //only new documents and upload/post them 
                _pre_delete: {
                    transfer_asset: {
                        _w:[
                            ["transfer_id", "e", formData.id]
                        ]
                    }
                }
            };
            
            //add transfer assets
            if(vm.selectedAssets.length > 0){
                //assets will need to be post_posted
                data["_pst_post"] = {};
                var transferAssets = [];
                for (let index = 0; index < vm.selectedAssets.length; index++) {
                    const selectedAsset = vm.selectedAssets[index];
                    transferAssets.push({
                        transfer_id: formData.id,
                        asset_id: selectedAsset.assetId.value,
                        transfer_condition: "",
                        receiving_condition: "" 
                    });
                }
                if(transferAssets.length > 0){
                    data._pst_post["transfer_assets"] = transferAssets;
                    data.transfer.no_of_assets = transferAssets.length;
                }
                
            }
            //if any new supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    if(uploadedDocument.transferId.value == ""){
                        supportDocuments.push({
                            transfer_id: formData.id,
                            name: uploadedDocument.name.value,
                            type: uploadedDocument.type.value,
                            link: uploadedDocument.link.value 
                        });
                    }
                }
                if(supportDocuments.length > 0){
                    if(!data["_pst_post"]){
                        data["_pst_post"] = {};
                    }
                    data._pst_post["transfer_support_documents"] = supportDocuments
                }
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit asset transfer " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated asset transfer details " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    disposalBucketDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                disposal_bucket_items: {
                    asset: {},
                    _desc: ["id"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        disposalBucketItems: res.disposal_bucket_items
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addDisposalBucketAssetsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        //only flag assets that are not in the bucket
        this.delay(function () {
            var data = {
                assets: {
                    _w:[
                        ["flag", "ne", "marked"]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addDisposalBucketItem(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var data = {
                disposal_bucket_item: {
                    asset_id: formData.assetId.value,
                    branch_id: user.belongs_to_branch_id,
                    type: formData.type.value,
                    _date_added_date: "",
                    _now_added_date_time: "",
                    added_by_user_id: user.id,
                    added_notes: formData.addedNotes.value,
                    purchase_cost: formData.purchaseCost.value,
                    useful_years: formData.usefulYears.value,
                    salvage_amount: formData.salvageAmount.value,
                    current_value: formData.currentValue.value,
                    status: "marked",
                    current_asset_status: formData.currentAssetStatus.value,
                    current_asset_condition: formData.currentAssetCondition.value,
                },
                //mark the asset as flaged
                _pst_update: {
                    asset: {
                        flag: "marked",
                        status: "Needs Dispossal",
                        _w: [
                            ["id", "e", formData.assetId.value]
                        ]
                    }
                }
            }
            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "identify asset for disposal",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "identified asset for disposal " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateDisposalBucketAssetsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateDisposalBucketItem(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {

            var data = {
                disposal_bucket_item: {
                    type: formData.type.value,
                    added_notes: formData.addedNotes.value,
                    _w: [
                        ["id", "e", formData.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit identify asset for disposal " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "edit identified asset for disposal " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    disposalsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                disposals: {
                    branch: {},
                    _desc: ["id"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        disposals: res.disposals
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addDisposalDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            // nyd
            // ideally these assets should be belonging to the branch
            var data = {
                branches: {},
                disposal_bucket_items: {
                    asset: {},
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess
                    let disposalItemAssets = [];
                    for (let index = 0; index < res.disposal_bucket_items.length; index++) {
                        const disposal_bucket_item = res.disposal_bucket_items[index];
                        disposal_bucket_item.name = disposal_bucket_item.asset.name;
                        disposalItemAssets.push(disposal_bucket_item);
                    }
                    onSuccess({
                        branches: res.branches,
                        disposalBucketItems: disposalItemAssets
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addDisposal(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var data = {
                disposal: {
                    branch_id: formData.branchId.value,
                    title: formData.title.value,
                    scheduled_disposal_date:  formData.scheduledDisposalDate.value,
                    _time_scheduled_disposal_date_time: formData.scheduledDisposalDate.value,
                    notes: formData.notes.value,
                    no_of_assets: 0,
                    total_assets_value: 0,
                    status: "pending"
                },
            }
            //disposal_assets
            if(vm.selectedAssets.length > 0){
                //we need to update the disposal buket items and shift the
                //status from marked to selected so that another disposal
                //request doesnot pick on the same already marked selected assets disposal 
                //but after some reasoning, I think this should be done after the disposal
                //has been approved because that gives us validity
                var disposalAssets = [];
                var totalValue = 0;
                for (let index = 0; index < vm.selectedAssets.length; index++) {
                    const selectedAsset = vm.selectedAssets[index];
                    disposalAssets.push({
                        _fk_disposal_id: "disposal",
                        disposal_bucket_item_id: selectedAsset.disposalBucketItemId.value,
                        asset_id: selectedAsset.assetId.value,
                        type: selectedAsset.type.value,
                        purchase_cost:  selectedAsset.purchaseCost.value,
                        useful_years: selectedAsset.usefulYears.value,
                        salvage_amount: selectedAsset.salvageAmount.value,
                        current_value: selectedAsset.currentValue.value,
                        disposal_condition: "", //applied on disposal approval phase
                    });
                    totalValue += parseFloat(selectedAsset.currentValue.value);
                }
                data["disposal_assets"] = disposalAssets;
                data.disposal.no_of_assets = disposalAssets.length;
                data.disposal.total_assets_value = totalValue;
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    supportDocuments.push({
                        _fk_disposal_id: "disposal",
                        name: uploadedDocument.name.value,
                        type: uploadedDocument.type.value,
                        link: uploadedDocument.link.value 
                    });
                }
                data["disposal_support_documents"] = supportDocuments;
            }
            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "posted asset disposal",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted a new asset disposal " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteDisposalDocument(uploadFormDataInput, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                disposal_support_document: {
                    _w: [
                        ["id", "e", uploadFormDataInput.id.value]
                    ]
                },
                _pst_post: {
                    _rmv_file_: uploadFormDataInput.link.value
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete asset disposal supporting document " + uploadFormDataInput.id.value,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed asset disposal supporting document " + JSON.stringify(uploadFormDataInput),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateDisposalDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            // nyd
            // ideally these assets should be belonging to the branch
            var data = {
                branches: {},
                disposal_bucket_items: {
                    asset: {},
                },
                disposal_assets: {
                    disposal_bucket_item: {},
                    asset: {},
                    _w: [
                        ["disposal_id", "e", vm.edits.id]
                    ]
                },
                disposal_support_documents: {
                    _w: [
                        ["disposal_id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess
                    let disposalItemAssets = [];
                    for (let index = 0; index < res.disposal_bucket_items.length; index++) {
                        const disposal_bucket_item = res.disposal_bucket_items[index];
                        disposal_bucket_item.name = disposal_bucket_item.asset.name;
                        disposalItemAssets.push(disposal_bucket_item);
                    }
                    onSuccess({
                        branches: res.branches,
                        disposalBucketItems: disposalItemAssets,
                        disposalAssets: res.disposal_assets,
                        disposalSupportDocuments: res.disposal_support_documents
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateDisposal(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var data = {
                disposal: {
                    branch_id: formData.branchId.value,
                    title: formData.title.value,
                    scheduled_disposal_date:  formData.scheduledDisposalDate.value,
                    _time_scheduled_disposal_date_time: formData.scheduledDisposalDate.value,
                    notes: formData.notes.value,
                    no_of_assets: 0,
                    total_assets_value: 0,
                    status: "pending",
                    _w:[
                        ["id", "e", formData.id]
                    ]
                },
                _pre_delete: {
                    disposal_asset: {
                        _w:[
                            ["disposal_id", "e", formData.id]
                        ]
                    }
                }
            }
            //disposal_assets
            if(vm.selectedAssets.length > 0){
                data["_pst_post"] = {};
                var disposalAssets = [];
                var totalValue = 0;
                for (let index = 0; index < vm.selectedAssets.length; index++) {
                    const selectedAsset = vm.selectedAssets[index];
                    disposalAssets.push({
                        disposal_id: formData.id,
                        disposal_bucket_item_id: selectedAsset.disposalBucketItemId.value,
                        asset_id: selectedAsset.assetId.value,
                        type: selectedAsset.type.value,
                        purchase_cost:  selectedAsset.purchaseCost.value,
                        useful_years: selectedAsset.usefulYears.value,
                        salvage_amount: selectedAsset.salvageAmount.value,
                        current_value: selectedAsset.currentValue.value,
                        disposal_condition: "", //applied on disposal approval phase
                    });
                    totalValue += parseFloat(selectedAsset.currentValue.value);
                }
                if(disposalAssets.length > 0){
                    data._pst_post["disposal_assets"] = disposalAssets;
                    data.disposal.no_of_assets = disposalAssets.length;
                    data.disposal.total_assets_value = totalValue;
                }
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    if(uploadedDocument.disposalId.value == ""){
                        supportDocuments.push({
                            disposal_id: formData.id,
                            name: uploadedDocument.name.value,
                            type: uploadedDocument.type.value,
                            link: uploadedDocument.link.value 
                        });
                    }
                }
                if(supportDocuments.length > 0){
                    if(!data["_pst_post"]){
                        data["_pst_post"] = {};
                    }
                    data._pst_post["disposal_support_documents"] = supportDocuments
                }
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit asset disposal",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updates asset disposal " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    disposalDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                disposal: {
                    _a: "* time_inserted",
                    branch: {},
                    _w: [
                        ["id", "e", item.id]
                    ]
                },
                disposal_assets: {
                    disposal_bucket_item: {},
                    asset: {},
                    _w: [
                        ["disposal_id", "e", item.id]
                    ]
                },
                disposal_support_documents: {
                    _w: [
                        ["disposal_id", "e", item.id]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess
                    var disposalAssetsTemp = [];
                    for(var i= 0; i< res.disposal_assets.length; i++){
                        var disposalAsset = res.disposal_assets[i];
                        disposalAssetsTemp.push({
                            id: disposalAsset.id,
                            name: disposalAsset.asset.name,
                            type: disposalAsset.type,
                            purchaseCost: disposalAsset.purchase_cost,
                            usefulYears: disposalAsset.useful_years,
                            salvageAmount: disposalAsset.salvage_amount,
                            currentValue:  disposalAsset.current_value,
                            disposalCondition:  disposalAsset.disposal_condition,
                            addedNotes: disposalAsset.disposal_bucket_item.added_notes,
                            condition: disposalAsset.asset.condition,
                            status: disposalAsset.asset.status,
                            disposal_bucket_item_id: disposalAsset.disposal_bucket_item_id,
                            asset_id: disposalAsset.asset_id
                        });
                    }
                    onSuccess({
                        disposal: res.disposal,
                        disposalAssets: disposalAssetsTemp,
                        disposalSupportDocuments:  res.disposal_support_documents
                    });
                })
                .catch((errors) => {
                    console.log("Errors @1", errors);
                    onErrors(errors)
                });
        });
    },
    rejectDisposal(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                disposal: {
                    status: "rejected",
                    _date_rejected_date: "",
                    _now_rejected_date_time: "",
                    rejected_by_user_id: user.id,
                    rejected_notes: formData.rejectedNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "reject asset disposal " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "rejected asset disposal" + JSON.stringify(vm.edits),
                    });
                    http.disposalDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    approveDisposal(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            //When a disposal is approved then the status of the buckets
            //and probaly the assets have to be elevated also
            var data = {
                disposal: {
                    status: "approved",
                    _date_approved_date: "",
                    _now_approved_date_time: "",
                    approved_by_user_id: user.id,
                    approval_notes: formData.approvalNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            //update the disposal bucket items
            if(vm.disposalAssets.length > 0){
                var bucketItems = [];
                var assetItems = [];
                for(var i=0; i < vm.disposalAssets.length; i++){
                    var disposalAsset = vm.disposalAssets[i];
                    bucketItems.push({
                        status: "selected",
                        _w: [
                            ["id", "e", disposalAsset.disposal_bucket_item_id]
                        ]
                    });
                    assetItems.push({
                        flag: "marked",
                        status: "Pending Dispossal",
                        _w: [
                            ["id", "e", disposalAsset.asset_id]
                        ]
                    });
                }
                data["disposal_bucket_items"] = bucketItems;
                data["assets"] = assetItems;
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "approve asset disposal " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "approved asset disposal" + JSON.stringify(data),
                    });
                    http.disposalDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    disposeAssetsDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                disposal_assets: {
                    disposal_bucket_item: {},
                    asset: {},
                    _w: [
                        ["disposal_id", "e", item.id]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess
                    var disposalAssetsTemp = [];
                    for(var i= 0; i< res.disposal_assets.length; i++){
                        var disposalAsset = res.disposal_assets[i];
                        disposalAssetsTemp.push({
                            id: disposalAsset.id,
                            name: disposalAsset.asset.name,
                            type: disposalAsset.type,
                            purchaseCost: disposalAsset.purchase_cost,
                            usefulYears: disposalAsset.useful_years,
                            salvageAmount: disposalAsset.salvage_amount,
                            currentValue:  disposalAsset.current_value,
                            disposalCondition:  disposalAsset.disposal_condition,
                            addedNotes: disposalAsset.disposal_bucket_item.added_notes,
                            condition: disposalAsset.asset.condition,
                            status: disposalAsset.asset.status,
                            disposal_bucket_item_id: disposalAsset.disposal_bucket_item_id,
                            asset_id: disposalAsset.asset_id
                        });
                    }
                    onSuccess({
                        disposalAssets: disposalAssetsTemp
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    disposeAssets(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                disposal: {
                    status: "disposed",
                    disposal_date: formData.disposalDate.value,
                    _time_disposal_date_time: formData.disposalDate.value,
                    disposed_by_user_id: user.id,
                    disposal_notes: formData.disposalNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            //update selected assets dispose conditions
            //all assets must be set to status of Disposed
            var temp = [];
            var assetsTemp = [];
            for (const prop in vm.formDataAssets) {
                if (Object.hasOwnProperty.call(vm.formDataAssets, prop)) {
                    const assetConditionFormData = vm.formDataAssets[prop];
                    temp.push({
                        disposal_condition: assetConditionFormData.value,
                        _w: [
                            ["id", "e", assetConditionFormData.disposeAssetId]
                        ]
                    });
                    assetsTemp.push({
                        status: "Disposed",
                        _w: [
                            ["id", "e", assetConditionFormData.assetId]
                        ]
                    });
                }
            }
            data["disposal_assets"] = temp;
            data["assets"] = assetsTemp;
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "dispose assets " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "disposed assets " + JSON.stringify(data)
                    });
                    http.disposalDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    categoriesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                categories: {
                    _pull_debit_account: "account.debit_account_id",
                    _pull_credit_account: "account.credit_account_id",
                    _asc: ["name"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess to add a label property
                    var catsTemp = [];
                    for (let index = 0; index < res.categories.length; index++) {
                        const category = res.categories[index];
                        catsTemp.push({
                            ...category,
                            label: category.name
                        });
                    }
                    onSuccess({
                        categories: catsTemp
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addCategoriesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var query = {
                categories: {},
                accounts: {}
            };
            Bee.get(query, isMock, vm)
                .then((res) => {
                    //add an empty category 
                    var categoriesTemp = [{
                        id: 0,
                        debit_account_id: 0,
                        credit_account_id: 0,
                        category_id: 0,
                        name: "",
                        useful_years: 0,
                        description: "",
                        identifier: ""
                    }];
                    categoriesTemp = categoriesTemp.concat(res.categories);
                    var categories = Utils.toValueLabelList(
                        categoriesTemp,
                        "id",
                        "name"
                    );
                    var accounts = Utils.toValueLabelList(
                        res.accounts,
                        "id",
                        "name"
                    );
                    onSuccess({
                        categories: categories,
                        accounts: accounts
                    })
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addCategory(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var parentCategoryId = formData.parentCategoryId.value;
            if(parentCategoryId == null){
                parentCategoryId = "";
            }
            parentCategoryId = parentCategoryId.toString();
            parentCategoryId = parentCategoryId.trim();
            if(parentCategoryId == ""){
                parentCategoryId = "0";
            }
            var data = {
                category: {
                    debit_account_id: formData.debitAccountId.value,
                    credit_account_id: formData.creditAccountId.value,
                    category_id: parentCategoryId,
                    name: formData.name.value,
                    useful_years: formData.usefulYears.value,
                    description: formData.description.value,
                    identifier: formData.identifier.value,
                    short_name: formData.shortName.value,
                }
            };
            //extra fields
            if(vm.addedExtraFields.length > 0){
                var extraFields = [];
                for (let index = 0; index < vm.addedExtraFields.length; index++) {
                    const addedExtraField = vm.addedExtraFields[index];
                    extraFields.push({
                        _fk_category_id: "category",
                        name: addedExtraField.name.value,
                        type: addedExtraField.type.value
                        //is_required for nowwe we are not considering this attribute
                        //units for now we are not utilizing this attribute
                    });
                }
                data["extra_fields"] = extraFields;
            }
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "added category",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted asset category " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateCategoryDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                categories: {},
                accounts: {},
                extra_fields: {
                    _w:[
                        ["category_id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //add an empty category 
                    var categoriesTemp = [{
                        id: 0,
                        debit_account_id: 0,
                        credit_account_id: 0,
                        category_id: 0,
                        name: "",
                        useful_years: 0,
                        description: "",
                        identifier: ""
                    }];
                    categoriesTemp = categoriesTemp.concat(res.categories);
                    var categories = Utils.toValueLabelList(
                        categoriesTemp,
                        "id",
                        "name"
                    );
                    var accounts = Utils.toValueLabelList(
                        res.accounts,
                        "id",
                        "name"
                    );
                    onSuccess({
                        categories: categories,
                        accounts: accounts,
                        extraFields: res.extra_fields
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateCategory(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var parentCategoryId = formData.parentCategoryId.value;
            if(parentCategoryId == null){
                parentCategoryId = "";
            }
            parentCategoryId = parentCategoryId.toString();
            parentCategoryId = parentCategoryId.trim();
            if(parentCategoryId == ""){
                parentCategoryId = "0";
            }

            var data = {
                category: {
                    debit_account_id: formData.debitAccountId.value,
                    credit_account_id: formData.creditAccountId.value,
                    category_id: parentCategoryId,
                    name: formData.name.value,
                    useful_years: formData.usefulYears.value,
                    description: formData.description.value,
                    identifier: formData.identifier.value,
                    short_name: formData.shortName.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                },
                //delete any previous added extra fields 
                _pre_delete: {
                    extra_field: {
                        _w:[
                            ["category_id", "e", formData.id]
                        ]
                    }
                }
            };
            
            //add extra fields if any 
            if(vm.addedExtraFields.length > 0){
                //extra fields will need to be post_posted
                data["_pst_post"] = {};
                var extraFields = [];
                for (let index = 0; index < vm.addedExtraFields.length; index++) {
                    const addedExtraField = vm.addedExtraFields[index];
                    extraFields.push({
                        category_id: formData.id,
                        name: addedExtraField.name.value,
                        type: addedExtraField.type.value
                        //is_required for nowwe we are not considering this attribute
                        //units for now we are not utilizing this attribute
                    });
                }
                if(extraFields.length > 0){
                    data._pst_post["extra_fields"] = extraFields;
                }
                
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit asset category " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated asset category details " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    suppliersDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                suppliers: {
                    _asc: ["name"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        suppliers: res.suppliers
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addSupplier(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                supplier: {
                    name: formData.name.value,
                    type: formData.type.value,
                    primary_contact: formData.primaryContact.value,
                    other_contact: formData.otherContact.value,
                    email: formData.email.value,
                    website: formData.website.value,
                    address: formData.address.value,
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "add supplier",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted supplier info " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateSupplier(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                supplier: {
                    name: formData.name.value,
                    type: formData.type.value,
                    primary_contact: formData.primaryContact.value,
                    other_contact: formData.otherContact.value,
                    email: formData.email.value,
                    website: formData.website.value,
                    address: formData.address.value,
                    _w: [
                        ["id", "e", formData.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit supplier " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated supplier details " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    purchaseOrderDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                acquisition_orders: {
                    branch: {},
                    supplier: {},
                    _desc: ["id"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        acquisitionOrders: res.acquisition_orders
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addPurchaseOrderDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                branches: {},
                suppliers: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        branches: res.branches,
                        suppliers: res.suppliers
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addPurchaseOrder(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var orderNumber = formData.orderNumber.value.trim();
            if(orderNumber == ""){
                //auto generate an order number
                var dateStr = Utils.dateToStandardDateString(new Date());
                dateStr = dateStr.split("-").join("");
                var rnd = parseInt(Math.random(user.id)*1000);
                orderNumber = `${user.id}${rnd}${dateStr}`;
            }
            var data = {
                acquisition_order: {
                    branch_id: formData.branchId.value,
                    supplier_id: formData.supplierId.value,
                    order_number:  orderNumber,
                    grn_number: "",
                    type: formData.type.value,
                    required_date: formData.requiredDate.value,
                    _time_required_date_time: formData.requiredDate.value,
                    notes: formData.notes.value,
                    no_of_items: 0,
                    total_amount: 0,
                    status: "pending"
                },
            }
            //added assets
            if(vm.orderItems.length > 0){
                var orderItems = [];
                var totalValue = 0;
                for (let index = 0; index < vm.orderItems.length; index++) {
                    const orderItem = vm.orderItems[index];
                    orderItems.push({
                        _fk_acquisition_order_id: "acquisition_order",
                        name: orderItem.name.value,
                        specifications: orderItem.specifications.value,
                        unit_price: orderItem.unitPrice.value,
                        quantity:  orderItem.quantity.value,
                        line_total_amount: orderItem.lineTotalAmount.value,
                        status: "pending",
                        status_level: 0
                    });
                    totalValue += parseFloat(orderItem.lineTotalAmount.value);
                }
                data["order_items"] = orderItems;
                data.acquisition_order.no_of_items = orderItems.length;
                data.acquisition_order.total_amount = totalValue;
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    supportDocuments.push({
                        _fk_acquisition_order_id: "acquisition_order",
                        name: uploadedDocument.name.value,
                        type: uploadedDocument.type.value,
                        link: uploadedDocument.link.value 
                    });
                }
                data["order_support_documents"] = supportDocuments;
            }
            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "posted asset acquisition",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted a new asset acquisition " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteAcquisiationDocument(uploadFormDataInput, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                order_support_document: {
                    _w: [
                        ["id", "e", uploadFormDataInput.id.value]
                    ]
                },
                _pst_post: {
                    _rmv_file_: uploadFormDataInput.link.value
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete asset acquisition supporting document " + uploadFormDataInput.id.value,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed asset acquisition supporting document " + JSON.stringify(uploadFormDataInput),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updatedPurchaseOrderDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                branches: {},
                suppliers: {},
                order_items: {
                    _w: [
                        ["acquisition_order_id", "e", vm.edits.id]
                    ]
                },
                order_support_documents: {
                    _w: [
                        ["acquisition_order_id", "e", vm.edits.id]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        branches: res.branches,
                        suppliers: res.suppliers,
                        orderItems: res.order_items,
                        orderSupportDocuments: res.order_support_documents
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updatePurchaseOrder(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var orderNumber = formData.orderNumber.value.trim();
            if(orderNumber == ""){
                //auto generate an order number
                var dateStr = Utils.dateToStandardDateString(new Date());
                dateStr = dateStr.split("-").join("");
                var rnd = parseInt(Math.random(user.id)*1000);
                orderNumber = `${user.id}${rnd}${dateStr}`;
            }

            var data = {
                acquisition_order: {
                    branch_id: formData.branchId.value,
                    supplier_id: formData.supplierId.value,
                    order_number:  orderNumber,
                    grn_number: "",
                    type: formData.type.value,
                    required_date: formData.requiredDate.value,
                    _time_required_date_time: formData.requiredDate.value,
                    notes: formData.notes.value,
                    no_of_items: 0,
                    total_amount: 0,
                    status: "pending",
                    _w:[
                        ["id", "e", formData.id]
                    ]
                },
                _pre_delete: {
                    order_item: {
                        _w:[
                            ["acquisition_order_id", "e", formData.id]
                        ]
                    }
                }
            }
            //added assets
            if(vm.orderItems.length > 0){
                data["_pst_post"] = {};
                var orderItems = [];
                var totalValue = 0;
                for (let index = 0; index < vm.orderItems.length; index++) {
                    const orderItem = vm.orderItems[index];
                    orderItems.push({
                        acquisition_order_id: formData.id,
                        name: orderItem.name.value,
                        specifications: orderItem.specifications.value,
                        unit_price: orderItem.unitPrice.value,
                        quantity:  orderItem.quantity.value,
                        line_total_amount: orderItem.lineTotalAmount.value,
                        status: "pending",
                        status_level: 0
                    });
                    totalValue += parseFloat(orderItem.lineTotalAmount.value);
                }
                if(orderItems.length > 0){
                    data._pst_post["order_items"] = orderItems;
                    data.acquisition_order.no_of_items = orderItems.length;
                    data.acquisition_order.total_amount = totalValue;
                }
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    if(uploadedDocument.acquisitionOrderId.value == ""){
                        supportDocuments.push({
                            acquisition_order_id: formData.id,
                            name: uploadedDocument.name.value,
                            type: uploadedDocument.type.value,
                            link: uploadedDocument.link.value 
                        });
                    }
                }
                if(supportDocuments.length > 0){
                    if(!data["_pst_post"]){
                        data["_pst_post"] = {};
                    }
                    data._pst_post["order_support_documents"] = supportDocuments
                }
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit asset acquisition",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updates asset acquisition " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    purchaseOrderDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                acquisition_order: {
                    _a: "* time_inserted",
                    branch: {},
                    supplier: {},
                    _w: [
                        ["id", "e", item.id]
                    ]
                },
                order_items: {
                    _w: [
                        ["acquisition_order_id", "e", item.id]
                    ]
                },
                order_support_documents: {
                    _w: [
                        ["acquisition_order_id", "e", item.id]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        acquisitionOrder: res.acquisition_order,
                        orderItems: res.order_items,
                        orderSupportDocuments:  res.order_support_documents
                    });
                })
                .catch((errors) => {
                    console.log("Errors @1", errors);
                    onErrors(errors)
                });
        });
    },
    rejectPurchaseOrder(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                acquisition_order: {
                    status: "rejected",
                    _date_rejected_date: "",
                    _now_rejected_date_time: "",
                    rejected_by_user_id: user.id,
                    rejected_notes: formData.rejectedNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "reject asset acquisition " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "rejected asset acquisition" + JSON.stringify(vm.edits),
                    });
                    http.purchaseOrderDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    approvePurchaseOrder(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                acquisition_order: {
                    status: "approved",
                    _date_approved_date: "",
                    _now_approved_date_time: "",
                    approved_by_user_id: user.id,
                    approval_notes: formData.approvalNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "approve asset acquisition " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "approved asset acquisition" + JSON.stringify(vm.edits),
                    });
                    http.purchaseOrderDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    receivePurchaseOrderItemDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                order_items: {
                    _w: [
                        ["acquisition_order_id", "e", item.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        orderItems: res.order_items
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    receivePurchaseOrder(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var grnNumber = formData.grnNumber.value.trim();
            if(grnNumber == ""){
                //auto generate a grn number
                var dateStr = Utils.dateToStandardDateString(new Date());
                dateStr = dateStr.split("-").join("");
                var rnd = parseInt(Math.random(user.id)*1000);
                grnNumber = `${user.id}${rnd}${dateStr}`;
            }

            var data = {
                acquisition_order: {
                    delivery_date: formData.deliveryDate.value,
                    _time_delivery_date_time: formData.deliveryDate.value,
                    delivery_notes: formData.notes.value,
                    grn_number: grnNumber,
                    checked_by_name: formData.checkedByName.value,
                    status: "delivered",
                    _w:[
                        ["id", "e", formData.id]
                    ]
                },
                order_items: []
            };
            //update the order items
            var allDelivered = true;
            for (var index = 0; index < vm.formDataItems.length; index++) {
                const formDataItem = vm.formDataItems[index];
                var itemToUpdate = {
                    quantity_delivered: formDataItem.quantityDelivered.value,
                    quantity_rejected: formDataItem.quantityRejected.value,
                    rejection_comment: formDataItem.rejectionComment.value,
                    receive_package_identity_label: formDataItem.receivePackageIdentityLabel.value,
                    status: formDataItem.status.value,
                    status_level: 1,
                    _w:[
                        ["id", "e", formDataItem.id.value]
                    ]
                };
                data.order_items.push(itemToUpdate);
                if(formDataItem.status.value != "delivered"){
                    allDelivered = false;
                }
            }
            if(allDelivered == false){
                data.order_items.status = "partially";
            }
            
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "received asset acquisition",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "received asset acquisition " + JSON.stringify(data),
                    });
                    http.purchaseOrderDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    assetRecordingsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                order_items: {
                    acquisition_order: {},
                    order_recorded_assets: {}, //nyd: slow query may need a better way
                    _desc: ["acquisition_order_id"],
                    _w: [
                        [
                            ["status", "e", "delivered"],
                            "OR",
                            ["status", "e", "partially"]
                        ]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess
                    var items = [];
                    for (let index = 0; index < res.order_items.length; index++) {
                        var orderItem = res.order_items[index];
                        var status = "pending";
                        var delivered = parseInt(orderItem.quantity_delivered);
                        var recorded = orderItem.order_recorded_assets.length;
                        var remaining =  delivered - recorded;


                        if(remaining == 0){
                            status = "finished";
                        }else if(recorded != 0 && recorded < delivered){
                            status = "partially"; 
                        }else {
                            status = "pending";
                        }
                        items.push({
                            ...orderItem,
                            quantity_recorded: recorded.toString(),
                            quantity_remaining: remaining,
                            status: status
                        });
                    }
                    onSuccess({
                        orderItems: items
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    assetShortagesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                order_items: {
                    acquisition_order: {},
                    _desc: ["acquisition_order_id"],
                    _w: [
                        ["status", "e", "partially"]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        orderItems: res.order_items
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    resolveShortage(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                order_item: {
                    is_rejected_resolved: 1,
                    resolve_rejection_comment: formData.resolveRejectionComment.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "marked shortage as resolved " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "marked shortage as resolved " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    recordedAssetsListDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                order_recorded_assets: {
                    asset: {
                        category: {}
                    },
                    _w: [
                        ["order_item_id", "e", item.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        orderRecordedAssets: res.order_recorded_assets
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    alertsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            //fetching both my specific notifications and general 
            //notificatons.

            var data = {
                user: {
                    _w: [
                        ["id", "e", user.id]
                    ]
                },
                notifications: {
                    _w: [
                        [
                            ["user_id", "e", user.id],
                            "OR",
                            ["user_id", "e", 0]
                        ]
                    ],
                    _desc: ["id"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {

                    //nyd 
                    //according to my user roles, filter out the general notifications
                    //that i am not supposed to see

                    //nyd
                    //delete this hard coded noscence
                    res.notifications = [
                        {
                          id: 1,
                          sub_title: "End Of Life As Of 2023-04-01",
                          title: "Asset Kick Starter Pinkage (Serial Number - SN 374902AG29)",
                          details: "The asset reached its end of life: 2023-04-01, and was marked for fdisposal",
                          created_date: "2023-05-18",
                          created_date_time: 1684421165,
                          type: "Out of Service",
                          user_id: user.id,
                          is_read_updatable: 0, 
                          is_seen: 1
                        },
                        {
                          id: 2,
                          sub_title: "End Of Life As Of 2023-04-01",
                          title: "Asset Cable Car (Number Plate - UBJ 345K)",
                          details: "The asset has depreciated below the limit: 50%, current asset value: 450,000,000 ugx, purchase cost: 1,265,000,000 ugx, percentage depreciation: 34%",
                          created_date: "2023-05-13",
                          created_date_time: 1684420065,
                          type: "Depreciation Below",
                          user_id: user.id,
                          is_read_updatable: 0, 
                          is_seen: 1
                        }
                      ]

                    //add a highlighter flag
                    var editedNotifications = [];
                    
                    var lastSeenNotificationId = parseInt(res.user.last_seen_notification_id);
                    var latestReadNotificationId = lastSeenNotificationId;
                    var isUpdateNecessary = false;
                    for (let index = 0; index < res.notifications.length; index++) {
                        const notification = res.notifications[index];
                        var notificationId = parseInt(notification.id);
                        if(notificationId > lastSeenNotificationId){
                            notification.displayHighlight =  true;
                            if(notificationId > latestReadNotificationId){
                                latestReadNotificationId = notificationId;
                                isUpdateNecessary = true;
                            }
                        }else{
                            notification.displayHighlight =  false;
                        }
                        editedNotifications.push(notification);
                    }
                    
                    onSuccess({
                        notifications: editedNotifications,
                        latestReadNotificationId: latestReadNotificationId,
                        isUpdateNecessary: isUpdateNecessary
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateLastReadNotificationId(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var data = {
                user: {
                    last_seen_notification_id: formData.latestReadNotificationId.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                },
                //mark all my notifications whose id is <= this one as read
                notifications: {
                    is_seen: 1,
                    _w: [
                        [
                            ["user_id", "e", formData.id],
                            "AND",
                            ["is_read_updatable", "e", 1]
                        ]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "read notifications",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated last read notification " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    messageDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var custodianQuery = {
                custodian: {
                    _w: [
                        ["user_id","e", user.id]
                    ]
                }
            };
            Bee.get(custodianQuery, isMock, vm)
                .then((res) => {
                    var custodian = res.custodian;

                    var where = [
                        ["contact", "e", user.email]
                    ];
                    if(custodian != null){
                        where = [
                            [
                                ["contact", "e", user.email],
                                "OR",
                                ["contact", "e", custodian.contact]
                            ]
                        ];
                    }

                    var data = {
                        sent_messages: {
                            _w: where,
                            _desc: ["id"]
                        }
                    };
                    Bee.get(data, isMock, vm)
                    .then((res2) => {
                        //nyd
                        //remove this hardcorded useless data
                        var title  = "Asset Cable Car (Number Plate - UBJ 345K)";
                        var details = "The asset has depreciated below the limit: 50%, current asset value: 450,000,000 ugx, purchase cost: 1,265,000,000 ugx, percentage depreciation: 34%";
                        var message = `${title} ${details}`;
                        var to = "256703158861";
                        res2.sent_messages = [
                            {
                                id: 1,
                                send_date: "2023-05-19",
                                body: `{\n   \"message\": \"${message}\",\n    \"to\": \"${to}\",\n    \"sender_id\": \"Akili\",\n   \"callback_url\": \"\"\n}`,
                                contact: "0703158861",
                                formated_contact: to,
                                is_success: 1,
                                response: "200",
                                send_date_time: 1684421165,
                                service: "https://api.sms.to",
                                context: "End Of Life",
                                type: "sms",
                                identity: 34475839
                            }
                        ];
                        res2.sent_messages = res2.sent_messages.concat(res2.sent_messages).concat(res2.sent_messages)
                        onSuccess({
                            sentMessages: res2.sent_messages
                        });
                    })
                    .catch((errors) => {
                        onErrors(errors)
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    maintenanceScheduleDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                maintenances: {
                    asset: {},
                    _desc: ["id"]
                }
            };
            if(vm.usage && vm.usage == "upcoming"){
                var todayDate = new Date();
                var phpTodatDateTime = todayDate.getTime() / 1000;
                data.maintenances["_w"] = [
                    [
                        [
                            [
                                ["scheduled_maintenance_date_time", "gte", phpTodatDateTime],
                                "AND",
                                ["status", "ne", "finished"],
                            ],
                            "AND",
                            ["status", "ne", "budget rejected"]
                        ],
                        "AND",
                        ["status", "ne", "rejected"]
                    ]
                ];
            }
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        maintenances: res.maintenances
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addAssetMaintenanceDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteMaintenanceDocument(uploadFormDataInput, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                maintenance_support_document: {
                    _w: [
                        ["id", "e", uploadFormDataInput.id.value]
                    ]
                },
                _pst_post: {
                    _rmv_file_: uploadFormDataInput.link.value
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete asset maintenance supporting document " + uploadFormDataInput.id.value,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed asset maintenance supporting document " + JSON.stringify(uploadFormDataInput),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    getAssetLastMaintenanceDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                maintenances: {
                    _w: [
                        [
                            ["asset_id", "e", item.id],
                            "AND",
                            ["status", "e", "finished"]
                        ]
                    ],
                    _desc: ["performed_maintenance_date_time"],
                    _pg: 1
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess
                    var maintenance = null;
                    if(res.maintenances.length > 0){
                        maintenance = res.maintenance[0];
                    }
                    onSuccess({
                        maintenance: maintenance
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addAssetMaintenance(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);


            var lastMaintenanceDate = formData.lastMaintenanceDate.value.trim();
            var lastMaintenanceDateTime = 0;
            if(lastMaintenanceDate.length > 0){
                var lastMaintenanceDateObj = (new Date(lastMaintenanceDate));
                lastMaintenanceDateTime = lastMaintenanceDateObj.getTime() / 1000;
            }

            var nextMaintenanceDate = formData.nextMaintenanceDate.value.trim();
            var nextMaintenanceDateTime = 0;
            if(nextMaintenanceDate.length > 0){
                var nextMaintenanceDateObj = (new Date(nextMaintenanceDate));
                nextMaintenanceDateTime = nextMaintenanceDateObj.getTime() / 1000;
            }
            var data = {
                maintenance: {
                    asset_id: formData.assetId.value,
                    type: formData.type.value,
                    status: "pending",
                    last_maintenance_date: lastMaintenanceDate,
                    last_maintenance_date_time: lastMaintenanceDateTime,
                    scheduled_maintenance_date: formData.scheduledMaintenanceDate.value,
                    _time_scheduled_maintenance_date_time: formData.scheduledMaintenanceDate.value,
                    maintenance_notes: formData.maintenanceNotes.value,
                    next_maintenance_date: nextMaintenanceDate,
                    next_maintenance_date_time: nextMaintenanceDateTime
                }
            };
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    supportDocuments.push({
                        _fk_maintenance_id: "maintenance",
                        name: uploadedDocument.name.value,
                        type: uploadedDocument.type.value,
                        link: uploadedDocument.link.value 
                    });
                }
                data["maintenance_support_documents"] = supportDocuments;
            }

            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "add asset maintenance",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "scheduled new asset  maintenance " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateMaintenanceDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                performed_works: {
                    maintainance_work_type: {},
                    _w: [
                        ["maintenance_id", "e", vm.edits.id]
                    ]
                },
                maintenance_support_documents: {
                    _w: [
                        ["maintenance_id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        performedWorks: res.performed_works,
                        maintenanceSupportDocuments: res.maintenance_support_documents,
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    workTypesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                maintainance_work_types: {
                    _pull_debit_account: "account.debit_account_id",
                    _pull_credit_account: "account.credit_account_id",
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        maintainanceWorkTypes: res.maintainance_work_types
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addWorkTypesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                accounts: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        accounts: Utils.toValueLabelList(res.accounts, "id", "name"),
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateWorkTypesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                accounts: {} 
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    var accounts = Utils.toValueLabelList(
                        res.accounts,
                        "id",
                        "name"
                    );
                    onSuccess({
                        accounts: accounts
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addWorkType(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                maintainance_work_type: {
                    name: formData.name.value,
                    life_time_increase_days: formData.lifeTimeIncreaseDays.value,
                    debit_account_id: formData.debitAccountId.value,
                    credit_account_id: formData.creditAccountId.value,
                    description: formData.description.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "added maintenance work type",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted maintenance work type " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateWorkType(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            
            var data = {
                maintainance_work_type: {
                    name: formData.name.value,
                    life_time_increase_days: formData.lifeTimeIncreaseDays.value,
                    debit_account_id: formData.debitAccountId.value,
                    credit_account_id: formData.creditAccountId.value,
                    description: formData.description.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                }
            };
            
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr)
                    
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit maintenance work type " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated maintenace work type details " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    maintenanceDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                maintenance: {
                    _a: "* time_inserted",
                    asset: {},
                    _w: [
                        ["id", "e", item.id]
                    ]
                },
                performed_works: {
                    maintainance_work_type: {},
                    _w: [
                        ["maintenance_id", "e", item.id]
                    ]
                },
                maintenance_support_documents: {
                    _w: [
                        ["maintenance_id", "e", item.id]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        maintenance: res.maintenance,
                        performedWorks: res.performed_works,
                        maintenanceSupportDocuments:  res.maintenance_support_documents
                    });
                })
                .catch((errors) => {
                    console.log("Errors @1", errors);
                    onErrors(errors)
                });
        });
    },
    rejectAssetMaintenance(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                maintenance: {
                    status: "rejected",
                    _date_rejected_date: "",
                    _now_rejected_date_time: "",
                    rejected_by_user_id: user.id,
                    rejected_notes: formData.rejectedNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "reject asset maintenance " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "rejected asset maintenance" + JSON.stringify(vm.data),
                    });
                    http.maintenanceDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    }, 
    approveAssetMaintenance(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                maintenance: {
                    status: "approved",
                    _date_approved_date: "",
                    _now_approved_date_time: "",
                    approved_by_user_id: user.id,
                    approval_notes: formData.approvalNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "approve asset maintenenace " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "approved asset maintenenace " + JSON.stringify(vm.data),
                    });
                    http.maintenanceDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    recallAssetForMaintenance(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                maintenance: {
                    status: "recalled",
                    _date_recalled_date: "",
                    _now_recalled_date_time: "",
                    recalled_by_user_id: user.id,
                    recalled_asset_return_date: formData.recalledAssetReturnDate.value,
                    _time_recalled_asset_return_date_time: formData.recalledAssetReturnDate.value,
                    recalled_notes: formData.recalledNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((updateRes) => {
                    //nyd send a notification(email and or sms)/alert to the  current custodian
                    //if there is no custodian, inform the store manger and asset manager
                    //in anycase the store manager and asset manger have to be informed
                    
                    //post 
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "recalle asset for maintenace " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "recalled asset for maintenace " + JSON.stringify(vm.edits),
                    });
                    http.maintenanceDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    returnAssetMaintenanceDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                allocation: {
                    custodian: {},
                    _w: [
                        [
                            ["asset_id", "e", vm.edits.asset_id],
                            "AND",
                            ["status", "e", "allocated"]
                        ]
                    ]
                },
                custodians: {},
                asset: {
                    _w: [
                        ["id", "e", vm.edits.asset_id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        allocation: res.allocation,
                        custodians: res.custodians,
                        asset: res.asset
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    returnAssetForMaintenance(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var custodianId = 0;
            if(formData.custodianId.value == null || formData.custodianId.value.toString().trim() == ""){
                custodianId = 0;
            }else{
                custodianId = parseInt(formData.custodianId.value);
            }

            var data = {
                maintenance: {
                    status: "returned",
                    _date_returned_date: "",
                    _now_returned_date_time: "",
                    returned_by_user_id: user.id,
                    returned_by_custodian_id: custodianId,
                    returned_condition: formData.returnedCondition.value,
                    returned_status: formData.returnedStatus.value,
                    returned_notes: formData.returnedNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                },
                asset: {
                    condition: formData.returnedCondition.value,
                    status: "Under Maintenance",
                    _w:[
                        ["id", "e", vm.edits.asset_id]
                    ]
                }
            };
            if(custodianId > 0){
                data["allocation"] = {
                    return_condition: formData.returnedCondition.value,
                    status: "returned",
                    _w:[
                        ["custodian_id", "e", custodianId]
                    ]
                };
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    //nyd send a notification(email and or sms) to the concerned parties that the 
                    //asset has been returned to the asset so that further actions can be taken

                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "returned requisitioned asset " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "returned requisitioned asset " + JSON.stringify(data),
                    });
                    http.maintenanceDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    scheduleAssetMaintenanceDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                maintainance_work_types: {
                    _asc: ["name"]
                },
                asset: {
                    _w: [
                        ["id", "e", vm.edits.asset_id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        maintainanceWorkTypes: res.maintainance_work_types,
                        asset: res.asset
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addAssetMaintenanceSchedule(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {

            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var data = {
                performed_works: [],
                _pst_update: {
                    maintenance: null
                }
            }

            var totalAmount = 0;
            var totalGainedDays = 0;
            var averageGainedDays = 0;
            var beforeOutOfServiceDate = vm.asset.outof_service_date;
            var afterOutOfServiceDate = "";

            for (let index = 0; index < vm.workItems.length; index++) {
                const workItem = vm.workItems[index];
                data.performed_works.push({
                    maintenance_id: vm.edits.id,
                    maintainance_work_type_id: workItem.maintainanceWorkTypeId.value,
                    name: workItem.name.value,
                    unit_cost: workItem.unitCost.value,
                    quantity: workItem.quantity.value,
                    line_total_amount: workItem.lineTotalAmount.value,
                    notes: workItem.notes.value
                });

                //total amount
                var unitCost = parseFloat(workItem.unitCost.value);
                var quantity = parseFloat(workItem.quantity.value);
                var lineTotal = unitCost * quantity;
                totalAmount += lineTotal;

                //total gained days
                var workType = Utils.pick(vm.workTypes, "id", parseInt(workItem.maintainanceWorkTypeId.value));
                var daysGained = parseInt(workType.life_time_increase_days);
                totalGainedDays += daysGained;
            }


            averageGainedDays = Math.ceil(totalGainedDays/vm.workItems.length);
            var afterOutOfServiceDateObj = Utils.addDaysToDate(beforeOutOfServiceDate, averageGainedDays);
            afterOutOfServiceDate = Utils.dateToStandardDateString(afterOutOfServiceDateObj);
            
            //update the asset maintenance
            data._pst_update.maintenance = {
                total_amount: totalAmount,
                total_life_time_gained_days: averageGainedDays,
                before_maintenance_outof_service_date: beforeOutOfServiceDate,
                after_maintenance_outof_service_date: afterOutOfServiceDate,
                _date_budgeted_date: "",
                _now_budgeted_date_time: "",
                budgeted_by_user_id: user.id,
                status: "budgeted",
                _w: [
                    ["id", "e", vm.edits.id]
                ]
            };

            //update the outof service date and useful years of the asset after repair has been marked as finished
            
            Bee.post(data, isMock, vm)
                .then((res) => {
                    

                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "posted asset maintenance schedule",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted a new asset maintenance schedule " + JSON.stringify(data),
                    });
                    http.maintenanceDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    rejectBudgetForAssetMaintenance(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                maintenance: {
                    status: "budget rejected",
                    _date_budget_rejected_date: "",
                    _now_budget_rejected_date_time: "",
                    budget_rejected_by_user_id: user.id,
                    budget_rejected_notes: formData.budgetRejectedNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                },
                asset: {
                    status: "In Store",
                    condition: vm.edits.returned_condition,
                    _w: [
                        ["id", "e", vm.edits.asset_id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "reject budget for asset maintenance" + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "rejected budget for asset maintenance" + JSON.stringify(vm.data),
                    });
                    http.maintenanceDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },  
    approveBudgetForAssetMaintenance(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                maintenance: {
                    status: "budget approved",
                    _date_budget_approved_date: "",
                    _now_budget_approved_date_time: "",
                    budget_approved_by_user_id: user.id,
                    budget_approved_notes: formData.budgetApprovedNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "approve budget for asset maintenenace " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "approved budget for asset maintenenace " + JSON.stringify(vm.data),
                    });
                    http.maintenanceDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    finishAssetMaintenanceDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                asset: {
                    _w: [
                        ["id", "e", vm.edits.asset_id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        asset: res.asset
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    finishAssetMaintenance(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var usefulYears = parseInt(vm.asset.useful_years);
            var addedDays = parseInt(vm.edits.total_life_time_gained_days);
            var daysInOneYear = 365; //days
            var oneDay = (1/daysInOneYear); //years
            var addedYears = Number((oneDay*addedDays).toFixed(2));
            usefulYears = usefulYears + addedYears;

            var data = {
                maintenance: {
                    finished_condition: formData.finishedCondition.value,
                    status: "finished",
                    _date_performed_maintenance_date: "",
                    _now_performed_maintenance_date_time: "",
                    performed_by_user_id: user.id,
                    performed_notes: formData.performedNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                },
                asset: {
                    condition: formData.finishedCondition.value,
                    useful_years: usefulYears,
                    outof_service_date: vm.edits.after_maintenance_outof_service_date,
                    status: "In Store",
                    _w: [
                        ["id", "e", vm.edits.asset_id]
                    ]
                }
            };
            //nyd
            //post accounting transactions

            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "finish asset maintenenace " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "finish asset maintenenace " + JSON.stringify(vm.data),
                    });
                    http.maintenanceDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    impairmentsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                impairments: {
                    asset: {},
                    custodian: {},
                    _desc: ["id"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        impairments: res.impairments
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addImpairmentDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                custodians: {},
                allocations: {
                    _w: [
                        ["status", "e", "allocated"]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        custodians: res.custodians,
                        allocations: res.allocations
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addAssetImpairment(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            
            var data = {
                impairment: {
                    asset_id: formData.assetId.value,
                    custodian_id: formData.custodianId.value,
                    type:  formData.type.value,
                    status: "pending",
                    occured_date: formData.occuredDate.value,
                    _time_occured_date_time: formData.occuredDate.value,
                    impairment_value_amount: formData.impairmentValueAmount.value,
                    asset_condition: formData.assetCondition.value,
                    notes: formData.notes.value,
                    debit_account_id: 0,
                    credit_account_id: 0,
                    transaction_id: 0
                },
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    supportDocuments.push({
                        _fk_impairment_id: "impairment",
                        name: uploadedDocument.name.value,
                        type: uploadedDocument.type.value,
                        link: uploadedDocument.link.value 
                    });
                }
                data["impairment_support_documents"] = supportDocuments;
            }
            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "posted asset impairment",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted a asset impairment " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteImpairmentDocument(uploadFormDataInput, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                impairment_support_document: {
                    _w: [
                        ["id", "e", uploadFormDataInput.id.value]
                    ]
                },
                _pst_post: {
                    _rmv_file_: uploadFormDataInput.link.value
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete asset impairment supporting document " + uploadFormDataInput.id.value,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed asset impairment supporting document " + JSON.stringify(uploadFormDataInput),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updatedAssetImpairmentDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                custodians: {},
                allocations: {
                    _w: [
                        ["status", "e", "allocated"]
                    ]
                },
                impairment_support_documents: {
                    _w: [
                        ["impairment_id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        custodians: res.custodians,
                        allocations: res.allocations,
                        impairmentSupportDocuments: res.impairment_support_documents
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateAssetImpairment(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var data = {
                impairment: {
                    asset_id: formData.assetId.value,
                    custodian_id: formData.custodianId.value,
                    type:  formData.type.value,
                    occured_date: formData.occuredDate.value,
                    _occured_date_time: formData.occuredDate.value,
                    impairment_value_amount: formData.impairmentValueAmount.value,
                    asset_condition: formData.assetCondition.value,
                    notes: formData.notes.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                }
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    if(uploadedDocument.impairmentId.value == ""){
                        supportDocuments.push({
                            impairment_id: formData.id,
                            name: uploadedDocument.name.value,
                            type: uploadedDocument.type.value,
                            link: uploadedDocument.link.value 
                        });
                    }
                }
                if(supportDocuments.length > 0){
                    if(!data["_pst_post"]){
                        data["_pst_post"] = {};
                    }
                    data._pst_post["impairment_support_documents"] = supportDocuments
                }
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit asset impairment",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated asset impairment " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    impairmentDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                impairment: {
                    _a: "* time_inserted",
                    asset: {},
                    custodian: {},
                    _pull_debit_account: "account.debit_account_id",
                    _pull_credit_account: "account.credit_account_id",
                    _w: [
                        ["id", "e", item.id]
                    ]
                },
                impairment_support_documents: {
                    _w: [
                        ["impairment_id", "e", item.id]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        impairment: res.impairment,
                        impairmentSupportDocuments:  res.impairment_support_documents
                    });
                })
                .catch((errors) => {
                    console.log("Errors @2", errors);
                    onErrors(errors)
                });
        });
    },
    rejectImpairment(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                impairment: {
                    status: "rejected",
                    _date_rejected_date: "",
                    _now_rejected_date_time: "",
                    rejected_by_user_id: user.id,
                    rejected_notes: formData.rejectedNotes.value,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "reject asset impairment " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "rejected asset impairment" + JSON.stringify(vm.edits),
                    });
                    http.impairmentDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    approveImpairmentsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                accounts: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    var accounts = Utils.toValueLabelList(
                        res.accounts,
                        "id",
                        "name"
                    );
                    onSuccess({
                        accounts: accounts
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    approveImpairment(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            var data = {
                impairment: {
                    status: "approved",
                    _date_approved_date: "",
                    _now_approved_date_time: "",
                    approved_by_user_id: user.id,
                    approval_notes: formData.approvalNotes.value,
                    debit_account_id: formData.debitAccountId.value,
                    credit_account_id: formData.creditAccountId.value,
                    transaction_id: 0,
                    _w: [
                        ["id", "e", vm.edits.id]
                    ]
                },
                asset: {
                    condition: vm.edits.asset_condition,
                    _w: [
                        ["id", "e", vm.edits.asset_id]
                    ]
                }
            };
            //asset status according to type of disposal
            if(vm.edits.type == "LOSS OR THEFT"){
                data.asset["status"] = "Lost Or Stolen";
            }

            //nyd
            //do accounting, disposal type may afect this
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "approve asset impairment " + vm.edits.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "approved asset impairment" + JSON.stringify(vm.edits),
                    });
                    http.impairmentDetails(vm.edits, function(detailsRes){
                        onSuccess(detailsRes);
                    }, onErrors, isMock, vm);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addInsuranceDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                suppliers: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        suppliers: res.suppliers
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addAssetInsurance(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            
            var data = {
                insurance: {
                    asset_id: formData.assetId.value,
                    supplier_id: formData.supplierId.value,
                    policy_number:  formData.policyNumber.value,
                    start_date: formData.startDate.value,
                    _time_start_date_time: formData.startDate.value,
                    end_date: formData.endDate.value,
                    _time_end_date_time: formData.endDate.value,
                    coverage: formData.coverage.value,
                    limitation: formData.limitation.value,
                    premium: formData.premium.value,
                    deducatables: formData.deducatables.value,
                },
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    supportDocuments.push({
                        _fk_insurance_id: "insurance",
                        name: uploadedDocument.name.value,
                        type: uploadedDocument.type.value,
                        link: uploadedDocument.link.value 
                    });
                }
                data["insurance_support_documents"] = supportDocuments;
            }
            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "posted asset insurance",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted a asset insurance " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updatedAssetInsuranceDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                suppliers: {},
                insurance_support_documents: {
                    _w: [
                        ["insurance_id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        suppliers: res.suppliers,
                        insuranceSupportDocuments: res.insurance_support_documents
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateAssetInsurance(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var data = {
                insurance: {
                    asset_id: formData.assetId.value,
                    supplier_id: formData.supplierId.value,
                    policy_number:  formData.policyNumber.value,
                    start_date: formData.startDate.value,
                    _time_start_date_time: formData.startDate.value,
                    end_date: formData.endDate.value,
                    _time_end_date_time: formData.endDate.value,
                    coverage: formData.coverage.value,
                    limitation: formData.limitation.value,
                    premium: formData.premium.value,
                    deducatables: formData.deducatables.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                }
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    if(uploadedDocument.insuranceId.value == ""){
                        supportDocuments.push({
                            insurance_id: formData.id,
                            name: uploadedDocument.name.value,
                            type: uploadedDocument.type.value,
                            link: uploadedDocument.link.value 
                        });
                    }
                }
                if(supportDocuments.length > 0){
                    if(!data["_pst_post"]){
                        data["_pst_post"] = {};
                    }
                    data._pst_post["insurance_support_documents"] = supportDocuments
                }
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit asset insurance",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated asset insurance " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteInsuranceSupportDocument(uploadFormDataInput, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                insurance_support_document: {
                    _w: [
                        ["id", "e", uploadFormDataInput.id.value]
                    ]
                },
                _pst_post: {
                    _rmv_file_: uploadFormDataInput.link.value
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete asset insurance supporting document " + uploadFormDataInput.id.value,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed asset insurance supporting document " + JSON.stringify(uploadFormDataInput),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    insuranceDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                insurances: {
                    asset: {},
                    supplier: {},
                    _desc: ["id"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        insurances: res.insurances
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    insuranceDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                insurance: {
                    _a: "* time_inserted",
                    asset: {},
                    supplier: {},
                    _w: [
                        ["id", "e", item.id]
                    ]
                },
                insurance_support_documents: {
                    _w: [
                        ["insurance_id", "e", item.id]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        insurance: res.insurance,
                        insuranceSupportDocuments:  res.insurance_support_documents
                    });
                })
                .catch((errors) => {
                    console.log("Errors @2", errors);
                    onErrors(errors)
                });
        });
    },
    warrantyDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                warranties: {
                    asset: {},
                    supplier: {},
                    _desc: ["id"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        warranties: res.warranties
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    warrantyDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                warranty: {
                    _a: "* time_inserted",
                    asset: {},
                    supplier: {},
                    _w: [
                        ["id", "e", item.id]
                    ]
                },
                warranty_support_documents: {
                    _w: [
                        ["warranty_id", "e", item.id]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        warranty: res.warranty,
                        warrantySupportDocuments:  res.warranty_support_documents
                    });
                })
                .catch((errors) => {
                    console.log("Errors @2", errors);
                    onErrors(errors)
                });
        });
    },
    addWarrantyDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                suppliers: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        suppliers: res.suppliers
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateWarrantyDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                suppliers: {},
                warranty_support_documents: {
                    _w: [
                        ["warranty_id", "e", vm.edits.id]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        suppliers: res.suppliers,
                        warrantySupportDocuments: res.warranty_support_documents
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addAssetWarranty(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);
            
            var data = {
                warranty: {
                    asset_id: formData.assetId.value,
                    supplier_id: formData.supplierId.value,
                    type:  formData.type.value,
                    start_date: formData.startDate.value,
                    _time_start_date_time: formData.startDate.value,
                    end_date: formData.endDate.value,
                    _time_end_date_time: formData.endDate.value,
                    coverage: formData.coverage.value,
                    limitation: formData.limitation.value,
                    status: formData.status.value
                },
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    supportDocuments.push({
                        _fk_warranty_id: "warranty",
                        name: uploadedDocument.name.value,
                        type: uploadedDocument.type.value,
                        link: uploadedDocument.link.value 
                    });
                }
                data["warranty_support_documents"] = supportDocuments;
            }
            Bee.post(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "posted asset warranty",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted a asset warranty " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateAssetWarranty(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var data = {
                warranty: {
                    asset_id: formData.assetId.value,
                    supplier_id: formData.supplierId.value,
                    type:  formData.type.value,
                    start_date: formData.startDate.value,
                    _time_start_date_time: formData.startDate.value,
                    end_date: formData.endDate.value,
                    _time_end_date_time: formData.endDate.value,
                    coverage: formData.coverage.value,
                    limitation: formData.limitation.value,
                    status: formData.status.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                }
            }
            //if any supported documents
            if(vm.uploadedDocuments.length > 0){
                let supportDocuments = [];
                for (let index = 0; index < vm.uploadedDocuments.length; index++) {
                    const uploadedDocument = vm.uploadedDocuments[index];
                    if(uploadedDocument.warrantyId.value == ""){
                        supportDocuments.push({
                            warranty_id: formData.id,
                            name: uploadedDocument.name.value,
                            type: uploadedDocument.type.value,
                            link: uploadedDocument.link.value 
                        });
                    }
                }
                if(supportDocuments.length > 0){
                    if(!data["_pst_post"]){
                        data["_pst_post"] = {};
                    }
                    data._pst_post["warranty_support_documents"] = supportDocuments
                }
            }
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit asset warranty",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated asset warranty " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    deleteWarrantySupportDocument(uploadFormDataInput, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                warranty_support_document: {
                    _w: [
                        ["id", "e", uploadFormDataInput.id.value]
                    ]
                },
                _pst_post: {
                    _rmv_file_: uploadFormDataInput.link.value
                }
            };
            Bee.delete(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "delete asset warranty supporting document " + uploadFormDataInput.id.value,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "removed asset warranty supporting document " + JSON.stringify(uploadFormDataInput),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    accountingAccountsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                accounts: {
                    _asc: ["ref_no"]
                }
            }; 
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //preprocess to add a label property
                    var accountsTemp = [];
                    for (let index = 0; index < res.accounts.length; index++) {
                        const account = res.accounts[index];
                        var name = account.name.toLowerCase();
                        accountsTemp.push({
                            ...account,
                            name: name,
                            type: account.type.toLowerCase(),
                            group: account.group.toLowerCase(),
                            statement_type: account.statement_type.toLowerCase(),
                            label: name
                        });
                    }
                    onSuccess({
                        accounts: accountsTemp
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    accountingAddAccountDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var query = {
                accounts: {
                    _asc: ["ref_no"]
                }
            };
            Bee.get(query, isMock, vm)
                .then((res) => {
                    //add an empty account 
                    var accountsTemp = [{
                        id: 0,
                        ref_no: "",
                        name: "",
                        type: "",
                        group: "",
                        statement_type: "",
                        account_id: 0,
                        description: ""
                    }];
                    accountsTemp = accountsTemp.concat(res.accounts);
                    var accounts = Utils.toValueLabelList(
                        accountsTemp,
                        "id",
                        function(item){
                            return `${item.ref_no} ${item.name}`;
                        }
                    );
                    onSuccess({
                        accounts: accounts
                    })
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    accountingAddAccount(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var parentAccountId = formData.parentAccountId.value;
            if(parentAccountId == null){
                parentAccountId = "";
            }
            parentAccountId = parentAccountId.toString();
            parentAccountId = parentAccountId.trim();
            if(parentAccountId == ""){
                parentAccountId = "0";
            }
            var data = {
                account: {
                    ref_no: formData.refNo.value,
                    name: formData.name.value,
                    type: formData.type.value,
                    group: formData.group.value,
                    statement_type: formData.statementType.value,
                    account_id: parentAccountId,
                    description: formData.description.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "added accounting account",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted accounting account " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    accountingUpdateAccountDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                accounts: {
                    _asc: ["ref_no"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    //add an empty account 
                    var accountsTemp = [{
                        id: 0,
                        ref_no: "",
                        name: "",
                        type: "",
                        group: "",
                        statement_type: "",
                        account_id: 0,
                        description: ""
                    }];
                    accountsTemp = accountsTemp.concat(res.accounts);
                    var accounts = Utils.toValueLabelList(
                        res.accounts,
                        "id",
                        function(item){
                            return `${item.ref_no} ${item.name}`;
                        }
                    );
                    onSuccess({
                        accounts: accounts
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    accountingUpdateCategory(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var parentAccountId = formData.parentAccountId.value;
            if(parentAccountId == null){
                parentAccountId = "";
            }
            parentAccountId = parentAccountId.toString();
            parentAccountId = parentAccountId.trim();
            if(parentAccountId == ""){
                parentAccountId = "0";
            }

            var data = {
                account: {
                    ref_no: formData.refNo.value,
                    name: formData.name.value,
                    type: formData.type.value,
                    group: formData.group.value,
                    statement_type: formData.statementType.value,
                    account_id: parentAccountId,
                    description: formData.description.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                }
            };
            
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit accounting account " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated accounting account details " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    expenseCategoriesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                expense_categories: {
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        expenseCategories: res.expense_categories
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addExpenseCategory(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                expense_category: {
                    name: formData.name.value,
                    description: formData.description.value
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "add expense category",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted new expense category " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateExpenseCategory(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            var data = {
                expense_category: {
                    name: formData.name.value,
                    description: formData.description.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                }
            };
            Bee.update(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edites expense category",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated expense category " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    accountingExpensesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                expenses: {
                    expense_category: {},
                    branch: {},
                    _pull_debit_account: "account.debit_account_id",
                    _pull_credit_account: "account.credit_account_id",
                    _desc: ["issued_date_time"]
                },
                branches: {},
                expense_categories: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        expenses: res.expenses,
                        branches: res.branches,
                        expenseCategories: res.expense_categories
                    });
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addExpensesDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var query = {
                branches: {},
                expense_categories: {},
                accounts: {}
            };
            Bee.get(query, isMock, vm)
                .then((res) => {
                    var branches = Utils.toValueLabelList(
                        res.branches,
                        "id",
                        "name"
                    );
                    var expenseCategories = Utils.toValueLabelList(
                        res.expense_categories,
                        "id",
                        "name"
                    );
                    var accounts = Utils.toValueLabelList(
                        res.accounts,
                        "id",
                        "name"
                    );
                    onSuccess({
                        branches: branches,
                        expenseCategories: expenseCategories,
                        accounts: accounts
                    })
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    addExpense(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            
            var data = {
                expense: {
                    expense_category_id: formData.expenseCategoryId.value,
                    branch_id: formData.branchId.value,
                    user_id: 0, //for now
                    description: formData.description.value,
                    issued_date: formData.issuedDate.value,
                    _time_issued_date_time: formData.issuedDate.value,
                    amount: formData.amount.value,
                    debit_account_id: formData.debitAccountId.value,
                    credit_account_id: formData.creditAccountId.value,
                    transaction_id: 0, //for now
                }
            };
            Bee.post(data, isMock, vm)
                .then((res) => {
                    var userStr = localStorage.getItem("user");
                    var user = JSON.parse(userStr);
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "added expense",
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "inserted expense" + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateExpense(formData, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function (http) {
            
            var userStr = localStorage.getItem("user");
            var user = JSON.parse(userStr);

            var data = {
                expense: {
                    expense_category_id: formData.expenseCategoryId.value,
                    branch_id: formData.branchId.value,
                    description: formData.description.value,
                    issued_date: formData.issuedDate.value,
                    _time_issued_date_time: formData.issuedDate.value,
                    amount: formData.amount.value,
                    debit_account_id: formData.debitAccountId.value,
                    credit_account_id: formData.creditAccountId.value,
                    _w:[
                        ["id", "e", formData.id]
                    ]
                }
            };
            
            Bee.update(data, isMock, vm)
                .then((res) => {
                    http.trail({
                        who: user.name,
                        user_id: user.id,
                        activity: "edit expense " + formData.id,
                        role: user.user_roles[0].role.name,
                        role_id: user.user_roles[0].role.id,
                        description: "updated expense details " + JSON.stringify(data),
                    });
                    onSuccess(res);
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    updateExpenseDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                branches: {},
                expense_categories: {},
                accounts: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    var branches = Utils.toValueLabelList(
                        res.branches,
                        "id",
                        "name"
                    );
                    var expenseCategories = Utils.toValueLabelList(
                        res.expense_categories,
                        "id",
                        "name"
                    );
                    var accounts = Utils.toValueLabelList(
                        res.accounts,
                        "id",
                        "name"
                    );
                    onSuccess({
                        branches: branches,
                        expenseCategories: expenseCategories,
                        accounts: accounts
                    })
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    generalLedgerDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                accounts: {
                    _asc: ["ref_no"]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        accounts: res.accounts
                    })
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    generalJournalDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var startOfThisMonthPhpTime = 0;
            var endOfThisMonthPhpTime = 0;
            var data = {
                transactions: {
                    _pull_debit_account: "account.debit_account_id",
                    _pull_credit_account: "account.credit_account_id",
                    _asc: ["occured_date_time"],
                    _w: [
                        [
                            ["occured_date_time", "gte", startOfThisMonthPhpTime],
                            "And",
                            ["occured_date_time", "lte", endOfThisMonthPhpTime]
                        ]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        transactions: res.transactions
                    })
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
    reportAssetRegisterDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var startPhpTime = 0;
            var endPhpTime =  100000000000000;
            var data = {
                assets: {},
                categories: {},
                value_trends: {
                    _w: [
                        [
                            ["entry_date_time", "gte", startPhpTime],
                            "And",
                            ["entry_date_time", "lte", endPhpTime]
                        ]
                    ],
                    _asc: ["entry_date_time"]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        categories: res.categories,
                        valueTrends: res.value_trends
                    })
                })
                .catch((errors) => {
                    console.log("reportAssetRegisterDependencies", errors);
                    onErrors(errors)
                });
        });
    },
    reportAssetAcquisitionDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var startPhpTime = 1;
            var endPhpTime =  100000000000000;
            var data = {
                acquisition_orders: {
                    supplier: {},
                    branch: {},
                    order_items: {},
                    _w: [
                        [
                            [
                                ["approved_date_time", "gte", startPhpTime],
                                "AND",
                                ["approved_date_time", "lte", endPhpTime],
                            ],
                            "AND",
                            ["status", "ne", "pending"]
                        ]
                    ],
                    _desc: ["approved_date_time"]
                },
                order_recorded_assets: {
                    _w: [
                        [
                            ["recorded_date_time", "gte", startPhpTime],
                            "AND",
                            ["recorded_date_time", "lte", endPhpTime]
                        ]
                    ],
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        acquisitionOrders: res.acquisition_orders,
                        orderRecordedAssets: res.order_recorded_assets
                    })
                })
                .catch((errors) => {
                    console.log("reportAssetAcquisitionDependencies", errors);
                    onErrors(errors)
                });
        });
    },
    acquisitionReportRecordedItemsDetails(item, onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                order_recorded_assets: {
                    asset: {
                        category: {}
                    },
                    order_item: {
                        acquisition_order: {}
                    },
                    _w: [
                        ["recorded_date", "e", item.recorded_date]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        orderRecordedAssets: res.order_recorded_assets
                    });
                })
                .catch((errors) => {
                    console.log("Errors @x2", errors);
                    onErrors(errors)
                });
        });
    },
    reportMaintenanceDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var startPhpTime = 1;
            var endPhpTime =  1000000000000;
            var data = {
                maintenances: {
                    asset: {
                        category: {}
                    },
                    performed_works: {
                        maintainance_work_type: {}
                    },
                    _w: [
                        [
                            [
                                ["budget_approved_date_time", "gt", startPhpTime],
                                "AND",
                                ["budget_approved_date_time", "lte", endPhpTime],
                            ],
                            "AND",
                            ["budget_approved_date_time", "ne", 0]
                        ]
                    ],
                    _desc: ["budget_approved_date_time"]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        maintenances: res.maintenances
                    })
                })
                .catch((errors) => {
                    console.log("reportMaintenanceDependencies", errors);
                    onErrors(errors)
                });
        });
    },
    reportImpairmentsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var startPhpTime = 1;
            var endPhpTime =  1000000000000;
            var data = {
                impairments: {
                    asset: {
                        category: {}
                    },
                    custodian: {},
                    //nyd
                    //uncomment out this
                    // _w: [
                    //     [
                    //         [
                    //             ["occured_date_time", "gt", startPhpTime],
                    //             "AND",
                    //             ["occured_date_time", "lte", endPhpTime],
                    //         ],
                    //         "AND",
                    //         ["occured_date_time", "ne", 0]
                    //     ],
                    // ],
                    _desc: ["occured_date_time"]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        impairments: res.impairments
                    })
                })
                .catch((errors) => {
                    console.log("reportImpairmentsDependencies", errors);
                    onErrors(errors)
                });
        });
    },
    reportBalanceSheetDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var startPhpTime = 1;
            var endPhpTime =  1000000000000;
            var data = {
                transactions: {

                    _w: [
                        [
                            ["occured_date_time", "gt", startPhpTime],
                            "AND",
                            ["occured_date_time", "lte", endPhpTime],
                        ]
                    ]
                },
                accounts: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        transactions: res.transactions,
                        accounts: res.accounts
                    })
                })
                .catch((errors) => {
                    console.log("reportBalanceSheetDependencies", errors);
                    onErrors(errors)
                });
        });
    },
    reportIncomeStatementDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var startPhpTime = 1;
            var endPhpTime =  1000000000000;
            var data = {
                transactions: {

                    _w: [
                        [
                            ["occured_date_time", "gt", startPhpTime],
                            "AND",
                            ["occured_date_time", "lte", endPhpTime],
                        ]
                    ]
                },
                accounts: {}
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        transactions: res.transactions,
                        accounts: res.accounts
                    })
                })
                .catch((errors) => {
                    console.log("reportBalanceSheetDependencies", errors);
                    onErrors(errors)
                });
        });
    },
    dashboardDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {
                    _nAvailable: {
                        _w: [
                            [
                                ["status", "ne", "Disposed"],
                                "AND",
                                ["status", "ne", "Lost Or Stolen"],
                            ]
                        ]
                    },
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets
                    })
                })
                .catch((errors) => {
                    console.log("dashboardDependencies", errors);
                    onErrors(errors)
                });
        });
    },
    dashboardDepDistPortfolioWidgetDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {
                    _w: [
                        [
                            ["status", "ne", "Disposed"],
                            "AND",
                            ["status", "ne", "Lost Or Stolen"],
                        ]
                    ]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets
                    })
                })
                .catch((errors) => {
                    console.log("dashboardDepDistPortfolioWidgetDependencies", errors);
                    onErrors(errors)
                });
        });
    },
    dashboardCallToActionWidgetDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                _julz: {
                    _gets: {
                        main: {
                            requisition: {
                                _a: " _count ",
                                _w: [
                                    ["status", "e", "pending"]
                                ]
                            },
                            transfer: {
                                _a: " _count ",
                                _w: [
                                    ["status", "e", "pending"]
                                ]
                            },
                            disposal_bucket_item: {
                                _a: " _count ",
                                _w: [
                                    ["status", "e", "marked"]
                                ]
                            },
                            notification: {
                                _a: " _count ",
                                _w: [
                                    ["is_seen", "e", 0] 
                                ]
                            },
                            disposal: {
                                _a: " _count ",
                                _w: [
                                    ["status", "e", "pending"]
                                ]
                            },
                            acquisition_order: {
                                _a: " _count ",
                                _w: [
                                    ["status", "e", "pending"]
                                ]
                            },
                            acquisition_order: {
                                _a: " _count ",
                                _w: [
                                    ["status", "e", "pending"]
                                ]
                            },
                            order_item: {
                                _a: " _count ",
                                _w: [
                                    [
                                        ["status", "e", "delivered"],
                                        "OR",
                                        ["status", "e", "partially"]
                                    ]
                                ]
                            },
                            maintenance: {
                                _a: " _count ",
                                _w: [
                                    ["status", "e", "pending"]
                                ]
                            },
                            impairment: {
                                _a: " _count ",
                                _w: [
                                    ["status", "e", "pending"]
                                ]
                            },
                        },
                        other: {
                            order_item: {
                                _a: " _count ",
                                _w: [
                                    ["status", "e", "partially"]
                                ]
                            }
                        }
                    }
                }
                
                
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        requisitions: parseFloat(res.julz.gets.main.requisition.count),
                        transfers: parseFloat(res.julz.gets.main.transfer.count),
                        disposalBucketItems: parseFloat(res.julz.gets.main.disposal_bucket_item.count),
                        notifications: parseFloat(res.julz.gets.main.notification.count),
                        disposals: parseFloat(res.julz.gets.main.disposal.count),
                        acquisitionOrders: parseFloat(res.julz.gets.main.acquisition_order.count),
                        assetRecordings: parseFloat(res.julz.gets.main.order_item.count),
                        shortages: parseFloat(res.julz.gets.other.order_item.count),
                        maintenances: parseFloat(res.julz.gets.main.maintenance.count),
                        impairments: parseFloat(res.julz.gets.main.impairment.count),
                    })
                })
                .catch((errors) => {
                    console.log("dashboardCallToActionWidgetDependencies", errors);
                    onErrors(errors)
                });
        });
    },
    dashboardCategoriesDistWidgetDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                assets: {},
                categories: {},
                impairments: {},
                maintenances: {},
                disposal_assets: {
                    disposal: {},
                    _w: [
                        ["_fk_disposal.status", "e", "disposed"]
                    ]
                }
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        assets: res.assets,
                        categories: res.categories,
                        impairments: res.impairments,
                        maintenances: res.maintenances,
                        disposal_assets: res.disposal_assets,
                    })
                })
                .catch((errors) => {
                    console.log("dashboardCategoriesDistWidgetDependencies", errors);
                    onErrors(errors)
                });
        });
    },
    auditTrailsDependencies(onSuccess, onErrors, isMock = false, vm = null) {
        this.delay(function () {
            var data = {
                trails: {
                    _a: " * time_inserted",
                    _pg: 200,
                    _desc: ["id"]
                },
            };
            Bee.get(data, isMock, vm)
                .then((res) => {
                    onSuccess({
                        trails: res.trails
                    })
                })
                .catch((errors) => {
                    onErrors(errors)
                });
        });
    },
}