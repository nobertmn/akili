import Http from "@/utils/Http";
import Validator from "@/utils/Validator";
export default {
    validateHelpers: {
        validateListOfFormDataFields(listFormDataKey, errorMsg) {
            var vm = this;
            var tempFormData = {};
            var listFieldsData = vm[listFormDataKey];
            for (let index = 0; index < listFieldsData.length; index++) {
                const fieldItem = listFieldsData[index];
                var id = fieldItem.id;
                tempFormData[id] = fieldItem;
            }
            var validationResults = Validator.validateFormData(tempFormData);
            var isValid = validationResults.isValid;
            var validatedFormData = validationResults.formData;
            if (isValid === true) {
                return true;
            } else {
                var listItemsData = [];
                for (const fieldId in validatedFormData) {
                    if (Object.hasOwnProperty.call(validatedFormData, fieldId)) {
                        var field = validatedFormData[fieldId];
                        listItemsData.push(field);
                    }
                }
                vm[listFormDataKey] = listItemsData;
                vm.errors = [errorMsg ? errorMsg : "Please correct the error(s) and submit again"];
                return false;
            }
        }
    },
    fetch: {
        fetch: function (apiName, onSuccess) {
            var vm = this;
            vm.$emit("on-show-loader");
            Http[apiName](
                (res) => {
                    onSuccess(vm, res);
                    vm.errors = [];
                    vm.$emit("on-hide-loader");
                },
                (errors) => {
                    vm.errors = errors;
                    vm.$emit("on-hide-loader");
                },
                false,
                vm);
        },
        fetchDeleteDeps: function (seed, onSuccess) {
            var vm = this;
            vm.$emit("on-show-loader");
            Http.comfirmDeleteAsset(
                seed,
                (res) => {
                    onSuccess(vm, res);
                    vm.errors = [];
                    vm.$emit("on-hide-loader");
                },
                (errors) => {
                    vm.errors = errors;
                    vm.$emit("on-hide-loader");
                },
                false,
                vm);
        },
        fetchItem: function (apiName, item, onSuccess) {
            var vm = this;
            vm.$emit("on-show-loader");
            Http[apiName](
                item,
                (res) => {
                    onSuccess(vm, res);
                    vm.errors = [];
                    vm.$emit("on-hide-loader");
                },
                (errors) => {
                    vm.errors = errors;
                    vm.$emit("on-hide-loader");
                },
                false,
                vm);
        },
        downloadFile(filePath) {
            Http.downloadFile(filePath);
        }
    },
    update: {
        update: function (apiName, formDataKey, id, onSuccess, onErrors) {
            var vm = this;
            var formData = typeof formDataKey == 'string' ? vm[formDataKey] : formDataKey;
            var validationResults = Validator.validateFormData(formData);
            var isValid = validationResults.isValid;
            var validatedFormData = validationResults.formData;
            if (isValid === true) {
                vm.$emit("on-show-loader");
                Http[apiName](
                    {
                        ...validatedFormData,
                        id: id
                    },
                    (res) => {
                        onSuccess(vm, res);
                        vm.errors = [];
                        vm.$emit("on-hide-loader");
                    },
                    (errors) => {
                        vm.$emit("on-hide-loader");
                        if (typeof onErrors == 'function') {
                            onErrors(vm, errors);
                        } else {
                            vm.errors = errors;
                        }
                    },
                    false,
                    vm);
            } else {
                vm[formDataKey] = validatedFormData;
                vm.errors = ["Please correct the error(s) and submit again"];
            }
        }
    },
    post: {
        post: function (apiName, formDataKey, onSuccess, validate = true) {
            var vm = this;
            var formData = vm[formDataKey];
            if (validate === true) {
                var validationResults = Validator.validateFormData(formData);
                var isValid = validationResults.isValid;
                var validatedFormData = validationResults.formData;
                if (isValid === true) {
                    vm.$emit("on-show-loader");
                    Http[apiName](
                        validatedFormData,
                        (res) => {
                            onSuccess(vm, res);
                            vm.errors = [];
                            vm.$emit("on-hide-loader");
                        },
                        (errors) => {
                            vm.errors = errors;
                            vm.$emit("on-hide-loader");
                        },
                        false,
                        vm);
                } else {
                    vm[formDataKey] = validatedFormData;
                    vm.errors = ["Please correct the error(s) and submit again"];
                }
            } else {
                vm.$emit("on-show-loader");
                Http[apiName](
                    formData,
                    (res) => {
                        onSuccess(vm, res);
                        vm.errors = [];
                        vm.$emit("on-hide-loader");
                    },
                    (errors) => {
                        vm.errors = errors;
                        vm.$emit("on-hide-loader");
                    },
                    false,
                    vm);
            }

        }
    },
    delete: {
        delete: function (apiName, objectWithId, onSuccess) {
            var vm = this;
            vm.$emit("on-show-loader");
            Http[apiName](
                objectWithId,
                (res) => {
                    onSuccess(vm, res);
                    vm.errors = [];
                    vm.$emit("on-hide-loader");
                },
                (errors) => {
                    vm.errors = errors;
                    vm.$emit("on-hide-loader");
                },
                false,
                vm);
        },
        deleteCascade: function (seed, onSuccess) {
            var vm = this;
            vm.$emit("on-show-loader");
            Http.deleteItem(
                seed,
                (res) => {
                    onSuccess(vm, res);
                    vm.errors = [];
                    vm.$emit("on-hide-loader");
                },
                (errors) => {
                    vm.errors = errors;
                    vm.$emit("on-hide-loader");
                },
                false,
                vm);
        }
    },
    queryPost: {
        queryPost: function (apiName, formData, onSuccess, onValidationFail) {
            var vm = this;
            var validationResults = Validator.validateFormData(formData);
            var isValid = validationResults.isValid;
            var validatedFormData = validationResults.formData;
            if (isValid === true) {
                vm.$emit("on-show-loader");
                Http[apiName](
                    validatedFormData,
                    (res) => {
                        vm.errors = [];
                        vm.$emit("on-hide-loader");
                        if (onSuccess.length == 2) {
                            onSuccess(vm, res);
                        } else {
                            onSuccess(vm);
                        }
                    },
                    (errors) => {
                        vm.errors = errors;
                        vm.$emit("on-hide-loader");
                    },
                    false,
                    vm);
            } else {
                vm.errors = ["Please correct the error(s) and submit again"];
                onValidationFail(vm, validatedFormData);
            }
        }
    },
    loaders: {
        showLoader() {
            this.$emit('on-show-loader')
        },
        hideLoader() {
            this.$emit('on-hide-loader')
        },
        onSessionExpired(payload) {
            this.$emit('on-session-expired', payload)
        }
    },
    upload: {
        validateFileUpload(fileToValidate, config) {
            var vm = this;
            var isValidFileype = true;
            if (config.extensions.length > 0 && fileToValidate) {
                var fileNameParts = fileToValidate.name ? fileToValidate.name.split(".") : [];
                if (fileNameParts.length > 0) {
                    var ext = fileNameParts[fileNameParts.length - 1];
                    if (config.extensions.indexOf(ext) < 0) {
                        //not found
                        isValidFileype = false;
                    }
                } else {
                    isValidFileype = false;
                }
            }
            if (isValidFileype == false) {
                var errorMsg =
                    "Invalid file format expected any of " + config.extensions.join(", ");
                vm.errors = [errorMsg];
                return false;
            }
            //file size validation
            const fileSize = fileToValidate.size / 1024 / 1024; // in MiB
            if (fileSize > config.maxFileSizeMbs) {
                var errorMsg =
                    "Selected file is too large, maximum allowed size is " +
                    config.maxFileSizeMbs +
                    "MB";
                vm.errors = [errorMsg];
                return false;
            }
            return true;
        },
        uploadFile: function (selectedFile, config, onSuccess, onErrors) {
            var vm = this;
            let isValid = vm.validateFileUpload(selectedFile, config);
            if (isValid === true) {
                var formData = new FormData();
                // HTML file input, chosen by user
                formData.append("temp_file", selectedFile);
                vm.$emit("on-show-loader");
                Http.uploadFile(
                    formData,
                    (res) => {
                        onSuccess(vm, res);
                        vm.errors = [];
                        vm.$emit("on-hide-loader");
                    },
                    (errors) => {
                        vm.errors = errors;
                        vm.$emit("on-hide-loader");
                        onErrors(vm);
                    },
                    false,
                    vm);
            }
        },
        deleteUploadFile: function (selectedFile, onSuccess, onErrors) {
            if (typeof onErrors == 'undefined') {
                onErrors = function () { };
            }
            var vm = this;
            vm.$emit("on-show-loader");
            Http.deleteUploadedFile(
                selectedFile,
                (res) => {
                    onSuccess(vm, res);
                    vm.errors = [];
                    vm.$emit("on-hide-loader");
                },
                (errors) => {
                    vm.errors = errors;
                    vm.$emit("on-hide-loader");
                    onErrors();
                },
                false,
                vm);
        },
    },
}