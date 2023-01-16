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
import * as DocumentPicker from "expo-document-picker";
import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "./navigationMenu";
import Drawer from "react-native-drawer";
import Autocomplete from "react-native-autocomplete-input";
import * as mime from "react-native-mime-types";
import Spinner from "react-native-loading-spinner-overlay";

class JoinUnionScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            organization: null,
            organizationName: '',
            parentUnion: 'Профсоюзное объединение',
            parentIndustry: 'Отраслевое объединение',
            unions: [],
            union_sample: [],
            union_id: null,
            placeName: 'Город/область',
            placeId: null,
            hideResults: true,
            isLoading: false,
            entry_sample: {
                name: "Образец на вступление"
            },
            hold_sample: {
              name: "Образец на удержание"
            },
            joinApplication: {
              name: "Заявление на вступление"
            },
            retentionApplication: {
              name: "Заявление на удержание" 
            }
        }

        this.joinUnion = this.joinUnion.bind(this)

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

    joinUnion = async () => {

        if (this.state.placeId == null){
            Alert.alert("", "Выберите пожалуйста город/область")
        }else{
            this.setState({isLoading: true})

            let files = [];

            this.uploadFile(this.state.joinApplication, response => {
                files.push(response.headers.map['x-entity-id']);

                this.uploadFile(this.state.retentionApplication, response => {
                    files.push(response.headers.map['x-entity-id']);

                    try {
                        AsyncStorage.getItem("token").then(async token => {
                            const response = await fetch("https://api.kasipodaq.org/api/v1/join_union", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": token
                                },
                                body: JSON.stringify({
                                    union_id: this.state.union_id,
                                    association_id: this.state.placeId,
                                    files: files.join(",")
                                })
                            });

                            this.setState({isLoading: false});

                            if (response.status != 200) {
                                response.json().then(data => {
                                    Alert.alert("", data.message);
                                })

                                return;
                            }

                            const applicationId = response.headers.map["x-entity-id"];

                            Alert.alert("Вступить в профсоюз", `Заявка #${applicationId} на вступление успешно подана`, [
                                { text: "ОК", onPress: () => this.props.navigation.navigate("newsList") },
                            ]);
                        });
                    } catch(error) {
                        alert(error);
                    }
                });
            });
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            placeName: props.route.params.placeName || 'Город/область',
            placeId: props.route.params.placeId || null,
        })
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

    onUnionsChangeText = text => {
      this.setState({
        organizationName: text
      });

      if (text.length > 2) {
        try {
            AsyncStorage.getItem("token").then(token => {
              fetch(`https://api.kasipodaq.org/api/v1/unions/?max_depth=2&search=${text}`, {
                headers: {
                    "Authorization": token
                }
              }).then(response => response.json())
                .then(data => this.setState({unions: data}));
            });
        } catch(error) {
            alert(error);
        }
      }
    }

    chooseJoinApplication = () => {
      this.chooseFile(response => {
        if (response.type !== "cancel") {
          this.setState({
            joinApplication: response
          })
        }
      });
    }

    chooseRetentionApplication = () => {
      this.chooseFile(response => {
        if (response.type !== "cancel") {
          this.setState({
            retentionApplication: response
          })
        }
      });
    }

    chooseFile = (then) => {
      DocumentPicker.getDocumentAsync().then(response => {
        then(response);
      })
    }

    onSelectItemPress = item => {
      this.setState({
        hideResults: true,
        organizationName: item.name,
        union_id: item.resource_id,
        parentIndustry: item.industry.name,
        parentUnion: item.root_union.name,
        entry_sample: item.entry_sample
      }, () => {
          try {
              AsyncStorage.getItem("token").then(token => {
                  fetch(`https://api.kasipodaq.org/api/v1/unions/${this.state.union_id}`, {
                      headers: {
                          "Authorization": token
                      }
                  }).then(response => response.json())
                      .then(data => this.setState({union_sample: data}));
              });
          } catch(error) {
              alert(error);
          }
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

                    <View style={{...styles.selectRow, marginBottom: 20 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("placesListUnion")}>
                            <Text style={{
                                paddingVertical: 10,
                                paddingHorizontal: 11,
                                fontSize: 16,
                                width: "100%",
                                color: "#BFC5D2"
                            }}>{ this.state.placeName }</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Первичная организация</Text>
                    <View style={styles.inputRow}>
                      <Autocomplete
                        data={this.state.unions}
                        defaultValue={this.state.organizationName}
                        onChangeText={this.onUnionsChangeText}
                        onFocus={() => this.setState({hideResults: false})}
                        containerStyle={{flex: 1, backgroundColor: "#ffffff", borderWidth: 0, zIndex: 1}}
                        listContainerStyle={{flex: 1}}
                        inputContainerStyle={{paddingVertical: 10, borderWidth: 0, fontSize: 16}}
                        placeholder="Заполните поле"
                        placeholderTextColor="#BFC5D2"
                        hideResults={this.state.hideResults}
                        renderItem={({item}) => (
                          <TouchableOpacity onPress={() => this.onSelectItemPress(item)}>
                            <Text style={{margin: 5}}>{item.name}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>

                    <View style={styles.selectRow}>
                        <TextInput
                            value={this.state.parentIndustry}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 11,
                                fontSize: 16,
                                width: "100%",
                                color: "#BFC5D2"
                            }}
                        />
                    </View>

                    <View style={styles.selectRow}>
                        <TextInput
                            value={this.state.parentUnion}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 11,
                                fontSize: 16,
                                width: "100%",
                                color: "#BFC5D2"
                            }}
                        />
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
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.entry_sample.uri ? this.state.entry_sample.uri : "name")}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    { this.state.entry_sample?.name }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.entry_sample.uri ? this.state.entry_sample.uri : "name")}>
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
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.hold_sample.uri ? this.state.hold_sample.uri : "name")}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    { this.state.hold_sample.name }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.hold_sample.uri ? this.state.hold_sample.uri : "name")}>
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
                            <TouchableOpacity onPress={this.chooseJoinApplication}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    {this.state.joinApplication.name}
                                </Text>
                            </TouchableOpacity>
                            {
                                !this.state.joinApplication.size ?
                                    <TouchableOpacity onPress={this.chooseJoinApplication}>
                                    <Image
                                        source={require("../assets/clip.png")}
                                        style={{
                                            width: 22,
                                            height: 23,
                                        }} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => { this.setState({ joinApplication: { name: "Заявление на вступление" } }) }}>
                                        <Image
                                            source={require("../assets/file_delete.png")}
                                            style={{
                                                width: 20,
                                                height: 26,
                                            }}>
                                        </Image>
                                    </TouchableOpacity>
                            }
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 16,
                        }}>
                            <TouchableOpacity onPress={this.chooseRetentionApplication}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    {this.state.retentionApplication.name}
                                </Text>
                            </TouchableOpacity>
                            {
                                !this.state.retentionApplication.size ?
                                    <TouchableOpacity onPress={this.chooseRetentionApplication}>
                                    <Image
                                        source={require("../assets/clip.png")}
                                        style={{
                                            width: 22,
                                            height: 23,
                                        }} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => { this.setState({ retentionApplication: { name: "Заявление на вступление" } }) }}>
                                        <Image
                                            source={require("../assets/file_delete.png")}
                                            style={{
                                                width: 20,
                                                height: 26,
                                            }}>
                                        </Image>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <View style={{ marginTop: 24, alignItems: "center" }}>
                        <TouchableHighlight style={styles.saveButton} onPress={this.joinUnion} underlayColor="#00AEEF">
                            <Text style={{color: '#ffffff', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Вступить</Text>
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
        paddingBottom: 4,
        marginBottom: 41,
        alignItems: "center",
        borderBottomColor: "#E4E8F0",
        borderBottomWidth: 1,
    },
    selectRow: {
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
    autocompleteContainer: {
      flex: 1,
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: 1
    }
});

export default JoinUnionScreen;
