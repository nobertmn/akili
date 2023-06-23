<template>
    <div class="d-flex flex-column justify-content-start align-items-center h-100 pt-2">
        <div class="d-flex align-items-stretch mb-2">
            <CardContainer 
                v-for="(role, index) in permissionsData"
                :key="index"
                :title="role.name" 
                :sub-title="role.description"
                :is-app-card="false"
                :classes="'permission-role-card mx-1 ' + ((role.id.toString() == activeRoleId)?'active':'') "
                @click="onClickRole(role)" >
            </CardContainer>
        </div>
        <div class="w-90">
            <h4 class="mb-1">Available System Permissions For The Role: <b>{{permissionsData[activeRoleId].name}}</b></h4>
            <vue-good-table
                :columns="columns"
                :rows="rows"
                max-height="350px"
                :fixed-header="true"
                styleClass="vgt-table striped"/>
        </div>
    </div>
</template>

<script>
import Vm from "@/utils/Vm";
import PermissionsData from "@/data/permissions"
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from "mdb-vue-ui-kit";
import CardContainer from "@/components/containers/CardContainer.vue";


export default {
    components: {
      MDBCard,
      MDBCardBody,
      MDBCardTitle,
      MDBCardText,
      MDBBtn,
      CardContainer
    },
    data() {
        return {
            columns: [{
                label: 'Module',
                field: 'module_name',
            },{
                label: 'Sub Module',
                field: 'sub_module_name',
            },{
                label: 'Can View',
                field: 'can_view',
            },{
                label: 'Can Edit',
                field: 'can_edit',
            },{
                label: 'Can Delete',
                field: 'can_delete',
            }],
            permissionsData: PermissionsData,
            activeRoleId: "1"
        }
    },
    methods: {
        onClickRole(role){
            this.activeRoleId = role.id.toString();
        }
    },
    computed:{
        rows(){
            var modules = this.permissionsData[this.activeRoleId].modules;
            var items = [];
            for (const moduleName in modules) {
                if (Object.hasOwnProperty.call(modules, moduleName)) {
                    const element = modules[moduleName];
                    items.push({
                        module_name: moduleName,
                        sub_module_name: " ",
                        can_view: "",
                        can_add: "",
                        can_edit: "",
                        can_delete: ""
                    });
                    items = items.concat(element.permissions);
                }
            }
            return items;
        }
    },
    mounted(){
        console.log("PermissionsData", PermissionsData)
    }
};
</script>
