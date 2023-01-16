import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

class ApiService {
    static objectToQuery(object) {
        let query = '?' + Object.keys(object).map(key => {
            return encodeURIComponent(key) + '=' + object[key]
        }).join('&')

        return query
    }

    static authenticate(query, after, afterError) {
        axios.post(API_URL + '/api/v1/auth', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    }

    static async uploadFile(query, after, afterError) {
        await axios.post(API_URL + '/api/v1/upload_file', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
            // afterError({
            //     status: error.response.status,
            //     data: error.response.data,
            //     headers: error.response.headers
            // })
        })
    };

    static send_sms(query, after, afterError) {
        axios.post(API_URL + '/api/v1/send_sms', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    }

    static confirm_sms(query, after, afterError) {
        axios.post(API_URL + '/api/v1/confirm_sms', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    }

    static async join_union(query, after, afterError) {
        await axios.post(API_URL + '/api/v1/join_union', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static create_union(query, after, afterError) {
        axios.post(API_URL + '/api/v1/create_union', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static registration(query, after, afterError) {
        axios.post(API_URL + '/api/v1/register', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getIndustries(query, after, afterError) {
        axios.get(API_URL + '/api/v1/industries' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
            // afterError({
            //     status: error.response.status,
            //     data: error.response.data,
            //     headers: error.response.headers
            // })
        })
    };

    static getNewsList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/news/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getNews(query, after, afterError) {
        axios.get(API_URL + '/api/v1/news/' + query.id + '/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getUnions(query, after, afterError) {
        axios.get(API_URL + '/api/v1/unions/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getUnion(query, after, afterError) {
        axios.get(API_URL + '/api/v1/unions/' + query.id + '/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static restorePass(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/restore_password', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getProfileInfo(query, after, afterError) {
        axios.get(API_URL + '/api/v1/profile'+ this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
            // afterError({
            //     status: error.response.status,
            //     data: error.response.data,
            //     headers: error.response.headers
            // })
        })
    };

    static updateProfileInfo(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/profile_edit', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getAppealList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/appeals/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static createAppeal(query, after, afterError) {
        axios.post(API_URL + '/api/v1/appeals/', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getInfo(query, after, afterError) {
        axios.get(API_URL + '/api/v1/articles/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getDisputeCategory(query, after, afterError) {
        axios.get(API_URL + '/api/v1/records/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getDisputeList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/disputes/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getLegislationType(query, after, afterError) {
        axios.get(API_URL + '/api/v1/legislation/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
            // afterError({
            //     status: error.response.status,
            //     data: error.response.data,
            //     headers: error.response.headers
            // })
        })
    };

    static getLegislation(query, after, afterError) {
        axios.get(API_URL + '/api/v1/legislation/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
            // afterError({
            //     status: error.response.status,
            //     data: error.response.data,
            //     headers: error.response.headers
            // })
        })
    };

    static getLegislationArticle(query, after, afterError) {
        axios.get(API_URL + '/api/v1/legislation/' + query.id + '/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
            // afterError({
            //     status: error.response.status,
            //     data: error.response.data,
            //     headers: error.response.headers
            // })
        })
    };

    static getPartnerCategoryList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/records/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getPartnerCategory(query, after, afterError) {
        axios.get(API_URL + '/api/v1/partners/' + query.id + '/' +  this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getPartnerList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/partners/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getPartner(query, after, afterError) {
        axios.get(API_URL + '/api/v1/partners/' + query.id + '/' +  this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getFaqList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/faqs/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getFaq(query, after, afterError) {
        axios.get(API_URL + '/api/v1/faqs/' + query.id + '/' +  this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getOrderList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/orders/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getOrder(query, after, afterError) {
        axios.get(API_URL + '/api/v1/orders/' + query.id + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static union(query, after, afterError) {
        axios.get(API_URL + '/api/v1/self_union' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getPermissions(query, after, afterError) {
        axios.get(API_URL + '/api/v1/permissions/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
            // afterError({
            //     status: error.response.status,
            //     data: error.response.data,
            //     headers: error.response.headers
            // })
        })
    };

    static getNotificationList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/notifications/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static notificationRead(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/read_notification', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static notificationToggle(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/edit_setting/' + query.id + '/', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static changePassword(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/change_password', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getTestList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/revisions/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getQuestion(query, after, afterError) {
        axios.get(API_URL + '/api/v1/questions/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
            // afterError({
            //     status: error.response.status,
            //     data: error.response.data,
            //     headers: error.response.headers
            // })
        })
    };

    static getAnswer(query, after, afterError) {
        axios.get(API_URL + '/api/v1/answers/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static async personAnswers(query, after, afterError) {
        await axios.post(API_URL + '/api/v1/person_answers/', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static async finish_revision(query, after, afterError) {
        await axios.post(API_URL + '/api/v1/finish_revision', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getVoteStatistic(query, after, afterError) {
        axios.get(API_URL + '/api/v1/revision_test_statistic' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static deleteFile(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/delete_file', { data: query.body }).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static deletePictureProfile(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/delete_person_picture', query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static childrenCreate(query, after, afterError) {
        axios.post(API_URL + '/api/v1/children/', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getChildrenInfo(query, after, afterError) {
        axios.get(API_URL + '/api/v1/children/'+ this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static delete_children(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/children/' + query.id + '/', query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getChildrenInfoById(query, after, afterError) {
        axios.get(API_URL + '/api/v1/children/' + query.id + '/' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static childrenUpdate(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/children/' + query.id + '/', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getPlaces(query, after, afterError) {
        axios.get(API_URL + '/api/v1/place_associations' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
        })
    };

    static getUnionAssociations(query, after, afterError) {
        axios.get(API_URL + '/api/v1/union_associations' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
        })
    };

    static getPersonUnions(query, after, afterError) {
        axios.get(API_URL + '/api/v1/unions_by_person' + this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static setLanguage(query, after, afterError) {
        axios.get(API_URL + '/api/v1/service_localization'+ this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static languageList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/all_service_localization'+ this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static commentAdd(query, after, afterError) {
        axios.post(API_URL + '/api/v1/comment/', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    }

    static getVerifyRecaptcha(query, after, afterError) {
        axios.post(API_URL + '/api/v1/verify_captcha', query.body, query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    }

}

export default ApiService
