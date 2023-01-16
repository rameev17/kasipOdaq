import React from "react";

import {
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    AsyncStorage,
    StyleSheet,
    RefreshControl
} from "react-native";
import {WebView} from "react-native-webview";

import { SearchBar } from 'react-native-elements';

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import Spinner from "react-native-loading-spinner-overlay";
import AutoHeightWebView from "react-native-autoheight-webview";

class LawDatabaseScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            laws: [],
            isLoading: false,
            refreshing: false,
            searchInput: '',
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

    loadLaws = (parentLaw, id) => {
      this.setState({isLoading: true, refreshing: true})

      let url = "https://api.kasipodaq.org/api/v1/legislation/";

      if (parentLaw) {
        url += `?parent_id=${parentLaw}`;
      }

      if (id) {
        url += `${id}/`;
      }

      fetch(url).then(response => response.json()).then(data => this.setState({laws: data, isLoading: false, refreshing: false}));
    }

    searchUpdated = (term) => {
        this.setState({ searchInput: term }, () => {

            if (this.state.searchInput !== '' && this.state.searchInput.length > 2){
                this.setState({ isLoading: true })
                try {
                    fetch(`https://api.kasipodaq.org/api/v1/legislation?search=${term}`, {
                        headers: {
                        }
                    })
                        .then(response => response.json())
                        .then(data => this.setState({laws: data, isLoading: false}));
                } catch(error) {
                    alert(error);
                }
            }else{
                try {
                    fetch(`https://api.kasipodaq.org/api/v1/legislation/`, {

                    })
                        .then(response => response.json())
                        .then(data => this.setState({laws: data, isLoading: false}));
                } catch(error) {
                    alert(error);
                }
            }
        })
    }

    componentDidMount = () => {
      this.loadLaws();
    }

    render = () => {
        return (
          <Drawer
            ref={(ref) => this._drawer = ref}
            openDrawerOffset={0.2}
            tapToClose={true}
            content={<NavigationMenu {...this.props}/>}
            >
            <Spinner
              visible={this.state.isLoading}
            />
            <ScrollView style={{backgroundColor: "#EFF1F5", flex: 1}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadLaws}/>}>
                <View style={styles.card}>
                    <ScrollView>
                        <SearchBar
                            placeholder="Поиск"
                            onChangeText={this.searchUpdated}
                            value={this.state.searchInput}
                            showLoading={this.state.isLoading}
                            lightTheme={true}
                            containerStyle={{
                                backgroundColor: "#E4E8F0",
                            }}
                            inputContainerStyle={{
                                backgroundColor: "white",
                            }}
                            inputStyle={{
                                backgroundColor: "white",
                            }}
                            leftIconContainerStyle={{
                                backgroundColor: "white"
                            }}
                            rightIconContainerStyle={{
                                backgroundColor: "white",
                            }}
                        />
                      <View style={{
                          padding: 16,
                          minHeight: 300,
                      }}>
                          <View style={{
                              alignItems: "center"
                          }}>
                              {
                                Array.isArray(this.state.laws) ?
                                  this.state.laws.map((law, index) => {
                                    return <TouchableOpacity style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        width: "98%",
                                        minHeight: 36,
                                        borderBottomColor: "#E4E8F0",
                                        borderBottomWidth: 1,
                                        alignItems: "center"
                                    }}
                                    onPress={() => law.content ? this.loadLaws(null, law.resource_id) : this.loadLaws(law.resource_id)}>
                                        { !law.content &&
                                        <Image
                                            source={require("../assets/folder.png")}
                                            style={{
                                                width: 20,
                                                height: 16,
                                                marginRight: 18,
                                            }}
                                        />
                                        }

                                        <Text style={{
                                            fontSize: 16,
                                            lineHeight: 24,
                                            color: "#2E384D",
                                            width: "92%"
                                        }}>{law.title}</Text>

                                    </TouchableOpacity>
                                  })
                                  :
                                  <View style={{
                                      width: "100%",
                                      padding: 16,
                                  }}>
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: "500",
                                        lineHeight: 24,
                                        color: "#2E384D",
                                        marginBottom: 24
                                    }}>{this.state.laws.title}</Text>
                                      <AutoHeightWebView
                                          style={{ width: "100%" }}
                                          source={{ html: this.state.laws.content }}
                                          scalesPageToFit={true}
                                          viewportContent={'width=device-width, user-scalable=no'}
                                      />
                                  </View>
                              }
                          </View>
                      </View>
                    </ScrollView>
                </View>
            </ScrollView>
            <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel} />
          </Drawer>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffff",
        flex: 1,
        height: 523,
        margin: 24,
        borderRadius: 8,
        shadowColor: "#000000",
        shadowOpacity: 0.24,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },
    searchInput:{
        padding: 10,
        borderBottomColor: '#CCC',
        borderBottomWidth: 1
    }
});

export default LawDatabaseScreen;
