import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import Ctouchable from '../Component/Ctouchable';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/firestore';

export default function Chat({route}) {
  const navigation = useNavigation();

  const [msg, setMsg] = useState();

  const [message, setMessage] = useState([]);

  const messageref = useRef(null);

  const handleMessage = async () => {
    if (!msg) {
      return false;
    } else {
      await firebase
        .firestore()
        .collection('users')
        .doc()
        .set({
          message: msg,
        })
        .then(() => {
          console.log(msg);
          setMessage(prevMessages => [...prevMessages, msg]);
          setMsg('');
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#101010" barStyle="light-content" />

        <View style={styles.header}>
          <Ctouchable
            onPress={() => navigation.goBack()}
            source={require('../assets/back.png')}
            style={styles.backimg}
          />

          <Image source={route.params.item.image} style={styles.img} />

          <View style={styles.statusname}>
            <Text style={styles.name}>{route.params.item.name}</Text>
            <Text style={styles.status}>{route.params.item.status}</Text>
          </View>

          <Image source={require('../assets/phone.png')} style={styles.phone} />
          <Image source={require('../assets/video.png')} style={styles.vc} />
        </View>

        <View style={styles.margbot}>
          <FlatList
            ref={messageref}
            data={message}
            scrollEventThrottle={3}
            keyExtractor={(item, index) => index}
            renderItem={({item}) => {
              return (
                <View style={styles.message}>
                  <Text style={styles.you}>You</Text>
                  <Text style={styles.chat}>{item}</Text>
                  <View style={styles.tick}>
                    <Image
                      source={require('../assets/doubletick.png')}
                      style={styles.tickimg}
                    />
                    <Text style={styles.time}>10:20</Text>
                  </View>
                </View>
              );
            }}
          />
        </View>

        <View style={styles.msg}>
          <TextInput
            placeholder="Enter message..."
            placeholderTextColor="white"
            style={styles.textin}
            value={msg}
            onChangeText={text => setMsg(text)}
          />
          {!msg ? (
            <TouchableOpacity disabled>
              <Text style={styles.dissend}>Send</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleMessage}>
              <Text style={styles.send}>Send</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  head: {
    margin: 20,
    color: 'black',
    fontSize: 17,
  },

  tick: {
    flexDirection: 'row',
    margin: 5,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#101010',
    shadowColor: 'white',
    elevation: 40,
    borderColor: 'white',
    borderRadius: 20,
    margin: 10,
    alignItems: 'center',
  },

  statusname: {
    marginLeft: 10,
  },

  name: {
    color: 'white',
    fontSize: 18,
    margin: 4,
  },

  status: {
    color: 'white',
    fontSize: 12,
    margin: 4,
  },

  margbot: {
    marginBottom: 150,
  },

  backimg: {
    width: 20,
    height: 20,
    borderRadius: 30,
    marginLeft: 10,
  },

  img: {
    width: 45,
    height: 45,
    borderRadius: 30,
    marginLeft: 6,
  },

  phone: {
    width: 23,
    height: 23,
    position: 'absolute',
    right: 55,
  },

  vc: {
    width: 26,
    height: 26,
    position: 'absolute',
    right: 15,
  },

  msg: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    elevation: 30,
    bottom: Platform.OS === 'android' ? 15 : 20,
    padding: Platform.OS === 'android' ? 5 : 20,
    borderRadius: 30,
    backgroundColor: '#101010',
    shadowColor: 'white',
  },

  textin: {
    width: 270,
    fontSize: 17,
    color: 'white',
  },

  dissend: {
    marginLeft: 15,
    color: 'grey',
    fontSize: 19,
  },

  send: {
    marginLeft: 15,
    color: 'blue',
    fontSize: 19,
  },

  message: {
    justifyContent: 'center',
    width: 330,
    borderLeftColor: 'grey',
    borderLeftWidth: 5,
    marginLeft: 5,
    margin: 10,
  },

  chat: {
    margin: 3,
    marginLeft: 13,
    fontSize: 17,
    color: 'white',
  },

  you: {
    marginBottom: 3,
    marginLeft: 13,
    fontSize: 14,
    color: 'lightgreen',
  },

  time: {
    marginLeft: 13,
    fontSize: 12,
    color: 'lightblue',
  },

  tickimg: {
    marginLeft: 10,
    width: 15,
    height: 15,
  },
});
