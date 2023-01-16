import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class TribuneStore {
    testList = [];
    test = {};
    testSingle = {};

    pollList = [];
    questions = [];
    questionSingle = [];
    answers = [];
    answerSingle = [];
    polls = [];
    revisionId = '';
    questionId = '';

    totalTestStatistic = {};
    totalVoteStatistic = {};
    personTestStatistics = {};

    revisionMembers = [];

    revisionName = '';

    testPageNumber = 1;

    addQuestion() {
        this.questions.push({value: ''})
    }

    addAnswer(questionIndex){
        const answersLength = this.answers.filter(answer => answer.questionIndex == questionIndex).length

        if (answersLength < 10){
            this.answers.push({value: '', questionIndex: questionIndex, index: answersLength, status: 0})
        }
    }

    addPoll(){
        this.polls.push({value: ''})
        this.questionSingle.push({value: ''})
    }

    removePoll(index){
        this.polls.splice(index, 1)
        this.questionSingle.splice(index,1)
    }

    removeQuestion(index) {
        this.questions.splice(index, 1)
    }

    getAnswer(questionIndex, index) {
        const answerIndex = this.answers.findIndex(answer => {
            return (answer.questionIndex == questionIndex) && (answer.index == index)
        })

        return this.answers[answerIndex]
    }

    removeAnswer(questionIndex, index){
        const answerIndex = this.answers.findIndex(answer => {
            return (answer.questionIndex == questionIndex) && (answer.index == index)
        })

        this.answers.splice(answerIndex, 1)
    }

    loadTestList(id, handle, afterError) {
        ApiService.getTestList({
            body: {
                union_id: id,
                max_depth: 3,
                page_number: this.testPageNumber,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.testList = response.data;
            this.testCurrentPage = response.headers['x-pagination-current-page'];
            this.testPageCount = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadTestSingle(id, handle, afterError) {
        ApiService.getRevision({
            id: id,
            body: {
                max_depth: 7,

            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.testSingle = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadQuestionSingle(id, handle, afterError) {
        ApiService.getQuestion({
            body: {
                revision_id: id,
                max_depth: 3,

            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.questionSingle = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadAnswerSingle(id, handle, afterError) {
        ApiService.getAnswer({
            body: {
                question_id: id,
                max_depth: 3,

            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.answerSingle = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    createTest(title, percent, status, start_date, finish_date, handle, afterError) {

        let body = {
            type_id: 84,
            name: title,
            percent_threshold: percent,
            start_date: start_date,
            finish_date: finish_date,
        }

        if (status !== 0){
            body.status = 1
        }

        ApiService.createRevision({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.revisionId = response.headers['x-entity-id']

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    editTest(title, content, handle, afterError) {
        ApiService.editTest({
            id: this.testSingle.resource_id,
            body: {
                title: title,
                content: content,
            },
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

    deleteTest(id, handle, afterError) {
        ApiService.delete_revision({
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

    createQuestionForTest(name, alternative_answer, handle, afterError) {
        ApiService.createQuestion({
            body: {
                revision_id: this.revisionId,
                question: name,
                has_alternate_answer: alternative_answer,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.questionId = response.headers['x-entity-id']

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    createAnswerForQuestion(name, status, handle, afterError) {
        ApiService.createAnswer({
            body: {
                question_id: this.questionId,
                answer: name,
                is_right: status,
            },
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

    loadPollList(id, handle, afterError) {
        ApiService.getTestList({
            body: {
                union_id: id,
                max_depth: 3,
                page_number: this.pollPageNumber,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.pollList = response.data;
            this.pollCurrentPage = response.headers['x-pagination-current-page'];
            this.pollPageCount = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadTotalTestStatistics(id, handle, afterError) {
        ApiService.getTotalTestStatistics({
            body: {
                revision_id: id,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.totalTestStatistic = response.data;
            this.totalTestStatistic.testName = response.data["revision"]["name"];
            this.totalTestStatistic.start_date = response.data["revision"]["start_date"];
            this.totalTestStatistic.finish_date = response.data["revision"]["finish_date"];

            this.revisionName = response.data["revision"]["name"];

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadTotalVoteStatistics(id, handle, afterError) {
        ApiService.getTotalVoteStatistics({
            body: {
                revision_id: id,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.totalVoteStatistic = response.data;

            this.revisionName = response.data["name"];

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadPersonalTestStatistics(id, person_id=null, handle, afterError) {
        ApiService.getPersonalTestStatistics({
            body: {
                revision_id: id,
                person_id               // if null returns personal test statistics for current user
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.personTestStatistics = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    getDoughnutTotalTestData() {
        const {total_complete, total_not_passed, not_finished} = this.totalTestStatistic;

        return {
            labels: ['Прошли тест', 'Не прошли тест', 'Не участвовали в тесте'],
            datasets: [{
                data: [total_complete, total_not_passed, not_finished],
                backgroundColor: ['#002b60', '#0052a4', '#d6d8dc'],
                hoverBackgroundColor: ['#002b60', '#0052a4', '#d6d8dc'],
            }]
        }
    }

    getDoughnutTotalVoteData() {
        const {total_finished, not_finished} = this.totalVoteStatistic;

        return {
            labels: ['Прошли опрос', 'Не прошли опрос'],
            datasets: [{
                data: [total_finished, not_finished],
                backgroundColor: ['#002b60', '#d6d8dc'],
                hoverBackgroundColor: ['#002b60', '#d6d8dc']
            }]
        }
    }

    getDoughnutPersonalTestData() {
        const {valid_answers, total_questions} = this.personTestStatistics;
        const wrong_answers = total_questions - valid_answers;

        return {
            labels: ['Правильных ответов', 'Неправильных ответов'],
            datasets: [{
                data: [valid_answers, wrong_answers],
                backgroundColor: ['#002b60', '#d6d8dc'],
                hoverBackgroundColor: ['#002b60', '#d6d8dc']
            }]
        }
    }

    createDecree(revisionId, decreeMessage, handle, afterError) {
        ApiService.createDecree({
            id: revisionId,
            body: {
                decree: decreeMessage
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.revisionId = response.headers['x-entity-id']

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadRevisionMembers(revisionId, handle, afterError) {
        ApiService.getRevisionMembers({
            body: {
                revision_id: revisionId,
                max_depth: 3,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.revisionMembers = response.data;

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

TribuneStore = decorate(TribuneStore, {
    testList: observable,
    pollList: observable,
    questions: observable,
    questionSingle: observable,
    answers: observable,
    answerSingle: observable,
    polls: observable,
    testSingle: observable,
    revisionId: observable,
    questionId: observable,
    pollCurrentPage: observable,
    pollPageCount: observable,
    pollPageNumber: observable,
    testCurrentPage: observable,
    testPageCount: observable,
    testPageNumber: observable,
    totalTestStatistic: observable,
    totalVoteStatistic: observable,
    personTestStatistics: observable,
    revisionMembers: observable,
    loadTestList: action,
    loadPollList: action,
    loadTestSingle: action,
    loadQuestionSingle: action,
    loadAnswerSingle: action,
    createPoll: action,
    createTest: action,
    createAnswerForQuestion: action,
    createAnswerForTest: action,
    editTest: action,
    deleteTest: action,
    addQuestion: action,
    addAnswer: action,
    addPoll: action,
    removeQuestion: action,
    removeAnswer: action,
    removePoll: action,
    getAnswer: action,
    loadTotalTestStatistics: action,
    loadTotalVoteStatistics: action,
    loadPersonalTestStatistics: action,
    loadRevisionMembers: action,

});

const tribuneStore = new TribuneStore();

export default tribuneStore;
