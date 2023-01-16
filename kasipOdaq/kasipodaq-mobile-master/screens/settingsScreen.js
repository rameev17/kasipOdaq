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
import ActionSheet from 'react-native-actionsheet';
import ToggleSwitch from 'toggle-switch-react-native'

import { AsyncStorage } from "react-native";
import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "./navigationMenu";
import Drawer from "react-native-drawer";

class SettingsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notificationVisible: false,
            token: null,
        }

        AsyncStorage.getItem("token").then(token => {
            this.setState({ token: token })
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

    componentDidMount() {
        try {
            AsyncStorage.getItem("token").then(token => {
                this.setState({ token: token })
                fetch("https://api.kasipodaq.org/api/v1/profile?max_depth=3", {
                    headers: {
                        "Authorization": token
                    }
                })
                    .then(response => response.json())
                    .then(data => this.setState({
                        notificationVisible: data.settings.enable_notice,
                    }));
            });
        } catch(error) {
            alert(error);
        }
    }

    notificationVisible = async() => {
        this.setState({ notificationVisible: !this.state.notificationVisible })

        const response = await fetch("https://api.kasipodaq.org/api/v1/edit_settings", {
            method: "PATCH",
            headers: {
                "Authorization": this.state.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                enable_notice: this.state.notificationVisible,
            })
        })

    }

    closeControlPanel = () => {
        this._drawer.close();
    }

    openControlPanel = () => {
        this._drawer.open();
    }

    languageChange = () => {
        this.ActionSheet.show()
    }

    quit = () => {
      try {
          AsyncStorage.removeItem("token").then(() => {
            this.props.navigation.navigate("newsList");
          });
      } catch(error) {
          alert(error);
      }
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
                        {
                            this.state.token &&
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingVertical: 16,
                                borderBottomColor: "#E4E8F0",
                                borderBottomWidth: 1,
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        width: "100%",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}>
                                        <Image
                                            source={require("../assets/notification_settings.png")}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                marginRight: 16,
                                            }}/>
                                        <Text style={{
                                            color: "#2E384D",
                                            fontSize: 16,
                                            lineHeight: 24,
                                        }}>
                                            Уведомления
                                        </Text>
                                    </View>

                                    <ToggleSwitch
                                        isOn={this.state.notificationVisible}
                                        onColor="#01579B"
                                        offColor="#C6C5C5"
                                        label=""
                                        labelStyle={{ color: "#2E384D", justifyContent: "flex-end" }}
                                        size="medium"
                                        onToggle={this.notificationVisible}
                                    />

                                </TouchableOpacity>
                            </View>
                        }

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 16,
                            borderBottomColor: "#E4E8F0",
                            borderBottomWidth: 1,
                        }}>
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                                onPress = {this.languageChange}
                            >
                                <Image
                                    source={require("../assets/language_settings.png")}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        marginRight: 16,
                                    }}/>
                                <Text style={{
                                    color: "#2E384D",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    Смена языка
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            title={'Выберите язык'}
                            options={['Русский', 'Казахский', 'Отмена']}
                            cancelButtonIndex={2}
                            destructiveButtonIndex={3}
                            onPress={(index) => { /* do something */ }}
                        />

                        {
                            this.state.token &&
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingVertical: 16,
                                borderBottomColor: "#E4E8F0",
                                borderBottomWidth: 1,
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                    onPress = {() => this.props.navigation.navigate("changePassword")}
                                >
                                    <Image
                                        source={require("../assets/pass_settings.png")}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            marginRight: 16,
                                        }}/>
                                    <Text style={{
                                        color: "#2E384D",
                                        fontSize: 16,
                                        lineHeight: 24,
                                    }}>
                                        Смена пароля
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {
                            this.state.token &&
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingVertical: 16,
                                borderBottomColor: "#E4E8F0",
                                borderBottomWidth: 1,
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                    onPress = {() => this.props.navigation.navigate("support")}
                                >
                                    <Image
                                        source={require("../assets/support_settings.png")}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            marginRight: 16,
                                        }}/>
                                    <Text style={{
                                        color: "#2E384D",
                                        fontSize: 16,
                                        lineHeight: 24,
                                    }}>
                                        Техническая служба поддержки
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {
                            this.state.token &&
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingVertical: 16,
                                borderBottomColor: "#E4E8F0",
                                borderBottomWidth: 1,
                            }}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                    onPress = {() => this.quit()}
                                >
                                    <Image
                                        source={require("../assets/exit_settings.png")}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            marginRight: 16,
                                        }}/>
                                    <Text style={{
                                        color: "#2E384D",
                                        fontSize: 16,
                                        lineHeight: 24,
                                    }}>
                                        Выйти
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }

                    </View>
                </ScrollView>
                <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel}/>
            </Drawer>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        margin: 24,
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

export default SettingsScreen;
