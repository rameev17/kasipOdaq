import React from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Picker
} from "react-native";
import StepIndicator from 'react-native-step-indicator';
import RNPickerSelect from 'react-native-picker-select';

import { AsyncStorage } from "react-native";
import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "./navigationMenu";
import Drawer from "react-native-drawer";

class PartnerListScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            partners: [],
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
        this.setState({isLoading: true})

        fetch("https://api.kasipodaq.org/api/v1/partners/")
        .then(response => response.json())
        .then(data => this.setState({partners: data, isLoading: false}));
    }

    componentWillReceiveProps = (props) => {
      fetch(`https://api.kasipodaq.org/api/v1/partners/?category_id=${props.route.params.id}`)
      .then(response => response.json())
      .then(data => this.setState({partners: data, isLoading: false}));
    }

    render = () => {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                openDrawerOffset={0.2}
                tapToClose={true}
                content={<NavigationMenu {...this.props}/>}
            >
                <ScrollView>
                  <View style={styles.card}>
                      <View style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingVertical: 16,
                          borderBottomColor: "#E4E8F0",
                          borderBottomWidth: 1,
                          borderTopColor: "#E4E8F0",
                          borderTopWidth: 1
                      }}>
                          <TouchableOpacity onPress = {() => this.props.navigation.navigate("partnerCategory")} >
                              <Text style={{
                                  color: "#2E384D",
                                  fontSize: 16,
                                  lineHeight: 24,
                              }}>
                                  Выбрать категорию
                              </Text>
                          </TouchableOpacity>
                          <Image
                              source={require("../assets/right_icon.png")}
                              style={{
                                  width: 4,
                                  height: 8,
                              }}>
                          </Image>
                      </View>

                      {
                        this.state.partners.map((partner, index) => {
                          return <View style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              paddingVertical: 16,
                              borderBottomColor: "#E4E8F0",
                              borderBottomWidth: 1,
                              borderTopColor: "#E4E8F0",
                              borderTopWidth: 1
                          }}>
                              <View style={{
                                  flexDirection: "row",
                                  alignItems: "center"
                              }}>
                                  <Image
                                      source={{uri: partner.picture_uri}}
                                      style={{
                                          width: 72,
                                          height: 72,
                                          marginRight: 16,
                                      }}>
                                  </Image>

                                  <TouchableOpacity
                                      onPress = {() => this.props.navigation.navigate("partner", { id: partner.resource_id } )}
                                  >
                                      <Text style={{
                                          color: "#2E384D",
                                          fontSize: 16,
                                          lineHeight: 24,
                                      }}>
                                          { partner.name }
                                      </Text>
                                  </TouchableOpacity>
                              </View>

                              <Image
                                  source={require("../assets/right_icon.png")}
                                  style={{
                                      width: 4,
                                      height: 8,
                                  }}>
                              </Image>
                          </View>
                        })
                      }
                  </View>
                </ScrollView>
                <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel} activeTab={"partnerList"}/>
            </Drawer>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        margin: 24,
        padding: 16,
        flex: 1,
        paddingVertical: 32,
        paddingHorizontal: 16,
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
        borderColor: "#E4E8F0",
        borderWidth: 1,
        borderRadius: 4,
    },
    infoRow: {
        flexDirection: "row",
        marginTop: 32,
    },
    saveButton: {
        backgroundColor: "#00AEEF",
        borderRadius: 4,
        width: 247,
        height: 44,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
});

export default PartnerListScreen;
