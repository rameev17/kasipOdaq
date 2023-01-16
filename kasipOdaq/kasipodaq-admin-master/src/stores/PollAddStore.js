import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class PollAddStore {
    pollList = [];
    poll = {};
    questions = [];
    answers = [];

    pollPageNumber = 1;
    pollCurrentPage = 1;
    pollPageCount = 1;

    addQuestion() {
        this.questions.push({value: '', is_new: true, index: this.questions.length})
    }

    removeQuestion(index) {
        this.questions.splice(index, 1)
    }

    addAnswer(questionIndex, questionId) {
        const answersLength = this.answers.filter(answer => answer.questionIndex == questionIndex).length

        if (answersLength < 10){
            this.answers.push({value: '', questionId: questionId, questionIndex: questionIndex, index: answersLength, status: 0, is_new: true})
        }
    }

    getAnswer(questionIndex, index, newQuestion, answerId) {
        const answerIndex = this.answers.findIndex(answer => {
            return newQuestion ? (answer.index == index && answer.questionIndex == questionIndex) : answer.resource_id == answerId
        })

        return this.answers[answerIndex]
    }

    getNewAnswerByQuestionId(questionId, index) {
        const answerIndex = this.answers.findIndex(answer => {
            return answer.questionId == questionId && answer.index == index
        })

        return this.answers[answerIndex]
    }

    removeAnswer(questionIndex, index) {
        const answerIndex = this.answers.findIndex(answer => {
            return answer.questionIndex == questionIndex && answer.index == index
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

    loadTest(id, handle, afterError) {
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
            this.test = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadQuestions(id, handle, afterError) {
        ApiService.getQuestions({
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
            this.questions = response.data.map(question => Object({
                resource_id: question.resource_id,
                value: question.question,
                is_new: false
            }));

            // todo: make sure that this change didn't break anything
            this.answers = [];

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadAnswers(id, handle, afterError) {
        ApiService.getAnswers({
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
            this.answers = response.data.map(answer => Object({
                resource_id: answer.resource_id,
                value: answer.answer,
                is_right: answer.is_right,
                question_id: id,
                is_new: false
            }));

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    createPoll(title, start_date, finish_date, handle, afterError) {

        let body = {
            type_id: 83,
            name: title,
            start_date: start_date,
            finish_date: finish_date,
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

    deleteQuestion(id, handle, afterError){
        ApiService.delete_question({
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
    }

    deleteAnswer(id, handle, afterError){
        ApiService.delete_answer({
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
    }

    async createQuestionForTest(name, alternativeAnswer, handle, afterError) {
        await ApiService.createQuestion({
            body: {
                revision_id: this.revisionId,
                question: name,
                has_alternate_answer: alternativeAnswer
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        },  response => {
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

    async updateQuestionForTest(questionId, name, handle, afterError) {
        await ApiService.updateQuestion({
            id: questionId,
            body: {
                revision_id: this.revisionId,
                question: name
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        },  response => {


            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    async updateAnswerForQuestion(answerId, name, handle, afterError) {
        await ApiService.updateAnswer({
            id: answerId,
            body: {
                question_id: this.revisionId,
                answer: name
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        },  response => {


            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    async createAnswerForQuestion(name, status, handle, afterError) {
        await ApiService.createAnswer({
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
        }, async data => {
            if (handle !== undefined) {
                await handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    updateStatusRevision(handle, afterError) {
        ApiService.updateStatusRevision({
            id: this.revisionId,
            body: {
                status: 1
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

    loadPersonAnswers(id, personId, handle, afterError) {
        ApiService.getAnswers({
            body: {
                question_id: id,
                person_id: personId,
                max_depth: 3,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            const tmp = response.data.map(answer => Object({
                resource_id: answer.resource_id,
                value: answer.answer,
                is_right: answer.is_right,
                question_id: id,
                is_person_answer: answer.is_person_answer,
            }));

            this.answers = [...this.answers, ...tmp];

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

PollAddStore = decorate(PollAddStore, {
    poll: observable,
    pollList: observable,
    questions: observable,
    answers: observable,
    pollPageNumber: observable,
    pollCurrentPage: observable,
    pollPageCount: observable,
    addQuestion: action,
    addAnswer: action,
    removeQuestion: action,
    getAnswer: action,
    removeAnswer: action,
    loadPollList: action,
    loadPoll: action,
    loadQuestions: action,
    loadAnswers: action,
    createPoll: action,
    createQuestionForTest: action,
    createAnswerForQuestion: action,
    updateStatusRevision: action,
    updateQuestionForTest: action,
    updateAnswerForQuestion: action,
    loadPersonAnswers: action,
    deleteAnswer: action,
    deleteQuestion: action,

});

const pollAddStore = new PollAddStore();

export default pollAddStore;
