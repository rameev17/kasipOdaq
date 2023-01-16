import React from "react";

import {
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    AsyncStorage,
    StyleSheet,
    TouchableHighlight,
    Dimensions
} from "react-native";
import {WebView} from "react-native-webview";

import BottomMenu from "../components/bottomMenu";
import NavigationMenu from "../screens/navigationMenu";
import Drawer from "react-native-drawer";
import AutoHeightWebView from "react-native-autoheight-webview";
import Spinner from "react-native-loading-spinner-overlay";

import { VictoryPie } from 'victory-native';

class TribuneRevisionResultScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            revision: {},
            data: [],
            isLoading: false
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

    loadStatistics = () => {
      this.setState({isLoading: true});

      AsyncStorage.getItem("token").then(token => {
        fetch(`https://api.kasipodaq.org/api/v1/person_test_statistic?revision_id=${this.props.route.params.revision.resource_id}`, {
          headers: {
            "Authorization": token
          }
        })
        .then(response => response.json())
        .then(data => this.setState({data: data, isLoading: false}))
      });

    }

    componentDidMount = () => {
      this.loadStatistics();
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
                  <View style={{backgroundColor: "#EFF1F5", flex: 1 }}>
                      <View style={styles.card}>
                        <Text style={{
                          textAlign: "center",
                          marginTop: 24,
                          fontSize: 20,
                          fontWeight: "500",
                          color: "#2F394E"
                        }}>{this.props.route.params.revision.name}</Text>
                      <Text style={{
                          fontSize: 36,
                          fontWeight: "700",
                          top: 140,
                          textAlign: "center",
                          color: "#2F394E"
                        }}>{Math.floor(parseInt(this.state.data.valid_answers) / parseInt(this.state.data.total_questions) * 100)}%</Text>
                        <VictoryPie
                          width={330}
                          height={330}
                          data={[{y: this.state.data.invalid_answers, label: " "}, {y: this.state.data.valid_answers, label: " "}]}
                          style={{parent: {top: -50}}}
                          innerRadius={65}
                          colorScale={["#F91F2A", "#14CF00"]}
                        />
                        <View style={{top: -50}}>
                          <Text style={{fontSize: 18, textAlign: "center", color: "#2E384D"}}>{this.state.data.is_passed ? "Пройден" : "Не пройден"} {this.props.route.params.revision.finish_date}</Text>
                          <Text style={{fontSize: 18, textAlign: "center", marginTop: 8, color: "#2E384D"}}>{`${this.state.data.valid_answers} / ${this.state.data.total_questions}`}</Text>
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
    card: {
        backgroundColor: "#ffff",
        flex: 1,
        minHeight: 520,
        margin: 24,
        borderRadius: 8,
        shadowColor: "#000000",
        shadowOpacity: 0.24,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        position: "relative",
    }
});

export default TribuneRevisionResultScreen;
