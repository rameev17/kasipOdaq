import React from "react";

import {
    View,
    StatusBar,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    ScrollView,
    AsyncStorage,
    StyleSheet,
    RefreshControl
} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";

import * as ImagePicker from "expo-image-picker";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import {format} from "date-fns";

class CabinetMemberScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: [{
                union: {}
            }],
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
        this.loadProfile(data => { this.setState({ profile: data }) })
    }

    loadProfile = (then) => {
        try {
            AsyncStorage.getItem("token").then(token => {
                fetch("https://api.kasipodaq.org/api/v1/profile?max_depth=3", {
                    headers: {
                        "Authorization": token
                    }
                })
                    .then(response => response.json())
                    .then(data => then(data));
            });
        } catch(error) {
            alert(error);
        }
    }

    refreshScreen = () => {
        this.setState({refreshing: true, isLoading: true});
        this.loadProfile(data => this.setState({profile: data, refreshing: false, isLoading: false}));
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
              <ScrollView style={{backgroundColor: "#EFF1F5", flex: 1}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshScreen}/>}>
                  <View style={styles.card}>
                      <ScrollView>
                          <View style={{flexDirection: "row", justifyContent: "flex-end", marginRight: 16, marginTop: 16}}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate("cabinetMemberEdit")} >
                                  <Image
                                      source={require("../assets/profile_edit.png")}
                                      style={{width: 24, height: 24 }}></Image>
                              </TouchableOpacity>
                          </View>
                          <View style={{
                              alignItems: "center",
                          }}>

                              <Image
                                  source={{uri: this.state.profile.picture_uri}}
                                  style={{width: 80, height: 80, backgroundColor: "#c4c4c4", borderRadius: 50, marginBottom: 16}}>
                              </Image>

                              <Text style={{
                                  fontSize: 20,
                                  fontWeight: "500",
                                  lineHeight: 24,
                                  marginBottom: 8
                              }}>
                                  {this.state.profile.family_name} {this.state.profile.first_name} {this.state.profile.patronymic}
                              </Text>
                              <Text style={{
                                  color: "#B6B6B6",
                                  fontSize: 16,
                                  fontWeight: "500",
                                  lineHeight: 24,
                                  marginBottom: 16
                              }}>
                                  {this.state.profile.birthday}
                              </Text>
                          </View>

                          <View>
                              <Text style={styles.memberDefaultInfo}>
                                  Пол
                              </Text>
                              <Text style={styles.memberInfo}>
                                  {this.state.profile.sex == 1 ? "Мужской" : "Женский"}
                              </Text>

                              <Text style={styles.memberDefaultInfo}>
                                  ИИН
                              </Text>
                              <Text style={styles.memberInfo}>
                                  {this.state.profile.individual_number}
                              </Text>

                              <Text style={styles.memberDefaultInfo}>
                                  Адрес проживания
                              </Text>
                              <Text style={styles.memberInfo}>
                                  {this.state.profile.physical_address}
                              </Text>

                              <Text style={styles.memberDefaultInfo}>
                                  Номер телефона
                              </Text>
                              <Text style={styles.memberInfo}>
                                  {this.state.profile.phone}
                              </Text>
                              { this.state.profile.union &&
                                  <>
                                      <Text style={styles.memberDefaultInfo}>
                                          Отраслевой профсоюз
                                      </Text>
                                      <Text style={styles.memberInfo}>
                                          {this.state.profile.union?.industry.name}
                                      </Text>

                                      <Text style={styles.memberDefaultInfo}>
                                          ТОП
                                      </Text>
                                      <Text style={styles.memberInfo}>
                                          {this.state.profile.union.association_union?.name}
                                      </Text>

                                      <Text style={styles.memberDefaultInfo}>
                                          Профсоюзное объеднинение
                                      </Text>
                                      <Text style={styles.memberInfo}>
                                          {this.state.profile.union?.name}
                                      </Text>
                                      {
                                          this.state.profile.union.root_union &&
                                          <>
                                          <Text style={styles.memberDefaultInfo}>
                                              Филиал
                                          </Text>
                                          <Text style={styles.memberInfo}>
                                            {this.state.profile.union.root_union?.name}
                                          </Text>
                                          </>
                                      }
                                      <Text style={styles.memberDefaultInfo}>
                                          Дата вступления в профсоюз
                                      </Text>
                                      <Text style={styles.memberInfo}>
                                          {format(new Date(this.state.profile.union?.join_date), "dd-MM-yyyy")}
                                      </Text>
                                  </>
                              }
                          </View>
                      </ScrollView>
                  </View>
              </ScrollView>
            <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel}/>
          </Drawer>
          </>
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
    memberDefaultInfo: {
        backgroundColor: "#EFF1F5",
        height: 34,
        paddingTop: 8,
        paddingLeft: 16,
        color: "#979797",
        fontSize: 14,
        lineHeight: 18,
    },
    memberInfo: {
        marginTop: 16,
        marginBottom: 16,
        paddingLeft: 16,
        color: "#2E384D",
        fontSize: 16,
        lineHeight: 24,
    }
});

export default CabinetMemberScreen;
