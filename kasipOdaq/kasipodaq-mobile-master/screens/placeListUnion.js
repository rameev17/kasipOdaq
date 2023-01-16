
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
    Picker, RefreshControl
} from "react-native";
import StepIndicator from 'react-native-step-indicator';
import RNPickerSelect from 'react-native-picker-select';

import { AsyncStorage } from "react-native";
import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "./navigationMenu";
import Drawer from "react-native-drawer";
import Spinner from "react-native-loading-spinner-overlay";

class PlacesListUnionScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            placesList: [],
            isLoading: false,
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

    componentDidMount() {
        this.loadPlaces(data => this.setState({placesList: data, isLoading: false}))
    }

    loadPlaces = (then) => {
        this.setState({isLoading: true})
        try {
            AsyncStorage.getItem("token").then(token => {
                fetch("https://api.dev.kasipodaq.org/api/v1/place_associations", {
                    headers: {
                        "Authorization": token
                    }
                }).then(response => response.json())
                    .then(data => then(data));
            });
        } catch(error) {
            alert(error);
        }
    }

    refreshScreen = () => {
        this.setState({refreshing: true, isLoading: true});
        this.loadPlaces(data => this.setState({placesList: data, refreshing: false, isLoading: false}));
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
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshScreen}/>} >
                    <View style={styles.card}>
                        {
                            this.state.placesList.map((place, index) => {
                                return <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingVertical: 16,
                                    borderBottomColor: "#E4E8F0",
                                    borderBottomWidth: 1,
                                }}>
                                    <TouchableOpacity onPress = {() => this.props.navigation.navigate("join", { placeId: place.resource_id, placeName: place.name })} >
                                        <Text style={{
                                            color: "#2E384D",
                                            fontSize: 16,
                                            lineHeight: 24,
                                        }}>
                                            { place.name }
                                        </Text>
                                    </TouchableOpacity>
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
        flex: 1,
        minHeight: 510,
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

export default PlacesListUnionScreen;
