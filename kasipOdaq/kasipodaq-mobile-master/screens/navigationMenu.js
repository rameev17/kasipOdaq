import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { AsyncStorage } from "react-native";

class NavigationMenu extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          token: null,
          unionId: null
        }
    }

    componentDidMount = () => {
      try {
          AsyncStorage.getItem("token").then(token => {
            this.setState({token: token})
          });

          AsyncStorage.getItem("union_id").then(unionId => {
            this.setState({unionId: unionId})
          });
      } catch(error) {
          alert(error);
      }
    }

    render = () => {
        return (
            <ScrollView style={styles.navigationMenu}>
                <View style={{ width: "100%", height: 58, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" }}>
                  <Image
                      source={require("../assets/logo_menu.png")}
                      style={{width: 142, height: 32 }}></Image>
                </View>

                {
                  !this.state.token &&
                  <TouchableOpacity onPress = {() => this.props.navigation.navigate("login")} >
                      <View style={styles.navigationButton} >
                        <Image
                            source={require("../assets/menu-login.png")}
                            style={{width: 20, height: 20, marginRight: 20}}>
                          </Image>
                          <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                              Войти
                          </Text>
                      </View>
                  </TouchableOpacity>
                }

                {
                  this.state.token &&
                  <>
                  <TouchableOpacity onPress = {() => this.props.navigation.navigate("cabinetMember")} >
                      <View style={styles.navigationButton} >
                        <Image
                            source={require("../assets/menu-enter-to-union.png")}
                            style={{width: 20, height: 20, marginRight: 20}}>
                          </Image>
                          <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                              Личный кабинет
                          </Text>
                      </View>
                  </TouchableOpacity>

                    {
                      !this.state.unionId &&
                      <>
                      <TouchableOpacity onPress = {() => this.props.navigation.navigate("join")} >
                          <View style={styles.navigationButton} >
                            <Image
                                source={require("../assets/menu-enter-to-union.png")}
                                style={{width: 20, height: 20, marginRight: 20}}>
                              </Image>
                              <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                                  Вступить в профсоюз
                              </Text>
                          </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress = {() => this.props.navigation.navigate("create")} >
                          <View style={styles.navigationButton} >
                            <Image
                                source={require("../assets/menu-create-union.png")}
                                style={{width: 20, height: 20, marginRight: 20}}></Image>
                              <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                                  Создать профсоюз
                              </Text>
                          </View>
                      </TouchableOpacity>
                      </>
                    }

                    {
                      this.state.unionId &&
                      <>
                      <TouchableOpacity onPress = {() => this.props.navigation.navigate("appeals")} >
                          <View style={styles.navigationButton} >
                            <Image
                                source={require("../assets/menu-request-to-fprk.png")}
                                style={{width: 20, height: 20, marginRight: 20}}>
                              </Image>
                              <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                                  Обращение в Yntymaq
                              </Text>
                          </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress = {() => this.props.navigation.navigate("tribune")} >
                          <View style={styles.navigationButton} >
                            <Image
                                source={require("../assets/menu-tribune.png")}
                                style={{width: 20, height: 20, marginRight: 20}}>
                              </Image>
                              <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                                  Трибуна
                              </Text>
                          </View>
                      </TouchableOpacity>
                      </>
                    }
                  </>
                }

                <TouchableOpacity onPress = {() => this.props.navigation.navigate("laws")} >
                    <View style={styles.navigationButton} >
                      <Image
                          source={require("../assets/menu-law-database.png")}
                          style={{width: 20, height: 20, marginRight: 20}}>
                        </Image>
                        <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                            Законодательная база
                        </Text>
                    </View>
                </TouchableOpacity>

                {
                  (this.state.token && this.state.unionId) &&
                  <>
                  <TouchableOpacity onPress = {() => this.props.navigation.navigate("biot")} >
                      <View style={styles.navigationButton} >
                        <Image
                            source={require("../assets/menu-biot.png")}
                            style={{width: 20, height: 20, marginRight: 20}}>
                          </Image>
                          <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                              БиОТ
                          </Text>
                      </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress = {() => this.props.navigation.navigate("disputes")} >
                      <View style={styles.navigationButton} >
                        <Image
                            source={require("../assets/menu-dispute.png")}
                            style={{width: 20, height: 20, marginRight: 20}}></Image>
                          <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                              Трудовой спор
                          </Text>
                      </View>
                  </TouchableOpacity>
                  </>
                }

                <TouchableOpacity onPress = {() => this.props.navigation.navigate("epb")} >
                    <View style={styles.navigationButton} >
                      <Image
                          source={require("../assets/menu-epb.png")}
                          style={{width: 20, height: 20, marginRight: 20}}>
                        </Image>
                        <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                            ЭПБ
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress = {() => this.props.navigation.navigate("yntymaq")} >
                    <View style={styles.navigationButton} >
                      <Image
                          source={require("../assets/menu-about-us.png")}
                          style={{width: 20, height: 20, marginRight: 20}}>
                        </Image>
                        <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                            Yntymaq
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress = {() => this.props.navigation.navigate("settings")} >
                    <View style={styles.navigationButton} >
                        <Image
                            source={require("../assets/menu-preferences.png")}
                            style={{width: 20, height: 20, marginRight: 20}}>
                        </Image>
                        <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                            Настройки
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress = {() => this.props.navigation.navigate("contacts")} >
                    <View style={styles.navigationButton} >
                      <Image
                          source={require("../assets/menu-contacts.png")}
                          style={{width: 20, height: 20, marginRight: 20}}>
                        </Image>
                        <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 16, display: "flex", alignItems: "center"}}>
                            Контакты
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
 button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
},
navigationMenu: {
    width: "100%",
    height: "100%",
    backgroundColor: "#01579B",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
},
navigationButton: {
    flexDirection: "row",
    width: "100%",
    height: 58,
    borderTopColor: "#002F6C",
    borderTopWidth: 1,
    display: "flex",
    alignItems: "center",
    paddingLeft: 20,
}

});

export default NavigationMenu;
