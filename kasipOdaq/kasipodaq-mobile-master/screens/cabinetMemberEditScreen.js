import React from "react";
import RNPickerSelect from 'react-native-picker-select';
import {Picker, TouchableHighlight, TouchableWithoutFeedback} from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    AsyncStorage,
    StyleSheet,
    TextInput
} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import DatePicker from "react-native-datepicker";

class CabinetMemberEditScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: [],
            token: null,
            isFocused: false,
            name: null,
            familyName: null,
            patronymic: null,
            birthday: null,
            sex: null,
            email: null,
            address: null,
        }

        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.editProfile = this.editProfile.bind(this)

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
                        profile: data,
                        name: data.first_name,
                        familyName: data.family_name,
                        patronymic: data.patronymic,
                        birthday: data.birthday,
                        sex: data.sex,
                        email: data.email,
                        address: data.physical_address
                    }));
            });
        } catch(error) {
            alert(error);
        }
    }

    chooseFile = () => {
      ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.Images}).then(picture => {
        const pictureParts = picture.uri.split(".");
        const uriParts = picture.uri.split("/");

        const formData = new FormData();

        formData.append("file", {
          uri: picture.uri,
          type: `image/${pictureParts[pictureParts.length - 1]}`,
          name: uriParts[uriParts.length - 1]
        })

        try {
            AsyncStorage.getItem("token").then(token => {
              fetch("https://api.kasipodaq.org/api/v1/upload_file", {
                method: "POST",
                headers: {
                  "Content-Type": "multipart/form-data",
                  "Authorization": token
                },
                body: formData
              })
              .then(response => {
                fetch("https://api.kasipodaq.org/api/v1/profile_edit", {
                  method: "PATCH",
                  headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    picture_id: response.headers.map["x-entity-id"]
                  })
                });

                const newProfile = this.state.profile;
                newProfile.picture_uri = picture.uri;

                this.setState({profile: newProfile});
              });
            });
        } catch(error) {
            alert(error);
        }
      })
    }

    handleFocus = event => {
        this.setState({ isFocused: true });
        // Remember to propagate the `onFocus` event to the
        // parent as well (if set)
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    }

    handleBlur = event => {
        this.setState({ isFocused: false });
        // Remember to propagate the `onBlur` event to the
        // parent as well (if set)
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    }

    editProfile = async () => {
        const response = await fetch("https://api.kasipodaq.org/api/v1/profile_edit", {
            method: "PATCH",
            headers: {
                "Authorization": this.state.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                first_name: this.state.name,
                family_name: this.state.familyName,
                patronymic: this.state.patronymic,
                birthday: this.state.birthday,
                sex: this.state.sex,
                email: this.state.email,
                physical_address: this.state.address
            })
        })

        this.props.navigation.navigate("cabinetMember");
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
            <View style={{backgroundColor: "#EFF1F5", flex: 1}}>
                <ScrollView style={styles.card}>
                    <TouchableWithoutFeedback onPress={this.chooseFile}>
                      <View style={{
                          padding: 40,
                          alignItems: "center",
                      }}>
                          <Image
                              source={{uri: this.state.profile.picture_uri}}
                              style={{width: 145, height: 145, marginTop: 16, backgroundColor: "#c4c4c4", borderRadius: 100, marginBottom: 16}}>
                          </Image>
                      </View>
                    </TouchableWithoutFeedback>

                    <View>
                        <Text style={styles.memberDefaultInfo}>
                            Изменение данных
                        </Text>
                        <Text style={styles.memberInfo}>
                            Имя
                        </Text>
                        <TextInput
                            placeholder=""
                            placeholderTextColor="#BFC5D2"
                            value={this.state.name}
                            onChangeText={text => this.setState({name: text})}
                            selectionColor={"#00AEEF"}
                            underlineColorAndroid={this.state.isFocused ? "#00AEEF" : "#E4E8F0"}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            style={styles.input}
                        />

                        <Text style={styles.memberInfo}>
                            Фамилия
                        </Text>
                        <TextInput
                            placeholder=""
                            placeholderTextColor="#BFC5D2"
                            value={this.state.familyName}
                            onChangeText={text => this.setState({familyName: text})}
                            selectionColor={"#00AEEF"}
                            underlineColorAndroid={this.state.isFocused ? "#00AEEF" : "#E4E8F0"}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            style={styles.input}
                        />

                        <Text style={styles.memberInfo}>
                            Отчество
                        </Text>
                        <TextInput
                            placeholder=""
                            placeholderTextColor="#BFC5D2"
                            value={this.state.patronymic}
                            onChangeText={text => this.setState({patronymic: text})}
                            selectionColor={"#00AEEF"}
                            underlineColorAndroid={this.state.isFocused ? "#00AEEF" : "#E4E8F0"}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            style={styles.input}
                        />

                        <Text style={styles.memberInfo}>
                            Дата рождения
                        </Text>
                        <DatePicker
                            style={{width: "100%"}}
                            date={this.state.birthday}
                            mode="date"
                            locale={"ru-RU"}
                            placeholder="Выберите дату"
                            format="DD-MM-YYYY"
                            minDate="01-01-1990"
                            maxDate="31-12-2020"
                            confirmBtnText="Выбрать"
                            cancelBtnText="Закрыть"
                            customStyles={{
                                dateIcon: {
                                    display: "none"
                                },
                                dateInput: {
                                    alignItems: "flex-start",
                                    marginLeft: 16,
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

                    </View>

                    <Text style={styles.memberInfo}>
                        Пол
                    </Text>
                    <View
                      style={{
                        height: 44,
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
                          onValueChange={(value) => { this.setState({ sex: value }) }}
                          value={this.state.sex}
                          style={{
                              width: "96%",
                              height: "100%",
                              marginLeft: 16,
                              alignItems: "center"
                          }}
                          textStyle={{
                              alignItems: "center",
                              marginLeft: 16,
                            padding: 10,
                            color: "#BFC5D2",
                            fontSize: 16,
                            lineHeight: 24,
                          }}
                          items={[
                              { label: 'Мужской', value: '1' },
                              { label: 'Женский', value: '0' },
                          ]}
                      />
                    </View>

                    <Text style={styles.memberDefaultInfo}>
                        Контакты
                    </Text>

                    <Text style={styles.memberInfo}>
                        Адрес проживания
                    </Text>
                    <TextInput
                        placeholder=""
                        placeholderTextColor="#BFC5D2"
                        value={this.state.address}
                        onChangeText={text => this.setState({address: text})}
                        selectionColor={"#00AEEF"}
                        underlineColorAndroid={this.state.isFocused ? "#00AEEF" : "#E4E8F0"}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        style={styles.input}
                    />

                    <Text style={styles.memberInfo}>
                        E-mail
                    </Text>
                    <TextInput
                        placeholder=""
                        placeholderTextColor="#BFC5D2"
                        value={this.state.email}
                        onChangeText={text => this.setState({email: text})}
                        selectionColor={"#00AEEF"}
                        underlineColorAndroid={this.state.isFocused ? "#00AEEF" : "#E4E8F0"}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        style={styles.input}
                    />

                    <View style={{ marginTop: 32, alignItems: "center" }}>
                        <TouchableHighlight style={styles.saveButton} onPress={this.editProfile} underlayColor="#00AEEF">
                            <Text style={{color: '#2E384D', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Сохранить</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.saveButton} onPress={() => this.props.navigation.navigate("cabinetMember")} underlayColor="#00AEEF">
                            <Text style={{color: '#2E384D', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Отмена</Text>
                        </TouchableHighlight>
                    </View>


                </ScrollView>
            </View>
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
        marginBottom: 4,
        paddingLeft: 16,
        color: "#0052A4",
        fontSize: 14,
        lineHeight: 24,
    },
    input: {
        marginLeft: 16,
        paddingBottom: 4,
        marginRight: 16,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E4E8F0",
        marginBottom: 8,
    },
    saveButton: {
        backgroundColor: "#EFF1F5",
        borderRadius: 4,
        width: 247,
        height: 44,
        color: "#2E384D",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
});

export default CabinetMemberEditScreen;
