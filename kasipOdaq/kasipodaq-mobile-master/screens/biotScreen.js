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

class BiotScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            biot: [],
            tab: 1,
            articles: [],
            council: [],
            isLoading: false,
            refreshing: false,
        }
        this.loadCouncil = this.loadCouncil.bind(this)

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

    componentDidMount = () => {
        this.loadBiot(data => this.setState({articles: data, isLoading: false}))
    }

    loadBiot = (then) => {
        this.setState({isLoading: true})

        AsyncStorage.getItem("union_id").then(unionId => {
            fetch(`https://api.kasipodaq.org/api/v1/articles/?key=biot&parent_articles=1&union_id=${unionId}`)
                .then(response => response.json())
                .then(data => then(data));
        });
    }

    loadCouncil = () => {
        this.setState({ tab: 2 })

        this.setState({isLoading: true})

        AsyncStorage.getItem("union_id").then(unionId => {
            fetch(`https://api.kasipodaq.org/api/v1/articles/?key=council&parent_articles=1&union_id=${unionId}`)
                .then(response => response.json())
                .then(data => this.setState({council: data, isLoading: false}));
        });

    }

    refreshScreen = () => {
        this.setState({refreshing: true});
        this.loadBiot(data => this.setState({articles: data, refreshing: false, isLoading: false}));
    }

    closeControlPanel = () => {
        this._drawer.close();
    }

    openControlPanel = () => {
        this._drawer.open();
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
                    <View style={{backgroundColor: "#EFF1F5" }}>
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
                                    Охрана труда
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
                                      onPress={this.loadCouncil}
                                >
                                    Совет
                                </Text>
                            </View>

                            {
                                this.state.tab == 1 &&
                                <View style={{
                                    padding: 16,
                                    minHeight: 180,
                                }}>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingVertical: 16,
                                        marginBottom: 16,
                                        borderBottomColor: "#E4E8F0",
                                        borderBottomWidth: 1,
                                        borderTopColor: "#E4E8F0",
                                        borderTopWidth: 1,
                                    }}>
                                        <TouchableOpacity onPress = {() => this.props.navigation.navigate("biotOrder")} >
                                            <Text style={{
                                                color: "#2E384D",
                                                fontSize: 16,
                                                lineHeight: 24,
                                            }}>
                                                Приказы
                                            </Text>
                                        </TouchableOpacity>
                                        <Image
                                            source={require("../assets/right_icon.png")}
                                            style={{
                                                width: 4,
                                                height: 8,
                                            }}>
                                        </Image>
                                    </View>
                                    {
                                      this.state.articles.map(article => {
                                        return <AutoHeightWebView
                                          source={{ html: article.content }}
                                          scalesPageToFit={true}
                                          style={{width: "100%"}}
                                          viewportContent={'width=device-width, user-scalable=no'}
                                        />
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
                                        this.state.council.map(council => {
                                            return <AutoHeightWebView
                                                source={{ html: council.content }}
                                                scalesPageToFit={true}
                                                style={{width: "100%", borderBottomWidth: 1, borderBottomColor: "#c4c4c4"}}
                                                viewportContent={'width=device-width, user-scalable=no'}
                                            />
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

export default BiotScreen;
