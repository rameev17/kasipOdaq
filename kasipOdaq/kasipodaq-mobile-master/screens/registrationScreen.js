import React from "react";
import { View, StyleSheet, TextInput, Text, Image, TouchableOpacity, TouchableHighlight, ScrollView, Alert } from "react-native";
import StepIndicator from 'react-native-step-indicator';

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import RNPickerSelect from 'react-native-picker-select';

import { AsyncStorage } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import DatePicker from 'react-native-datepicker'
import {TextInputMask} from "react-native-masked-text";

class RegistrationScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            currentPosition: 0,
            phone: null,
            smsCode: null,
            firstName: null,
            familyName: null,
            patronymic: null,
            birthday: null,
            individualNumber: null,
            sex: 0,
            address: null,
            password: null,
            lastPassword: null,
            secure: true,
            secure2: true,
        }
    }

    closeControlPanel = () => {
      this._drawer.close();
    }

    openControlPanel = () => {
      this._drawer.open();
    }

    sendMessage = async () => {
      if (this.state.phone != null) {
          this.setState({ isLoading: true })
          try {
              let response = await fetch("https://api.kasipodaq.org/api/v1/send_sms", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                      phone: this.state.phone,
                      method: "register"
                  })
              });

              if (response.status != 201) {
                  let data = await response.json();

                  Alert.alert("", data.message);
                  this.setState({isLoading: false})
                  return;
              }else{
                  this.setState({ currentPosition: 1, isLoading: false });
              }
          } catch(error) {
              alert(error);
          }
      }
    }

    confirmMessage = async () => {
      if (this.state.smsCode != null) {
          this.setState({ isLoading: true })
          try {
              let response = await fetch("https://api.kasipodaq.org/api/v1/confirm_sms", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                      phone: this.state.phone,
                      sms_code: this.state.smsCode
                  })
              });

              if (response.status != 200) {
                  data = await response.json();

                  Alert.alert("", data.message);
                  this.setState({isLoading: false})
                  return;
              }else{
                  this.setState({ currentPosition: 2, isLoading: false });
              }
          } catch(error) {
              alert(error);
          }
      }
    }

    register = async () => {
      const body = {};

      if (this.state.phone != null && this.state.phone != "") {
        body.phone = this.state.phone;
      }

      if (this.state.smsCode != null && this.state.smsCode != "") {
        body.sms_code = this.state.smsCode;
      }

      if (this.state.firstName != null && this.state.firstName != "") {
        body.first_name = this.state.firstName;
      } else {
        Alert.alert("Обязательное поле", "Заполните поле Имя");
        return;
      }

      if (this.state.familyName != null && this.state.familyName != "") {
        body.family_name = this.state.familyName;
      } else {
        Alert.alert("Обязательное поле", "Заполните поле Фамилия");
        return;
      }

      if (this.state.birthday != null && this.state.birthday != "") {
        body.birthday = this.state.birthday;
      } else {
        Alert.alert("Обязательное поле", "Заполните поле День рождения");
        return;
      }

      if (this.state.individualNumber != null && this.state.individualNumber != "") {
        body.uid = this.state.individualNumber;
      } else {
        Alert.alert("Обязательное поле", "Заполните поле ИИН");
        return;
      }

      body.sex = this.state.sex;

      if (this.state.address != null && this.state.address != "") {
        body.physical_address = this.state.address;
      }

      if (this.state.password != null && this.state.password != "") {
        body.password = this.state.password;
      } else {
        Alert.alert("Обязательное поле", "Заполните поле Пароль");
        return;
      }

      if (this.state.password != this.state.lastPassword) {
        Alert.alert("Регистрация", "Пароли не совпадают");
        return;
      }

      this.setState({ isLoading: true })

      const response = await fetch("https://api.kasipodaq.org/api/v1/register", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
      });

        if (response.status != 200) {
            response.json().then(data => {
              if (Array.isArray(data)) {
                  Alert.alert("", data.map(error => error.message).join("\n"));
              } else {
                  Alert.alert("", data.message);
              }
              this.setState({ isLoading: false })
              return;
            });
        } else {
        this.setState({ isLoading: false }, () => {
          Alert.alert("Регистрация", "Вы успешно зарегистрированы", [
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
              <Spinner
                  visible={this.state.isLoading}
              />
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
                            <Text style={styles.label}>Имя*</Text>

                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="Заполните поле"
                                    placeholderTextColor="#BFC5D2"
                                    onChangeText={text => this.setState({firstName: text})}
                                    style={{ paddingVertical: 10, fontSize: 16, width: "100%" }}
                                />
                            </View>

                            <Text style={styles.label}>Фамилия*</Text>

                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="Заполните поле"
                                    placeholderTextColor="#BFC5D2"
                                    onChangeText={text => this.setState({familyName: text})}
                                    style={{ paddingVertical: 10, fontSize: 16, width: "100%" }}
                                />
                            </View>

                            <Text style={styles.label}>Отчество</Text>

                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="Заполните поле"
                                    placeholderTextColor="#BFC5D2"
                                    onChangeText={text => this.setState({patronymic: text})}
                                    style={{ paddingVertical: 10, fontSize: 16, width: "100%" }}
                                />
                            </View>

                            <Text style={styles.label}>Дата рождения*</Text>

                            <DatePicker
                                style={{width: "100%"}}
                                date={this.state.birthday}
                                mode="date"
                                locale={"ru-RU"}
                                placeholder="Выберите дату"
                                format="DD-MM-YYYY"
                                minDate="01-01-1900"
                                maxDate="31-12-2020"
                                confirmBtnText="Выбрать"
                                cancelBtnText="Закрыть"
                                customStyles={{
                                    dateIcon: {
                                      display: "none"
                                    },
                                    dateInput: {
                                        alignItems: "flex-start",
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        borderTopWidth: 0,
                                        borderLeftWidth: 0,
                                        borderRightWidth: 0,
                                        borderBottomColor: "#E4E8F0",
                                        borderBottomWidth: 1,
                                    }
                                }}
                                onDateChange={(date) => this.setState({ birthday: date })}
                            />
                            <Text style={{ marginTop: 25 }}></Text>
                            <Text style={styles.label}>ИИН*</Text>

                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="Заполните поле"
                                    placeholderTextColor="#BFC5D2"
                                    keyboardType={'numeric'}
                                    onChangeText={text => this.setState({individualNumber: text})}
                                    style={{ paddingVertical: 10, fontSize: 16, width: "100%" }}
                                />
                            </View>

                            <Text style={styles.label}>Пол</Text>
                            <View
                              style={{
                                height: 44,
                                padding: 10,
                              alignItems: "center",
                                marginTop: 4,
                                marginBottom: 40,
                                borderColor: "#E4E8F0",
                                borderWidth: 1,
                                borderRadius: 4,
                                color: "#BFC5D2",
                                fontSize: 16,
                                lineHeight: 24,
                            }}>
                              <RNPickerSelect
                                  placeholder={{ label: "Выберите пол", value: "Выберите пол" }}
                                  onValueChange={(value) => this.setState({sex: value})}
                                  textStyle={{
                                    height: 44,
                                    padding: 10,
                                  alignItems: "center",
                                    marginTop: 4,
                                    marginBottom: 40,
                                    borderColor: "#E4E8F0",
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    color: "#BFC5D2",
                                    fontSize: 16,
                                    lineHeight: 24,
                                  }}
                                  items={[
                                      { label: 'Мужской', value: 1 },
                                      { label: 'Женский', value: 0 },
                                  ]}
                              />
                            </View>

                            <Text style={styles.label}>Адрес проживания*</Text>

                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="Заполните поле"
                                    placeholderTextColor="#BFC5D2"
                                    onChangeText={text => this.setState({address: text})}
                                    style={{ paddingVertical: 10, fontSize: 16, width: "100%" }}
                                />
                            </View>

                            <Text style={styles.label}>Пароль*</Text>

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

                            <Text style={styles.label}>Повторите пароль*</Text>

                            <View style={styles.inputRow}>
                                <TextInput
                                    placeholder="Заполните поле"
                                    placeholderTextColor="#BFC5D2"
                                    secureTextEntry={this.state.secure2}
                                    onChangeText={text => this.setState({lastPassword: text})}
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
                                <TouchableHighlight style={styles.saveButton} onPress={this.register} underlayColor="#00AEEF">
                                    <Text style={{color: '#2E384D', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Зарегистрироваться</Text>
                                </TouchableHighlight>
                            </View>

                        </View>

                        <TouchableOpacity style={{ alignItems: "center" }}>
                            <Text style={{color: "#9A9B9C", fontSize: 14}}>Пользовательское соглашение</Text>
                        </TouchableOpacity>

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

export default RegistrationScreen;
