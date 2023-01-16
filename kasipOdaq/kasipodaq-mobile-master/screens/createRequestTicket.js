import React from "react";

import {
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    AsyncStorage,
    TextInput,
    StyleSheet, TouchableHighlight
} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import * as DocumentPicker from "expo-document-picker";
import * as mime from "react-native-mime-types";

class CreateRequestTicketScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: null,
            content: null,
            file: {
                name: "Прикрепить файл"
            }
        }

        this.chooseRequestFile = this.chooseRequestFile.bind(this)
        this.createTicket = this.createTicket.bind(this)

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

    chooseRequestFile = () => {
        this.chooseFile(response => {
            if (response.type !== "cancel") {
                this.setState({
                    file: response
                })
            }
        });
    }

    chooseFile = (then) => {
        DocumentPicker.getDocumentAsync().then(response => {
            then(response);
        })
    }

    createTicket = async () => {
      if (this.state.title && this.state.title != "" &&
          this.state.content && this.state.content != "") {
        try {
            this.setState({ isLoading: true })

            let files = [];

            this.uploadFile(this.state.file, response => {
                files.push(response.headers.map['x-entity-id']);

                AsyncStorage.getItem("token").then(async token => {
                    const response = await fetch("https://api.kasipodaq.org/api/v1/appeals/", {
                        method: "POST",
                        headers: {
                            "Authorization": token,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: this.state.title,
                            content: this.state.content,
                            type: this.props.route.params.id,
                            files: files.join(",")
                        })
                    })
                    if (this.props.route.params.id == 0) {
                        this.props.navigation.navigate("appeals")
                    } else {
                        this.props.navigation.navigate("help")
                    }
                })
            });
        } catch(error) {
            alert(error);
        }
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

    render = () => {
        return (
          <Drawer
            ref={(ref) => this._drawer = ref}
            openDrawerOffset={0.2}
            tapToClose={true}
            content={<NavigationMenu {...this.props}/>}
            >
            <ScrollView>
                <View style={{backgroundColor: "#EFF1F5", flex: 1}}>
                    <View style={{
                        backgroundColor: "#ffff",
                        flex: 1,
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
                    }}>

                        <Text style={styles.memberInfo}>
                            Тема:
                        </Text>
                        <TextInput
                            placeholder=""
                            placeholderTextColor="#BFC5D2"
                            numberOfLines={1}
                            onChangeText={text => this.setState({title: text})}
                            autoFocus={true}
                            selectionColor={"#00AEEF"}
                            style={{
                                width: "98%",
                                paddingLeft: 4,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: "#E4E8F0",
                                marginBottom: 8,
                            }}
                        />

                        <Text style={styles.memberInfo}>
                            Содержание:
                        </Text>
                        <TextInput
                            placeholder="Введите текст..."
                            multiline={true}
                            numberOfLines={10}
                            placeholderTextColor="#BFC5D2"
                            onChangeText={text => this.setState({content: text})}
                            autoFocus={true}
                            selectionColor={"#00AEEF"}
                            style={{
                                width: "98%",
                                padding: 10,
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: "#E4E8F0",
                                marginBottom: 8,
                                textAlignVertical: "top"
                            }}
                        />

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "98%",
                            marginVertical: 16,
                            paddingVertical: 16,
                            paddingHorizontal: 16,
                            borderTopWidth: 1,
                            borderTopColor: "#E4E8F0",
                            borderBottomColor: "#E4E8F0",
                            borderBottomWidth: 1
                        }}>
                            <TouchableOpacity onPress={this.chooseRequestFile}>
                                <Text style={{
                                    color: "#01579B",
                                    fontSize: 16,
                                    lineHeight: 24,
                                }}>
                                    {this.state.file.name}
                                </Text>
                            </TouchableOpacity>
                            {
                                !this.state.file.size ?
                                    <TouchableOpacity onPress={this.chooseRequestFile}>
                                    <Image
                                        source={require("../assets/clip.png")}
                                        style={{
                                            width: 22,
                                            height: 23,
                                        }} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => { this.setState({ file: { name: "Прикрепить файл" } }) }}>
                                        <Image
                                            source={require("../assets/file_delete.png")}
                                            style={{
                                                width: 20,
                                                height: 26,
                                            }} />
                                    </TouchableOpacity>
                            }

                        </View>

                        <View style={{ marginTop: 32, alignItems: "center" }}>
                            <TouchableHighlight style={styles.saveButton} onPress={this.createTicket} underlayColor="#00AEEF">
                                <Text style={{color: '#2E384D', fontWeight: "500", fontSize: 16, lineHeight: 24}}>Отправить</Text>
                            </TouchableHighlight>
                        </View>

                    </View>
                </View>

            </ScrollView>
            <BottomMenu {...this.props} openControlPanel={this.openControlPanel} closeControlPanel={this.closeControlPanel}/>
          </Drawer>
        );
    }
}

const styles = StyleSheet.create({
    memberInfo: {
        marginTop: 16,
        marginBottom: 4,
        color: "#0052A4",
        fontSize: 14,
        lineHeight: 24,
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

export default CreateRequestTicketScreen;
