import React from "react";
import { View, StyleSheet, TextInput, Text, Image, TouchableOpacity, TouchableHighlight } from "react-native";

import { AsyncStorage, Alert } from "react-native";

import { TextInputMask } from 'react-native-masked-text';

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";

import { setupSocket } from "../tools";

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: null,
      password: null,
      secure: true,
    }

  }

  closeControlPanel = () => {
    this._drawer.close();
  }

  openControlPanel = () => {
    this._drawer.open();
  }

  authorize = async () => {
    let response = await fetch("https://api.kasipodaq.org/api/v1/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: this.state.phone,
        password: this.state.password
      })
    });

    if (response.status != 200) {
      response = response.json().then(data => {
        Alert.alert("", data.message);
      });

      return;
    }

    response = await response.json();

    const token = response.token;

    try {
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      alert(error);
    }

    response = await fetch("https://api.kasipodaq.org/api/v1/profile?max_depth=3", {
      headers: {
        "Authorization": token
      }
    }).then(response => response.json());

    try {
      await AsyncStorage.removeItem("union_id");

      if (response.union) {
        await AsyncStorage.setItem("union_id", response.union.resource_id.toString());
      }

      await AsyncStorage.removeItem("person_id");

      if (response.union) {
        await AsyncStorage.setItem("person_id", response.resource_id.toString());
      }
    } catch (error) {
      alert(error);
    }

    setupSocket();

    this.props.navigation.navigate("cabinetMember");
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
        <View style={{flex: 1}}>
          <View style={styles.card}>
            <Text style={styles.label}>Номер телефона</Text>

            <View style={styles.inputRow}>
              <Image source={require("../assets/phone-icon.png")} style={{width: 24, height: 24}}/>
              <TextInputMask
                  type={'custom'}
                  options={{
                    mask: '9(999)999-99-99',
                  }}
                  value={this.state.phone}
                  placeholder={"7(___)___-__-__"}
                  onChangeText={phone => {
                    this.setState({
                      phone: phone.replace(/[^0-9]/g, '')
                    })
                  }}
                  style={{ width: "100%" }}
              />
            </View>

            <Text style={{...styles.label, marginTop: 29}}>Пароль</Text>
            <View style={styles.inputRow}>
              <Image source={require("../assets/password-icon.png")} style={{width: 24, height: 24}}/>
              <TextInput
                placeholder="Введите пароль"
                placeholderTextColor="#BFC5D2"
                secureTextEntry={this.state.secure}
                onChangeText={text => this.setState({password: text})}
                style={{marginLeft: 8, fontSize: 16, width: "100%"}}
              />
              <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => this.setState({ secure: !this.state.secure }) }>
                {
                  this.state.secure ?
                      <Image source={require("../assets/eye.png")} style={{width: 22, height: 15}} />
                      :
                      <Image source={require("../assets/eye_not.png")} style={{width: 22, height: 20}} />
                }
              </TouchableOpacity>
            </View>

            <View style={styles.cardBottom}>
              <TouchableHighlight style={styles.loginButton} onPress={this.authorize} underlayColor="#00AEEF">
                <Text style={{color: '#2E384D', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Войти</Text>
              </TouchableHighlight>

              <TouchableOpacity style={{ marginTop: 24 }} onPress={() => this.props.navigation.navigate("restorePassword")}>
                <Text style={{color: "#9A9B9C", fontSize: 14}}>Забыли пароль?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ marginTop: 24 }} onPress={() => this.props.navigation.navigate("register")}>
                <Text style={{color: "#01579B", fontSize: 14}}>Зарегистрироваться</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={{ alignItems: "center", marginTop: 24 }}>
            <Text style={{color: "#9A9B9C", fontSize: 14}}>Пользовательское соглашение</Text>
          </TouchableOpacity>
        </View>
        <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel}/>
      </Drawer>
      </>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    margin: 24,
    padding: 16,
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
    borderBottomColor: "#E4E8F0",
    borderBottomWidth: 1
  },
  loginButton: {
    backgroundColor: "#EFF1F5",
    borderRadius: 4,
    width: 247,
    height: 44,
    marginTop: 49,
    color: "#2E384D",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  cardBottom: {
    alignItems: "center"
  }
});

export default LoginScreen;
