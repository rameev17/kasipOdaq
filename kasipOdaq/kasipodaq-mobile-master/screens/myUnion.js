import React, { Component } from 'react';
import {
    AsyncStorage,
    Image,
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View,
    Linking, RefreshControl,
} from 'react-native';
import Drawer from "react-native-drawer";
import NavigationMenu from "./navigationMenu";
import SideMenu from "react-native-side-menu/index";
import BottomMenu from "../components/bottomMenu";
import AutoHeightWebView from "react-native-autoheight-webview";
import Spinner from "react-native-loading-spinner-overlay";

class MyUnion extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            unionInfo: [],
            tab: 1,
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

    componentDidMount = () => {
      this.loadInfo(data => this.setState({unionInfo: data, isLoading: false}))
    }

    loadInfo = (then) => {
        this.setState({isLoading: true})
        try {
            AsyncStorage.getItem("token").then(token => {
                fetch("https://api.kasipodaq.org/api/v1/self_union", {
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

    refreshScreen = () => {
        this.setState({refreshing: true, isLoading: true});
        this.loadInfo(data => this.setState({unionInfo: data, refreshing: false, isLoading: false}));
    }

    render = () => {
        return (
            <>
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
                        <View style={styles.card}>
                            <View style={{ paddingLeft: 16, paddingRight: 16 }}>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 16,
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
                                        О профсоюзе
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
                                          onPress={() => this.setState({ tab: 2 })}
                                    >
                                        О компании
                                    </Text>
                                </View>

                                {
                                    this.state.tab == 1 &&
                                    <>
                                        <View style={{
                                            marginBottom: 24,
                                        }}>
                                            { this.state.unionInfo.agreement &&
                                            <View style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingVertical: 16,
                                                borderBottomColor: "#E4E8F0",
                                                borderBottomWidth: 1
                                            }}>
                                                <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.agreement.uri}`)}>
                                                    <Text style={{
                                                        color: "#01579B",
                                                        fontSize: 16,
                                                        lineHeight: 24,
                                                    }}>
                                                        { this.state.unionInfo.agreement ? this.state.unionInfo.agreement.name : "Коллективный договор" }
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.agreement.uri}`)}>
                                                    <Image
                                                        source={require("../assets/download_icon.png")}
                                                        style={{
                                                            width: 24,
                                                            height: 23,
                                                        }} />
                                                </TouchableOpacity>
                                            </View>
                                            }

                                            {
                                                this.state.unionInfo.position &&
                                                <View style={{
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    paddingVertical: 16,
                                                    borderBottomColor: "#E4E8F0",
                                                    borderBottomWidth: 1
                                                }}>
                                                    <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.position.uri}`)}>
                                                        <Text style={{
                                                            color: "#01579B",
                                                            fontSize: 16,
                                                            lineHeight: 24,
                                                        }}>
                                                            { this.state.unionInfo.position ? this.state.unionInfo.position.name : "Положение" }
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.position.uri}`)}>
                                                        <Image
                                                            source={require("../assets/download_icon.png")}
                                                            style={{
                                                                width: 24,
                                                                height: 23,
                                                            }} />
                                                    </TouchableOpacity>
                                                </View>
                                            }

                                            { this.state.unionInfo.protocol &&
                                            <View style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingVertical: 16,
                                                borderBottomColor: "#E4E8F0",
                                                borderBottomWidth: 1
                                            }}>
                                                <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.protocol.uri}`)}>
                                                    <Text style={{
                                                        color: "#01579B",
                                                        fontSize: 16,
                                                        lineHeight: 24,
                                                    }}>
                                                        { this.state.unionInfo.protocol ? this.state.unionInfo.protocol.name : "Протокол" }
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.protocol.uri}`)}>
                                                    <Image
                                                        source={require("../assets/download_icon.png")}
                                                        style={{
                                                            width: 24,
                                                            height: 23,
                                                        }} />
                                                </TouchableOpacity>
                                            </View>
                                            }

                                            <View style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingVertical: 16,
                                                borderBottomColor: "#E4E8F0",
                                                borderBottomWidth: 1
                                            }}>
                                                <TouchableOpacity onPress = {() => this.props.navigation.navigate("myUnionApplication")}>
                                                    <Text style={{
                                                        color: "#01579B",
                                                        fontSize: 16,
                                                        lineHeight: 24,
                                                    }}>
                                                         Образцы Заявлений
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress = {() => this.props.navigation.navigate("myUnionApplication")}>
                                                <Image
                                                    source={require("../assets/right_icon.png")}
                                                    style={{
                                                        marginRight: 10,
                                                        width: 4,
                                                        height: 8,
                                                    }} />
                                                </TouchableOpacity>
                                            </View>

                                        </View>

                                        <View style={{
                                            alignItems: "center"
                                          }}>
                                          <Text style={{
                                              textAlign: "center",
                                              fontSize: 20,
                                              lineHeight: 24,
                                              marginBottom: 16,

                                            }}>
                                            { this.state.unionInfo.name }
                                          </Text>
                                            <AutoHeightWebView
                                              style={{ width: 300 }}
                                              source={{ html: this.state.unionInfo.about_union }}
                                              scalesPageToFit={true}
                                              viewportContent={'width=device-width, user-scalable=no'}
                                            />
                                        </View>
                                    </>
                                }

                                {
                                    this.state.tab == 2 &&
                                    <View style={{
                                        alignItems: "center"
                                      }}>
                                      <Image
                                          source={{ uri: this.state.unionInfo.picture?.uri }}
                                          style={{
                                              width: 72,
                                              height: 72,
                                              marginTop: 18,
                                              marginBottom: 18,
                                          }}
                                      />
                                    <Text>
                                      {this.state.unionInfo.name}
                                    </Text>
                                        <AutoHeightWebView
                                          style={{ width: 300, marginTop: 8 }}
                                          source={{ html: this.state.unionInfo.about_company }}
                                          scalesPageToFit={true}
                                          viewportContent={'width=device-width, user-scalable=no'}
                                        />
                                    </View>
                                }
                            </View>
                        </View>

                    </ScrollView>
                    <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel} activeTab={"myUnion"}/>
                </Drawer>
            </>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffff",
        flex: 1,
        margin: 24,
        paddingTop: 16,
        paddingBottom: 16,
        borderRadius: 8,
        shadowColor: "#000000",
        shadowOpacity: 0.24,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },
});

export default MyUnion;
