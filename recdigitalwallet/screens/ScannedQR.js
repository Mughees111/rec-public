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
import QRCode from 'react-native-qrcode-image';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import APPJSON from '../app.json';

const ScannedQR = ({navigation, route}) => {
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
  const [is_active, setIsactive] = React.useState(true);
  const [user, setUser] = React.useState({});
  const [balances, setBalances] = React.useState(dummyBalances);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    getBalances();
    return () => {
      setIsactive(false);
    };
  }, []);

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
      .post(APPJSON.API_URL + 'balance', {token: token}, axiosConfig)
      .then(response => {
        setLoading(false);
        if (response.data !== undefined && response.data.erc20 >= 0) {
          setBalances(response.data);
        } else if (!response.data.response) {
          // Toast.show('There was error fetching balance', Toast.LONG);
        }
      })
      .catch(error => {
        setLoading(false);
        // Toast.show('There was error fetching balance', Toast.LONG);
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
          <Text style={{fontSize: 18}}>
            {route.params.wallet_type} | Wallet Options
          </Text>
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
      <View
        style={{
          backgroundColor: COLORS.primaryBlue,
          height: '100%',
          width: '100%',
          borderRadius: 25,
          marginTop: 10,
          padding: 30,
        }}>
        <View
          style={{
            zIndex: 100,
            width: '100%',
            borderRadius: 25,
          }}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 0,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 15,
                backgroundColor: COLORS.white,
              }}>
              <Image
                style={{
                  height: 70,
                  width: 70,
                  position: 'absolute',
                  zIndex: 10,
                  borderWidth: 3,
                  borderColor: COLORS.black,
                  borderRadius: 50,
                }}
                source={route.params.wallet_icon}
              />
              <QRCode
                value={route.params.wallet_address}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
              {/* <Image style={{height: 250, width: 250}} source={images.QRImage} /> */}
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                margin: 30,
              }}>
              <Text style={{color: COLORS.white, fontSize: 14}}>
                Scanned Wallet Adddress
              </Text>
              <TextInput
                value={route.params.wallet_address}
                editable={false}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                  width: 350,
                  paddingHorizontal: 10,
                  marginTop: 15,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 15}}>Select Option</Text>
            {(() => {
              if (loading) {
                return (
                  <Image
                    source={icons.reload}
                    style={{height: 15, width: 15}}
                  />
                );
              }
            })()}
          </View>
          <ScrollView style={{height: 230}}>
            {(() => {
              if (route.params.wallet_type == 'TRC20') {
                return (
                  <View>
                     <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Send', {
                          wallet: {
                            id: null,
                            title: 'REC',
                            wallet_type: 'TRC20',
                            token: 'rec',
                            description: 'REC',
                            current_rate: balances.rec_rate,
                            icon: images.recImage,
                            balance: balances.trc20_rec,
                            usd_balance: balances.rec_to_usd,
                            wallet_address: balances.trc20_wallet_address,
                          },
                          address_copied: 1,
                        })
                      }
                      style={{
                        marginBottom: 20,
                        borderRadius: 20,
                        padding: 15,
                        backgroundColor: COLORS.primary,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Image
                          style={{height: 40, width: 40, marginRight: 15}}
                          source={images.recImage}
                        />
                        <View>
                          <Text style={{fontSize: 20, color: COLORS.white}}>
                            REC
                          </Text>
                          <Text style={{fontSize: 10, color: COLORS.white}}>
                            Tron (trc20)
                          </Text>
                        </View>
                      </View>
                      <View style={{marginTop: 20}}>
                        <Text>Balance: {balances.trc20_rec} rec</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Send', {
                          wallet: {
                            id: 2,
                            title: 'TRX',
                            wallet_type: 'TRC20',
                            token: '',
                            description: 'Tron',
                            icon: images.trxImage,
                            balance: balances.trc20,
                            current_rate: balances.trx_rate,
                            usd_balance: balances.trx_to_usd,
                            wallet_address: balances.trc20_wallet_address,
                          },
                          address_copied: 1,
                        })
                      }
                      style={{
                        marginBottom: 20,
                        borderRadius: 20,
                        padding: 15,
                        backgroundColor: COLORS.primary,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Image
                          style={{height: 40, width: 40, marginRight: 15}}
                          source={images.trxImage}
                        />
                        <View>
                          <Text style={{fontSize: 20, color: COLORS.white}}>
                            Tron
                          </Text>
                          <Text style={{fontSize: 10, color: COLORS.white}}>
                            TRC20
                          </Text>
                        </View>
                      </View>
                      <View style={{marginTop: 20}}>
                        <Text>Balance: {balances.trc20} trx</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Send', {
                          wallet: {
                            id: 4,
                            wallet_type: 'TRC20',
                            token: 'usdt',
                            title: 'USDT',
                            description: 'TRC20 Network',
                            icon: images.usdtImage,
                            current_rate: 1,
                            balance: balances.trc20_usdt,
                            wallet_address: balances.trc20_wallet_address,
                            usd_balance: balances.trc20_usdt,
                          },
                          address_copied: 1,
                        })
                      }
                      style={{
                        marginBottom: 20,
                        borderRadius: 20,
                        padding: 15,
                        backgroundColor: COLORS.primary,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Image
                          style={{height: 40, width: 40, marginRight: 15}}
                          source={images.usdtImage}
                        />
                        <View>
                          <Text style={{fontSize: 20, color: COLORS.white}}>
                            USDT
                          </Text>
                          <Text style={{fontSize: 10, color: COLORS.white}}>
                            Tron (trc20)
                          </Text>
                        </View>
                      </View>
                      <View style={{marginTop: 20}}>
                        <Text>Balance: ${balances.trc20_usdt}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              } else if (route.params.wallet_type == 'ERC20') {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Send', {
                          wallet: {
                            id: 1,
                            title: 'ETH',
                            wallet_type: 'ERC20',
                            token: '',
                            description: 'Ethereum',
                            icon: images.ethImage,
                            balance: balances.erc20,
                            current_rate: balances.eth_rate,
                            usd_balance: balances.eth_to_usd,
                            wallet_address: balances.erc20_wallet_address,
                          },
                          address_copied: 1,
                        })
                      }
                      style={{
                        marginBottom: 30,
                        borderRadius: 20,
                        padding: 15,
                        backgroundColor: COLORS.primary,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Image
                          style={{height: 40, width: 40, marginRight: 15}}
                          source={images.ethImage}
                        />
                        <View>
                          <Text style={{fontSize: 20, color: COLORS.white}}>
                            Ethereum
                          </Text>
                          <Text style={{fontSize: 10, color: COLORS.white}}>
                            ERC20
                          </Text>
                        </View>
                      </View>
                      <View style={{marginTop: 20}}>
                        <Text>Balance: {balances.erc20} eth</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Send', {
                          wallet: {
                            id: 3,
                            title: 'USDT',
                            wallet_type: 'ERC20',
                            token: 'usdt',
                            description: 'ERC20 Network',
                            icon: images.usdtImage,
                            current_rate: 1,
                            balance: balances.erc20_usdt,
                            wallet_address: balances.erc20_wallet_address,
                            usd_balance: balances.erc20_usdt,
                          },
                          address_copied: 1,
                        })
                      }
                      style={{
                        marginBottom: 30,
                        borderRadius: 20,
                        padding: 15,
                        backgroundColor: COLORS.primary,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Image
                          style={{height: 40, width: 40, marginRight: 15}}
                          source={images.usdtImage}
                        />
                        <View>
                          <Text style={{fontSize: 20, color: COLORS.white}}>
                            USDT
                          </Text>
                          <Text style={{fontSize: 10, color: COLORS.white}}>
                            Ethereum (erc20)
                          </Text>
                        </View>
                      </View>
                      <View style={{marginTop: 20}}>
                        <Text>Balance: ${balances.erc20_usdt}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            })()}
          </ScrollView>
        </View>
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

export default ScannedQR;
