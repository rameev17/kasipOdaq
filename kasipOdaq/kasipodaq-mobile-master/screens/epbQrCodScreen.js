
import React from "react";

import {View, StatusBar, Image, ImageBackground, TouchableOpacity, Text, ScrollView, AsyncStorage} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import Spinner from "react-native-loading-spinner-overlay";

class epbQrCodScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            isLoading: false,
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

            this.setState({isLoading: true})
              try {
                  AsyncStorage.getItem("token").then(token => {
                    fetch("https://api.kasipodaq.org/api/v1/profile?max_depth=3", {
                      headers: {
                          "Authorization": token
                      }
                    }).then(response => response.json())
                      .then(data => this.setState({data: data, isLoading: false}));
                  });
              } catch(error) {
                  alert(error);
              }
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
                    <ScrollView>
                        <View style={{backgroundColor: "#EFF1F5"}}>

                            <View style={{
                                backgroundColor: "#ffff",
                                flex: 1,
                                margin: 24,
                                padding: 40,
                                borderRadius: 8,
                                shadowColor: "#000000",
                                shadowOpacity: 0.24,
                                shadowRadius: 4,
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                alignItems: "center"
                            }}>
                            <Text  style={{ fontSize: 20 }}> Мой QR-код </Text>
                            <Image
                                source={{uri: this.state.data.qr_uri}}
                              style={{
                                width: 292,
                                height: 292,
                              }}
                              />

                            </View>
                        </View>

                    </ScrollView>
                    <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel}/>
                </Drawer>
            </>
        );
    }
}

export default epbQrCodScreen;
