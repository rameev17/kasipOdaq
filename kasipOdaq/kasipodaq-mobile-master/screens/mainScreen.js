import React from "react";

import {
  View,
  StatusBar,
  Button,
  Image,
  Direction,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableHighlightComponent,
  AsyncStorage
} from "react-native";
import {DrawerActions} from "react-navigation";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";

class MainScreen extends React.Component {
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
            <Image source={require("../assets/logo.png")} style={{width: 202, height: 170, marginBottom: 91 }} />

            <TouchableOpacity onPress = {() => this.props.navigation.navigate("newsList")}>
              <View style = {styles.button} >
                <Text style = {{color: '#2E384D', fontWeight: "500", fontSize: 14, lineHeight: 24}}>Қазақ тілі</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {() => this.props.navigation.navigate("newsList")} style={{ marginTop: 24 }}>
              <View style = {styles.button} >
                <Text style = {{color: '#2E384D', fontWeight: "500", fontSize: 14, lineHeight: 24}}>Русский язык</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.infoText}>
              Вы всегда сможете изменить язык в настройках приложения
            </Text>

          </View>
        </View>

      </ScrollView>

    </Drawer>
      </>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#EFF1F5',
    borderRadius: 4,
    width: 247,
    height: 44,
    color: '#2E384D',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoText: {
    marginTop: 32,
    color: '#9A9B9C',
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  }
});

export default MainScreen;
