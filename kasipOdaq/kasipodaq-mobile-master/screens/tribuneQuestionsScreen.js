import React from "react";

import {
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    AsyncStorage,
    StyleSheet,
    TouchableHighlight,
    Alert
} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import AutoHeightWebView from "react-native-autoheight-webview";
import Spinner from "react-native-loading-spinner-overlay";

const VOTE_RESOURCE_ID = 83;
const TEST_RESOURCE_ID = 84;

class TribuneQuestionsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            answeredList: [],
            answers: [],
            pageNumber: 1,
            currentAnswer: null,
            isLastQuestion: false,
            isLoading: false
        }

        AsyncStorage.getItem("token").then(token => {
          if (token != null) {
            this.props.navigation.setOptions({ headerRight: () => <TouchableOpacity onPress={() => this.props.navigation.navigate("notifications")}>
              <Image
                source={require("../assets/ring.png")}
                style={{width: 24, height: 24, marginRight: 16}}>
              </Image>
            </TouchableOpacity> });
          }
        });
    }

    closeControlPanel = () => {
        this._drawer.close();
    }

    openControlPanel = () => {
        this._drawer.open();
    }

    loadQuestions = id => {
      this.setState({isLoading: true});

      try {
          AsyncStorage.getItem("token").then(token => {
            AsyncStorage.getItem("union_id").then(async unionId => {
              const response = await fetch(`https://api.kasipodaq.org/api/v1/questions/?revision_id=${id}&max_depth=3&page_number=${this.state.pageNumber}&count=1`, {
                headers: {
                    "Authorization": token
                }
              });

              response.json().then(questions => {
                  fetch(`https://api.kasipodaq.org/api/v1/answers/?question_id=${questions[0].resource_id}&max_depth=3&person_id=2518`, {
                    headers: {
                        "Authorization": token
                    }
                  }).then(response => response.json())
                    .then(answers => this.setState({
                      questions: questions,
                      answers: answers,
                      isLoading: false,
                      pageNumber: this.state.pageNumber + 1
                    }));
                });

                const pageCount = response.headers.map["x-pagination-page-count"];
                const currentPage = response.headers.map["x-pagination-current-page"];

                if (currentPage == pageCount) {
                  this.setState({isLastQuestion: true});
                }
            });
          });
      } catch(error) {
          alert(error);
      }
    }

    nextQuestion = () => {
      let answeredList = this.state.answeredList;
      answeredList.push(this.state.currentAnswer);

      this.setState({answeredList: answeredList}, () => this.loadQuestions(this.props.route.params.revision.resource_id));
    }

    answerRevision = async () => {
      this.setState({isLoading: true});

      try {
          await AsyncStorage.getItem("token").then(async token => {
            await fetch(`https://api.kasipodaq.org/api/v1/finish_revision`, {
              method: "POST",
              headers: {
                  "Authorization": token,
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                revision_id: this.props.route.params.revision.resource_id
              })
            }).then(response => {
              this.setState({isLoading: false});

              this.props.navigation.navigate("tribuneRevisionResult", {revision: this.props.route.params.revision});
            });
          });
      } catch(error) {
          alert(error);
      }
    }

    answerQuestion = async id => {
      this.setState({isLoading: true});

      try {
          await AsyncStorage.getItem("token").then(async token => {
            await fetch(`https://api.kasipodaq.org/api/v1/person_answers/`, {
              method: "POST",
              headers: {
                  "Authorization": token,
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                answer_id: id
              })
            }).then(response => this.setState({isLoading: false}));
          });
      } catch(error) {
          alert(error);
      }
    }

    finishRevision = () => {
      let answeredList = this.state.answeredList;
      answeredList.push(this.state.currentAnswer);

      this.setState({answeredList: answeredList}, async () => {
        for (let answerId of this.state.answeredList) {
            await this.answerQuestion(answerId);
        }

        this.answerRevision();
      });
    }

    componentDidMount = () => {
      this.loadQuestions(this.props.route.params.revision.resource_id);
    }

    render = () => {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                openDrawerOffset={0.2}
                tapToClose={true}
                content={<NavigationMenu {...this.props}/>}
            >
            <Spinner
              visible={this.state.isLoading}
            />
                <ScrollView>
                    <View style={{backgroundColor: "#EFF1F5", flex: 1 }}>
                        <View style={styles.card}>

                            <View style={{
                                padding: 16,
                                minHeight: 180,
                            }}>
                                <View style={{
                                    alignItems: "center",
                                    paddingBottom: 24,
                                    borderBottomColor: "#E4E8F0",
                                    borderBottomWidth: 1
                                }}>
                                    <Text style={{
                                        color: "#2F394E",
                                        fontSize: 20,
                                        lineHeight: 24,
                                        marginBottom: 16,
                                    }}>{this.props.route.params.revision.name}</Text>
                                  {
                                    this.state.questions.length > 0 &&
                                      <Text style={{
                                          color: "#2F394E",
                                          fontSize: 16,
                                          lineHeight: 24,
                                      }}>{this.state.questions[0].question}</Text>
                                  }
                                </View>
                                {
                                  this.state.answers.map(answer => {
                                    return <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingVertical: 16,
                                        borderBottomColor: "#E4E8F0",
                                        borderBottomWidth: 1,
                                    }}>
                                      {
                                        this.state.currentAnswer == answer.resource_id ?
                                        <>
                                        <TouchableOpacity>
                                            <Text style={{
                                                color: "#00AEEF",
                                                fontSize: 16,
                                                lineHeight: 24,
                                            }}>{answer.answer}</Text>
                                        </TouchableOpacity>
                                        <Image
                                            source={require("../assets/checked.png")}
                                            style={{
                                                width: 13,
                                                height: 10,
                                            }}>
                                        </Image>
                                        </>
                                        :
                                        <TouchableOpacity onPress={() => this.setState({currentAnswer: answer.resource_id})}>
                                            <Text style={{
                                                color: "#2E384D",
                                                fontSize: 16,
                                                lineHeight: 24,
                                            }}>{answer.answer}</Text>
                                        </TouchableOpacity>
                                      }
                                    </View>
                                  })
                                }
                            </View>

                            <View style={{ marginTop: 24, alignItems: "center" }}>
                              {
                                this.state.isLastQuestion ?
                                <TouchableHighlight style={styles.saveButton} onPress={this.finishRevision} underlayColor="#00AEEF">
                                    <Text style={{color: '#ffffff', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Завершить {this.props.route.params.revision.type.resource_id == TEST_RESOURCE_ID ? "тест" : "опрос"}</Text>
                                </TouchableHighlight>
                                :
                                <TouchableHighlight style={styles.saveButton} onPress={this.nextQuestion} underlayColor="#00AEEF">
                                    <Text style={{color: '#ffffff', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Ответить</Text>
                                </TouchableHighlight>
                              }
                            </View>

                        </View>
                    </View>
                </ScrollView>
                <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel}/>
            </Drawer>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffff",
        flex: 1,
        minHeight: 520,
        margin: 24,
        borderRadius: 8,
        shadowColor: "#000000",
        shadowOpacity: 0.24,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        position: "relative",
    },
    saveButton: {
        backgroundColor: "#00AEEF",
        borderRadius: 4,
        width: 247,
        height: 44,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    }
});

export default TribuneQuestionsScreen;
