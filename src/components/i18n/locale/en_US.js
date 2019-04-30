module.exports={
    buttonText:{
        confirm:"Ok",
        cancel:"Cancel",
        save:"Save",
        submit:"Submit",
        reset:"Reset"
    },
    messagebox:{
        info:"info"
    },
    barButton:{
        add:"add",
        edit:"edit",
        remove:"remove",
        search:"search",
        authorize:"authorize",
        setting:"setting",
        detail:"detail"
    },
    grid:{
        operation:"operate"
    },
    commoninfo:{
        loadfailed:"loading failed!",
        selectinfo:"Please select the record to be modified!",
        removesuccess:"Remove success!",
        removefailed:"Remove failed",
        removeselect:"Please select the record to delete!",
        checkfailed:"Check failed!",
        savesuccess:"Save successed!",
        savefailed:"Save failed"
    },
    user:{
        search:{
            userName:"username",
            loginName:"loginname"
        },
        form:{
            userName:"username",
            loginName:"loginname",
            userType:"usertype",
            phone:"phone",
            email:"email",
            usertypes:{
                idm:"idmuseer",
                mobility:"mobilityuser"
            }
        },
        info:{
            addTitle:"New User",
            editTitle:"Edit User",
            authorsuccess:"Successed!",
            authorfailed:"Failed!",
            nouser:"User not found!",
            selectrole:"Please select roles!",
            authorclear:"No roles remaining!",
            authorTitle:"User authorization",
            detailTitle:"User privileges",
            removeInfo:"This operation will completely delete the user, and can not be restored, whether to continue!"
        },
        ruleinfo:{
            userName:"username not empty!",
            loginName:"login not empty!"
        },
        transfer:{
            selected:"selected",
            unselected:"unselected",
            selectprev:"Selected preview",
            adjustprev:"Adjust preview"
        }
    },
    role:{
        form:{
            roleName:"rolename",
            roleCode:"rolecode",
            remark:"remark"
        },
        info:{
            authorTitle:"Role authorization",
            norole:"Role not found!",
            removeInfo:"This operation will completely delete the role, and can not be restored, whether to continue!",
            cantremove:"There are child nodes, not allowed to delete!",
            onevalidate:"Role code  already exists!",
            authorinfo:"Please select the record to be authorized first!",
            authorsuccess:"Author successed!",
            authorfailed:"Author failed!",
            addTitle:"New Role",
            editTitle:"Edit Role"
        }
    },
    menu:{
        form:{
            parentMenu:"parentmenu",
            menuName:"menuname",
            component:"component",
            url:"url",
            remark:"remark"
        },
        placeholder:{
            menuName:"Please enter a name/path"
        },
        transfer:{
            selected:"selected",
            unselected:"unselected",
            apiName:"apiname",
            apiPath:"apipath"
        },
        tree:{
            rootName:"All"
        },
        rules:{
            menuName:"menuname not empty"
        },
        info:{
            nomenu:"Menu not found!",
            removeInfo:"This operation will completely delete the menu, and can not be restored, whether to continue!",
            cantremove:"There are child nodes, not allowed to delete!",
            cfgselectinfo:"Please select a menu!"
        }
    },
    menunames:{
        systemconfig:"SystemSettings",
        usermanager:"UserManager",
        rolemanager:"RoleManager",
        menumanager:"MenuManager"
    },
    currentLang:"English",
    login:{
        placeholder:{
            username:"loginname",
            password:"password"
        },
        button:{
            login:"Sign in"
        },
        info:{
            nouser:"Username not exists!",
            error:"username/password error!",
            exception:"Server exception, please try again later!"
        }
    },
    modifypwd:{
        rules:{
            oldpwd:"Old password not empty!",
            newpwd:"New password not empty!",
            newpwd2:"Confirmation password not empty!",
            differ:"The password is inconsistent with the confirmation password!"
        },
        form:{
            oldpwd:"Old password",
            newpwd:"New password",
            newpwd2:"Confirm password"
        },
        info:{
            info:"Incomplete information!",
            title:"ChangePassword"
        }
    },
}