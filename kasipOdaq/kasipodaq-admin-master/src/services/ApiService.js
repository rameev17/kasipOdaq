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

    static loadFile(query, after, afterError) {
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

    static uploadFile(query, after, afterError) {
        axios.post(API_URL + '/api/v1/upload_file', query.body, query.params).then(response => {
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

    static async uploadAsyncFile(query, after, afterError) {
        await axios.post(API_URL + '/api/v1/upload_file', query.body, query.params).then(response => {
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

    static unions(query, after, afterError) {
        axios.get(API_URL + '/api/v1/unions/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static union(query, after, afterError) {
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

    static updateUnion(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/unions/' + query.id + '/', query.body,  query.params).then(response => {
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

    static memberList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/members/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static member(query, after, afterError) {
        axios.get(API_URL + '/api/v1/members/' + query.id + '/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static exclude_member(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/members/' + query.id + '/',{data: query.body, headers: query.params.headers}).then(response => {
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

    static union_applications(query, after, afterError) {
        axios.get(API_URL + '/api/v1/union_applications/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static get_union_application(query, after, afterError) {
        axios.get(API_URL + '/api/v1/union_applications/' + query.id + '/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static confirm_application(query, after, afterError) {
        axios.post(API_URL + '/api/v1/confirm_application', query.body, query.params).then(response => {
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

    static reject_application(query, after, afterError) {
        axios.post(API_URL + '/api/v1/reject_application', query.body, query.params).then(response => {
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

    static delete_application(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/' +
            '', query.body,  query.params).then(response => {
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

    static delete_union(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/unions/' + query.id + '/', query.body,  query.params).then(response => {
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

    static createNews(query, after, afterError) {
        axios.post(API_URL + '/api/v1/news/', query.body, query.params).then(response => {
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

    static deleteNews(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/news/' + query.id + '/', query.params).then(response => {
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

    static updateNews(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/news/' + query.id + '/', query.body, query.params).then(response => {
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

    static getInfo(query, after, afterError) {
        axios.get(API_URL + '/api/v1/articles/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static createInfo(query, after, afterError) {
        axios.post(API_URL + '/api/v1/articles/', query.body, query.params).then(response => {
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

    static updateInfo(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/articles/' + query.id + '/', query.body, query.params).then(response => {
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

    static getAppeal(query, after, afterError) {
        axios.get(API_URL + '/api/v1/appeals/' + query.id + '/' +  this.objectToQuery(query.body), query.params).then(response => {
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

    static delete_appeal(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/appeals/' + query.id + '/', query.params).then(response => {
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

    static answer_appeal(query, after, afterError) {
        axios.post(API_URL + '/api/v1/appeals/', query.body,  query.params).then(response => {
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

    static createNews(query, after, afterError) {
        axios.post(API_URL + '/api/v1/news/', query.body, query.params).then(response => {
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

    static getCategoryDispute(query, after, afterError) {
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

    static getDispute(query, after, afterError) {
        axios.get(API_URL + '/api/v1/disputes/' + query.id + '/' +  this.objectToQuery(query.body), query.params).then(response => {
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

    static createDispute(query, after, afterError) {
        axios.post(API_URL + '/api/v1/disputes/', query.body, query.params).then(response => {
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

    static updateDispute(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/disputes/' + query.id + '/', query.body, query.params).then(response => {
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

    static deleteDispute(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/disputes/' + query.id + '/', query.params).then(response => {
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
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getLegislation(query, after, afterError) {
        axios.get(API_URL + '/api/v1/legislation/' +  this.objectToQuery(query.body), query.params).then(response => {
            after({
                status: 200,
                data: response.data,
                headers: response.headers
            })
        }).catch(error => {
            console.log(error)
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getLegislationArticle(query, after, afterError) {
        axios.get(API_URL + '/api/v1/legislation/' + query.id + '/' +  this.objectToQuery(query.body), query.params).then(response => {
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

    static createLegislation(query, after, afterError) {
        axios.post(API_URL + '/api/v1/legislation/', query.body, query.params).then(response => {
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

    static updateLegislation(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/legislation/' + query.id + '/', query.body, query.params).then(response => {
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

    static deleteLegislation(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/legislation/' + query.id + '/', query.params).then(response => {
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
        axios.get(API_URL + '/api/v1/records/' + query.id + '/' +  this.objectToQuery(query.body), query.params).then(response => {
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

    static createPartnerCategory(query, after, afterError) {
        axios.post(API_URL + '/api/v1/records/', query.body, query.params).then(response => {
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

    static editPartnerCategory(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/records/' + query.id + '/', query.body, query.params).then(response => {
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

    static deletePartnerCategory(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/records/' + query.id + '/', query.params).then(response => {
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

    static createPartner(query, after, afterError) {
        axios.post(API_URL + '/api/v1/partners/', query.body, query.params).then(response => {
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

    static editPartner(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/partners/' + query.id + '/', query.body, query.params).then(response => {
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

    static deletePartner(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/partners/' + query.id + '/', query.params).then(response => {
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

    static createFaq(query, after, afterError) {
        axios.post(API_URL + '/api/v1/faqs/', query.body, query.params).then(response => {
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

    static editFaq(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/faqs/' + query.id + '/', query.body, query.params).then(response => {
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

    static deleteFaq(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/faqs/' + query.id + '/', query.params).then(response => {
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
            afterError({
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            })
        })
    };

    static getIndustry(query, after, afterError) {
        axios.get(API_URL + '/api/v1/industries/' + query.id + this.objectToQuery(query.body), query.params).then(response => {
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

    static createOrder(query, after, afterError) {
        axios.post(API_URL + '/api/v1/orders/', query.body, query.params).then(response => {
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

    static editOrder(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/orders/' + query.id + '/', query.body, query.params).then(response => {
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

    static deleteOrder(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/orders/' + query.id + '/', query.params).then(response => {
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

    static createRevision(query, after, afterError) {
        axios.post(API_URL + '/api/v1/revisions/', query.body, query.params).then(response => {
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

    static async editTest(query, after, afterError) {
        await axios.patch(API_URL + '/api/v1/revisions/' + query.id + '/', query.body, query.params).then(response => {
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

    static delete_revision(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/revisions/' + query.id + '/', query.params).then(response => {
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

    static async createQuestion(query, after, afterError) {
        await axios.post(API_URL + '/api/v1/questions/', query.body, query.params).then(response => {
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

    static async createAnswer(query, after, afterError) {
        await axios.post(API_URL + '/api/v1/answers/', query.body, query.params).then(response => {
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

    static getRevision(query, after, afterError) {
        axios.get(API_URL + '/api/v1/revisions/' + query.id + '/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static getQuestions(query, after, afterError) {
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

    static delete_question(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/questions/' + query.id + '/', query.params).then(response => {
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

    static delete_answer(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/answers/' + query.id + '/', query.params).then(response => {
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

    static getAnswers(query, after, afterError) {
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

    static updateStatusRevision(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/revisions/' + query.id + '/', query.body, query.params).then(response => {
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

    static getTotalTestStatistics(query, after, afterError) {
        axios.get(API_URL + '/api/v1/revision_test_statistic'+ this.objectToQuery(query.body), query.params).then(response => {
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

    static getTotalVoteStatistics(query, after, afterError) {
        axios.get(API_URL + '/api/v1/revision_vote_statistic'+ this.objectToQuery(query.body), query.params).then(response => {
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


    static getPersonalTestStatistics(query, after, afterError) {
        axios.get(API_URL + '/api/v1/person_test_statistic'+ this.objectToQuery(query.body), query.params).then(response => {
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

    static async updateQuestion(query, after, afterError) {
        await axios.patch(API_URL + '/api/v1/questions/' + query.id + '/', query.body, query.params).then(response => {
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

    static async updateAnswer(query, after, afterError) {
        await axios.patch(API_URL + '/api/v1/answers/' + query.id + '/', query.body, query.params).then(response => {
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


    static createDecree(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/revisions/' + query.id + '/', query.body, query.params).then(response => {
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

    static getRevisionMembers(query, after, afterError) {
        axios.get(API_URL + '/api/v1/revision_members'+ this.objectToQuery(query.body), query.params).then(response => {
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

    static createMember(query, after, afterError) {
        axios.post(API_URL + '/api/v1/create_union_member', query.body, query.params).then(response => {
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

    static updateMember(query, after, afterError) {
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

    static getChildrenList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/children/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static deletePictureMember(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/delete_person_picture', {data: query.body, headers: query.params.headers}).then(response => {
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

    static member_status_change(query, after, afterError) {
        axios.post(API_URL + '/api/v1/set_union_master', query.body, query.params).then(response => {
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

    static getLanguageList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/all_service_localization' + this.objectToQuery(query.body), query.params).then(response => {
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

    static getReportList(query, after, afterError) {
        axios.get(API_URL + '/api/v1/report/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static ReportForm(query, after, afterError) {
        axios.post(API_URL + '/api/v1/report/', query.body, query.params).then(response => {
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

    static ReportReform(query, after, afterError) {
        axios.patch(API_URL + '/api/v1/report/' + query.id + '/', query.body,  query.params).then(response => {
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

    static getCommentsForQuestion(query, after, afterError) {
        axios.get(API_URL + '/api/v1/comment/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static getReportId(query, after, afterError) {
        axios.get(API_URL + '/api/v1/report/' + query.id + '/' + this.objectToQuery(query.body), query.params).then(response => {
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

    static delete_sample(query, after, afterError) {
        axios.delete(API_URL + '/api/v1/delete_file_link', { data: query.body }).then(response => {
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

    static getImportChildren(query, after, afterError) {
        axios.post(API_URL + '/api/v1/children/import', query.body, query.params).then(response => {
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

    static getImportMember(query, after, afterError) {
        axios.post(API_URL + '/api/v1/members/import', query.body, query.params).then(response => {
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

}

export default ApiService
