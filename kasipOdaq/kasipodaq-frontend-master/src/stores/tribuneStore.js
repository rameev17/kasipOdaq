import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class TribuneStore {
    testList = [];
    questions = [];
    answers = [];
    personAnswers = [];
    questionsHeaders = {};
    testHeaders = {};

    isLastQuestion = false;
    totalTestStatistic = [];

    loadTestList(id, is_answered, pageNumber, handle, afterError) {
        ApiService.getTestList({
            body: {
                union_id: id,
                max_depth: 3,
                is_answered: is_answered,
                page_number: pageNumber,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }

        }, response => {
            this.testList = response.data;
            this.testHeaders = response.headers;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadQuestions(id, page, handle, afterError) {
        ApiService.getQuestion({
            body: {
                revision_id: id,
                max_depth: 3,
                page_number: page,
                count: 1
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.questions = response.data
            this.questionsHeaders = response.headers

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadAnswers(id, person_id, handle, afterError) {
        ApiService.getAnswer({
            body: {
                question_id: id,
                max_depth: 3,
                person_id: person_id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.answers = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    async answerQuestion(answerId, handle, afterError){

        await ApiService.personAnswers({
            body: {
                answer_id: answerId
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.answers = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    finishRevision(id, handle, afterError){
        ApiService.finish_revision({
            body: {
                revision_id: id,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.totalTestStatistic = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    getVoteStatistic(id, handle, afterError){
        ApiService.getVoteStatistic({
            body: {
                revision_id: id,
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
    }

    getDoughnutVoteData() {
        const {valid_answers, invalid_answers} = this.totalTestStatistic;

        return {
            labels: ['Верных ответов', 'Не верных ответов'],
            datasets: [{
                data: [valid_answers, invalid_answers],
                backgroundColor: ['#14CF00', '#F91F2A'],
                hoverBackgroundColor: ['#14CF00', '#F91F2A']
            }]
        }
    }

    async commentCreate(questionId, comment, handle, afterError){

        await ApiService.commentAdd({
            body: {
                question_id: questionId,
                comment: comment
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

}

TribuneStore = decorate(TribuneStore, {
    testList: observable,
    questions: observable,
    answers: observable,
    questionsHeaders: observable,
    testHeaders: observable,
    isLastQuestion: observable,
    personAnswers: observable,
    totalTestStatistic: observable,
    totalCountTest: observable,
    currentPageTest: observable,
    pageCountTest: observable,
    loadTestList: action,
    loadQuestions: action,
    loadAnswers: action,
    answerQuestion: action,
    finishRevision: action,
    getVoteStatistic: action,
    getDoughnutVoteData: action,


});

const tribuneStore = new TribuneStore();

export default tribuneStore;