import { Notifications } from "expo";
import { AsyncStorage } from "react-native";

const setupSocket = () => {
  try {
    AsyncStorage.getItem("token").then(token => {
      if (token != null) {
        key = token.split(" ")[1];
        const socket = new WebSocket(`wss://kasipodaq.org/notify?token=${key}`);

        socket.onmessage = async event => {
          const data = JSON.parse(event.data);

          await Notifications.presentLocalNotificationAsync({
            title: "Новое уведомление!",
            body: data.message,
            android: {
              channelId: "notifications"
            },
            ios: {
              sound: true
            }
          })
        }
      }
    });
  } catch(error) {
    alert(error);
  }
}

export { setupSocket }
