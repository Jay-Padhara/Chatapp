import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import fireStore from '@react-native-firebase/firestore';

export default function Gchat({route}) {
  const navigation = useNavigation();

  const [isread, setRead] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      route.params.onGoBack({isread: true});
    });

    return unsubscribe;
  }, [navigation, route.params]);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = fireStore()
      .collection('chats')
      .doc('' + route.params.id + route.params.item.userid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const allmessages = snapshot.docs.map(doc => {
          const data = doc.data();
          const createdAt = data.createdAt ? data.createdAt.toDate() : null;
          return {
            ...data,
            createdAt,
          };
        });
        setMessages(allmessages);
      });

    return () => unsubscribe();
  }, [route.params.id, route.params.item.userid]);

  const onSend = async (message = []) => {
    const msg = message[0];

    const myMsg = {
      ...msg,
      user: {
        _id: route.params.id,
      },
      sendBy: route.params.id,
      sendTo: route.params.item.userid,
      isread: isread,
      createdAt: new Date(),
    };

    fireStore()
      .collection('chats')
      .doc('' + route.params.id + route.params.item.userid)
      .collection('messages')
      .add({
        ...msg,
        sendBy: route.params.id,
        sendTo: route.params.item.userid,
        isread: isread,
        createdAt: fireStore.FieldValue.serverTimestamp(),
      });

    fireStore()
      .collection('chats')
      .doc('' + route.params.item.userid + route.params.id)
      .collection('messages')
      .add({
        ...msg,
        sendBy: route.params.id,
        sendTo: route.params.item.userid,
        isread: isread,
        createdAt: fireStore.FieldValue.serverTimestamp(),
      });

    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
  };

  return (
    <View style={styles.contain}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back.png')}
            style={styles.backimg}
          />
        </TouchableOpacity>

        <Text style={styles.name}>{route.params.item.name}</Text>

        <Image source={require('../assets/phone.png')} style={styles.phone} />
        <Image source={require('../assets/video.png')} style={styles.vc} />
      </View>

      <GiftedChat
        messages={messages}
        onSend={message => onSend(message)}
        user={{
          _id: route.params.id,
        }}
        textInputStyle={styles.mestext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  contain: {
    flex: 1,
    backgroundColor: 'black',
  },

  head: {
    margin: 20,
    color: 'black',
    fontSize: 17,
  },

  mestext: {
    color: 'black',
    marginTop: 5,
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
    marginLeft: 10,
  },

  status: {
    color: 'white',
    fontSize: 12,
    margin: 4,
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
    fontSize: 15,
    color: 'white',
  },

  you: {
    marginBottom: 3,
    marginLeft: 13,
    fontSize: 12,
    color: 'lightgreen',
  },

  time: {
    marginLeft: 13,
    fontSize: 11,
    color: 'lightblue',
  },

  tickimg: {
    marginLeft: 10,
    width: 15,
    height: 15,
  },

  notext: {
    textAlign: 'center',
    marginTop: '75%',
    color: 'skyblue',
    fontSize: 20,
    margin: 4,
    marginLeft: 10,
  },
});
