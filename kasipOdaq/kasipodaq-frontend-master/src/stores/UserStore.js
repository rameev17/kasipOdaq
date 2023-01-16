import {action, computed, decorate, observable, runInAction} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class UserStore {
    industriesList = [];
    unionsList = [];
    childrens = [];
    children = {};
    requestNumber = '';
    phone = '';
    activationCode = '';
    firstName = '';
    familyName = '';
    password = '';
    newPassword = '';
    uid = '';
    union_id = '';
    job_position = '';
    address = '';
    patronymic = '';
    industry = '';
    unionName = '';
    birthday = '';
    physical_address = '';
    sex = 0;
    protocolFile = { name: 'Прикрепить Протокол', id: null };
    positionFile = { name: 'Прикрепить Положение', id: null  };
    statementFile = { name: 'Прикрепить Заявление', id: null  };
    files = [];
    joinFiles = [];
    avatarFile = null;
    avatarId = null;
    joinFile = { name: 'Заявление на вступление' };
    retentionFile = { name: 'Заявление на удержание' };
    profile = {
        union: {
            industry: {}
        },
        first_name: '',
        family_name: '',
        birthday: new Date().toUTCString(),
        roles: ''
    };
    languageList = {};

    addChildren() {
        this.childrens.push({ is_new: true })
    }

    childrenCreate(name, family_name, patronymic, sex, birthday, iin, handle, afterError) {
        ApiService.childrenCreate({
            body: {
                first_name: name,
                family_name: family_name,
                patronymic: patronymic,
                sex: sex,
                birth_date: birthday,
                personal_code: iin
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, data => {
            if (handle !== undefined) {
                handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })

    };

    childrenUpdate(id, name, family_name, patronymic, sex, birthday, iin, handle, afterError) {
        ApiService.childrenUpdate({
            id: id,
            body: {
                first_name: name,
                family_name: family_name,
                patronymic: patronymic,
                sex: sex,
                birth_date: birthday,
                personal_code: iin
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, data => {
            if (handle !== undefined) {
                handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })

    };

    loadIndustries(handle, afterError){
        ApiService.getIndustries({
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.industriesList = response.data
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    setPhone(phone) {
        this.phone = phone;
    };

    setBirthday(birthday){
        this.birthday = birthday
    }

    setActivationCode(code) {
        this.activationCode = code;
    };

    setfirstName(first_name){
        this.firstName = first_name
    }

    setfamilyName(family_name){
        this.familyName = family_name
    }

    setPassword(password){
        this.password = password
    }

    setUid(uid){
        this.uid = uid
    }

    setUnionId(union_id){
        this.union_id = union_id
    }

    setUnionName(union_name){
        this.unionName = union_name
    }

    setJobPosition(job_position){
        this.job_position = job_position
    }

    setAddress(address){
        this.address = address
    }

    setPatronymic(patronymic){
        this.patronymic = patronymic
    }

    setIndustry(industry){
        this.industry = industry
    }

    async uploadFile(file, handle, afterError) {
        let formData = new FormData()
        formData.append('file', file)

        await ApiService.uploadFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            if (handle !== undefined) {
                handle(response.data, response.headers)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    setLanguage(key, language, handle, afterError) {
        ApiService.setLanguage({
            body: {
                key: key,
                language: language
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    getLanguage(language, handle, afterError) {
        ApiService.languageList({
            body: {
                language: language
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.languageList = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    async uploadFileForJoin(file, handle, afterError) {
        let formData = new FormData()
        formData.append('file', file)

        await ApiService.uploadFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.joinFiles.push(response.headers['x-entity-id'])

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    uploadAvatarFile(handle, afterError) {
        let formData = new FormData()
        formData.append('file', this.avatarFile)
        formData.append('thumbnail', '1')
        formData.append('width', '206')
        formData.append('height', '206')

        ApiService.uploadFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.avatarId = response.headers['x-entity-id']

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    auth(login, password, handle, afterError) {
        ApiService.authenticate({
            body: {
                phone: login,
                password: password
            },
            params: {}
        }, response => {
            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    sendSms(method, handle, afterError) {
        ApiService.send_sms({
            body: {
                phone: this.phone,
                method: method,
            },
            params: {}
        }, data => {
            if (handle !== undefined) {
                handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })

    };

    confirmSms(handle, afterError) {
        ApiService.confirm_sms({
            body: {
                phone: this.phone,
                sms_code: this.activationCode
            },
            params: {}
        }, data => {
            if (handle !== undefined) {
                handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    async joinUnion(files, place, handle, afterError) {
        let body = {
            union_id: this.union_id,
            files: files,
            association_id: place,
        }

        await ApiService.join_union({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.requestNumber = response.headers['x-entity-id']
            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    registration(handle, afterError) {
        const body = {
            phone: this.phone,
            first_name: this.firstName,
            family_name: this.familyName,
            patronymic: this.patronymic,
            password: this.password,
            birthday: this.birthday,
            sex: this.sex,
            uid: this.uid,
            sms_code: this.activationCode,
            physical_address: this.physical_address,
        }

        ApiService.registration({
            body: body,
            params: {}
        }, response => {
            this.requestNumber = response.headers['x-entity-id']

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    createUnion(union, industry, place, handle, afterError) {
        const body = {
            union_name: this.unionName,
            localizations: [
                {
                    "language_id": "ru",
                    "name": this.unionName
                }
            ],
            union_protocol_id: this.protocolFile.id,
            union_position_id: this.positionFile.id,
            union_statement_id: this.statementFile.id,
            association_id: place,
        }

        if (union !== null){
            body.root_union_id = union
        }

        if (industry !== null){
            body.industry_id = industry
        }

        ApiService.create_union({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.requestNumber = response.headers['x-entity-id']

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadUnionsList(search, handle, afterError){
        let body = {
            max_depth: 2
        }

        if (search !== null){
            body.search = search
        }

        ApiService.getUnions({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.unionsList = response.data
            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    restorePass(handle, afterError){
        ApiService.restorePass({
            body: {
                phone: this.phone,
                sms_code: this.activationCode,
                new_password: this.newPassword
            },
            params: {}
        }, response => {
            this.unionsList = response.data
            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    profileInfo(handle, afterError){
        ApiService.getProfileInfo({
            body: {
                max_depth: 3,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.profile = response.data
            this.birthday = response.data.birthday
            this.sex = response.data.sex

            if (response.data.union !== null){
                CookieService.create('union_id', response.data.union.resource_id)
            }

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    childrenInfo(handle, afterError){
        ApiService.getChildrenInfo({
            body: {
                max_depth: 3,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.childrens = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    childrenInfoById(id, handle, afterError){
        ApiService.getChildrenInfoById({
            id: id,
            body: {

            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.children = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    deleteChildren(id, handle, afterError) {
        ApiService.delete_children({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    updateProfileInfo(name, familyName, patronymic, sex, email, address, handle, afterError) {
        const body = {
            first_name: name,
            family_name: familyName,
            patronymic: patronymic,
            birthday: this.birthday,
            sex: sex,
            email: email,
            physical_address: address,
        }

        if (this.avatarId !== null) {
            body.picture_id = this.avatarId
        }

        ApiService.updateProfileInfo({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, data => {
            if (handle !== undefined) {
                handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    deleteFile(id, handle, afterError) {
        ApiService.deleteFile({
            body: {
                record_id: id,
                file_class_id: 6,
            },
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token'),
                }
            }
        }, response => {

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    deletePictureProfile(handle, afterError) {
        ApiService.deletePictureProfile({
            body: {
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                }
            }
        }, response => {

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    changePassword(oldPassword, newPassword, handle, afterError) {

        ApiService.changePassword({
            body: {
                old_password: oldPassword,
                new_password: newPassword
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, data => {
            if (handle !== undefined) {
                handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    verifyRecaptcha(token, handle, afterError) {

        ApiService.getVerifyRecaptcha({
            body: {
                token: token
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, data => {
            if (handle !== undefined) {
                handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

}

UserStore = decorate(UserStore, {
    protocolFile: observable,
    statementFile: observable,
    positionFile: observable,
    requestNumber: observable,
    joinFile: observable,
    avatarFile: observable,
    avatarId: observable,
    retentionFile: observable,
    industriesList: observable,
    childrens: observable,
    children: observable,
    userList: observable,
    birthday: observable,
    sex: observable,
    physical_address: observable,
    phone: observable,
    password: observable,
    newPassword: observable,
    activationCode: observable,
    industry: observable,
    unionName: observable,
    unionsList: observable,
    profile: observable,
    languageList: observable,
    childrenInfoById: action,
    childrenCreate: action,
    childrenUpdate: action,
    addChildren: action,
    deleteChildren: action,
    loadUser: action,
    loadIndustries: action,
    auth: action,
    sendSms: action,
    confirmSms: action,
    setPhone: action,
    setActivationCode: action,
    joinUnion: action,
    createUnion: action,
    registration: action,
    setfirstName: action,
    setfamilyName: action,
    setBirthday: action,
    setPassword: action,
    setUid: action,
    setUnionId: action,
    deleteFile: action,
    setJobPosition: action,
    setAddress: action,
    setPatronymic: action,
    setIndustry: action,
    setUnionName: action,
    loadUnionsList: action,
    uploadFile: action,
    uploadFileForJoin: action,
    uploadAvatarFile: action,
    restorePass: action,
    childrenInfo: action,
    profileInfo: action,
    updateProfileInfo: action,
    changePassword: action,
    deletePictureProfile: action,
    setLanguage: action,
    getLanguage: action,
    verifyRecaptcha: action

});

const userStore = new UserStore();

export default userStore;
