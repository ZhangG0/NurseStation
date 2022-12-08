import {defineStore} from "pinia";


export const useUserStore = defineStore("user", {
    state: () => {
        return {
            userData: {
                USER_ID: -1,
                USER_CODE: -1,
                USER_PHONE: null,
                USER_PASSWORD: null,
                USER_NAME: null,
                USER_GENDER: null,
                USER_AGE: null,
                USER_BIRTHDAY: null,
                USER_ADMISSION_DATE: null,
                USER_DISCHARGE_DATE: null,
                USER_AREA_CODE: null,
                USER_ROOM_CODE: null,
                USER_BED_CODE: null,
                USER_NURSE: null,
                USER_AVATAR_URL: null,
                USER_AVATAR_NAME: null,
            },
            phoneNumber:""
        }
    },
    getters: {
        getPhone(){
            if (this.phoneNumber) {
                return this.phoneNumber.replace(this.phoneNumber.substring(3, 7), "****");
            } else {
                return undefined;
            }
        },
        getUserData(){
            return this.userData;
        }
    },
    actions: {
        initUser(Data){
            this.phoneNumber = Data.USER_PHONE;
            this.userData = Data;
        }
    },
    // persist:true
    //持久化设置
    persist: {
        enabled: true,
        storage: sessionStorage,

    },
})
