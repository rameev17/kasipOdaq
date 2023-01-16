import React from "react";

import { View, ScrollView, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { AsyncStorage } from "react-native";

const dateFormat = require("dateformat");

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import Spinner from "react-native-loading-spinner-overlay";
import AutoHeightWebView from "react-native-autoheight-webview";

class NewsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: {},
      newsList: [],
      isLoading: false
    };

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

    fetch(`https://api.kasipodaq.org/api/v1/news/${this.props.route.params.id}`)
      .then(response => response.json())
      .then(data => this.setState({news: data, isLoading: false}));

    this.loadNewsList()
  }

  loadNewsList = () => {
    try {
      AsyncStorage.getItem("token").then(token => {
        if (token !== null) {
          fetch("https://api.kasipodaq.org/api/v1/news/", {
            headers: {
              "Authorization": token
            }
          })
              .then(response => response.json())
              .then(data => this.setState({newsList: data, isLoading: false}));
        } else {
          fetch("https://api.kasipodaq.org/api/v1/news/")
              .then(response => response.json())
              .then(data => this.setState({newsList: data, isLoading: false}));
        }
      });
    } catch(error) {
      alert(error);
    }
  }

  reloadPage = (id) => {
    this.setState({isLoading: true})

    fetch(`https://api.kasipodaq.org/api/v1/news/${id}`)
        .then(response => response.json())
        .then(data => this.setState({news: data, isLoading: false}));

    this.scrollView.scrollTo(0);
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
        <ScrollView ref={ref => this.scrollView = ref}>
          <View style={styles.card}>
            <AutoHeightWebView
                style={{marginTop: 16, width: 300}}
                source={{html:
                      `<html><head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                </head>
                <body>
                <h4 style="text-align: center">${this.state.news.title}</h4>
                  <img width="100%" src="${this.state.news.picture_uri}"/>
                  ${this.state.news.content}
                </body>
              </html>`}}
            />
          </View>

          <View style={styles.cardBottom}>
            <Text style={{ color: "#2E384D", fontSize: 20, paddingBottom: 16, fontWeight: "500", }}>Читайте также</Text>
            <ScrollView horizontal={true}>
              {
                this.state.newsList.map((news, index) => {
                  return <View style={styles.topNews} key={index}>
                    <Image
                        source={{uri: news.picture_uri}}
                        style={{width: 246, height: 178}}
                    />
                    <Text onPress={() => this.reloadPage(news.resource_id)} style={{
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
    alignItems: "center",
    margin: 24,
    marginBottom: 0,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.24,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  cardBottom: {
    backgroundColor: "#ffff",
    flex: 1,
    alignItems: "center",
    margin: 24,
    marginTop: 16,
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
  topNews: {
    width: 246,
    borderBottomColor: "#E4E8F0",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginRight: 16
  },
});

export default NewsScreen;
