import { registerRootComponent, Notifications } from "expo";
import "react-native-gesture-handler";

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image, View, Text, Button, Platform, AsyncStorage } from "react-native";

import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

import { ThemeProvider } from "react-native-elements";

import { setupSocket } from "./tools";

import MainScreen from "./screens/mainScreen";
import NewsListScreen from "./screens/newsListScreen";
import NewsScreen from "./screens/newsScreen";
import YntymaqScreen from "./screens/yntymaqScreen";
import ContactsScreen from "./screens/contactsScreen";
import LoginScreen from "./screens/loginScreen";

import CabinetMemberScreen from "./screens/cabinetMemberScreen";
import CabinetMemberEditScreen from "./screens/cabinetMemberEditScreen";
import RequestToFprkScreen from "./screens/requestToFprk";
import HelpScreen from "./screens/helpScreen";
import CreateRequestTicketScreen from "./screens/createRequestTicket";
import LawDatabaseScreen from "./screens/lawDatabaseScreen";
import RegistrationScreen from "./screens/registrationScreen";
import CreateUnionScreen from "./screens/createUnionScreen";
import JoinUnionScreen from "./screens/joinUnionScreen";
import epbScreen from "./screens/epbScreen";
import MyUnion from "./screens/myUnion";
import DisputeScreen from "./screens/disputeScreen";
import DisputesScreen from "./screens/disputesScreen";
import BiotScreen from "./screens/biotScreen";
import BiotOrderScreen from "./screens/biotOrderScreen";
import PartnerListScreen from "./screens/partnerListScreen";
import PartnerCategoryScreen from "./screens/partnerCategoryScreen";
import PartnerScreen from "./screens/partnerScreen";
import SettingsScreen from "./screens/settingsScreen";
import RestorePasswordScreen from "./screens/restorePasswordScreen";
import TribuneScreen from "./screens/tribuneScreen";
import TribuneQuestionsScreen from "./screens/tribuneQuestionsScreen";
import TribuneAnsweredScreen from "./screens/tribuneAnsweredScreen";
import TribuneDecisionScreen from "./screens/tribuneDecisionScreen";
import TribuneAnsweredQuestionsScreen from "./screens/tribuneAnsweredQuestions";
import TribuneRevisionResultScreen from "./screens/tribuneRevisionResult";
import epbCartScreen from "./screens/epbCartScreen";
import epbQrCodScreen from "./screens/epbQrCodScreen"
import NotificationsScreen from "./screens/notificationsScreen"
import MyUnionApplication from "./screens/myUnionApplication";
import ChangePasswordScreen from "./screens/changePasswordScreen";
import SupportScreen from "./screens/supportScreen";
import IndustriesListScreen from "./screens/industriesList";
import PlacesListScreen from "./screens/placesList";
import UnionListScreen from "./screens/unionList";
import PlacesListUnionScreen from "./screens/placeListUnion";

const Stack = createStackNavigator();

