<template>
  <div class="d-flex justify-content-center align-items-start h-100 pt-3">
    <div class="d-flex flex-column">
      <img
        :src="
          user.avatar && user.avatar.length > 0 ? user.avatar : defaultAvatar
        "
        class="mb-1"
        alt="system user image"
        style="height: 180px"
      />
      
    </div>
    <div class="w-50 d-flex justify-content-between flex-column bg-light pb-2" style="height: 180px">
      
      <div class="w-100 d-flex justify-content-end align-items-end">
        <KeyValueList :items="basicInfo" classes="d-felx w-100" />
      </div>
      
      <div class="w-100 d-flex justify-content-end align-items-end pe-2">
        <Button
          label="Edit Info"
          :is-disabled="isLoading"
          @on-click="onClickEditInfoBtn"
          class="me-1"
        />
        <label
          for="add-request-form-file-upload"
          class="relative cursor-pointer btn btn-primary me-1"
        >
          <span>Edit Image</span>
          <input
            @input="onSelectFile"
            ref="adPictureFileInput"
            id="add-request-form-file-upload"
            name="picture"
            type="file"
            class="sr-only"
          />
        </label>
        <Button
          label="Update Password"
          :is-disabled="isLoading"
          @on-click="onClickEditPasswordBtn"
          
        />
      </div>

    </div>

    <SimpleModal
      id="edit-profile-modal"
      title="Edit Profile Info"
      v-model="showFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      ok-btn-text="Save"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showFormModal=false"
      @on-ok-btn-click="onClickModalOkBtn"
    >
      <EditProfileForm 
        :is-loading="isLoading"
        @on-show-loader="showLoader" 
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onFormSuccess"
        :pst="pst"
        :edits="user"
      />
    </SimpleModal>

    <SimpleModal
      id="edit-password-modal"
      title="Update Password"
      v-model="showUpdatePasswordFormModal"
      :show-close-btn="true"
      :show-ok-btn="true"
      ok-btn-text="Update"
      :show-top-close-btn="true"
      :is-headless="false"
      @on-close-btn-click="showUpdatePasswordFormModal=false"
      @on-ok-btn-click="onClickUpdatePasswordModalOkBtn"
    >
      <EditPasswordForm 
        :is-loading="isLoading"
        @on-show-loader="showLoader" 
        @on-hide-loader="hideLoader"
        @on-session-expired="onSessionExpired"
        @on-success="onUpdatePasswordFormSuccess"
        :pst="pst"
        :edits="user"
      />
    </SimpleModal>
  </div>
    
</template>

<script>
import KeyValueList from "@/components/lists/KeyValueList.vue";
import Button from "@/components/inputs/Button.vue";
import EditProfileForm from '@/components/forms/EditProfileForm.vue';
import EditPasswordForm from '@/components/forms/EditPasswordForm.vue';
import SimpleModal from "@/components/modals/SimpleModal.vue";
import Utils from "@/utils";
import Http from "@/utils/Http";
import Vm from "@/utils/Vm";

export default {
  components: {
    KeyValueList,
    Button,
    EditProfileForm,
    SimpleModal,
    EditPasswordForm
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      basicInfo: [],
      user: Utils.defaultUser(),
      defaultAvatar: Utils.defaultUser().avatar,
      updateFormData: {},
      showFormModal: false,
      pst: 0,
      showUpdatePasswordFormModal: false,
    };
  },
  methods: {
    ...Vm.update,
    ...Vm.loaders,
    loadDependencies() {
      var user = localStorage.getItem("user");
      if (user) {
        user = JSON.parse(user);
        this.basicInfo = [
          {
            key: "Name",
            value: user.name,
          },
          {
            key: "Email address",
            value: user.email,
          },
          {
            key: "Account Status ",
            value: user.status,
          },
        ];
        this.user = user;
      }
    },
    onClickEditInfoBtn() {
      this.showFormModal =  true;
    },
    onClickEditImageBtn() {},
    onSelectFile() {
      const input = this.$refs.adPictureFileInput;
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.user.avatar = e.target.result;
          this.uploadImage();
        };
        reader.readAsDataURL(files[0]);
      }
    },
    uploadImage() {
      let vm = this;
      const input = this.$refs.adPictureFileInput;
      const files = input.files;
      if (files.length > 0) {
        Http.uploadFileToCloudinary(files[0], "avatar")
          .then((res) => {
            vm.user.avatar = res.secure_url;
            vm.sendImage();
          })
          .catch((errors) => {
            console.log("Upload errors", errors);
          });
      }
    },
    sendImage(){
        var vm = this;
        vm.update("updateProfilePicture", "updateFormData", vm.user.id, function (thisVm, res) {
            //refresh the entire broswer window
            window.location.reload();
        });
    },
    onClickModalOkBtn(){
      this.pst += 1;
    },
    onFormSuccess(){
      this.showFormModal = false;
      //logout the user
      Http.logout();
      this.$router.push("/");
    },
    onClickEditPasswordBtn(){
      this.showUpdatePasswordFormModal =  true;
    },
    onClickUpdatePasswordModalOkBtn(){
      this.pst += 1;
    },
    onUpdatePasswordFormSuccess(){
      this.showUpdatePasswordFormModal =  false;
    }
  },
  mounted() {
    this.loadDependencies();
  },
};
</script>