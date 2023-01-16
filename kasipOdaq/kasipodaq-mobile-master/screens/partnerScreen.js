
import React from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Picker, Linking, RefreshControl
} from "react-native";
import StepIndicator from 'react-native-step-indicator';
import RNPickerSelect from 'react-native-picker-select';

import { AsyncStorage } from "react-native";
import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "./navigationMenu";
import Drawer from "react-native-drawer";

import AutoHeightWebView from "react-native-autoheight-webview";
import Spinner from "react-native-loading-spinner-overlay";

class PartnerScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            partner: {},
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

    componentDidMount = () => {
      this.loadPartner(data => this.setState({partner: data, isLoading: false}))
    }

    loadPartner = (then) => {
        this.setState({isLoading: true})

        fetch(`https://api.kasipodaq.org/api/v1/partners/${this.props.route.params.id}/`)
            .then(response => response.json())
            .then(data => then(data));
    }

    refreshScreen = () => {
        this.setState({refreshing: true, isLoading: true});
        this.loadPartner(data => this.setState({partner: data, refreshing: false, isLoading: false}));
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
                  <View style={styles.card}>
                      <View style={{
                          borderBottomWidth: 1,
                          borderBottomColor: "#E4E8F0",
                          paddingBottom: 16,
                          justifyContent: "center",
                          alignItems: "center",
                      }}>
                          <Image
                              source={{ uri: this.state.partner.picture_uri }}
                              style={{
                                  width: 114,
                                  height: 80
                              }}
                          />
                        <Text>{ this.state.partner.name }</Text>
                      </View>

                      <View style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 16,
                          marginBottom: 16,
                      }}>
                          { this.state.partner.vk &&
                          <TouchableOpacity onPress={() => Linking.openURL(`${this.state.partner.vk}`)}>
                              <Image
                                  source={require("../assets/social-vk.png")}
                                  style={{
                                      width: 30,
                                      height: 30,
                                      marginRight: 5,
                                  }}
                              />
                          </TouchableOpacity>
                          }
                          {
                              this.state.partner.odnoklassniki &&
                              <TouchableOpacity onPress={() => Linking.openURL(`${this.state.partner.odnoklassniki}`)}>
                                  <Image
                                      source={require("../assets/social-ok.png")}
                                      style={{
                                          width: 30,
                                          height: 30,
                                          marginRight: 5,
                                      }}
                                  />
                              </TouchableOpacity>
                          }
                          {
                              this.state.partner.instagram &&
                              <TouchableOpacity onPress={() => Linking.openURL(`${this.state.partner.instagram}`)}>
                                  <Image
                                      source={require("../assets/social-instagram.png")}
                                      style={{
                                          width: 30,
                                          height: 30,
                                          marginRight: 5,
                                      }}
                                  />
                              </TouchableOpacity>
                          }
                          {
                              this.state.partner.facebook &&
                              <TouchableOpacity onPress={() => Linking.openURL(`${this.state.partner.facebook}`)}>
                                  <Image
                                      source={require("../assets/social-facebook.png")}
                                      style={{
                                          width: 30,
                                          height: 30,
                                          marginRight: 5,
                                      }}
                                  />
                              </TouchableOpacity>
                          }
                          {
                              this.state.partner.twitter &&
                              <TouchableOpacity onPress={() => Linking.openURL(`${this.state.partner.twitter}`)}>
                                  <Image
                                      source={require("../assets/social-twitter.png")}
                                      style={{
                                          width: 30,
                                          height: 30,
                                          marginRight: 5,
                                      }}
                                  />
                              </TouchableOpacity>
                          }
                          {
                              this.state.partner.telegram &&
                              <TouchableOpacity onPress={() => Linking.openURL(`${this.state.partner.telegram}`)}>
                                  <Image
                                      source={require("../assets/social-telegram.png")}
                                      style={{
                                          width: 30,
                                          height: 30,
                                          marginRight: 5,
                                      }}
                                  />
                              </TouchableOpacity>
                          }
                      </View>

                      <View style={{
                          alignItems: "center"
                      }}>
                          <AutoHeightWebView
                            style={{ width: 300 }}
                            source={{ html: this.state.partner.description }}
                            scalesPageToFit={true}
                            viewportContent={'width=device-width, user-scalable=no'}
                          />
                      </View>
                  </View>
                </ScrollView>
                <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel} activeTab={"partnerList"}/>
            </Drawer>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        margin: 24,
        flex: 1,
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderRadius: 8,
        shadowColor: "#000000",
        shadowOpacity: 0.24,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },
    label: {
        color: "#01579B",
        fontSize: 14,
        fontWeight: "400"
    },
    inputRow: {
        flexDirection: "row",
        marginTop: 4,
        paddingBottom: 4,
        alignItems: "center",
        borderColor: "#E4E8F0",
        borderWidth: 1,
        borderRadius: 4,
    },
    infoRow: {
        flexDirection: "row",
        marginTop: 32,
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
    },
});

export default PartnerScreen;
