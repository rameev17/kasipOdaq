import React from "react";

import {View, StatusBar, ScrollView, Text, TouchableOpacity, Image, RefreshControl} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import Spinner from "react-native-loading-spinner-overlay";
import { AsyncStorage } from "react-native";

class ContactsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: [],
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
    this.loadInfo(data => this.setState({contact: data[0], isLoading: false} ))
  }

  loadInfo = (then) => {
    this.setState({isLoading: true})

    fetch(`https://api.kasipodaq.org/api/v1/articles/?key=contacts&parent_articles=1`)
        .then(response => response.json())
        .then(data => then(data));
  }

  refreshScreen = () => {
    this.setState({refreshing: true});
    this.loadInfo(data => this.setState({contact: data[0], refreshing: false}));
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
        <ScrollView style={{backgroundColor: "#EFF1F5"}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshScreen}/>} >
          <View style={{
            backgroundColor: "#ffff",
            flex: 1,
            minHeight: 500,
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
            <WebView
                style={{ width: 300, height: "100%" }}
                source={{html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${this.state.contact.content}</body></html>`}}
            />
          </View>
        </ScrollView>
        <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel}/>
      </Drawer>
      </>
    );
  }
}

export default ContactsScreen;
