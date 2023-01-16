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
    Alert
} from "react-native";
import StepIndicator from 'react-native-step-indicator';

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import RNPickerSelect from 'react-native-picker-select';

import { AsyncStorage } from "react-native";

class ChangePasswordScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPassword: null,
            newPassword: null,
            newPasswordRepeat: null,
            tokenId: null,
        }
    }

    componentDidMount() {
        AsyncStorage.getItem("token").then(token => {
            this.setState({ tokenId: token })
        })
    }

    closeControlPanel = () => {
        this._drawer.close();
    }

    openControlPanel = () => {
        this._drawer.open();
    }

    change = async () => {
        const body = {};

        if (this.state.oldPassword != null && this.state.oldPassword != "") {
            body.old_password = this.state.oldPassword;
        }

        if (this.state.newPassword != null && this.state.newPassword != "") {
            body.new_password = this.state.newPassword;
        }

        if (this.state.newPassword != this.state.newPasswordRepeat) {
            Alert.alert("", "Ваши пароли не совпадают!")
            return
        }else{
            try {
                const response = await fetch("https://api.kasipodaq.org/api/v1/change_password", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": this.state.tokenId
                    },
                    body: JSON.stringify(body)
                })

                if (response.status != 202) {
                    response.json().then(data => {
                        Alert.alert("", data.message)
                    })
                } else {
                    this.setState({isLoading: false}, () => {
                        Alert.alert("", "Ваш пароль успешно изменён!")
                        this.props.navigation.navigate("login");
                    })
                }
            }catch (error) {
                alert(error)
            }
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
                        <Text style={styles.label}>Старый пароль</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                placeholder="Заполните поле"
                                placeholderTextColor="#BFC5D2"
                                onChangeText={text => this.setState({oldPassword: text})}
                                style={{ paddingVertical: 10, fontSize: 16, width: "100%" }}
                            />
                        </View>
                        <Text style={styles.label}>Новый пароль</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                placeholder="Заполните поле"
                                placeholderTextColor="#BFC5D2"
                                secureTextEntry={this.state.secure}
                                onChangeText={text => this.setState({newPassword: text})}
                                style={{ paddingVertical: 10, fontSize: 16, width: "100%" }}
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

                        <Text style={styles.label}>Повторите новый пароль</Text>

                        <View style={styles.inputRow}>
                            <TextInput
                                placeholder="Заполните поле"
                                placeholderTextColor="#BFC5D2"
                                secureTextEntry={this.state.secure2}
                                onChangeText={text => this.setState({newPasswordRepeat: text})}
                                style={{ paddingVertical: 10, fontSize: 16, width: "100%" }}
                            />
                            <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => this.setState({ secure2: !this.state.secure2 }) }>
                                {
                                    this.state.secure2 ?
                                        <Image source={require("../assets/eye.png")} style={{width: 22, height: 15}} />
                                        :
                                        <Image source={require("../assets/eye_not.png")} style={{width: 22, height: 20}} />
                                }
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 24, alignItems: "center" }}>
                            <TouchableHighlight style={styles.saveButton} onPress={this.change} underlayColor="#00AEEF">
                                <Text style={{color: '#2E384D', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Сохранить</Text>
                            </TouchableHighlight>
                        </View>
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
        marginBottom: 29,
        alignItems: "center",
        borderBottomColor: "#E4E8F0",
        borderBottomWidth: 1
    },
    infoRow: {
        flexDirection: "row",
        marginTop: 32,
    },
    inputSmsRow: {
        flexDirection: "row",
        marginTop: 4,
        width: "100%",
        height: 46,
        alignItems: "center",
        borderColor: "#E4E8F0",
        borderWidth: 1
    },
    loginButton: {
        backgroundColor: "#EFF1F5",
        borderRadius: 4,
        width: 247,
        height: 44,
        marginTop: 24,
        color: "#2E384D",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    cardBottom: {
        alignItems: "center"
    },
    saveButton: {
        backgroundColor: "#EFF1F5",
        borderRadius: 4,
        width: 247,
        height: 44,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    }
});

const customStyles = {
    stepIndicatorSize: 24,
    currentStepIndicatorSize: 24,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 1,
    stepStrokeCurrentColor: '#00AEEF',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#00AEEF',
    stepStrokeUnFinishedColor: '#0052A4',
    separatorFinishedColor: '#00AEEF',
    separatorUnFinishedColor: '#0052A4',
    stepIndicatorFinishedColor: '#00AEEF',
    stepIndicatorUnFinishedColor: '#0052A4',
    stepIndicatorCurrentColor: '#00AEEF',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#ffffff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#ffffff',
    labelColor: '#0052A4',
    labelSize: 13,
    currentStepLabelColor: '#00AEEF',
    marginTop: 208,
}

export default ChangePasswordScreen;
