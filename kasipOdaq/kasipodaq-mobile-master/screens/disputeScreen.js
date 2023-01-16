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
import { format } from "date-fns";

class DisputeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disputes: [],
            disputeInfo: {},
            disputeIndex: null,
            expanded: false,
            isLoading: false,
            refreshing: false,
            tab: 1,
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

        this.expand = this.expand.bind(this)
    }

    closeControlPanel = () => {
        this._drawer.close();
    }

    openControlPanel = () => {
        this._drawer.open();
    }

    componentDidMount = () => {
        this.loadDispute(data => this.setState({disputes: data, isLoading: false}))
    }

    loadDispute = (then) => {
        this.setState({isLoading: true})
        try {
            AsyncStorage.getItem("token").then(token => {
                fetch(`https://api.kasipodaq.org/api/v1/disputes/?self=1&category_id=${this.props.route.params.id}`, {
                    headers: {
                        "Authorization": token
                    }
                }).then(response => response.json())
                    .then(data => then(data));
            });
        } catch(error) {
            alert(error);
        }
    }

    loadInfo = () => {
      this.setState({ tab: 2, isLoading: true })
      try {
          AsyncStorage.getItem("token").then(token => {
            fetch(`https://api.kasipodaq.org/api/v1/articles/?key=dispute&parent_articles=1&type_id=${this.props.route.params.id}`, {
              headers: {
                  "Authorization": token
              }
            }).then(response => response.json())
              .then(data => this.setState({disputeInfo: data[0], isLoading: false}));
          });
      } catch(error) {
          alert(error);
      }
    }

    refreshScreen = () => {
        this.setState({refreshing: true, isLoading: true});
        this.loadDispute(data => this.setState({disputes: data, refreshing: false, isLoading: false}));
    }

    expand = (disputeId) => {
        this.setState({
            disputeIndex: disputeId
        }, () => {
            this.setState({ expanded: !this.state.expanded })
        })
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
                                      onPress={() => this.setState({ tab: 1 })}
                                >
                                    Споры
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
                                      onPress={this.loadInfo}
                                >
                                    Информация
                                </Text>
                            </View>

                            {
                                this.state.tab == 1 &&
                                <View style={{
                                    padding: 16,
                                    minHeight: 300,
                                }}>
                                {
                                  this.state.disputes.map((dispute, index) => {
                                    return <TouchableOpacity style={{
                                        marginBottom: 24,
                                        paddingBottom: 24,
                                        borderRadius: 8,
                                        borderColor: "#E4E8F0",
                                        borderWidth: 1,
                                        minHeight: 180,
                                    }}
                                     onPress={() => this.expand(dispute.resource_id) }
                                    >
                                        <View style={{
                                            minHeight: 64,
                                            backgroundColor: "#EFF1F5",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            paddingVertical: 8,
                                            paddingHorizontal: 16,
                                        }}>
                                            <View style={{

                                            }}>
                                                <Text style={{
                                                    fontSize: 18,
                                                    fontWeight: "500",
                                                    lineHeight: 24,
                                                    color: "#2E384D",
                                                }}>
                                                    { dispute.title }
                                                </Text>
                                                <View style={{
                                                    flexDirection: "row",
                                                    marginTop: 4,
                                                }}>
                                                    <Text style={{ marginRight: 8 }}>Начало: { format(new Date(dispute.start_date), "dd.MM.yyyy") }</Text>
                                                    { dispute.finish_date &&
                                                    <Text>Конец: { format(new Date(dispute.finish_date), "dd.MM.yyyy") }</Text>
                                                    }
                                                </View>
                                            </View>
                                            {
                                                dispute.solution !== "" &&
                                                <Image
                                                    source={!this.state.expanded ? require("../assets/bottom-icon.png") : require( "../assets/top-icon.png")}
                                                    style={{
                                                        width: 10,
                                                        height: 6
                                                    }}
                                                />
                                            }
                                        </View>

                                        <View style={{
                                            padding: 16
                                          }}>
                                          <AutoHeightWebView
                                            style={{ width: 300 }}
                                            source={{ html: dispute.thesis }}
                                            scalesPageToFit={true}
                                            scrollEnabled={false}
                                            viewportContent={'width=device-width, user-scalable=no'}
                                          />

                                        {
                                          dispute.solution !== "" &&
                                              this.state.disputeIndex == dispute.resource_id &&
                                              this.state.expanded &&
                                          <View>
                                          <Text style={{
                                              marginTop: 24,
                                              marginBottom: 8,
                                              fontSize: 18,
                                              fontWeight: "500",
                                              lineHeight: 24,
                                            }}>Решение</Text>
                                            <AutoHeightWebView
                                              style={{ width: 300 }}
                                              source={{ html: dispute.solution }}
                                              scalesPageToFit={true}
                                              scrollEnabled={false}
                                              viewportContent={'width=device-width, user-scalable=no'}
                                            />
                                        </View>
                                        }
                                        </View>
                                    </TouchableOpacity>
                                  })
                                }

                                </View>
                            }

                            {
                                this.state.tab == 2 &&
                                    <View style={{
                                        padding: 16,
                                    }}>
                                      <AutoHeightWebView
                                        style={{ width: 300 }}
                                        source={{ html: this.state.disputeInfo?.content }}
                                        scalesPageToFit={true}
                                        viewportContent={'width=device-width, user-scalable=no'}
                                      />
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

export default DisputeScreen;
