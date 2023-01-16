import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class PollStore {
    pollList = [];
    pollArchiveList = [];
    poll = {};
    questions = [];
    answers = [];
    comments = [];

    testPageNumber = 1;
    testCurrentPage = 1;
    testPageCount = 1;

    pollArchivePageNumber = 1;
    pollArchiveCurrentPage = 1;
    pollArchivePageCount = 1;

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

    loadPollList(id, search, handle, afterError) {
        let body = {}

        if (search !== null && search !== ''){
            body.search = search;
            body.union_id = id;
        }else{
            body = {
                union_id: id,
                max_depth: 3,
                page_number: this.testPageNumber,
                type_id: 83,
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

    loadPollArchiveList(id, handle, afterError) {
        ApiService.getTestList({
            body: {
                union_id: id,
                max_depth: 3,
                page_number: this.pollArchivePageNumber,
                type_id: 84,
                is_archive: 1,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.pollArchiveList = response.data;
            this.pollArchiveCurrentPage = response.headers['x-pagination-current-page'];
            this.pollArchivePageCount = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadPoll(id, handle, afterError) {
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
            this.poll = response.data

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
                total_responded: answer.total_responded,
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

    createPoll(title, start_date, finish_date, handle, afterError) {

        let body = {
            type_id: 84,
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

    async editTest(title, startDate, finishDate, status, handle, afterError) {
        await ApiService.editTest({
            id: this.poll.resource_id,
            body: {
                name: title,
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

    deletePoll(id, handle, afterError) {
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

    async updateQuestionForTest(questionId, name, alternativeAnswer, handle, afterError) {
        await ApiService.updateQuestion({
            id: questionId,
            body: {
                revision_id: this.revisionId,
                question: name,
                has_alternate_answer: alternativeAnswer,
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

    getColorArray(colorNum) {
        let colors = [
            '#2471A3',
            '#3498DB',
            '#BA4A00',
            '#CA6F1E',
            '#D68910',
            '#D4AC0D',
            '#7D3C98',
            '#884EA0',
            '#CB4335',
            '#A93226',
            '#17A589',
            '#138D75',
            '#229954',
            '#28B463',
            '#D0D3D4',
            '#273746',
            '#707B7C',
        ];
        let tmpNumber = colorNum;
        let repeatedColors = [];
        // defines whether we need to slice an array or add colors into it
        const deleteCount = colorNum > colors.length ? 0 : colors.length;

        // if requested colors number is bigger than colors which we have we repeat the colors in output array
        while (tmpNumber > colors.length) {
            repeatedColors = repeatedColors.concat(colors.slice(0, tmpNumber - colors.length));
            tmpNumber -= colors.length;
        }

        colors.splice(colorNum, deleteCount, ...repeatedColors);

        return colors;
    }

    getQuestionData(question_id) {
        let questionData = {
            resource_id: question_id,
            answers: [],
        };

        questionData.answers = this.answers.filter(answer => {
            return answer.question_id === question_id
        });

        const colors = this.getColorArray(questionData.answers.length);

        questionData.answers = questionData.answers.map((answer, index) => {

            answer.color = colors[index];
            return answer;
        });

        return questionData;
    }

    getDoughnutQuestionData(questionData) {
        const labels = questionData.answers.map(answer => {
            return answer.value;
        });
        const data = questionData.answers.map(answer => {
            return answer.total_responded;
        });
        const colors = questionData.answers.map(answer => {
            return answer.color;
        });

        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                hoverBackgroundColor:colors,
            }]
        };
    }

    loadCommentForQuestion(id, handle, afterError){
        ApiService.getCommentsForQuestion({
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
            this.comments = response.data;

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

PollStore = decorate(PollStore, {
    poll: observable,
    pollList: observable,
    comments: observable,
    pollArchiveList: observable,
    questions: observable,
    answers: observable,
    testPageNumber: observable,
    testCurrentPage: observable,
    testPageCount: observable,
    pollArchivePageNumber: observable,
    pollArchiveCurrentPage: observable,
    pollArchivePageCount: observable,
    addQuestion: action,
    addAnswer: action,
    removeQuestion: action,
    getAnswer: action,
    removeAnswer: action,
    loadPollList: action,
    loadPoll: action,
    loadQuestions: action,
    loadAnswers: action,
    createTest: action,
    createQuestionForTest: action,
    createAnswerForQuestion: action,
    updateStatusRevision: action,
    updateQuestionForTest: action,
    updateAnswerForQuestion: action,
    loadPersonAnswers: action,
    deletePoll: action,
    deleteAnswer: action,
    deleteQuestion: action,
    getQuestionData: action,
    loadPollArchiveList: action,
    loadCommentForQuestion: action,

});

const pollStore = new PollStore();

export default pollStore;
