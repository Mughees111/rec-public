import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Alert
} from 'react-native';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import APPJSON from '../app.json';
import PTRView from 'react-native-pull-to-refresh';
import TextTicker from 'react-native-text-ticker';
import PushNotification from "react-native-push-notification";



const Home = ({ navigation }) => {


  const dummyBalances = {
    trc20_rec: 0,
    eth_rate: 0,
    trx_rate: 0,
    erc20: 0,
    erc20_usdt: 0,
    trc20: 0,
    trc20_usdt: 0,
    eth_to_usd: 0,
    trx_to_usd: 0,
    rec_to_usd: 0,
    trc20_wallet_address: '',
    erc20_wallet_address: '',
  };


  const [user, setUser] = React.useState([]);
  const [isActive, setActive] = React.useState(true);
  const [balances, setBalances] = React.useState(dummyBalances);
  const [loading, setLoading] = React.useState(false);
  const [FlashNews, setFlashNews] = React.useState('');


  let interval;
  // if (isActive) {
  //   interval = setInterval(check, 5 * 60000);
  // }


  React.useEffect(() => {
    getPushNotificationToken();
    getBalances();
    check();
    return () => {
      setActive(false);
    };
  }, []);



  function getPushNotificationToken() {

    PushNotification.createChannel(
      {
        channelId: "8193", // (required)
        channelName: "REC", // (required)
        channelDescription: "Wallet App", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );


    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: async function (push_id) {

        let token = await AsyncStorage.getItem('token');
        const reqObj = {
          token: token,
          push_id: push_id.token
        }
        console.log(reqObj)
        let axiosConfig = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
          },
        };
        axios.post(APPJSON.API_URL + 'do_store_push_id', reqObj, axiosConfig)
          .then(response => {
            console.log(response)
          })
          .catch(err => {
            console.log(err)
          })

      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('recieved')
        console.log(notification)
        if (notification.foreground) {

          PushNotification.localNotification({
            title: notification.title,
            message: notification.message
          });
        }

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      // onAction: function (notification) {
      //   console.log("ACTION:", notification.action);
      //   console.log("NOTIFICATION:", notification);

      //   // process the action
      // },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }


  async function getBalances() {
    if (loading) {
      return false;
    }
    setLoading(true);
    let token = await AsyncStorage.getItem('token');
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(APPJSON.API_URL + 'balance', { token: token }, axiosConfig)
      .then(response => {
        setLoading(false);
        if (response.data !== undefined && response.data.erc20 >= 0) {
          console.log(response.data);
          setBalances(response.data);
        } else if (!response.data.response) {
          // Toast.show('There was error fetching balance', Toast.LONG);
        }
      })
      .catch(error => {
        setLoading(false);
        // Toast.show('There was error fetching balance', Toast.LONG);
      });
    setFlashNews('');
    newsFlashes();
  }



  async function check() {
    let token = await AsyncStorage.getItem('token');
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(APPJSON.API_URL + 'user', { token: token }, axiosConfig)
      .then(response => {
        if (response.data.id != undefined && response.data.id) {
          setUser(response.data);
        } else if (!response.data.response) {
          clearInterval(interval);
          // Toast.show('You are logged out.', Toast.LONG);
          navigation.navigate('Login');
        }
      })
      .catch(error => {
        clearInterval(interval);
        // Toast.show('You are logged out.', Toast.LONG);
        navigation.navigate('Login');
      });
  }



  async function newsFlashes() {
    setFlashNews('loading flash news...');
    let token = await AsyncStorage.getItem('token');
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(APPJSON.API_URL + 'newsflashes', { token: token }, axiosConfig)
      .then(response => {
        if (response.data != undefined && response.data) {
          let news = '';
          response.data.forEach((element, index) => {
            if (response.data.length > 2) {
              if (index == 0) {
                news += element.description;
              } else if (response.data.length == index + 1) {
                news += element.description + '             ';
              } else {
                news += '     |     ' + element.description;
              }
            } else {
              news += '     ' + element.description + '     |';
            }
          });
          setFlashNews(news);
        } else if (!response.data.response) {
          // Toast.show('error occured please.', Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
        // Toast.show('error occured.', Toast.LONG);
      });
  }


  async function sendDummyPush() {

    let token = await AsyncStorage.getItem('token');
    const reqObj = {
      token: token,
      message: {
        "title": "Hello",
        "description": "Notification from the home screen"
      }
    }
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };

    axios.post(APPJSON.API_URL + 'send_notif_live', reqObj, axiosConfig)
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })

  }


  let featuresData = [
    {
      id: 1,
      title: 'ETH',
      wallet_type: 'ERC20',
      token: '',
      description: 'Ethereum',
      icon: images.ethImage,
      balance: balances.erc20,
      rec_rate: balances.rec_rate,
      current_rate: balances.eth_rate,
      usd_balance: balances.eth_to_usd,
      wallet_address: balances.erc20_wallet_address,
    },
    {
      id: 2,
      title: 'TRX',
      wallet_type: 'TRC20',
      token: '',
      description: 'Tron',
      icon: images.trxImage,
      balance: balances.trc20,
      current_rate: balances.trx_rate,
      rec_rate: balances.rec_rate,
      usd_balance: balances.trx_to_usd,
      wallet_address: balances.trc20_wallet_address,
    },
    {
      id: 3,
      title: 'USDT',
      wallet_type: 'ERC20',
      token: 'usdt',
      description: 'ERC20 Network',
      icon: images.usdtImage,
      current_rate: 1,
      balance: balances.erc20_usdt,
      rec_rate: balances.rec_rate,
      wallet_address: balances.erc20_wallet_address,
      usd_balance: balances.erc20_usdt,
    },
    {
      id: 4,
      wallet_type: 'TRC20',
      token: 'usdt',
      title: 'USDT',
      description: 'TRC20 Network',
      icon: images.usdtImage,
      current_rate: 1,
      balance: balances.trc20_usdt,
      rec_rate: balances.rec_rate,
      wallet_address: balances.trc20_wallet_address,
      usd_balance: balances.trc20_usdt,
    },
  ];

  function currencyFormat(num) {
    return parseFloat(num)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: SIZES.padding * 2,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            width: 50,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Menu')}
            style={{
              borderRadius: 50,
              borderColor: COLORS.darkgray,
              borderWidth: 1,
              height: 50,
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.lightGray,
            }}>
            <Image
              source={images.userIcon}
              style={{
                height: '100%',
                borderRadius: 50,
                width: '100%',
              }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          
          onLongPress={() => { sendDummyPush() }} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18 }}>Dashboard</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
      </View >
    );
  }

  function renderBanner() {
    return (
      <View
        style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              borderWidth: 2,
              borderRadius: 50,
              paddingHorizontal: 40,
              paddingVertical: 10,
              borderColor: COLORS.yellow,
            }}>
            {loading
              ? '0.0000'
              : '$ ' +
              currencyFormat(
                parseFloat(featuresData[0].usd_balance) +
                parseFloat(balances.rec_to_usd) +
                parseFloat(featuresData[1].usd_balance) +
                parseFloat(featuresData[2].usd_balance) +
                parseFloat(featuresData[3].usd_balance),
              )}
          </Text>
          <View
            style={{
              height: 14,
              width: 14,
              borderRadius: 10,
              borderColor: COLORS.yellow,
              borderWidth: 1,
            }}>
            <View
              style={{
                height: 10,
                margin: 1,
                width: 10,
                backgroundColor: COLORS.yellow,
                borderRadius: 50,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 20,
            alignItems: 'center',
          }}>
          <Image
            source={icons.speaker}
            style={{ width: 20, height: 20, marginRight: 7 }}
          />
          <TextTicker
            style={{ fontSize: 10 }}
            duration={20000}
            loop
            bounce
            repeatSpacer={10}
            marqueeDelay={500}>
            {FlashNews}
          </TextTicker>
        </View>
      </View>
    );
  }

  function renderFeatures() {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            marginVertical: SIZES.base,
            width: '100%',
          }}
          onPress={() =>
            navigation.navigate('Wallet', {
              wallet: {
                id: null,
                title: 'REC',
                wallet_type: 'TRC20',
                token: 'rec',
                description: 'REC',
                current_rate: balances.rec_rate,
                rec_rate: balances.rec_rate,
                icon: images.recImage,
                balance: balances.trc20_rec,
                usd_balance: balances.rec_to_usd,
                wallet_address: balances.trc20_wallet_address,
              },
            })
          }>
          <View
            style={{
              backgroundColor: COLORS.btnColor,
              borderRadius: 20,
              padding: 15,
            }}>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', marginBottom: 25 }}>
                <Image
                  source={images.AppLogo}
                  style={{ height: 40, width: 40 }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 18 }}>REC</Text>
                  <Text style={{ fontSize: 10 }}>REC Asset</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '48%' }}>
                  <Text style={{ fontSize: 10 }}>REC Balance</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ fontSize: 17 }}>
                      {loading ? '0.0000' : currencyFormat(balances.trc20_rec)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 1,
                    height: '100%',
                    backgroundColor: COLORS.black,
                    marginVertical: 2,
                    marginRight: 10,
                    opacity: 0.2,
                  }}
                />
                <View style={{ width: '48%' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Text style={{ fontSize: 17 }}>
                      {loading
                        ? '0.0000'
                        : '$ ' + currencyFormat(balances.rec_to_usd)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              marginVertical: SIZES.base,
              width: '48%',
            }}
            onPress={() =>
              navigation.navigate('Wallet', { wallet: featuresData[0] })
            }
            >
            <View
              style={{
                backgroundColor: COLORS.btnColor,
                borderRadius: 20,
                padding: 15,
              }}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', marginBottom: 25 }}>
                  <Image
                    source={featuresData[0].icon}
                    style={{ height: 40, width: 40 }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 18 }}>{featuresData[0].title}</Text>
                    <Text style={{ fontSize: 10 }}>
                      {featuresData[0].description}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 10 }}>
                    {featuresData[0].title} Balance
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ fontSize: 17 }}>
                      {loading
                        ? '0.0000'
                        : currencyFormat(featuresData[0].balance)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: COLORS.black,
                      marginVertical: 2,
                      opacity: 0.2,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ fontSize: 17 }}>
                      {loading
                        ? '0.0000'
                        : '$ ' + currencyFormat(featuresData[0].usd_balance)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            style={{
              marginVertical: SIZES.base,
              width: '48%',
            }}
            onPress={() =>
              navigation.navigate('Wallet', { wallet: featuresData[1] })
            }>
            <View
              style={{
                backgroundColor: COLORS.btnColor,
                borderRadius: 20,
                padding: 15,
              }}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', marginBottom: 25 }}>
                  <Image
                    source={featuresData[1].icon}
                    style={{ height: 40, width: 40 }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 18 }}>{featuresData[1].title}</Text>
                    <Text style={{ fontSize: 10 }}>
                      {featuresData[1].description}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 10 }}>
                    {featuresData[1].title} Balance
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ fontSize: 17 }}>
                      {loading
                        ? '0.0000'
                        : currencyFormat(featuresData[1].balance)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: COLORS.black,
                      marginVertical: 2,
                      opacity: 0.2,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ fontSize: 17 }}>
                      {loading
                        ? '0.0000'
                        : '$ ' + currencyFormat(featuresData[1].usd_balance)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              marginVertical: SIZES.base,
              width: '48%',
              marginBottom: 30,
            }}
            onPress={() =>
              navigation.navigate('Wallet', { wallet: featuresData[2] })
            }>
            <View
              style={{
                backgroundColor: COLORS.btnColor,
                borderRadius: 20,
                padding: 15,
              }}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', marginBottom: 25 }}>
                  <Image
                    source={featuresData[2].icon}
                    style={{ height: 40, width: 40 }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 18 }}>{featuresData[2].title}</Text>
                    <Text style={{ fontSize: 10 }}>
                      {featuresData[2].description}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 10 }}>
                    {featuresData[2].title} Balance
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ fontSize: 17 }}>
                      {loading
                        ? '0.0000'
                        : currencyFormat(featuresData[2].balance)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: COLORS.black,
                      marginVertical: 2,
                      opacity: 0.2,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ fontSize: 17 }}>
                      {loading
                        ? '0.0000'
                        : '$ ' + currencyFormat(featuresData[2].usd_balance)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            style={{
              marginVertical: SIZES.base,
              width: '48%',
              marginBottom: 30,
            }}
            onPress={() =>
              navigation.navigate('Wallet', { wallet: featuresData[3] })
            }>
            <View
              style={{
                backgroundColor: COLORS.btnColor,
                borderRadius: 20,
                padding: 15,
              }}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', marginBottom: 25 }}>
                  <Image
                    source={featuresData[3].icon}
                    style={{ height: 40, width: 40 }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 18 }}>{featuresData[3].title}</Text>
                    <Text style={{ fontSize: 10 }}>
                      {featuresData[3].description}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={{ fontSize: 10 }}>
                    {featuresData[3].title} Balance
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ fontSize: 17 }}>
                      {loading
                        ? '0.0000'
                        : currencyFormat(featuresData[3].balance)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: COLORS.black,
                      marginVertical: 2,
                      opacity: 0.2,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ fontSize: 17 }}>
                      {loading
                        ? '0.0000'
                        : '$ ' + currencyFormat(featuresData[3].usd_balance)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            width: '100%',
            height: 250,
            marginTop: SIZES.padding * 2,
          }}
          onPress={() =>
            navigation.navigate('FineXGM', {
              wallet: {
                id: null,
                title: 'REC',
                wallet_type: 'TRC20',
                token: 'rec',
                description: 'Finexgm MT4 Trading',
                current_rate: balances.rec_rate,
                icon: images.recImage,
                balance: balances.trc20_rec,
                usd_balance: balances.rec_to_usd,
                wallet_address: balances.trc20_wallet_address,
              },
            })
          }>
          <View
            style={{
              height: 160,
              backgroundColor: COLORS.btnColor,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <LinearGradient
              style={{
                borderRadius: 50,
              }}
              colors={['transparent', COLORS.emerald]}
              start={{ x: 0.0, y: 1 }}
              end={{ x: 1, y: 0 }}>
              <Text
                style={{
                  paddingHorizontal: 40,
                  paddingVertical: 10,
                }}>
                Finexgm MT4 Trading
              </Text>
            </LinearGradient>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 30, color: COLORS.white }}>FINE</Text>
              <Text
                style={{ fontSize: 30, color: COLORS.red, fontFamily: 'serif' }}>
                X
              </Text>
              <Text style={{ fontSize: 30, color: COLORS.white }}>GM</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <PTRView
      progressBackgroundColor={COLORS.primary}
      enabled={loading ? false : true}
      refreshing={loading ? false : true}
      onRefresh={getBalances}>
      {(() => {
        if (loading) {
          return (
            <View
              style={{
                backgroundColor: '#03213d',
                zIndex: 10,
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                opacity: 1,
                justifyContent: 'flex-start',
              }}>
              <Image
                source={images.AppLogo}
                style={{
                  marginTop: '70%',
                  height: 100,
                  width: 100,
                  marginBottom: 10,
                }}
              />
              <Text>Synching your account...</Text>
            </View>
          );
        }
      })()}

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.primary,
          paddingHorizontal: 20,
        }}>
        {renderHeader()}
        {renderBanner()}
        {renderFeatures()}
      </SafeAreaView>
    </PTRView>
  );
};

export default Home;
