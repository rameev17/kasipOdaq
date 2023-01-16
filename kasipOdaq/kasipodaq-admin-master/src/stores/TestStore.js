import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class TestStore {
    testList = [];
    testArchiveList = [];
    test = {};
    questions = [];
    answers = [];

    testPageNumber = 1;
    testCurrentPage = 1;
    testPageCount = 1;

    testArchivePageNumber = 1;
    testArchiveCurrentPage = 1;
    testArchivePageCount = 1;

    addQuestion() {
        this.questions.push({value: '', is_new: true, index: this.questions.length})
    }

    removeQuestion(question, index) {
        if (question.is_new) {
          const answers = this.answers.filter(answer => answer.questionIndex == index)

          answers.forEach(answer => {
            this.removeAnswer(answer, question, index)
          })

          this.questions.splice(index, 1)
        } else {
          this.deleteQuestion(question.resource_id, () => {
            this.questions.splice(index, 1);

            const answers = this.answers.filter(answer => answer.question_id == question.resource_id);

            answers.forEach(answer => {
              this.removeAnswer(answer, question, index)
            })
          })
        }
    }

    addAnswer(questionIndex, questionId) {
        const answersLength = this.answers.filter(answer => answer.questionIndex == questionIndex).length

        if (answersLength < 10){
            this.answers.push({value: '', question_id: questionId, questionIndex: questionIndex, index: answersLength, status: 0, is_new: true})
        }
    }

    getAnswer(questionIndex, index, newQuestion, answerId) {
        const answerIndex = this.answers.findIndex(answer => {
            return newQuestion ? (answer.index == index && answer.questionIndex == questionIndex) : answer.resource_id == answerId
        })

        return this.answers[answerIndex];
    }

    getNewAnswerByQuestionId(question_id, index) {
        const answerIndex = this.answers.findIndex(answer => {
            return answer.question_id == question_id && answer.index == index
        })

        return this.answers[answerIndex]
    }

    removeAnswer(currentAnswer, question, questionIndex) {
        if (currentAnswer.is_new) {
          const answerIndex = this.answers.findIndex(answer => {
              return answer.questionIndex == questionIndex && answer.index == currentAnswer.index
          })

          this.answers.splice(answerIndex, 1)
        } else {
          this.deleteAnswer(currentAnswer.resource_id, () => {
            const answerIndex = this.answers.findIndex(answer => {
                return answer.resource_id == currentAnswer.resource_id
            })

            this.answers.splice(answerIndex, 1)
          })
        }
    }

    loadTestList(id, search, handle, afterError) {
        let body = {}

        if (search !== null && search !== ''){
            body.search = search;
            body.union_id = id
        }else{
            body = {
                union_id: id,
                max_depth: 3,
                page_number: this.testPageNumber,
                type_id: 84,
            }
        }

        ApiService.getTestList({
            body: body,
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

    loadTestArchiveList(id, handle, afterError) {
        ApiService.getTestList({
            body: {
                union_id: id,
                max_depth: 3,
                page_number: this.testArchivePageNumber,
                type_id: 84,
                is_archive: 1,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.testArchiveList = response.data;
            this.testArchiveCurrentPage = response.headers['x-pagination-current-page'];
            this.testArchivePageCount = response.headers['x-pagination-page-count'];

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
            this.answers = this.answers.concat(response.data.map(answer => Object({
                resource_id: answer.resource_id,
                value: answer.answer,
                is_right: answer.is_right,
                status: answer.is_right,
                question_id: id,
                is_new: false
            })));

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    createTest(title, percent, start_date, finish_date, handle, afterError) {

        let body = {
            type_id: 84,
            name: title,
            percent_threshold: percent,
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

    async editTest(title, percent, startDate, finishDate, status, handle, afterError) {
        await ApiService.editTest({
            id: this.test.resource_id,
            body: {
                name: title,
                percent_threshold: percent,
                start_date: startDate,
                finish_date: finishDate,
                status: status ? 1 : 0
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

    async createQuestionForTest(name, handle, afterError) {
        await ApiService.createQuestion({
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
            this.questionId = response.headers['x-entity-id']

            if (handle !== undefined) {
                 handle(response.data, response.headers)
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
        },  async response => {


            if (handle !== undefined) {
                await handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    async updateAnswerForQuestion(answerId, name, isRight, handle, afterError) {
        await ApiService.updateAnswer({
            id: answerId,
            body: {
                answer: name,
                is_right: isRight ? 1 : 0
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

    async createAnswerForQuestion(name, questionId, status, handle, afterError) {
        await ApiService.createAnswer({
            body: {
                question_id: questionId,
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

TestStore = decorate(TestStore, {
    test: observable,
    testList: observable,
    testArchiveList: observable,
    questions: observable,
    answers: observable,
    testPageNumber: observable,
    testCurrentPage: observable,
    testPageCount: observable,
    addQuestion: action,
    addAnswer: action,
    removeQuestion: action,
    getAnswer: action,
    removeAnswer: action,
    loadTestList: action,
    loadTest: action,
    loadQuestions: action,
    loadAnswers: action,
    createTest: action,
    createQuestionForTest: action,
    createAnswerForQuestion: action,
    updateStatusRevision: action,
    updateQuestionForTest: action,
    updateAnswerForQuestion: action,
    loadPersonAnswers: action,
    deleteTest: action,
    deleteAnswer: action,
    deleteQuestion: action,
    loadTestArchiveList: action,

});

const testStore = new TestStore();

export default testStore;
