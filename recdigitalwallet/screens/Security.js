import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import axios from 'axios';
import APPJSON from '../app.json';
import {ScrollView} from 'react-native-gesture-handler';

const Security = ({navigation}) => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const [showPassword3, setShowPassword3] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState({name: '', phone_no: '', email: ''});
  React.useEffect(() => {
    if (isActive && user.id == undefined) {
      check();
    }
    return () => {
      setIsActive(false);
    };
  }, []);
  async function updatePassord() {
    let token = await AsyncStorage.getItem('token');
    if (!token) {
      return false;
    }
    setLoading(true);
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(
        APPJSON.API_URL + 'updateUserSecurity',
        {
          token: token,
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
        axiosConfig,
      )
      .then(response => {
        setLoading(false);
        if (
          response.data != null &&
          response.data.response != undefined &&
          response.data.response
        ) {
          Toast.show('Password updated successfully');
        } else {
          Toast.show(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
        if (error.response != undefined) {
          Toast.show(error.response.data.message);
        } else if (error.response) {
          console.log(error);
          //  Toast.show(error.response.data.message);
        }
      });
  }
  async function check() {
    let user = await AsyncStorage.getItem('user');
    if (user) {
      console.log(user);
      user = JSON.parse(user);
      setUser(user);
      return false;
    } else{
      console.log(user);
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
          <Text style={{fontSize: 18}}>Security</Text>
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
          <View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={icons.info}
                style={{
                  height: 15,
                  width: 15,
                  marginRight: 5,
                  tintColor: COLORS.yellow,
                }}
              />
              <Text style={{fontSize: 10}}>
                Password must be at least 6 character long and strong
              </Text>
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                marginTop: 20,
                justifyContent: 'center',
              }}>
              <Text style={{color: COLORS.white, fontSize: 14}}>
                Current Password
              </Text>
              <TextInput
                secureTextEntry={!showPassword}
                value={currentPassword}
                onChangeText={Text => {
                  setCurrentPassword(Text);
                }}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                  width: '100%',
                  paddingHorizontal: 10,
                  marginTop: 15,
                }}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 5,
                  height: 30,
                  width: 30,
                }}
                onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={showPassword ? icons.disable_eye : icons.eye}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.white,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                marginTop: 20,
                justifyContent: 'center',
              }}>
              <Text style={{color: COLORS.white, fontSize: 14}}>
                New Password
              </Text>
              <TextInput
                secureTextEntry={!showPassword2}
                value={newPassword}
                onChangeText={Text => {
                  setNewPassword(Text);
                }}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                  width: '100%',
                  paddingHorizontal: 10,
                  marginTop: 15,
                }}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 5,
                  height: 30,
                  width: 30,
                }}
                onPress={() => setShowPassword2(!showPassword2)}>
                <Image
                  source={showPassword2 ? icons.disable_eye : icons.eye}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.white,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                marginTop: 20,
                justifyContent: 'center',
              }}>
              <Text style={{color: COLORS.white, fontSize: 14}}>
                Confirm Password
              </Text>
              <TextInput
                secureTextEntry={!showPassword3}
                value={confirmPassword}
                onChangeText={Text => {
                  setConfirmPassword(Text);
                }}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                  width: '100%',
                  paddingHorizontal: 10,
                  marginTop: 15,
                }}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 5,
                  height: 30,
                  width: 30,
                }}
                onPress={() => setShowPassword3(!showPassword3)}>
                <Image
                  source={showPassword3 ? icons.disable_eye : icons.eye}
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: COLORS.white,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.yellow,
                height: 50,
                marginTop: 20,
                width: '48%',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => updatePassord()}>
              <Text style={{color: COLORS.white}}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            backgroundColor: COLORS.primaryBlue,
            height: '100%',
            width: '100%',
            borderRadius: 25,
            marginTop: 50,
          }}
        />
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
    <ScrollView style={{backgroundColor: COLORS.primaryBlue}}>
      <SafeAreaView
        style={{flex: 1, backgroundColor: COLORS.primary, height: '100%'}}>
        {renderPromos()}
      </SafeAreaView>
    </ScrollView>
  );
};

export default Security;
