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
    RefreshControl
} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import AutoHeightWebView from "react-native-autoheight-webview";
import Spinner from "react-native-loading-spinner-overlay";

class TribuneScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            revisions: [],
            tab: 1,
            isLoading: false,
            refreshing: false,
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

    loadCurrentRevisions = (then) => {
      this.setState({isLoading: true});

      try {
          AsyncStorage.getItem("token").then(async token => {
            AsyncStorage.getItem("union_id").then(unionId => {
              fetch(`https://api.kasipodaq.org/api/v1/revisions/?union_id=${unionId}&max_depth=3&is_answered=0&page_number=1`, {
                headers: {
                    "Authorization": token
                }
              }).then(response => response.json())
                .then(data => then(data));
            });
          });
      } catch(error) {
          alert(error);
      }
    }

    loadAnsweredRevisions = (then) => {
      this.setState({isLoading: true});

      try {
          AsyncStorage.getItem("token").then(async token => {
            AsyncStorage.getItem("union_id").then(unionId => {
              fetch(`https://api.kasipodaq.org/api/v1/revisions/?union_id=${unionId}&max_depth=3&is_answered=1&page_number=1`, {
                headers: {
                    "Authorization": token
                }
              }).then(response => response.json())
                .then(data => then(data));
            });
          });
      } catch(error) {
          alert(error);
      }
    }

    componentDidMount = () => {
      this.loadCurrentRevisions(data => this.setState({revisions: data, isLoading: false}));
    }

    onTabPress = tabIndex => {
      if (tabIndex == 1) {
        this.loadCurrentRevisions(data => this.setState({revisions: data, isLoading: false}));
      } else if (tabIndex == 2) {
        this.loadAnsweredRevisions(data => this.setState({revisions: data, isLoading: false}));
      }
      this.setState({tab: tabIndex})
    }

    onRevisionPress = (revision, answered) => {
      if (answered) {
        this.props.navigation.navigate("tribuneAnswered", {revision: revision});
      } else {
        this.props.navigation.navigate("tribuneQuestions", {revision: revision});
      }
    }

    refreshScreen = () => {
        this.setState({refreshing: true, isLoading: true});
        if (this.state.tab == 1) {
            this.loadCurrentRevisions(data => this.setState({revisions: data, refreshing: false, isLoading: false}));
        } else if (this.state.tab == 2) {
            this.loadAnsweredRevisions(data => this.setState({revisions: data, refreshing: false, isLoading: false}));
        }
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
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshScreen}/>} >
                    <View style={{backgroundColor: "#EFF1F5", flex: 1 }}>
                        <View style={styles.card}>

                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 16,
                                marginTop: 16,
                            }}>
                                <Text style={{
                                    height: 32,
                                    paddingVertical: 6,
                                    paddingHorizontal: 35,
                                    borderTopLeftRadius: 4,
                                    borderBottomLeftRadius: 4,
                                    borderColor: "#00AEEF",
                                    borderWidth: 1,
                                    backgroundColor: this.state.tab == 1 ? "#00AEEF" : "transparent",
                                    color: this.state.tab == 1 ? "#ffffff" : "#2E384D",
                                }}
                                      onPress={() => this.onTabPress(1)}
                                >
                                    Текущие
                                </Text>
                                <Text style={{
                                    height: 32,
                                    paddingVertical: 6,
                                    paddingHorizontal: 35,
                                    borderTopRightRadius: 4,
                                    borderBottomRightRadius: 4,
                                    borderColor: "#00AEEF",
                                    borderWidth: 1,
                                    backgroundColor: this.state.tab == 2 ? "#00AEEF" : "transparent",
                                    color: this.state.tab == 2 ? "#ffffff" : "#2E384D",
                                }}
                                      onPress={() => this.onTabPress(2)}
                                >
                                    Отвеченные
                                </Text>
                            </View>

                            {
                                this.state.tab == 1 &&
                                <View style={{
                                    padding: 16,
                                    minHeight: 180,
                                }}>
                                  {
                                    this.state.revisions.map(revision => {
                                      return <View style={{
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          paddingVertical: 16,
                                          borderBottomColor: "#E4E8F0",
                                          borderBottomWidth: 1,
                                      }}>
                                          <TouchableOpacity onPress = {() => this.onRevisionPress(revision, false) } >
                                              <Text style={{
                                                  color: "#2E384D",
                                                  fontSize: 16,
                                                  lineHeight: 24,
                                              }}>{revision.name}</Text>
                                          </TouchableOpacity>
                                          <Image
                                              source={require("../assets/right_icon.png")}
                                              style={{
                                                  width: 4,
                                                  height: 8,
                                              }}>
                                          </Image>
                                      </View>
                                    })
                                  }

                                </View>
                            }

                            {
                                this.state.tab == 2 &&
                                <View style={{
                                    padding: 16,
                                    minHeight: 180,
                                }}>
                                {
                                  this.state.revisions.map(revision => {
                                    return <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingVertical: 16,
                                        borderBottomColor: "#E4E8F0",
                                        borderBottomWidth: 1,
                                    }}>
                                        <TouchableOpacity onPress = {() => this.onRevisionPress(revision, true) }>
                                            <Text style={{
                                                color: "#2E384D",
                                                fontSize: 16,
                                                lineHeight: 24,
                                            }}>{revision.name}</Text>
                                        </TouchableOpacity>
                                        <Image
                                            source={require("../assets/right_icon.png")}
                                            style={{
                                                width: 4,
                                                height: 8,
                                            }}>
                                        </Image>
                                    </View>
                                  })
                                }

                                </View>
                            }

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
    }
});

export default TribuneScreen;
