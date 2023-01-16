import React from "react";

import {View, StatusBar, Image, TouchableOpacity, Text, ScrollView, AsyncStorage, StyleSheet} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import AutoHeightWebView from "react-native-autoheight-webview";

const VOTE_RESOURCE_ID = 83;
const TEST_RESOURCE_ID = 84;

class TribuneAnsweredScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tribune: [],
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
                <ScrollView>
                    <View style={{backgroundColor: "#EFF1F5", flex: 1 }}>
                        <View style={styles.card}>

                            <View style={{
                                padding: 16,
                                minHeight: 180,
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingVertical: 16,
                                    borderBottomColor: "#E4E8F0",
                                    borderBottomWidth: 1,
                                }}>
                                    <TouchableOpacity onPress = {() => this.props.navigation.navigate("tribuneAnsweredQuestions", {revision: this.props.route.params.revision})} >
                                        <Text style={{
                                            color: "#2E384D",
                                            fontSize: 16,
                                            lineHeight: 24,
                                        }}>{this.props.route.params.revision.type.resource_id == TEST_RESOURCE_ID ? "Верные/Не верные ответы" : "Ответы"}</Text>
                                    </TouchableOpacity>
                                    <Image
                                        source={require("../assets/right_icon.png")}
                                        style={{
                                            width: 4,
                                            height: 8,
                                        }}>
                                    </Image>
                                </View>

                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingVertical: 16,
                                    borderBottomColor: "#E4E8F0",
                                    borderBottomWidth: 1,
                                }}>
                                    <TouchableOpacity onPress = {() => this.props.navigation.navigate("tribuneRevisionResult", {revision: this.props.route.params.revision})} >
                                        <Text style={{
                                            color: "#2E384D",
                                            fontSize: 16,
                                            lineHeight: 24,
                                        }}>
                                            Результат
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
                                  this.props.route.params.revision.decree &&
                                  <View style={{
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      paddingVertical: 16,
                                      borderBottomColor: "#E4E8F0",
                                      borderBottomWidth: 1,
                                  }}>

                                      <TouchableOpacity onPress = {() => this.props.navigation.navigate("tribuneDecision", {revision: this.props.route.params.revision})} >
                                          <Text style={{
                                              color: "#2E384D",
                                              fontSize: 16,
                                              lineHeight: 24,
                                          }}>
                                              Решение
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
    }
});

export default TribuneAnsweredScreen;
