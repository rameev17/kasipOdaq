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

class MyUnionApplication extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            unionInfo: {
                union_sample_applications: [{}]
            },
            refreshing: false,
            tab: 1,
        }

    }

    closeControlPanel = () => {
        this._drawer.close();
    }

    openControlPanel = () => {
        this._drawer.open();
    }

    componentDidMount = () => {
        this.loadApplication(data => this.setState({unionInfo: data, isLoading: false}))
    }

    loadApplication = (then) => {
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
        this.loadApplication(data => this.setState({unionInfo: data, refreshing: false, isLoading: false}));
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
                                    marginBottom: 24,
                                }}>

                                    {
                                        this.state.unionInfo.union_sample_applications.map(application => {
                                            return <View style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingVertical: 16,
                                                borderBottomColor: "#E4E8F0",
                                                borderBottomWidth: 1
                                            }}>
                                                <TouchableOpacity onPress={() => Linking.openURL(`${application.uri}`)}>
                                                    <Text style={{
                                                        color: "#01579B",
                                                        fontSize: 16,
                                                        lineHeight: 24,
                                                    }}>
                                                        { application.name }
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => Linking.openURL(`${application.uri}`)}>
                                                    <Image
                                                        source={require("../assets/download_icon.png")}
                                                        style={{
                                                            width: 24,
                                                            height: 23,
                                                        }} />
                                                </TouchableOpacity>
                                            </View>
                                        })
                                    }

                                    {/*<View style={{*/}
                                    {/*    flexDirection: "row",*/}
                                    {/*    justifyContent: "space-between",*/}
                                    {/*    alignItems: "center",*/}
                                    {/*    paddingVertical: 16,*/}
                                    {/*    borderBottomColor: "#E4E8F0",*/}
                                    {/*    borderBottomWidth: 1*/}
                                    {/*}}>*/}
                                    {/*    <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.union_sample_applications[0].uri}`)}>*/}
                                    {/*        <Text style={{*/}
                                    {/*            color: "#01579B",*/}
                                    {/*            fontSize: 16,*/}
                                    {/*            lineHeight: 24,*/}
                                    {/*        }}>*/}
                                    {/*            { this.state.unionInfo.union_sample_applications[0].name }*/}
                                    {/*        </Text>*/}
                                    {/*    </TouchableOpacity>*/}
                                    {/*    <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.union_sample_applications[0].uri}`)}>*/}
                                    {/*    <Image*/}
                                    {/*        source={require("../assets/download_icon.png")}*/}
                                    {/*        style={{*/}
                                    {/*            width: 24,*/}
                                    {/*            height: 23,*/}
                                    {/*        }} />*/}
                                    {/*    </TouchableOpacity>*/}
                                    {/*</View>*/}

                                    {/*<View style={{*/}
                                    {/*    flexDirection: "row",*/}
                                    {/*    justifyContent: "space-between",*/}
                                    {/*    alignItems: "center",*/}
                                    {/*    paddingVertical: 16,*/}
                                    {/*    borderBottomColor: "#E4E8F0",*/}
                                    {/*    borderBottomWidth: 1*/}
                                    {/*}}>*/}
                                    {/*    <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.protocol.uri}`)}>*/}
                                    {/*        <Text style={{*/}
                                    {/*            color: "#01579B",*/}
                                    {/*            fontSize: 16,*/}
                                    {/*            lineHeight: 24,*/}
                                    {/*        }}>*/}
                                    {/*            Удержание взносов*/}
                                    {/*        </Text>*/}
                                    {/*    </TouchableOpacity>*/}
                                    {/*    <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.protocol.uri}`)}>*/}
                                    {/*    <Image*/}
                                    {/*        source={require("../assets/download_icon.png")}*/}
                                    {/*        style={{*/}
                                    {/*            width: 24,*/}
                                    {/*            height: 23,*/}
                                    {/*        }} />*/}
                                    {/*    </TouchableOpacity>*/}
                                    {/*</View>*/}

                                    {/*<View style={{*/}
                                    {/*    flexDirection: "row",*/}
                                    {/*    justifyContent: "space-between",*/}
                                    {/*    alignItems: "center",*/}
                                    {/*    paddingVertical: 16,*/}
                                    {/*    borderBottomColor: "#E4E8F0",*/}
                                    {/*    borderBottomWidth: 1*/}
                                    {/*}}>*/}
                                    {/*    <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.statement.uri}`)}>*/}
                                    {/*        <Text style={{*/}
                                    {/*            color: "#01579B",*/}
                                    {/*            fontSize: 16,*/}
                                    {/*            lineHeight: 24,*/}
                                    {/*        }}>*/}
                                    {/*            Возмещение путевки*/}
                                    {/*        </Text>*/}
                                    {/*    </TouchableOpacity>*/}
                                    {/*    <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.statement.uri}`)}>*/}
                                    {/*    <Image*/}
                                    {/*        source={require("../assets/download_icon.png")}*/}
                                    {/*        style={{*/}
                                    {/*            width: 24,*/}
                                    {/*            height: 23,*/}
                                    {/*        }} />*/}
                                    {/*    </TouchableOpacity>*/}
                                    {/*</View>*/}

                                    {/*<View style={{*/}
                                    {/*    flexDirection: "row",*/}
                                    {/*    justifyContent: "space-between",*/}
                                    {/*    alignItems: "center",*/}
                                    {/*    paddingVertical: 16,*/}
                                    {/*    borderBottomColor: "#E4E8F0",*/}
                                    {/*    borderBottomWidth: 1*/}
                                    {/*}}>*/}
                                    {/*    <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.statement.uri}`)}>*/}
                                    {/*        <Text style={{*/}
                                    {/*            color: "#01579B",*/}
                                    {/*            fontSize: 16,*/}
                                    {/*            lineHeight: 24,*/}
                                    {/*        }}>*/}
                                    {/*            Помощь в связи с утерей*/}
                                    {/*        </Text>*/}
                                    {/*    </TouchableOpacity>*/}
                                    {/*    <TouchableOpacity onPress={() => Linking.openURL(`${this.state.unionInfo.statement.uri}`)}>*/}
                                    {/*    <Image*/}
                                    {/*        source={require("../assets/download_icon.png")}*/}
                                    {/*        style={{*/}
                                    {/*            width: 24,*/}
                                    {/*            height: 23,*/}
                                    {/*        }} />*/}
                                    {/*    </TouchableOpacity>*/}
                                    {/*</View>*/}

                                </View>
                            </View>
                        </View>
                        {
                            this.state.menuOpened &&
                            <SideMenu menu={<NavigationMenu menuOpened={this.state.menuOpened} />} ></SideMenu>
                        }
                    </ScrollView>
                    <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel}/>
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

export default MyUnionApplication;
