import React from 'react';
import {SafeAreaView, View, Text, Image, TouchableOpacity} from 'react-native';
import {COLORS, SIZES, icons, images} from '../constants';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import APPJSON from '../app.json';

const ConfirmBuy = ({navigation, route}) => {
  const [wallet, setWallet] = React.useState(route.params.wallet);
  const [amount, setAmount] = React.useState(route.params.amount);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState('');
  const [action_type, setActionType] = React.useState(1);
  const [showArrow, setShowArrow] = React.useState(true);
  var [address_copied, setCopiedAddress] = React.useState(
    route.params.address_copied,
  );
  const [isActive, setActive] = React.useState(true);

  React.useEffect(() => {
    if (address_copied && isActive) {
      fetchCopiedText();
    }
    return () => {
      setActive(false);
    };
  }, []);

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setWalletAddress(text);
  };
  function animateArrow() {
    return setInterval(function () {
      setShowArrow(!showArrow);
    }, 1000);
  }
  async function _transfer(action_type) {
    setIsSubmitted(true);
    setActionType(action_type);
    const animator = animateArrow();
    let token = await AsyncStorage.getItem('token');
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    setIsLoading(true);
    axios
      .post(
        APPJSON.API_URL + 'buyRecAssets',
        {
          token,
          amount,
          from_address: wallet.wallet_address,
          wallet_type: wallet.title + ' ' + wallet.wallet_type,
          contract_address: wallet.token,
          action_type,
        },
        axiosConfig,
      )
      .then(response => {
        clearInterval(animator);
        setIsSubmitted(false);
        setIsLoading(false);
        if (response.data != undefined && response.data.response) {
          if (response.data.hash) {
            navigation.navigate('Bought', {
              hash: response.data.hash,
              wallet,
              amount,
              action_type,
              usd_amount: wallet.current_rate * amount,
            });
          } else if (response.data.message != undefined) {
            Toast.show(response.data.message, Toast.LONG);
          } else if (response.data.msg != undefined) {
            Toast.show(response.data.msg, Toast.LONG);
          }
        } else {
          if (response.data.message != undefined) {
            Toast.show(response.data.message, Toast.LONG);
          } else if (response.data.msg) {
            Toast.show(response.data.msg, Toast.LONG);
          }
          if (response.data.message == 'You are logged out') {
            navigation.navigate('Login');
          }
        }
      })
      .catch(error => {
        clearInterval(animator);
        setIsLoading(false);
        setIsSubmitted(false);
        Toast.show(error.message, Toast.LONG);
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
            onPress={() => navigation.goBack({wallet})}
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
          <Text style={{fontSize: 18}}>Buy REC Assets</Text>
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
                flexDirection: 'row',
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
          alignItems: 'center',
          padding: 20,
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{marginTop: 0, fontSize: 15}}>Confirm Amount</Text>
          <View style={{flexDirection: 'row', position: 'absolute'}}>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 30,
                fontWeight: 'bold',
                margin: 4,
              }}>
              _
            </Text>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 30,
                fontWeight: 'bold',
                margin: 3,
              }}>
              _
            </Text>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 30,
                fontWeight: 'bold',
                margin: 3,
              }}>
              _
            </Text>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 30,
                fontWeight: 'bold',
                margin: 3,
              }}>
              _
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <View
              style={{
                alignItems: 'flex-start',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View>
                <Text style={{fontSize: 30, fontWeight: 'bold'}}>Total: </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 30,
                    color: COLORS.white,
                    fontWeight: 'bold',
                  }}>
                  {amount + ' REC'}
                </Text>
                <Text style={{fontSize: 12}}>
                  {'$' + wallet.rec_rate * amount} ={' '}
                  {((wallet.rec_rate * amount) / wallet.current_rate).toFixed(
                    5,
                  )}{' '}
                  {wallet.title}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              marginTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderStyle: 'dotted',
              borderWidth: 1,
              borderColor: '#ffffff40',
              height: 140,
              borderRadius: 200,
              width: 140,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: 'dotted',
                borderWidth: 1,
                borderColor: '#ffffff60',
                height: 120,
                borderRadius: 200,
                width: 120,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderStyle: 'dotted',
                  borderWidth: 1,
                  borderColor: '#ffffff80',
                  height: 100,
                  borderRadius: 200,
                  width: 100,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderStyle: 'dotted',
                    borderWidth: 1,
                    borderColor: '#ffffff60',
                    height: 80,
                    borderRadius: 200,
                    width: 80,
                  }}>
                  <Image style={{height: 60, width: 60}} source={wallet.icon} />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {(() => {
              if (showArrow) {
                return (
                  <Image
                    source={icons.back}
                    style={{height: 40, width: 40, tintColor: COLORS.white}}
                  />
                );
              } else {
                return (
                  <View style={{height: 40, width: 40}}></View>
                );
              }
            })()}
          </View>
          <View
            style={{
              marginTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderStyle: 'dotted',
              borderWidth: 1,
              borderColor: '#ffffff40',
              height: 140,
              borderRadius: 200,
              width: 140,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: 'dotted',
                borderWidth: 1,
                borderColor: '#ffffff60',
                height: 120,
                borderRadius: 200,
                width: 120,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderStyle: 'dotted',
                  borderWidth: 1,
                  borderColor: '#ffffff80',
                  height: 100,
                  borderRadius: 200,
                  width: 100,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderStyle: 'dotted',
                    borderWidth: 1,
                    borderColor: '#ffffff60',
                    height: 80,
                    borderRadius: 200,
                    width: 80,
                  }}>
                  <Image
                    style={{height: 60, width: 60}}
                    source={images.recImage}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 20,
            justifyContent: 'center',
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 30,
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <TouchableOpacity
            disabled={isLoading}
            style={{
              backgroundColor: COLORS.bgHighlightedBlue,
              height: 50,
              width: '48%',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (amount && !isSubmitted) {
                _transfer(1);
              }
            }}>
            <Text style={{color: COLORS.white}}>
              {isLoading && action_type == 1 ? 'Please wait...' : 'Stake coins'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading}
            style={{
              backgroundColor: COLORS.bgHighlightedBlue,
              height: 50,
              width: '48%',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (amount && !isSubmitted) {
                _transfer(3);
              }
            }}>
            <Text style={{color: COLORS.white}}>
              {isLoading && action_type == 3
                ? 'Please wait...'
                : 'Buy REC coins'}
            </Text>
          </TouchableOpacity>
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

export default ConfirmBuy;
