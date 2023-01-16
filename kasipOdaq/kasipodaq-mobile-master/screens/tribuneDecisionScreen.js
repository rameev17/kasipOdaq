import React from "react";

import {View, StatusBar, Image, TouchableOpacity, Text, ScrollView, AsyncStorage} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";

class TribuneDecisionScreen extends React.Component {
    constructor(props) {
        super(props);

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
            <>
                <Drawer
                    ref={(ref) => this._drawer = ref}
                    openDrawerOffset={0.2}
                    tapToClose={true}
                    content={<NavigationMenu {...this.props}/>}
                >
                    <ScrollView>
                        <View style={{backgroundColor: "#EFF1F5", flex: 1}}>
                            <View style={{
                                backgroundColor: "#ffff",
                                flex: 1,
                                height: 523,
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
                                <Text>{this.props.route.params.revision.name}</Text>
                                <WebView
                                    style={{ width: 300, height: "100%", alignItems: "center" }}
                                    source={{html: `
                                    <html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
                                    <body>${this.props.route.params.revision.decree}</body>
                                    </html>`
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

export default TribuneDecisionScreen;
