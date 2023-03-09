import {defineStore} from "pinia";


export const useUserStore = defineStore("user", {
    state: () => {
        return {
            userData: {
                userId: -1,
                userCode: -1,
                userPhone: null,
                userPassword: null,
                userName: null,
                userGender: null,
                userAge: null,
                userBirthday: null,
                userAdmissionDate: null,
                userDischargeDate: null,
                userAreaCode: null,
                userRoomCode: null,
                userBedCode: null,
                userNurse: null,
                userAvatarUrl: null,
                userAvatarName: null,
            },
        }
    },
    getters: {
        getPhone(){
            if (this.userData.userPhone) {
                let str = this.userData.userPhone;
                return str;
                // return str.replace(str.substring(3, 7), "****");
            } else {
                return undefined;
            }
        },
        getIdCode(){
            if (this.userData.userCode) {
                let str = this.userData.userCode;
                return str;
                // return str.replace(str.substring(14,18), "****");
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
