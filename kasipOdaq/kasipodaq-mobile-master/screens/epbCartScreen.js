
import React from "react";

import {
    View,
    StatusBar,
    Image,
    ImageBackground,
    TouchableOpacity,
    Text,
    ScrollView,
    TouchableWithoutFeedback,
    AsyncStorage,
    RefreshControl
} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import Spinner from "react-native-loading-spinner-overlay";

class epbCartScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
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
        this.loadProfile(data => this.setState({data: data, isLoading: false}) )
    }

    loadProfile = (then) => {
        this.setState({isLoading: true})
        try {
            AsyncStorage.getItem("token").then(token => {
                fetch("https://api.kasipodaq.org/api/v1/profile?max_depth=3", {
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
        this.loadProfile(data => this.setState({data: data, refreshing: false, isLoading: false}));
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
                            <ImageBackground
                                source={require("../assets/epb.png")}
                                style={{
                                    width: 293,
                                    height: 184,
                                    backgroundColor: "rgba(10, 51, 115, 1)",
                                    borderRadius: 16
                                }}>
                                <View style={{  }}>
                                  <Image
                                    source={require("../assets/epb_logo.png")}
                                    style={{
                                      width: 140,
                                      height: 18,
                                      marginTop: 12,
                                      marginLeft: 11,
                                      marginBottom: 10,
                                    }}
                                  />

                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 8,
                                  }}>
                                  <Text style={{
                                      textAlign: "right",
                                      color: "#ffffff",
                                      marginRight: 15,
                                      fontSize: 10,
                                    }}>
                                    Elektrondy{"\n"} kasipodaq bileti
                                  </Text>
                                  <Text style={{
                                      color: "#ffffff",
                                      fontSize: 10,
                                    }}>
                                    Электронный{"\n"}профсоюзный билет
                                  </Text>
                                </View>

                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 5,
                                  }}>
                                  <Image
                                    source={{uri: this.state.data.picture_uri}}
                                    style={{
                                      width: 68,
                                      height: 85,
                                      marginLeft: 13,
                                    }}
                                    />

                                  <View style={{
                                      marginLeft: 15,
                                    }}>
                                    <Text style={{ color: "#DDC783", fontSize: 17, marginBottom: 3 }}>{ this.state.data.individual_number }</Text>
                                    <Text style={{ color: "#ffffff", fontSize: 5, }}>ai/jyl</Text>
                                    <Text style={{ color: "#ffffff", fontSize: 5, }}>Месяц/Год</Text>
                                    <Text style={{ color: "#ffffff", fontSize: 11, marginBottom: 5 }}>{ this.state.data.birthday }</Text>
                                    <Text style={{ color: "#DDC783", fontSize: 13, textTransform: "uppercase"}}>{this.state.data.first_name} {this.state.data.family_name}</Text>
                                  </View>

                                </View>

                                {
                                  // <View>
                                  //   <Text style={{ color: "#ffffff", fontSize: 5, fontWeight: "600", textAlign: "center" }}>
                                  //     Karta kásіpodaq uıymynyń menshіgі bolyp tabylady jáne kásіpodaq komıtetіnіń sheshіmі boıynsha alynýy múmkіn
                                  //   </Text>
                                  //   <Text style={{ color: "#ffffff", marginLeft: 8, fontSize: 5, fontWeight: "600", textAlign: "center" }}>
                                  //     Карта является собственностью профсоюзной организации и может быть изъята по решению профкома
                                  //   </Text>
                                  // </View>
                                }

                                </View>
                            </ImageBackground>

                            <ImageBackground
                                source={require("../assets/epb.png")}
                                style={{
                                    width: 293,
                                    height: 184,
                                    backgroundColor: "rgba(10, 51, 115, 1)",
                                    borderRadius: 16,
                                    marginTop: 24,
                                }}>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 12,
                                    marginLeft: 13,
                                    marginBottom: 8,
                                  }}>
                                  <TouchableWithoutFeedback onPress = {() => this.props.navigation.navigate("epbQrCod")} >
                                    <Image
                                        source={{uri: this.state.data.qr_uri}}
                                      style={{
                                        width: 102,
                                        height: 98,
                                        marginLeft: 13,
                                      }}
                                      />
                                  </TouchableWithoutFeedback>

                                  <View style={{
                                      marginLeft: 68,
                                    }}>
                                    <Image
                                      source={require("../assets/epb_back_logo.png")}
                                      style={{
                                        width: 83,
                                        height: 17,
                                      }}
                                    />
                                  <Text style={{ color: "#ffffff", fontSize: 7, marginTop: 30, }}>smartprofsouz@mail.ru</Text>
                                    <Text style={{ color: "#ffffff", fontSize: 7, marginTop: 4 }}>+7 700 385 44 87</Text>
                                    <Text style={{ color: "#ffffff", fontSize: 7 }}>www.smartprofsouz.kz</Text>
                                  </View>

                                </View>

                                <View style={{
                                    height: 68,
                                    width: "100%",
                                    backgroundColor: "#EFF1F5",
                                    borderBottomLeftRadius: 16,
                                    borderBottomRightRadius: 16,
                                    borderTopColor: "#FDB71A",
                                    borderTopWidth: 1,
                                  }}>
                                </View>

                            </ImageBackground>

                            <Text style={{ marginTop: 16, fontSize: 14, color: "#9A9B9C", textAlign: "center" }}> Нажмите на QR-код чтобы увеличить его </Text>

                            </View>
                        </View>

                    </ScrollView>
                    <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel}/>
                </Drawer>
            </>
        );
    }
}

export default epbCartScreen;