class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          token: null
        }
    }

    componentDidMount = async () => {
      AsyncStorage.getItem("token").then(token => {
        this.setState({token: token})
      });

      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

      if (status != "granted") {
        await Permissions.askAsync(Permissions.NOTIFICATIONS);
      }

      if (Platform.OS == "android") {
        await Notifications.createChannelAndroidAsync("notifications", {
          name: "Notifications",
          sound: true,
        });
      }

      setupSocket();
    }

    render = () => {
        return (
            <>
                <ThemeProvider>
                    <NavigationContainer>
                        <Stack.Navigator>
                            <Stack.Screen
                                name="main"
                                component={MainScreen}
                                options={{
                                    title: "?????????? ??????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="newsList"
                                component={NewsListScreen}
                                options={{
                                    title: "??????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="news"
                                component={NewsScreen}
                                options={{
                                    title: "??????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "normal"
                                    },
                                }}/>

                            <Stack.Screen
                                name="yntymaq"
                                component={YntymaqScreen}
                                options={{
                                    title: "???? YNTYMAQ",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}/>
                            <Stack.Screen
                                name="contacts"
                                component={ContactsScreen}
                                options={{
                                    title: "????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}/>
                            <Stack.Screen
                                name="login"
                                component={LoginScreen}
                                options={{
                                    title: "??????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}/>
                            <Stack.Screen
                                name="register"
                                component={RegistrationScreen}
                                options={{
                                    title: "??????????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}/>
                            <Stack.Screen
                                name="cabinetMember"
                                component={CabinetMemberScreen}
                                options={{
                                    title: "???????????? ??????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="cabinetMemberEdit"
                                component={CabinetMemberEditScreen}
                                options={{
                                    title: "???????????? ??????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="appeals"
                                component={RequestToFprkScreen}
                                options={{
                                    title: "?????????????????? ?? YNTYMAQ",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="help"
                                component={HelpScreen}
                                options={{
                                    title: "?????????????????????? ????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="support"
                                component={SupportScreen}
                                options={{
                                    title: "???????????? ??????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="appeal"
                                component={CreateRequestTicketScreen}
                                options={{
                                    title: "?????????? ??????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="laws"
                                component={LawDatabaseScreen}
                                options={{
                                    title: "?????????????????????????????? ????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="join"
                                component={JoinUnionScreen}
                                options={{
                                    title: "???????????????? ?? ????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="create"
                                component={CreateUnionScreen}
                                options={{
                                    title: "?????????????? ????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="industriesList"
                                component={IndustriesListScreen}
                                options={{
                                    title: "???????????????????? ??????????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="placesList"
                                component={PlacesListScreen}
                                options={{
                                    title: "??????????/??????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="placesListUnion"
                                component={PlacesListUnionScreen}
                                options={{
                                    title: "??????????/??????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="unionList"
                                component={UnionListScreen}
                                options={{
                                    title: "?????????????????????? ??????????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="createRequestTicket"
                                component={CreateRequestTicketScreen}
                                options={{
                                    title: "???????????????? ??????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="epb"
                                component={epbScreen}
                                options={{
                                    title: "??????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="epbCart"
                                component={epbCartScreen}
                                options={{
                                    title: "??????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="epbQrCod"
                                component={epbQrCodScreen}
                                options={{
                                    title: "??????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="myUnion"
                                component={MyUnion}
                                options={{
                                    title: "?????? ????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="myUnionApplication"
                                component={MyUnionApplication}
                                options={{
                                    title: "?????????????? ??????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="dispute"
                                component={DisputeScreen}
                                options={{
                                    title: "???????????????? ????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="disputes"
                                component={DisputesScreen}
                                options={{
                                    title: "???????????????? ????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="biot"
                                component={BiotScreen}
                                options={{
                                    title: "????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="biotOrder"
                                component={BiotOrderScreen}
                                options={{
                                    title: "?????????????? ????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="partnerList"
                                component={PartnerListScreen}
                                options={{
                                    title: "????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="partnerCategory"
                                component={PartnerCategoryScreen}
                                options={{
                                    title: "????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="partner"
                                component={PartnerScreen}
                                options={{
                                    title: "????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                                name="settings"
                                component={SettingsScreen}
                                options={{
                                    title: "??????????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                            <Stack.Screen
                            name="restorePassword"
                            component={RestorePasswordScreen}
                            options={{
                                title: "???????????????????????????? ????????????",
                                headerStyle: {
                                    backgroundColor: "#01579B",
                                },
                                headerTitleStyle: {
                                    color: "#ffff",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontWeight: "400"
                                },
                            }}
                        />
                            <Stack.Screen
                                name="changePassword"
                                component={ChangePasswordScreen}
                                options={{
                                    title: "?????????????????? ????????????",
                                    headerStyle: {
                                        backgroundColor: "#01579B",
                                    },
                                    headerTitleStyle: {
                                        color: "#ffff",
                                        alignItems: "center",
                                        textAlign: "center",
                                        fontWeight: "400"
                                    },
                                }}
                            />
                        <Stack.Screen
                            name="tribune"
                            component={TribuneScreen}
                            options={{
                                title: "??????????????",
                                headerStyle: {
                                    backgroundColor: "#01579B",
                                },
                                headerTitleStyle: {
                                    color: "#ffff",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontWeight: "400"
                                },
                            }}
                        />
                        <Stack.Screen
                            name="tribuneQuestions"
                            component={TribuneQuestionsScreen}
                            options={{
                                title: "??????????????",
                                headerStyle: {
                                    backgroundColor: "#01579B",
                                },
                                headerTitleStyle: {
                                    color: "#ffff",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontWeight: "400"
                                },
                            }}
                        />
                        <Stack.Screen
                            name="tribuneAnsweredQuestions"
                            component={TribuneAnsweredQuestionsScreen}
                            options={{
                                title: "??????????????",
                                headerStyle: {
                                    backgroundColor: "#01579B",
                                },
                                headerTitleStyle: {
                                    color: "#ffff",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontWeight: "400"
                                },
                            }}
                        />
                        <Stack.Screen
                            name="tribuneAnswered"
                            component={TribuneAnsweredScreen}
                            options={{
                                title: "??????????????",
                                headerStyle: {
                                    backgroundColor: "#01579B",
                                },
                                headerTitleStyle: {
                                    color: "#ffff",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontWeight: "400"
                                },
                            }}
                        />
                        <Stack.Screen
                            name="tribuneDecision"
                            component={TribuneDecisionScreen}
                            options={{
                                title: "??????????????",
                                headerStyle: {
                                    backgroundColor: "#01579B",
                                },
                                headerTitleStyle: {
                                    color: "#ffff",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontWeight: "400"
                                },
                            }}
                        />
                        <Stack.Screen
                            name="tribuneRevisionResult"
                            component={TribuneRevisionResultScreen}
                            options={{
                                title: "??????????????",
                                headerStyle: {
                                    backgroundColor: "#01579B",
                                },
                                headerTitleStyle: {
                                    color: "#ffff",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontWeight: "400"
                                },
                            }}
                        />
                        <Stack.Screen
                            name="notifications"
                            component={NotificationsScreen}
                            options={{
                                title: "??????????????????????",
                                headerStyle: {
                                    backgroundColor: "#01579B",
                                },
                                headerTitleStyle: {
                                    color: "#ffff",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontWeight: "400"
                                },
                            }}
                        />
                        </Stack.Navigator>
                    </NavigationContainer>
                </ThemeProvider>
            </>

        );
    }
}

export default registerRootComponent(Application);
