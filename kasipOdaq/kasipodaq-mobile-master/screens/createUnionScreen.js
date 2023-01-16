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
    Picker,
    Linking
} from "react-native";
import StepIndicator from 'react-native-step-indicator';
import RNPickerSelect from 'react-native-picker-select';

import { AsyncStorage, Alert } from "react-native";
import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "./navigationMenu";
import Drawer from "react-native-drawer";
import * as DocumentPicker from "expo-document-picker";
import * as mime from "react-native-mime-types";
import Spinner from "react-native-loading-spinner-overlay";

class CreateUnionScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            union_sample: [],
            organization: '',
            ppoName: null,
            industries: [],
            placeName: 'Город/область',
            industryName: 'Отраслевое объединение',
            unionName: 'Профсоюзное объединение',
            industryId: null,
            placeId: null,
            unionId: null,
            isLoading: false,
            union_protocol_id: null,
            union_position_id: null,
            union_statement_id: null,
            protocolFile: {
              name: "протокол"
            },
            positionFile: {
              name: "положение"
            },
            statementFile: {
              name: "заявление"
            },
            protocolFileSample: {
                name: "Проект протокола"
            },
            positionFileSample: {
                name: "Проект положения"
            },
            statementFileSample: {
                name: "Скачать заявление"
            }
        }

        this.createUnion = this.createUnion.bind(this)

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

    componentWillReceiveProps = (props) => {
        this.setState({
            industryName: props.route.params.industryName || 'Отраслевое объединение',
            industryId: props.route.params.industryId || null,
            placeName: props.route.params.placeName || 'Город/область',
            placeId: props.route.params.placeId || null,
            unionName: props.route.params.unionName || 'Профсоюзное объединеие',
            unionId: props.route.params.unionId || null,
            protocolFileSample: props.route.params.protocol_sample,
            positionFileSample: props.route.params.position_sample,
            statementFileSample: props.route.params.statement_sample
        })
    }

    createUnion = async () => {

        if (this.state.unionId == null && this.state.industryId == null){
            Alert.alert("", "Выберите пожалуйста либо Отраслевое объединение либо Профсоюзное объединение")
        }else if (this.state.placeId == null){
            Alert.alert("", "Выберите пожалуйста Город/Область")
        } else{
            this.setState({isLoading: true})

            this.uploadFile(this.state.protocolFile, response => {
                this.setState({union_protocol_id: response.headers.map['x-entity-id']});

                this.uploadFile(this.state.positionFile, response => {
                    this.setState({union_position_id: response.headers.map['x-entity-id']});

                    this.uploadFile(this.state.statementFile, response => {
                        this.setState({union_statement_id: response.headers.map['x-entity-id']});

                        let body = JSON.stringify({
                            union_name: this.state.ppoName,
                            union_protocol_id: this.state.union_protocol_id,
                            union_position_id: this.state.union_position_id,
                            union_statement_id: this.state.union_statement_id,
                            association_id: this.state.placeId
                        })

                        if (this.state.unionId !== null){
                            body.root_union_id = this.state.unionId
                        }

                        if (this.state.industryId !== null){
                            body.industry_id = this.state.industryId
                        }

                        try {
                            AsyncStorage.getItem("token").then(async token => {
                                const response = await fetch("https://api.kasipodaq.org/api/v1/create_union", {
                                    method: "POST",
                                    headers: {
                                        "Authorization": token,
                                        "Content-Type": "application/json"
                                    },
                                    body: body
                                });

                                this.setState({isLoading: false});

                                if (response.status != 200) {
                                    response.json().then(data => {
                                        Alert.alert("", data.message);
                                    })

                                    return;
                                }

                                const applicationId = response.headers.map["x-entity-id"];

                                Alert.alert("Создать профсоюз", `Заявка #${applicationId} на создание успешно подана`, [
                                    { text: "ОК", onPress: () => this.props.navigation.navigate("newsList") },
                                ]);
                            });
                        } catch(error) {
                            alert(error);
                        }
                    });
                });
            });
        }

    }

    uploadFile = (file, then) => {
      const filenameParts = file.name.split('.');

      const formData = new FormData();

      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: mime.lookup(filenameParts[filenameParts.length - 1])
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
            }).then(response => {
              then(response);
            });
          });
      } catch(error) {
          alert(error);
      }
    }

    chooseProtocol = () => {
      this.chooseFile(response => {
        if (response.type !== "cancel") {
          this.setState({
            protocolFile: response
          })
        }
      });
    }

    choosePosition = () => {
      this.chooseFile(response => {
        if (response.type !== "cancel") {
          this.setState({
            positionFile: response
          })
        }
      });
    }

    chooseStatement = () => {
      this.chooseFile(response => {
        if (response.type !== "cancel") {
          this.setState({
            statementFile: response
          })
        }
      });
    }

    chooseFile = (then) => {
      DocumentPicker.getDocumentAsync().then(response => {
        then(response);
      })
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
                <View style={styles.card}>
                    <Text style={styles.label}>Название вашей организации</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            placeholder="Заполните поле"
                            placeholderTextColor="#BFC5D2"
                            autoFocus={false}
                            onChangeText={text => this.setState({ppoName: text})}
                            style={{ paddingVertical: 10, fontSize: 16, width: "100%" }}
                        />
                    </View>

                    <View style={styles.selectRow}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("placesList")}>
                            <Text style={{ color: "#9A9B9C" }}>{ this.state.placeName }</Text>
                        </TouchableOpacity>
                      {/*<RNPickerSelect*/}
                      {/*    onValueChange={(value) => this.setState({industryId: value})}*/}
                      {/*    placeholder={{label: "Отраслевое объединение"}}*/}
                      {/*    useNativeAndroidPickerStyle={false}*/}
                      {/*    style={{*/}
                      {/*        padding: 10,*/}
                      {/*        marginTop: 4,*/}
                      {/*        marginBottom: 40,*/}
                      {/*        borderColor: "#E4E8F0",*/}
                      {/*        borderWidth: 1,*/}
                      {/*        borderRadius: 4,*/}
                      {/*        color: "red",*/}
                      {/*        fontSize: 16,*/}
                      {/*        flexWrap: "wrap",*/}
                      {/*    }}*/}
                      {/*    items={this.state.industries.map(industry => Object({label: industry.name, value: industry.resource_id}))}*/}
                      {/*/>*/}
                    </View>

                    <View style={styles.selectRow}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("industriesList")}>
                            <Text style={{ color: "#9A9B9C" }}>{ this.state.industryName }</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.selectRow}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("unionList")}>
                            <Text style={{ color: "#9A9B9C" }}>{ this.state.unionName }</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        marginTop: 24,
                        borderTopWidth: 1,
                        borderTopColor: "#E4E8F0",
                        borderBottomColor: "#E4E8F0",
                        borderBottomWidth: 1
                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 16,
                            borderBottomColor: "#E4E8F0",
                            borderBottomWidth: 1
                        }}>
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.protocolFileSample.uri ? this.state.protocolFileSample.uri : "name" )}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    { this.state.protocolFileSample?.name }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.protocolFileSample.uri ? this.state.protocolFileSample.uri : "name" )}>
                            <Image
                                source={require("../assets/download_icon.png")}
                                style={{
                                    width: 24,
                                    height: 23,
                                }} />
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 16,
                            borderBottomColor: "#E4E8F0",
                            borderBottomWidth: 1
                        }}>
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.positionFileSample.uri ? this.state.positionFileSample.uri : "name" )}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    { this.state.positionFileSample?.name }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.positionFileSample.uri ? this.state.positionFileSample.uri : "name" )}>
                            <Image
                                source={require("../assets/download_icon.png")}
                                style={{
                                    width: 24,
                                    height: 23,
                                }} />
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 16,
                            borderBottomColor: "#E4E8F0",
                            borderBottomWidth: 1
                        }}>
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.statementFileSample.uri ? this.state.statementFileSample.uri : "name" )}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    { this.state.statementFileSample?.name }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.statementFileSample.uri ? this.state.statementFileSample.uri : "name" )}>
                            <Image
                                source={require("../assets/download_icon.png")}
                                style={{
                                    width: 24,
                                    height: 23,
                                }} />
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 16,
                            borderBottomColor: "#E4E8F0",
                            borderBottomWidth: 1
                        }}>
                            <TouchableOpacity onPress={this.chooseProtocol}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    {this.state.protocolFile.name}
                                </Text>
                            </TouchableOpacity>
                            {
                                !this.state.protocolFile.size ?
                                    <Image
                                        source={require("../assets/clip.png")}
                                        style={{
                                            width: 22,
                                            height: 23,
                                        }} />
                                    :
                                    <TouchableOpacity onPress={() => { this.setState({ protocolFile: { name: "Протокол" } }) }}>
                                        <Image
                                            source={require("../assets/file_delete.png")}
                                            style={{
                                                width: 20,
                                                height: 26,
                                            }} />
                                    </TouchableOpacity>
                            }
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 16,
                        }}>
                            <TouchableOpacity onPress={this.choosePosition}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    {this.state.positionFile.name}
                                </Text>
                            </TouchableOpacity>
                            {
                                !this.state.positionFile.size ?
                                    <TouchableOpacity onPress={this.choosePosition}>
                                    <Image
                                        source={require("../assets/clip.png")}
                                        style={{
                                            width: 22,
                                            height: 23,
                                        }} />
                                    </TouchableOpacity>
                                        :
                                    <TouchableOpacity onPress={() => { this.setState({ positionFile: { name: "Положение" } }) }}>
                                        <Image
                                            source={require("../assets/file_delete.png")}
                                            style={{
                                                width: 20,
                                                height: 26,
                                            }} />
                                    </TouchableOpacity>
                            }
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 16,
                        }}>
                            <TouchableOpacity onPress={this.chooseStatement}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    {this.state.statementFile.name}
                                </Text>
                            </TouchableOpacity>
                            {
                                !this.state.statementFile.size ?
                                    <TouchableOpacity onPress={this.chooseStatement}>
                                    <Image
                                        source={require("../assets/clip.png")}
                                        style={{
                                            width: 22,
                                            height: 23,
                                    }} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => { this.setState({ statementFile: { name: "Заявление" } }) }}>
                                        <Image
                                            source={require("../assets/file_delete.png")}
                                            style={{
                                                width: 20,
                                                height: 26,
                                            }} />
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <View style={{ marginTop: 24, alignItems: "center" }}>
                        <TouchableHighlight style={styles.saveButton} onPress={this.createUnion} underlayColor="#00AEEF">
                            <Text style={{color: '#ffffff', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Создать</Text>
                        </TouchableHighlight>
                    </View>

                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    margin: 24,
                    justifyContent: "center"
                }}>
                    <Image source={require("../assets/info_checked.png")} style={{width: 16, height: 15}}/>
                    <Text
                        style={{
                            fontSize: 16,
                            lineHeight: 18,
                            color: "#9A9B9C",
                            marginLeft: 10,
                        }}
                    >
                        Нажимая на кнопку, Вы соглашаетесь на обработку персональных данных.
                    </Text>
                </View>

                <TouchableOpacity style={{ alignItems: "center", marginBottom: 32 }}>
                    <Text style={{color: "#9A9B9C", fontSize: 14}}>Пользовательское соглашение</Text>
                </TouchableOpacity>

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
        marginBottom: 40,
        paddingBottom: 4,
        alignItems: "center",
        borderBottomColor: "#E4E8F0",
        borderBottomWidth: 1,
    },
    selectRow: {
        minHeight: 40,
        paddingLeft: 8,
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

export default CreateUnionScreen;
