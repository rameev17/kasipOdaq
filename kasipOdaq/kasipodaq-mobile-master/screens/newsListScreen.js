import React from "react";
import {View, StatusBar, ScrollView, Image, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl} from "react-native";

import { AsyncStorage } from "react-native";
import SideMenu from "react-native-side-menu/index";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import Spinner from "react-native-loading-spinner-overlay";

import { LinearGradient } from 'expo-linear-gradient';

const dateFormat = require("dateformat");

class NewsListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newsList: [],
      menuOpened: false,
      isLoading: false,
      refreshing: false
    };

    this.menuOpened = this.menuOpened.bind(this)

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

  loadNewsList = (then) => {
    try {
      AsyncStorage.getItem("token").then(token => {
        if (token !== null) {
          fetch("https://api.kasipodaq.org/api/v1/news/", {
            headers: {
              "Authorization": token
            }
          })
            .then(response => response.json())
            .then(data => then(data));
        } else {
          fetch("https://api.kasipodaq.org/api/v1/news/")
            .then(response => response.json())
            .then(data => then(data));
        }
      });
    } catch(error) {
      alert(error);
    }
  }

  componentDidMount = () => {
    this.setState({isLoading: true});
    this.loadNewsList(data => this.setState({newsList: data, isLoading: false}));
  }

  menuOpened(){
      this.setState({
          menuOpened: !this.state.menuOpened
      })
  }

  refreshScreen = () => {
    this.setState({refreshing: true});
    this.loadNewsList(data => this.setState({newsList: data, refreshing: false}));
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
          <ScrollView style={{flex: 1}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshScreen}/>}>
            <Spinner
              visible={this.state.isLoading}
            />
            <View style={styles.card}>
              <View style={{ height: 300 }}>
                <LinearGradient
                    start={{x: 1, y: 0}}
                    end={{x: 0, y: 0}}
                    colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.3)']}
                    style={{
                      height: 300,
                       position: 'absolute',
                      zIndex: 1,
                      top: 0,
                      right: 0,
                     }} >
                  <Text style={{ width: 15, height: "100%" }}></Text>
                </LinearGradient>
                <ScrollView horizontal={true} >
                  {
                    this.state.newsList.map((news, index) => {
                      return <View style={styles.topNews} key={index}>
                        <Image
                            source={{uri: news.picture_uri}}
                            style={{width: 246, height: 178}}></Image>
                        <Text onPress={() => this.props.navigation.navigate("news", {id: news.resource_id})} style={{
                          fontSize: 20,
                          fontWeight: "700",
                          marginTop: 10,
                          color: "#2E384D",
                          flex: 1,
                        }}>{news.title.length > 30 ? `${news.title.substring(0, 30)}...` : news.title}</Text>

                        <View style={{flexDirection: "row", marginTop: 10}}>
                          <View style={{
                            flexDirection: "row",
                            alignItems: "center"
                          }}>
                            <Image
                                source={require("../assets/date-icon.png")}
                                style={{width: 16, height: 16}}></Image>
                            <Text style={{
                              fontSize: 14,
                              fontWeight: "400",
                              marginLeft: 4,
                              color: "#9A9B9C"
                            }}>{dateFormat(new Date(news.created_date), "dd.mm.yyyy")}</Text>
                          </View>

                          <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 16,
                            flex: 1
                          }}>
                            <Image
                                source={require("../assets/edit-icon.png")}
                                style={{width: 16, height: 16}}></Image>
                            <Text style={{
                              fontSize: 14,
                              fontWeight: "400",
                              marginLeft: 4,
                              color: "#9A9B9C"
                            }}>{news.source.length > 10 ? `${news.source.substring(0, 10)}...` : news.source}</Text>
                          </View>
                        </View>
                      </View>
                    })
                  }
                </ScrollView>
              </View>

              <View>
                {
                  this.state.newsList.map((news, index) => {
                    return <View style={styles.bottomNews} key={index}>
                      <View style={{flexDirection: "row", width: "100%", alignItems: "center"}}>
                        <Image
                            source={{uri: news.picture_uri}}
                            style={{width: 88, height: 64}}></Image>
                        <Text
                            onPress={() => this.props.navigation.navigate("news", {id: news.resource_id})}
                            style={{
                              fontSize: 16,
                              fontWeight: "700",
                              marginLeft: 10,
                              color: "#2E384D",
                              flex: 1,
                            }}>{news.title.length > 30 ? `${news.title.substring(0, 30)}...` : news.title}</Text>
                      </View>

                      <View style={{flexDirection: "row", marginTop: 10}}>
                        <View style={{
                          flexDirection: "row",
                          alignItems: "center"
                        }}>
                          <Image
                              source={require("../assets/date-icon.png")}
                              style={{width: 16, height: 16}}></Image>
                          <Text style={{
                            fontSize: 14,
                            fontWeight: "400",
                            marginLeft: 4,
                            color: "#9A9B9C"
                          }}>{dateFormat(new Date(news.created_date), "dd.mm.yyyy")}</Text>
                        </View>

                        <View style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 16,
                          flex: 1
                        }}>
                          <Image
                              source={require("../assets/edit-icon.png")}
                              style={{width: 16, height: 16}}></Image>
                          <Text style={{
                            fontSize: 14,
                            fontWeight: "400",
                            marginLeft: 4,
                            color: "#9A9B9C"
                          }}>{news.source.length > 10 ? `${news.source.substring(0, 10)}...` : news.source}</Text>
                        </View>
                      </View>
                    </View>
                  })
                }
              </View>

              {/*<View style={styles.bottomMenu}>*/}
              {/*  <TouchableOpacity onPress = {() => this.props.navigation.navigate("newsList")} >*/}
              {/*    <View style={styles.button} >*/}
              {/*      <Image*/}
              {/*          source={require("../assets/news.svg")}*/}
              {/*          style={{width: 20, height: 20}}></Image>*/}
              {/*      <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 10, lineHeight: 12}}>Новости</Text>*/}
              {/*    </View>*/}
              {/*  </TouchableOpacity>*/}

              {/*  <TouchableOpacity onPress = {() => this.props.navigation.navigate("newsList")} >*/}
              {/*    <View style={styles.button} >*/}
              {/*      <Image*/}
              {/*          source={require("../assets/help.svg")}*/}
              {/*          style={{width: 20, height: 20}}></Image>*/}
              {/*      <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 10, lineHeight: 12}}>Помощь</Text>*/}
              {/*    </View>*/}
              {/*  </TouchableOpacity>*/}

              {/*  <TouchableOpacity onPress = {() => this.props.navigation.navigate("newsList")} >*/}
              {/*    <View style={styles.button} >*/}
              {/*      <Image*/}
              {/*          source={require("../assets/partners.svg")}*/}
              {/*          style={{width: 20, height: 20}}></Image>*/}
              {/*      <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 10, lineHeight: 12}}>Партнеры</Text>*/}
              {/*    </View>*/}
              {/*  </TouchableOpacity>*/}

              {/*  <TouchableOpacity onPress = {() => this.props.navigation.navigate("newsList")} >*/}
              {/*    <View style={styles.button} >*/}
              {/*      <Image*/}
              {/*          source={require("../assets/union.svg")}*/}
              {/*          style={{width: 20, height: 20}}></Image>*/}
              {/*      <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 10, lineHeight: 12}}>Профсоюз</Text>*/}
              {/*    </View>*/}
              {/*  </TouchableOpacity>*/}

              {/*  <TouchableOpacity onPress = {() => this.menuOpened()} >*/}
              {/*    <View style={styles.button} >*/}
              {/*      <Image*/}
              {/*          source={require("../assets/menu.svg")}*/}
              {/*          style={{width: 20, height: 20}}></Image>*/}
              {/*      <Text style = {{color: '#80abcd', fontWeight: "500", fontSize: 10, lineHeight: 12}}>Меню</Text>*/}
              {/*    </View>*/}
              {/*  </TouchableOpacity>*/}
              {/*</View>*/}

            </View>

            {
              this.state.menuOpened &&
              <SideMenu menu={<NavigationMenu menuOpened={this.state.menuOpened} />} ></SideMenu>
            }
          </ScrollView>
          <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel} activeTab={"newsList"}/>
        </Drawer>
        </>
    );
  }
}

const styles = StyleSheet.create({
  card: {
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
  },
  // topShadow: {
  //   shadowOffset:{ width: 10, height: 0 },
  //   shadowColor: "black",
  //   shadowOpacity: 1,
  //   shadowRadius: 8,
  // },
  topNews: {
    width: 246,
    borderBottomColor: "#E4E8F0",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginRight: 16,
  },
  bottomNews: {
    paddingBottom: 10,
    marginTop: 16,
    borderBottomColor: "#E4E8F0",
    borderBottomWidth: 1,
  },
    bottomMenu: {
      display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      flex: 1,
      backgroundColor: "#01579B",
        position: "absolute",
        paddingLeft: 20,
        paddingRight: 20,
        width: "100%",
        height: 83,
        paddingTop: 8,
      bottom: 0,
    },
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
      flexDirection: "column",
        width: "100%",
        height: 58,
        borderTopColor: "#002F6C",
        display: "flex",
        justifyContent: "center",
        paddingLeft: 20,

    }
});

export default NewsListScreen;
