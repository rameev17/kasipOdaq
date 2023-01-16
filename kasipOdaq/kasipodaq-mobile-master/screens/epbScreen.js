
import React from "react";

import {View, StatusBar, Image, TouchableOpacity, Text, ScrollView, AsyncStorage} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";

class epbScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: [],
      data: [],
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

    try {
      AsyncStorage.getItem("token").then(token => {
        fetch("https://api.kasipodaq.org/api/v1/profile?max_depth=3", {
          headers: {
            "Authorization": token
          }
        })
            .then(response => response.json())
            .then(data => { this.setState({ profile: data }) });
      });
    } catch(error) {
      alert(error);
    }

    fetch(`https://api.kasipodaq.org/api/v1/articles/?key=about_yntymaq&parent_articles=1`)
        .then(response => response.json())
        .then(data => this.setState({data: data[0]} ));
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
            <View style={{backgroundColor: "#EFF1F5"}}>

              <View style={{
                backgroundColor: "#ffff",
                flex: 1,
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

              }}>
                { this.state.profile.union &&
                <TouchableOpacity onPress = {() => this.props.navigation.navigate("epbCart")} >
                  <Text style={{
                    paddingVertical: 4,
                    paddingHorizontal: 73,
                    borderRadius: 4,
                    marginBottom: 16,
                    backgroundColor: "#0A3373",
                    textAlign: "center",
                    color: "#ffffff",
                    fontSize: 14,
                  }}>
                    Мой электронный профсоюзный билет
                  </Text>
                </TouchableOpacity>
                }
                <Text style={{
                    textAlign: "center",
                    marginBottom: 16,
                    fontSize: 20,
                  }}>
                  Мой электронный профсоюзный билет
                </Text>
                <Text style={{ alignItems: "center" }}>
                  Электронный профсоюзный билет - представляет собой персонализированную пластиковую карту, удостоверяющую Ваше  членство в  профсоюзе.
                  Выдаётся комитетом первичной профсоюзной организации. ЭПБ предоставляет члену профсоюза получать преференции в виде скидок на товары и услуги в сети Партнёров профсоюзных организаций.
                  ЭПБ имеет единый вид для всех профсоюзных организаций. Приоритетные партнёры: сети АЗС, сети супермаркетов, автобусные парки, сети аптек, спортивные и оздоровительные учреждения и т.д.
                  Электронный профсоюзный билет готов к использованию уже с момента
                  его получения и не требует дополнительной активации.
                  Для получения скидки Вам необходимо:
                  1. Получить Электронный профсоюзный билет в своей профсоюзной организации.
                  2. Предъявить Электронный профсоюзный билет при оплате товара или
                  услуги в торгово- сервисном предприятии - партнере программы "Электронный профсоюзный билет".
                  3. При заказе товара или услуги в интернет-магазине Вам необходимо указать данные своего Электронного профсоюзного билета в комментариях к заказу или сообщить о его наличии оператору этого интернет-магазина.ß
                  Для получения подробной информации о текущих акциях и предложениях
                  для членов профсоюзных организаций просим Вас перейти в раздел
                  Партнеры.
                </Text>
              </View>
            </View>
          </ScrollView>
          <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel}/>
        </Drawer>
        </>
    );
  }
}

export default epbScreen;
