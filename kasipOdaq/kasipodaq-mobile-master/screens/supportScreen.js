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
    RefreshControl,
    Linking
} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";

import AutoHeightWebView from "react-native-autoheight-webview";
import { Dimensions } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {format} from "date-fns";

class SupportScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            isLoading: false,
            refreshing: false,
            appealIndex: null,
            expanded: false,
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

    loadRequests = (then) => {
        try {
            AsyncStorage.getItem("token").then(token => {
                AsyncStorage.getItem("union_id").then(unionId => {
                    fetch(`https://api.kasipodaq.org/api/v1/appeals/?union_id=${unionId}&type=0&self=1&max_depth=3`, {
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
        this.setState({isLoading: true})
        this.loadRequests(data => this.setState({requests: data, isLoading: false}))
    }

    refreshScreen = () => {
        this.setState({refreshing: true, isLoading: true});
        this.loadRequests(data => this.setState({requests: data, refreshing: false, isLoading: false}));
    }

    expand = (appealId) => {
        this.setState({
            appealIndex: appealId
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
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshScreen}/>}>
                    <View style={{backgroundColor: "#EFF1F5"}}>
                        <View style={styles.card}>
                            <View style={{
                                padding: 16,
                                minHeight: 300,
                            }}>
                                {/*{*/}
                                {/*    this.state.requests.map((request, index) => {*/}
                                {/*        return */}
                                {/*    })*/}
                                {/*}*/}

                                {
                                    this.state.requests.map((appeal, index) => {
                                        return <View style={{
                                            marginBottom: 24,
                                            paddingBottom: 24,
                                            borderBottomColor: "#E4E8F0",
                                            borderBottomWidth: 1,
                                        }}>
                                            <Text style={{
                                                fontSize: 18,
                                                fontWeight: "500",
                                                lineHeight: 24,
                                                color: "#2E384D",
                                                marginBottom: 8
                                            }}>
                                                {appeal.title}
                                            </Text>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: "400",
                                                lineHeight: 20,
                                                color: "#2E384D",
                                                marginBottom: 16
                                            }}>
                                                {format(new Date(appeal.created_date), "dd/mm/yyyy")}
                                            </Text>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight: "400",
                                                lineHeight: 24,
                                                color: "#2E384D"
                                            }}>
                                                {appeal.content}
                                            </Text>
                                            { appeal.files.map(file => {
                                                return <TouchableOpacity style={{
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    borderWidth: 1,
                                                    borderColor: "#E4E8F0",
                                                    marginTop: 10,
                                                    padding: 10,
                                                }}
                                                                         onPress={() => Linking.openURL(`${file.uri}`)}
                                                >
                                                    <Text>
                                                        { file.name }
                                                    </Text>
                                                    <Image
                                                        source={require("../assets/download_icon.png")}
                                                        style={{
                                                            width: 24,
                                                            height: 23
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            })
                                            }

                                            {
                                                !appeal.answer.content ?
                                                    <View style={{
                                                        display: "flex",
                                                        flex: 2,
                                                        flexDirection: "row",
                                                        justifyContent: "flex-start",
                                                        alignItems: "center",
                                                        width: "100%",
                                                        minHeight: 56,
                                                        borderBottomColor: "#E4E8F0",
                                                        borderBottomWidth: 1,
                                                        backgroundColor: "#EFF1F5",
                                                        marginTop: 24,
                                                        borderRadius: 4,
                                                    }}>
                                                        <Image
                                                            source={require("../assets/ticket_icon.png")}
                                                            style={{
                                                                width: 24,
                                                                height: 24,
                                                                marginLeft: 20,
                                                                marginRight: 12,
                                                            }}
                                                        />

                                                        <Text style={{
                                                            fontSize: 16,
                                                            lineHeight: 19,
                                                            color: "#9A9B9C",
                                                        }}>
                                                            Ответ:
                                                        </Text>
                                                        <Text style={{
                                                            marginLeft: 8,
                                                            fontSize: 16,
                                                            lineHeight: 21,
                                                            color: "#9A9B9C",
                                                        }}>
                                                            В обработке
                                                        </Text>
                                                    </View>
                                                    :
                                                    <View>
                                                        <TouchableOpacity style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            paddingRight: 16,
                                                            width: "100%",
                                                            minHeight: 56,
                                                            borderColor: "#E4E8F0",
                                                            borderWidth: 1,
                                                            backgroundColor: "#EFF1F5",
                                                            marginTop: 24,
                                                            borderRadius: 4,
                                                        }}
                                                                          onPress={() => this.expand(appeal.resource_id) }
                                                        >
                                                            <View style={{
                                                                flex: 2,
                                                                flexDirection: "row",
                                                                justifyContent: "flex-start",
                                                                alignItems: "center",
                                                            }}>
                                                                <Image
                                                                    source={require("../assets/ticket_icon.png")}
                                                                    style={{
                                                                        width: 24,
                                                                        height: 24,
                                                                        marginLeft: 20,
                                                                        marginRight: 12,
                                                                    }}
                                                                />
                                                                <Text style={{
                                                                    fontSize: 16,
                                                                    lineHeight: 19,
                                                                    color: "#9A9B9C",
                                                                }}>
                                                                    Ответ:
                                                                </Text>
                                                            </View>
                                                            <Image
                                                                source={!this.state.expanded ? require("../assets/bottom-icon.png") : require( "../assets/top-icon.png")}
                                                                style={{
                                                                    width: 10,
                                                                    height: 6
                                                                }}
                                                            />
                                                        </TouchableOpacity>

                                                        {
                                                            appeal.answer.content &&
                                                            this.state.appealIndex == appeal.resource_id &&
                                                            this.state.expanded &&
                                                            <View style={{
                                                                borderColor: "#E4E8F0",
                                                                borderWidth: 1,
                                                                padding: 5
                                                            }}>
                                                                <AutoHeightWebView
                                                                    source={{ html: appeal.answer.content }}
                                                                    scalesPageToFit={true}
                                                                    viewportContent={'width=device-width, user-scalable=no'}
                                                                />
                                                                { appeal.answer.files.map(file => {
                                                                    return <TouchableOpacity style={{
                                                                        flexDirection: "row",
                                                                        justifyContent: "space-between",
                                                                        borderWidth: 1,
                                                                        borderColor: "#E4E8F0",
                                                                        marginTop: 10,
                                                                        padding: 10,
                                                                    }}
                                                                                             onPress={() => Linking.openURL(`${file.uri}`)}
                                                                    >
                                                                        <Text>
                                                                            { file.name }
                                                                        </Text>
                                                                        <Image
                                                                            source={require("../assets/download_icon.png")}
                                                                            style={{
                                                                                width: 24,
                                                                                height: 23
                                                                            }}
                                                                        />
                                                                    </TouchableOpacity>
                                                                })
                                                                }
                                                            </View>
                                                        }

                                                    </View>
                                            }
                                        </View>
                                    })
                                }
                            </View>

                            <TouchableOpacity style={{
                                width: "94%",
                                height: 44,
                                marginLeft: 10,
                                backgroundColor: "#002F6C",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                color: "#ffffff",
                                bottom: 20,
                            }}
                              onPress = {() => this.props.navigation.navigate("createRequestTicket", {id: 0})}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    lineHeight: 18,
                                    color: "#ffffff",
                                }}
                                >
                                    Подать обращение
                                </Text>
                            </TouchableOpacity>
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

export default SupportScreen;
