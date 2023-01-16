import React from "react";
import { Image, AsyncStorage, Alert } from "react-native";

import BottomNavigation, { FullTab } from "react-native-material-bottom-navigation";

import NewsIcon from "../assets/news.png";
import HelpIcon from "../assets/help.png";
import PartnersIcon from "../assets/partners.png";
import UnionIcon from "../assets/union.png";
import MenuIcon from "../assets/menu.png";

const tabs = [
  {
    key: "newsList",
    icon: NewsIcon,
    label: "Новости",
    route: "news",
    barColor: '#01579B',
    pressColor: 'rgba(255, 255, 255, 0.16)'
  },
  {
    key: "help",
    icon: HelpIcon,
    label: "Помощь",
    barColor: '#01579B',
    pressColor: 'rgba(255, 255, 255, 0.16)'
  },
  {
    key: "partnerList",
    icon: PartnersIcon,
    label: "Партнеры",
    barColor: '#01579B',
    pressColor: 'rgba(255, 255, 255, 0.16)'
  },
  {
    key: "myUnion",
    icon: UnionIcon,
    label: "Профсоюз",
    barColor: '#01579B',
    pressColor: 'rgba(255, 255, 255, 0.16)'
  },
  {
    key: "menu",
    icon: MenuIcon,
    label: "Меню",
    barColor: '#01579B',
    pressColor: 'rgba(255, 255, 255, 0.16)'
  }
];

class BottomMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      unionId: null,
      authAlertMessage: "Для того чтобы воспользоваться этим пунктом меню, Вам необходимо авторизоваться",
      joinAlertMessage: "Для того чтобы воспользоваться этим пунктом меню, Вам необходимо состоять в профсоюзе"
    }
  }

  renderIcon = icon => ({ isActive }) => {
    return <Image
        source={icon}
        style={{width: 20, height: 20}}
    ></Image>
  }

  componentDidMount = () => {
    try {
      AsyncStorage.getItem("token").then(token => {
        this.setState({token: token});
      });

      AsyncStorage.getItem("union_id").then(unionId => {
        this.setState({unionId: unionId})
      });
    } catch(error) {
      alert(error);
    }
  }

  renderTab = ({ tab, isActive }) => (
    <FullTab
      key={tab.key}
      isActive={this.props.activeTab && isActive}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
      labelStyle={{fontSize: 10}}
    />
  )

  render = () => {

    const navigationParams = {};
    if (this.props.activeTab) {
      navigationParams.activeTab = this.props.activeTab;
    }

    return <BottomNavigation
      {...navigationParams}
      renderTab={this.renderTab}
      tabs={tabs}
      onTabPress={tab => {
        if (tab.key == "menu") {
          this.props.openControlPanel();
        } else if (this.state.token == null && tab.key != "newsList" && tab.key != "partnerList") {
          Alert.alert(tab.label, this.state.authAlertMessage, [
            { text: "Войти", onPress: () => this.props.navigation.navigate("login") },
            { text: "Отмена" }
          ]);
        } else {
          if (this.state.unionId == null && tab.key != "newsList" && tab.key != "partnerList") {
            Alert.alert(tab.label, this.state.joinAlertMessage, [
              { text: "Вступить в профсоюз", onPress: () => this.props.navigation.navigate("join") },
              { text: "Отмена" }
            ]);
          } else {
            this.props.navigation.navigate(tab.key);
          }
        }
      }}
    />
  }
}

export default BottomMenu;
