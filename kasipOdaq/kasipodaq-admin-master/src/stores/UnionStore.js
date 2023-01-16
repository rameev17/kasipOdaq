import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class UnionStore {
    industriesList = [];
    industry = '';
    unionsList = [];
    union = {
        kind: '',
        files: [],
        picture: {},
        protocol: {
            name: '',
            uri: '',
        },
        position: {
            name: '',
            uri: '',
        },
        statement: {
            name: '',
            uri: '',
        },
        agreement: {
            name: '',
            uri: '',
        },
    };
    unionKk = {
        kind: '',
        files: [],
        picture: {},
        protocol: {
            name: '',
            uri: '',
        },
        position: {
            name: '',
            uri: '',
        },
        statement: {
            name: '',
            uri: '',
        },
        agreement: {
            name: '',
            uri: '',
        },
    };
    membersList = [];
    member = '';
    unionsPpoList = [];
    membersPpoList = [];
    unionApplication = {
        person: {},
        files: [],
        union: {
            position: {},
            protocol: {},
            statement: {},
            agreement: {}
        },
    };
    files = [];
    fileMember = null;
    pictureFile = null;
    pictureUnionId = null;
    pictureIdMember = null;
    protocolFile = {
        name: 'Протокол',
        uri: '',
        id: null,
    };
    collectiveAgreementFile = {
        name: 'Коллективный договор',
        uri: '',
        id: null,
    };
    positionFile = {
        name: 'Положение',
        uri: '',
        id: null,
    };
    statementFile = {
        name: 'Заявление',
        uri: '',
        id: null,
    };
    entrySampleFile = {
        name: 'Образец на вступление',
        uri: '',
        id: null
    };
    holdSampleFile = {
        name: 'Образец на удержание',
        uri: '',
        id: null
    };
    positionSampleFile = {
        name: 'Образец положения',
        uri: '',
        id: null
    };
    protocolSampleFile = {
        name: 'Образец протокола',
        uri: '',
        id: null
    };
    statementSampleFile = {
        name: 'Образец заявления',
        uri: '',
        id: null
    };

    pageNumberIndustries = 1;
    currentPageIndustries = 1;
    pageCountIndustries = 1;

    pageNumberUnionsPpo = 1;
    currentPageUnionsPpo = 1;
    pageCountUnionsPpo = 1;

    pageNumberMembersPpo = 1;
    currentPageMembersPpo = 1;
    pageCountMembersPpo = 1;

    pageNumberUnions = 1;
    currentPageUnions = 1;
    pageCountUnions = 1;

    pageNumberUnionApplication = 1;
    currentPageUnionApplication = 1;
    pageCountUnionApplication = 1;

    pageNumberMembers = 1;
    currentPageMembers = 1;
    pageCountMembers = 1;

    countMembers = 0;

    applications = [];
    applicationFiles = [];
    children = [];
    child = {};
    memberId = '';

    reportList = [];
    report = [];

    breadCrumbsPpo = [];
    breadCrumbs = [];

    sampleFilesUpload(id, handle, afterError){
        let body = {};

        if (this.entrySampleFile != null && this.entrySampleFile != undefined && this.entrySampleFile != "undefined") {
            body.entry_sample_id = this.entrySampleFile.id
        }

        if (this.holdSampleFile != null && this.holdSampleFile != undefined && this.holdSampleFile != "undefined") {
            body.hold_sample_id = this.holdSampleFile.id
        }

        if (this.positionSampleFile != null && this.positionSampleFile != undefined && this.positionSampleFile != "undefined") {
            body.position_sample_id = this.positionSampleFile.id
        }

        if (this.protocolSampleFile != null && this.protocolSampleFile != undefined && this.protocolSampleFile != "undefined") {
            body.protocol_sample_id = this.protocolSampleFile.id
        }

        if (this.statementSampleFile != null && this.statementSampleFile != undefined && this.statementSampleFile != "undefined") {
            body.statement_sample_id = this.statementSampleFile.id
        }

        ApiService.updateUnion({
                id: id,
                body: body,
                params: {
                    headers: {
                        'Authorization': CookieService.get('token-admin'),
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
            }
        )
    }

    addApplication() {
        this.applications.push({value: '', index: this.applications.length})
    }

    async applicationFilesUpload(id, files, handle, afterError) {
        await ApiService.updateUnion({
            id: id,
            body: {
                union_sample_application_ids: files
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
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

    async uploadFile(file, handle, afterError) {
        let formData = new FormData();
        formData.append('file', file);

        await ApiService.uploadAsyncFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token-admin'),
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

    uploadFileMember(handle, afterError) {
        let formData = new FormData();
        formData.append('file', this.fileMember);
        formData.append('thumbnail', '1');
        formData.append('width', '1024');
        formData.append('height', '768');

        ApiService.uploadFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token-admin'),
                }
            }
        }, response => {
            this.pictureIdMember = response.headers['x-entity-id'];

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    deleteFile(id, handle, afterError) {
        ApiService.deleteFile({
            body: {
                record_id: id,
                file_class_id: 3,
            },
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token-admin'),
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

    deleteSample(id, handle, afterError) {
        ApiService.delete_sample({
            body: {
                link_id: id,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
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

    async uploadPictureFile(handle, afterError) {
        let formData = new FormData();
        formData.append('file', this.pictureFile);

        await ApiService.uploadAsyncFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token-admin'),
                }
            }
        }, response => {
            this.pictureUnionId = response.headers['x-entity-id'];

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    confirmApplication(id, handle, afterError) {
        ApiService.confirm_application({
            body: {
                application_id: id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
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

    rejectApplication(id, handle, afterError) {
        ApiService.reject_application({
            body: {
                application_id: id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
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

    deleteApplication(id, handle, afterError) {
        ApiService.delete_application({
            body: {
                application_id: id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
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

    deleteUnion(id, handle, afterError){
        ApiService.delete_union({
            id: id,
            body: {
                status: 0,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
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

    loadIndustries(search, handle, afterError){

        let body = {};

        if (search !== null  && search !== ''){
            body.search = search
        }else{
            body = {
                max_depth: 2,
                page_number: this.pageNumberIndustries,
                count: 10,
            }
        }

        ApiService.getIndustries({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }
        }, response => {
            this.industriesList = response.data;
            this.currentPageIndustries = response.headers['x-pagination-current-page'];
            this.pageCountIndustries = response.headers['x-pagination-page-count'];

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadIndustry(id, handle, afterError){
        ApiService.getIndustry({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
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

    loadUnion(id, handle, afterError){
        ApiService.union({
            id: id,
            body: {
                max_depth: 2,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }
        }, response => {
            this.union = response.data;
            this.breadCrumbs = response.data.bread_crumbs;
            this.union.kind = response.data.kind;
            this.protocolFile = response.data.protocol;
            this.positionFile = response.data.position;
            this.statementFile = response.data.statement;
            this.collectiveAgreementFile = response.data.agreement;
            this.applications = response.data.union_sample_applications;
            this.entrySampleFile = response.data.entry_sample;
            this.holdSampleFile = response.data.hold_sample;
            this.positionSampleFile = response.data.position_sample;
            this.protocolSampleFile = response.data.protocol_sample;
            this.statementSampleFile = response.data.statement_sample;

            if (response.data.agreement !== undefined) {
                this.collectiveAgreementFile = response.data.agreement
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadUnionPpoEdit(id, lang, handle, afterError){
        ApiService.union({
            id: id,
            body: {
                max_depth: 2,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': lang,
                }
            }
        }, response => {
            this.union = response.data;
            this.breadCrumbs = response.data.bread_crumbs;
            this.union.kind = response.data.kind;
            this.protocolFile = response.data.protocol;
            this.positionFile = response.data.position;
            this.statementFile = response.data.statement;
            this.collectiveAgreementFile = response.data.agreement;
            this.applications = response.data.union_sample_applications;
            this.entrySampleFile = response.data.entry_sample;
            this.holdSampleFile = response.data.hold_sample;
            this.positionSampleFile = response.data.position_sample;
            this.protocolSampleFile = response.data.protocol_sample;
            this.statementSampleFile = response.data.statement_sample;

            if (response.data.agreement !== undefined) {
                this.collectiveAgreementFile = response.data.agreement
            }

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadUnionsPpo(id, search, handle, afterError) {
        let body = {};

        if (search !== null && search !== '') {
            body.search = search
        } else {
            body = {
                industry_id: id,
                max_depth: 2,
                page_number: this.pageNumberUnionsPpo,
                count: 10,
            }
        }

        ApiService.unions({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-language': CookieService.get('language-admin')
                }
            }
        }, response => {
            this.unionsPpoList = response.data;
            this.currentPageUnionsPpo = response.headers['x-pagination-current-page'];
            this.pageCountUnionsPpo = response.headers['x-pagination-page-count'];
            this.breadCrumbsPpo = response.data[0]?.bread_crumbs;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadMembersPpo(id, search, handle, afterError) {
        let body = {};

        if (search !== null && search !== '') {
            body.search = search;
            body.union_id = id
        }else {
            body = {
                union_id: id,
                max_depth: 2,
                page_number: this.pageNumberMembersPpo,
                count: 10,
            }
        }

        ApiService.memberList({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                }
            }
        }, response => {
            this.membersPpoList = response.data;
            this.currentPageMembersPpo = response.headers['x-pagination-current-page'];
            this.pageCountMembersPpo = response.headers['x-pagination-page-count'];
            this.countMembers = response.headers['x-pagination-total-count'];

            if (handle !== undefined) {
                handle(response.data, response.headers)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadMember(id, handle, afterError) {
        ApiService.member({
            id: id,
            body: {
                max_depth: 2,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                }
            }
        }, response => {
            this.member = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadUnions(status, handle, afterError) {
        ApiService.union_applications({
            body: {
                status: status,
                max_depth: 2,
                page_number: this.pageNumberUnions,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                }
            }
        }, response => {
            this.unionsList = response.data;
            this.currentPageUnions = response.headers['x-pagination-current-page'];
            this.pageCountUnions = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadUnionApplication(id, handle, afterError) {
        ApiService.get_union_application({
            id: id,
            body: {
                max_depth: 3,
                page_number: this.pageNumberUnionApplication,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                }
            }
        }, response => {
            this.unionApplication = response.data;
            this.currentPageUnionApplication = response.headers['x-pagination-current-page'];
            this.pageCountUnionApplication = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadMembers(status, handle, afterError) {
        ApiService.union_applications({
            body: {
                status: status,
                max_depth: 2,
                page_number: this.pageNumberMembers,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                }
            }
        }, response => {
            this.membersList = response.data;
            this.currentPageMembers = response.headers['x-pagination-current-page'];
            this.pageCountMembers = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    editUnion(id, title, aboutCompany, aboutUnion, titleKk, aboutCompanyKk, aboutUnionKk, handle, afterError){
        let body = {};

        if (titleKk !== ''){
            body.localizations = [{
                name: title,
                about_company: aboutCompany,
                about_union: aboutUnion,
                language_id: 'ru',
            },
            {
                name: titleKk,
                about_company: aboutCompanyKk,
                about_union: aboutUnionKk,
                language_id: 'kk',
            }]
        }else{
            body.localizations = [{
                name: title,
                about_company: aboutCompany,
                about_union: aboutUnion,
                language_id: 'ru',
            }]
        }

        if (this.protocolFile != undefined) {
            body.union_protocol_id = this.protocolFile.id
        }

        if (this.positionFile != undefined) {
            body.union_position_id = this.positionFile.id
        }

        if (this.statementFile != undefined) {
            body.union_statement_id = this.statementFile.id
        }

        if (this.collectiveAgreementFile != undefined) {
            body.union_agreement_id = this.collectiveAgreementFile.id
        }

        if (this.entrySampleFile != undefined) {
            body.entry_sample_id = this.entrySampleFile.id
        }

        if (this.holdSampleFile != undefined) {
            body.hold_sample_id = this.holdSampleFile.id
        }

        if (this.positionSampleFile != undefined) {
            body.position_sample_id = this.positionSampleFile.id
        }

        if (this.protocolSampleFile != undefined) {
            body.protocol_sample_id = this.protocolSampleFile.id
        }

        if (this.statementSampleFile != undefined) {
            body.statement_sample_id = this.statementSampleFile.id
        }

        if (this.pictureUnionId !== null){
            body.picture_id = this.pictureUnionId
        }

        ApiService.updateUnion({
            id: id,
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
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
            }
        )
    }

    excludeMember(id, comment, handle, afterError){
        let body = {};

        if (comment !== ''){
            body.reason = comment
        }


        ApiService.exclude_member({
            id: id,
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
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

    addChildren() {
        this.children.push({ is_new: true })
    }

    createMember(firstName, familyName, patronymic, birthday, sex, iin, address, phone, mail, job, handle, afterError) {

        let body = {
            first_name: firstName,
            family_name: familyName,
            patronymic: patronymic,
            birthday: birthday,
            sex: sex,
            individual_number: iin,
            physical_address: address,
            phone: phone,
            email: mail,
            job_position: job
        };

        if (this.pictureIdMember !== null){
            body.picture_id = this.pictureIdMember
        }

        ApiService.createMember({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
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

    updateMember(id, name, family_name, patronymic, sex, birthday, iin, address, job, mail, handle, afterError) {

        let body = {
            person_id: id,
            first_name: name,
            family_name: family_name,
            patronymic: patronymic,
            sex: sex,
            birthday: birthday,
            individual_number: iin,
            physical_address: address,
            job_position: job,
            email: mail
        };

        if (this.pictureIdMember !== null){
            body.picture_id = this.pictureIdMember
        }

        ApiService.updateMember({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
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

    childrenCreate(id, name, family_name, patronymic, sex, birthday, iin, handle, afterError) {

        ApiService.childrenCreate({
            body: {
                person_id: id,
                first_name: name,
                family_name: family_name,
                patronymic: patronymic,
                sex: sex,
                birth_date: birthday,
                personal_code: iin
            },
            params: {
                headers: {
                    'Accept-Language': CookieService.get('language-admin'),
                    'Authorization': CookieService.get('token-admin')
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
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
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

    childrenList(id, handle, afterError){
        ApiService.getChildrenList({
            body: {
                person_id: id,
                max_depth: 3,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.children = response.data;

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
                max_depth: 3,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.child = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    deletePictureMember(id, handle, afterError) {
        ApiService.deletePictureMember({
            body: {
                person_id: id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
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

    deleteChild(id, handle, afterError) {
        ApiService.delete_children({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
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

    memberStatusChange(id, handle, afterError) {
        ApiService.member_status_change({
            body: {
                person_id: id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
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

    getReportList(id, handle, afterError){
        ApiService.getReportList({
            body: {
                max_depth: 3,
                union_id: id,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }
        }, response => {
            this.reportList = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    getReportById(id, handle, afterError){
        ApiService.getReportId({
            id: id,
            body: {
                max_depth: 3,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }
        }, response => {
            this.report = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    reportForm(type, id, fields, handle, afterError){
        ApiService.ReportForm({
            body: {
                type_id: type,
                union_id: id,
                fields: fields
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
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

    reportReform(id, fields, handle, afterError){

        ApiService.ReportReform({
            id: id,
            body: {
                fields: fields
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
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

    importChildren(file, handle, afterError) {
        let formData = new FormData();
        formData.append('file', file);

        ApiService.getImportChildren({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token-admin'),
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

    importMember(file, handle, afterError) {
        let formData = new FormData();
        formData.append('file', file);

        ApiService.getImportMember({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token-admin'),
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

}

UnionStore = decorate(UnionStore, {
    industriesList: observable,
    unionsList: observable,
    union: observable,
    unionKk: observable,
    unionsPpoList: observable,
    reportList: observable,
    report: observable,
    industry: observable,
    membersList: observable,
    membersPpoList: observable,
    member: observable,
    unionApplication: observable,
    files: observable,
    pictureFile: observable,
    protocolFile: observable,
    collectiveAgreementFile: observable,
    positionFile: observable,
    statementFile: observable,
    entrySampleFile: observable,
    holdSampleFile: observable,
    positionSampleFile: observable,
    protocolSampleFile: observable,
    statementSampleFile: observable,
    pictureUnionId: observable,
    pictureIdMember: observable,
    pageNumber: observable,
    children: observable,
    child: observable,
    pageNumberIndustries: observable,
    currentPageIndustries: observable,
    pageCountIndustries: observable,
    pageNumberUnionsPpo: observable,
    currentPageUnionsPpo: observable,
    countMembers: observable,
    pageCountUnionsPpo: observable,
    pageNumberMembersPpo: observable,
    currentPageMembersPpo: observable,
    pageCountMembersPpo: observable,
    pageNumberUnions: observable,
    currentPageUnions: observable,
    pageCountUnions: observable,
    pageNumberUnionApplication: observable,
    currentPageUnionApplication: observable,
    pageCountUnionApplication: observable,
    pageNumberMembers: observable,
    currentPageMembers: observable,
    pageCountMembers: observable,
    applications: observable,
    applicationFiles: observable,
    memberId: observable,
    applicationNewArrayFiles: observable,
    breadCrumbsPpo: observable,
    breadCrumbs: observable,
    sampleFilesUpload: action,
    addApplication: action,
    applicationFilesUpload: action,
    uploadFile: action,
    uploadFileMember: action,
    uploadPictureFile: action,
    deleteFile: observable,
    loadIndustries: action,
    loadIndustry: action,
    loadUnionsPpo: action,
    loadUnion: action,
    loadUnionPpoEdit: action,
    loadUnions: action,
    loadMembersPpo: action,
    loadMembers: action,
    addChildren: action,
    loadMember: action,
    updateMember: action,
    confirmApplication: action,
    rejectApplication: action,
    deleteApplication: action,
    deleteSample: action,
    deleteUnion: action,
    loadUnionApplication: action,
    editUnion: action,
    excludeMember: action,
    createMember: action,
    childrenCreate: action,
    childrenList: action,
    childrenInfoById: action,
    deletePictureMember: action,
    deleteChild: action,
    childrenUpdate: action,
    memberStatusChange: action,
    getReportList: action,
    getReportById: action,
    reportForm: action,
    reportReform: action,
    importChildren: action,
    importMember: action,

});

const unionStore = new UnionStore();

export default unionStore;