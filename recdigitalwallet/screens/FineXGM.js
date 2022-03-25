import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import APPJSON from '../app.json';
import PTRView from 'react-native-pull-to-refresh';

const FineXGM = ({navigation, route}) => {
  const [walletDetails, setWalletDetails] = React.useState({
    title: route.params.wallet.title,
    wallet_type: route.params.wallet.wallet_type,
    token: route.params.wallet.token,
    description: route.params.wallet.description,
    icon: route.params.wallet.icon,
    balance: route.params.wallet.balance,
    usd_balance: route.params.wallet.usd_balance,
    wallet_address: route.params.wallet.wallet_address,
    current_rate: route.params.wallet.current_rate,
  });

  const [loading, setLoading] = React.useState(false);
  const [transactions, setTransactions] = React.useState({});
  const [isActive, setActive] = React.useState(true);

  React.useEffect(() => {
    getBalances();
    return () => {
      setActive(false);
    };
  }, []);

  function refresh() {
    if (isActive) {
      getBalances();
      getTransactions();
    }
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
      .post(APPJSON.API_URL + 'balance', {token: token}, axiosConfig)
      .then(response => {
        setLoading(false);
        if (response.data !== undefined && response.data.erc20 >= 0) {
          let object = walletDetails;
          if (object.wallet_type == 'ERC20' && !object.token) {
            object.balance = response.data.erc20;
            object.usd_balance = response.data.eth_to_usd;
          } else if (object.wallet_type == 'TRC20' && !object.token) {
            object.balance = response.data.trc20;
            object.usd_balance = response.data.trx_to_usd;
          } else if (object.wallet_type == 'ERC20' && object.token) {
            object.balance = response.data.erc20_usdt;
            object.usd_balance = response.data.erc20_usdt;
          } else if (object.wallet_type == 'TRC20' && object.token == 'usdt') {
            object.balance = response.data.trc20_usdt;
            object.usd_balance = response.data.trc20_usdt;
          } else if (object.wallet_type == 'TRC20' && object.token == 'rec') {
            object.balance = response.data.trc20_rec;
            object.usd_balance = response.data.rec_to_usd;
          }
          setWalletDetails(object);
        } else if (!response.data.response) {
          //Toast.show('There was error fetching balance.', Toast.LONG);
        }
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        // Toast.show('There was error fetching balance', Toast.LONG);
      });
    getTransactions();
  }
  async function getTransactions() {
    setTransactions([]);
    let token = await AsyncStorage.getItem('token');
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(
        APPJSON.API_URL + 'fineXgmTransactions',
        {
          token: token,
          wallet_type: walletDetails.title + ' ' + walletDetails.wallet_type,
        },
        axiosConfig,
      )
      .then(response => {
        setLoading(false);
        if (response.data != undefined && response.data) {
          setTransactions(response.data);
        } else if (!response.data.response) {
          // Toast.show('error occured please.', Toast.LONG);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(walletDetails.title + ' ' + walletDetails.wallet_type);
        // Toast.show('error occured.', Toast.LONG);
      });
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
            onPress={() => navigation.navigate('Home')}
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
          <Text style={{fontSize: 18}}>{walletDetails.description}</Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
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
          padding: 0,
          justifyContent: 'space-between',
          alignItems: 'stretch',
          flexDirection: 'row',
        }}>
        <PTRView
          style={{backgroundColor: COLORS.primary}}
          progressBackgroundColor={COLORS.primary}
          enabled={loading ? false : true}
          refreshing={loading ? false : true}
          onRefresh={refresh}>
          <View
            style={{
              padding: 0,
              justifyContent: 'space-between',
              alignItems: 'stretch',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                width: '67%',
              }}>
              <LinearGradient
                colors={[COLORS.lime, COLORS.emerald]}
                style={{
                  borderRadius: 20,
                }}>
                <View
                  style={{
                    padding: 20,
                  }}>
                  <View style={{flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row', marginBottom: 20}}>
                      <Text style={{fontSize: 14, marginRight: 5}}>
                        {walletDetails.token
                          ? walletDetails.wallet_type
                          : walletDetails.description}
                      </Text>

                      <Text style={{color: COLORS.yellow}}>
                        ({walletDetails.token})
                      </Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: COLORS.white,
                        }}>
                        {walletDetails.balance}
                      </Text>
                      <Text style={{fontSize: 14}}>
                        {'$ ' + walletDetails.usd_balance}
                      </Text>
                      <Image
                        source={walletDetails.icon}
                        style={{height: 40, width: 40, marginTop: 55}}
                      />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-end',
                width: '30%',
              }}>
              <TouchableOpacity
                style={{marginBottom: 5}}
                onPress={() =>
                  navigation.navigate('Send', {
                    wallet: walletDetails,
                    isFineXGM: 1,
                  })
                }>
                <View
                  style={{
                    backgroundColor: COLORS.darkRed,
                    borderRadius: 20,
                    padding: 15,
                  }}>
                  <View style={{flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row', marginBottom: 25}}>
                      <Image
                        source={icons.send}
                        style={{height: 25, width: 25}}
                      />
                    </View>
                    <View>
                      <Text style={{fontSize: 18}}>Send</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </PTRView>
      </View>
    );
  }

  function renderFeatures() {
    const renderItem = ({item}) => (
      <View style={{width: '100%', marginVertical: 5}}>
        <TouchableOpacity
          style={{
            width: '100%',
            marginBottom: 5,
          }}
          onPress={() => {
            Linking.openURL(item.url);
          }}>
          <View style={{width: '100%'}}>
            <Text style={{fontSize: 11}}>{item.date}</Text>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Image
                  source={icons.wallet}
                  style={{
                    height: 45,
                    width: 45,
                    marginRight: 20,
                    opacity: 1,
                  }}
                />
                <View>
                  <Text style={{fontSize: 17, color: COLORS.white}}>
                    {item.title}
                  </Text>
                  {(() => {
                    if (item.status == 'Confirmed') {
                      return (
                        <Text style={{fontSize: 13, color: COLORS.startGreen}}>
                          {item.status}
                        </Text>
                      );
                    } else {
                      return (
                        <Text style={{fontSize: 13, color: COLORS.red}}>
                          {item.status}
                        </Text>
                      );
                    }
                  })()}
                </View>
              </View>
              <View>
                <Text style={{fontSize: 15, color: COLORS.white}}>
                  {item.balance} {walletDetails.title}
                </Text>
                <Text style={{fontSize: 12}}>${item.usd_balance}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            height: 2,
            backgroundColor: COLORS.white,
            marginVertical: 2,
            opacity: 0.1,
          }}
        />
      </View>
    );

    return (
      <View style={{width: '100%', height: '55%'}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <Text style={{fontSize: 15}}>History</Text>
          {/* <TouchableOpacity
            style={{marginTop: 5, marginRight: 20}}
            onPress={() => alert('Filter')}>
            <Image source={icons.more} style={{height: 20, width: 20}} />
          </TouchableOpacity> */}
        </View>
        {(() => {
          if (!loading && transactions.length) {
            return (
              <FlatList
                data={transactions}
                scrollEnabled={true}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                style={{marginTop: SIZES.padding * 1}}
              />
            );
          } else if (!loading && !transactions.length) {
            return (
              <Text style={{fontSize: 17, marginTop: 80, textAlign: 'center'}}>
                No Transaction yet
              </Text>
            );
          } else if (loading) {
            return (
              <Text style={{fontSize: 17, marginTop: 80, textAlign: 'center'}}>
                Fetching transactions...
              </Text>
            );
          }
        })()}
      </View>
    );
  }

  return (
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
  );
};

export default FineXGM;
