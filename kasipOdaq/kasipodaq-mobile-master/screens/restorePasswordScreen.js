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
import {TextInputMask} from "react-native-masked-text";

class RestorePasswordScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPosition: 0,
            phone: null,
            smsCode: null,
            password: null,
            newPassword: null,
            tokenId: null,
            secure: true,
            secure2: true,
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

    sendMessage = async () => {
        if (this.state.phone != null) {
            await fetch("https://api.kasipodaq.org/api/v1/send_sms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone: this.state.phone,
                    method: "restore_password"
                })
            });
            this.setState({ currentPosition: 1 });
        }
    }

    confirmMessage = async () => {
        if (this.state.smsCode != null) {
            await fetch("https://api.kasipodaq.org/api/v1/confirm_sms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone: this.state.phone,
                    sms_code: this.state.smsCode
                })
            });

            this.setState({ currentPosition: 2 });
        }
    }

    restore = async () => {
        const body = {};

        if (this.state.phone != null && this.state.phone != "") {
            body.phone = this.state.phone;
        }

        if (this.state.smsCode != null && this.state.smsCode != "") {
            body.sms_code = this.state.smsCode;
        }

        if (this.state.password != null && this.state.password != "") {
            body.new_password = this.state.password;
        } else {
          Alert.alert("Обязательное поле", "Заполните поле Пароль");
          return;
        }

        if (this.state.password != this.state.newPassword) {
          Alert.alert("Восстановление пароля", "Пароли не совпадают");
          return;
        }

        const response = await fetch("https://api.kasipodaq.org/api/v1/restore_password", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.state.tokenId
            },
            body: JSON.stringify(body)
        })

        if (response.status != 202) {
            response.json().then(data => {
              if (Array.isArray(data)) {
                  Alert.alert("", data.map(error => error.message).join("\n"));
              } else {
                  Alert.alert("", data.message);
              }
            })
        } else {
            this.setState({ isLoading: false }, () => {
                Alert.alert("", "Ваш пароль успешно изменён!", [
                  { text: "Войти", onPress: () => this.props.navigation.navigate("login") },
                ]);
            })
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
                    {
                        this.state.currentPosition == 0 &&
                        <>
                            <View style={styles.card}>
                                <Text style={styles.label}>Номер телефона</Text>

                                <View style={styles.inputRow}>
                                    <Image source={require("../assets/phone-icon.png")} style={{width: 24, height: 24}}/>
                                    <TextInputMask
                                        type={'custom'}
                                        options={{
                                            mask: '9(999)999-99-99',
                                        }}
                                        value={this.state.phone}
                                        placeholder={"7(___)___-__-__"}
                                        onChangeText={phone => {
                                            this.setState({
                                                phone: phone.replace(/[^0-9]/g, '')
                                            })
                                        }}
                                        style={{ width: "100%" }}
                                    />
                                </View>

                                <View style={styles.cardBottom}>
                                    <TouchableHighlight style={styles.loginButton} onPress={this.sendMessage} underlayColor="#00AEEF">
                                        <Text style={{color: '#2E384D', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Получить СМС</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>

                            <TouchableOpacity style={{ alignItems: "center" }}>
                                <Text style={{color: "#9A9B9C", fontSize: 14}}>Пользовательское соглашение</Text>
                            </TouchableOpacity>
                        </>
                    }

                    {
                        this.state.currentPosition == 1 &&
                        <>
                            <View style={styles.card}>
                                <Text style={styles.label}>Код из СМС</Text>

                                <View style={styles.inputSmsRow}>
                                    <TextInput
                                        placeholder="Введите код из СМС-Сообщения"
                                        placeholderTextColor="#BFC5D2"
                                        onChangeText={text => this.setState({smsCode: text})}
                                        style={{ paddingVertical: 10, paddingHorizontal: 11, fontSize: 16, width: "100%", height: "100%", }}
                                    />
                                </View>

                                <View style={styles.cardBottom}>
                                    <TouchableHighlight style={styles.loginButton} onPress={this.confirmMessage} underlayColor="#00AEEF">
                                        <Text style={{color: '#2E384D', fontWeight: "500", fontSize: 16, lineHeight: 24}} >Продолжить</Text>
                                    </TouchableHighlight>
                                </View>

                                <View style={styles.infoRow}>
                                    <Image source={require("../assets/info-icon.png")} style={{width: 20, height: 20}}/>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            lineHeight: 18,
                                            color: "#9A9B9C",
                                            marginLeft: 10,
                                        }}
                                    >
                                        Для подтверждения регистрации на указанный номер был выслан СМС-код.
                                        <Text>Выслать код еще раз</Text>
                                    </Text>
                                </View>

                            </View>

                            <TouchableOpacity style={{ alignItems: "center" }}>
                                <Text style={{color: "#9A9B9C", fontSize: 14}}>Пользовательское соглашение</Text>
                            </TouchableOpacity>
                        </>
                    }

                    {
                        this.state.currentPosition == 2 &&
                        <>
                            <View style={styles.card}>

                                <Text style={styles.label}>Новый пароль</Text>

                                <View style={styles.inputRow}>
                                    <TextInput
                                        placeholder="Заполните поле"
                                        placeholderTextColor="#BFC5D2"
                                        secureTextEntry={this.state.secure}
                                        onChangeText={text => this.setState({password: text})}
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
                                        onChangeText={text => this.setState({newPassword: text})}
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
                                    <TouchableHighlight style={styles.saveButton} onPress={this.restore} underlayColor="#00AEEF">
                                        <Text style={{color: '#2E384D', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Сохранить</Text>
                                    </TouchableHighlight>
                                </View>

                            </View>

                        </>
                    }

                    <StepIndicator
                        customStyles={customStyles}
                        currentPosition={this.state.currentPosition}
                        stepCount={3}
                    />

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

export default RestorePasswordScreen;
