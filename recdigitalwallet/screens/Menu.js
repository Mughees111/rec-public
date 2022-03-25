import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import LinearGradient from 'react-native-linear-gradient';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import APPJSON from '../app.json';
const Menu = ({navigation}) => {
  const [is_active, setIsactive] = React.useState(true);
  const [user, setUser] = React.useState({});
  const logout = () => {
    AsyncStorage.setItem('token', '');
    AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };
  React.useEffect(() => {
    if (is_active && user.id == undefined) {
      check();
    }
    return () => {
      setIsactive(false);
    };
  }, []);
  async function check() {
    let user = await AsyncStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      setUser(user);
      return false;
    }
    let token = await AsyncStorage.getItem('token');
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(APPJSON.API_URL + 'user', {token: token}, axiosConfig)
      .then(response => {
        if (response.data.id != undefined && response.data.id) {
          setUser(response.data);
        } else if (!response.data.response) {
          Toast.show('You are logged out.', Toast.LONG);
          navigation.navigate('Login');
        }
      })
      .catch(error => {
        Toast.show('You are logged out.', Toast.LONG);
        navigation.navigate('Login');
      });
  }
  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: SIZES.padding * 2,
          marginHorizontal: 20,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            width: 50,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              height: 20,
              width: 20,
            }}>
            <Image
              source={icons.right}
              style={{
                height: '100%',
                width: '100%',
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 18}}>Profile</Text>
        </View>
        <View
          style={{
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Image
              source={icons.bell}
              style={{
                width: 30,
                height: 30,
              }}
            /> */}
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                flexDirection: 'row'
              }}>
              <View
                style={{
                  height: 20,
                  width: 20,
                  marginRight: 5,
                  backgroundColor:
                    APPJSON.API_mode == 'Testnet' ? COLORS.red : COLORS.green,
                  borderRadius: 50,
                }}
              />
              <Text>{APPJSON.API_mode}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderBanner() {
    return (
      <View>
        <View
          style={{
            zIndex: 100,
            height: '100%',
            width: '100%',
            borderRadius: 25,
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
            }}>
            <Image
              source={images.userIcon}
              style={{
                height: 100,
                borderRadius: 50,
                width: 100,
              }}
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                margin: 30,
              }}>
              <Text
                style={{fontWeight: 'bold', fontSize: 16, color: COLORS.white}}>
                {user.name}
              </Text>
              <Text style={{fontWeight: 'bold', fontSize: 13}}>
                {user.phone_no} | {user.email}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Security')}
            style={{marginBottom: 30}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 50}}>
              <Image
                style={{height: 20, width: 20, marginRight: 15}}
                source={icons.key}
              />
              <Text style={{fontSize: 16, color: COLORS.white}}>
                Account Security
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <View style={{flexDirection: 'row', paddingHorizontal: 50}}>
              <Image
                style={{height: 20, width: 20, marginRight: 15}}
                source={icons.logout}
              />
              <Text style={{fontSize: 16, color: COLORS.white}}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: 'absolute',
            backgroundColor: COLORS.primaryBlue,
            height: '100%',
            width: '100%',
            borderRadius: 25,
            marginTop: 50,
          }}></View>
      </View>
    );
  }

  function renderPromos() {
    return (
      <View>
        {renderHeader()}
        {renderBanner()}
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.primary}}>
      {renderPromos()}
    </SafeAreaView>
  );
};

export default Menu;
