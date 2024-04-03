import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fireStore from '@react-native-firebase/firestore';

export default function Userlist() {
  const [name, setName] = useState();
  const [userdata, setUserdata] = useState([]);
  const [isread, setRead] = useState(false);
  const [loggedin, setLoggedIn] = useState(true);
  const [visible, setVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (loggedin) {
      navigation.addListener('beforeRemove', e => {
        e.preventDefault();
      });
    }
  }, [loggedin, navigation]);

  useEffect(() => {
    handleUser();
  }, [handleUser]);

  const handleUser = useCallback(async () => {
    try {
      setVisible(true);
      const uname = await AsyncStorage.getItem('Name');
      setName(uname);
      const email = await AsyncStorage.getItem('Email');
      const id = await AsyncStorage.getItem('Userid');

      const usersSnapshot = await fireStore()
        .collection('users')
        .where('email', '!=', email)
        .get();

      const userData = usersSnapshot.docs;
      setUserdata(userData);
      setVisible(false);

      userData.forEach(async user => {
        await fireStore()
          .collection('chats')
          .doc(id + user.data().userid)
          .collection('messages')
          .where('isread', '==', false)
          .onSnapshot(querysnapshot => {
            console.log(querysnapshot.docs.length);
            user.data().count = querysnapshot.docs.length;
            setUserdata([...userData]);
          });
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  const handleLog = async () => {
    try {
      setLoggedIn(false);
      setVisible(true);
      await AsyncStorage.clear();
      console.log('User logout successfully.');
      navigation.navigate('Login');
      setVisible(false);
    } catch (error) {
      setVisible(false);
      console.error('Error logging out:', error);
    }
  };

  const handleSend = async item => {
    try {
      const id = await AsyncStorage.getItem('Userid');
      navigation.navigate('Gchat', {
        item: item,
        id: id,
        onGoBack: ({read}) => {
          console.log(read);
          setRead(read);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {name}</Text>

        <TouchableOpacity style={styles.touchablelogout} onPress={handleLog}>
          <Image
            source={require('../assets/logout.png')}
            style={styles.logout}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.head}>Users : {userdata?.length}</Text>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.loder}>
          <ActivityIndicator size={40} color="red" />
        </View>
      </Modal>

      <FlatList
        data={userdata}
        keyExtractor={(item, index) => index}
        renderItem={({item}) => {
          console.log(item);

          return (
            <View>
              <TouchableOpacity
                style={styles.touchable}
                onPress={() => handleSend(item._data)}>
                <Image
                  source={{
                    uri: 'https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg',
                  }}
                  style={styles.avtar}
                />

                <View>
                  <View style={styles.namecount}>
                    <Text style={styles.user}>{item?._data.name}</Text>

                    {item._data.count > 0 ? (
                      <Text style={styles.count}>{item._data.count}</Text>
                    ) : null}
                  </View>

                  <Text style={styles.userid}>{item?._data.userid}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  welcome: {
    margin: 20,
    color: 'white',
    fontSize: 19,
  },

  loder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logout: {
    width: 26,
    height: 26,
    marginRight: 20,
  },

  user: {
    padding: 10,
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },

  userid: {
    width: 280,
    padding: 2,
    color: 'white',
    fontSize: 12,
    marginLeft: 10,
  },

  head: {
    margin: 20,
    marginLeft: 30,
    color: 'grey',
    fontSize: 20,
  },

  namecount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  name: {
    marginLeft: 20,
    margin: 10,
    color: 'black',
    fontSize: 18,
  },

  message: {
    marginLeft: 20,
    margin: 5,
    color: 'grey',
    fontSize: 15,
  },

  main: {
    backgroundColor: 'black',
    borderRadius: 20,
    margin: 5,
    padding: 5,
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },

  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 10,
    margin: 5,
    marginLeft: 15,
    marginRight: 15,
  },

  touchablelogout: {
    margin: 5,
  },

  timecount: {
    position: 'absolute',
    right: 5,
    alignItems: 'center',
  },

  time: {
    fontSize: 13,
    color: 'white',
  },

  avtar: {
    width: 45,
    height: 45,
    borderRadius: 20,
  },

  count: {
    marginRight: Dimensions.get('screen').width / 10,
    padding: 7,
    borderRadius: 5,
    color: 'white',
    fontSize: 15,
    backgroundColor: 'green',
  },
});
