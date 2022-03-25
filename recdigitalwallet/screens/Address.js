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
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import APPJSON from '../app.json';
import {RNCamera} from 'react-native-camera';

const Address = ({navigation, route}) => {
  const [wallet, setWallet] = React.useState(route.params.wallet);
  const [amount, setAmount] = React.useState(route.params.amount);
  const [isFineXGM, setIsFineXGM] = React.useState(route.params.isFineXGM);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState('');
  const [cameraIsActive, setActiveCamera] = React.useState(false);
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

  let transfer = isFineXGM ? 'finexgmtransfer' : 'transfer';
  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setWalletAddress(text);
  };
  async function _transfer() {
    setIsSubmitted(true);
    console.log({
      token,
      to_address: walletAddress,
      amount,
      from_address: wallet.wallet_address,
      wallet_type: wallet.title + ' ' + wallet.wallet_type,
      contract_address: wallet.token,
    });
    let token = await AsyncStorage.getItem('token');
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    };
    axios
      .post(
        APPJSON.API_URL + transfer,
        {
          token,
          to_address: walletAddress,
          amount,
          from_address: wallet.wallet_address,
          wallet_type: wallet.title + ' ' + wallet.wallet_type,
          contract_address: wallet.token,
        },
        axiosConfig,
      )
      .then(response => {
        setIsSubmitted(false);
        if (response.data != undefined && response.data.response) {
          if (response.data.hash) {
            navigation.navigate('Sent', {
              hash: response.data.hash,
              wallet,
              amount,
              to_address: walletAddress,
              usd_amount: wallet.current_rate * amount,
            });
          } else {
            Toast.show(response.data.message, Toast.LONG);
          }
        } else {
          Toast.show(response.data.message, Toast.LONG);
          if (response.data.message == 'You are logged out') {
            navigation.navigate('Login');
          }
        }
      })
      .catch(error => {
        console.log(token);
        console.log(error);
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
            onPress={() => navigation.navigate('Send')}
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
          <Text style={{fontSize: 18}}>{wallet.description}</Text>
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
          backgroundColor: COLORS.primaryBlue,
          height: '100%',
          width: '100%',
          borderRadius: 25,
          alignItems: 'center',
          padding: 20,
        }}>
        {(() => {
          if (cameraIsActive) {
            return (
              <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={{flex: 1, position: 'absolute', height: '67%', top: 40, width: '100%'}}
                captureAudio={false}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.off}
                onBarCodeRead={onBarCodeRead}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'Camera is required for barcode scanning',
                  buttonPositive: 'OK',
                  buttonNegative: 'Cancel',
                }}
              />
            );
          }
        })()}
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{marginTop: 0, fontSize: 15}}>Send {wallet.title}</Text>
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
            <Text>Total</Text>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{fontSize: 30, color: COLORS.white, fontWeight: 'bold'}}>
                {amount + ' ' + wallet.title}
              </Text>
              <Text style={{fontSize: 12}}>
                = {'$ ' + wallet.current_rate * amount}
              </Text>
            </View>
          </View>
        </View>
        {(() => {
          if (!cameraIsActive) {
            return (
              <View
                style={{
                  marginTop: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderStyle: 'dotted',
                  borderWidth: 1,
                  borderColor: '#ffffff40',
                  height: 210,
                  borderRadius: 200,
                  width: 210,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderStyle: 'dotted',
                    borderWidth: 1,
                    borderColor: '#ffffff60',
                    height: 180,
                    borderRadius: 200,
                    width: 180,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderStyle: 'dotted',
                      borderWidth: 1,
                      borderColor: '#ffffff80',
                      height: 150,
                      borderRadius: 200,
                      width: 150,
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
                      <Image
                        style={{height: 100, width: 100}}
                        source={wallet.icon}
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          } else {
            return (
              <View
                style={{
                  marginTop: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 210,
                  borderRadius: 200,
                  width: 210,
                }}/>
            );
          }
        })()}
        <View
          style={{
            alignItems: 'center',
            marginTop: 20,
            justifyContent: 'center',
          }}>
          <Text style={{color: COLORS.white, fontSize: 14}}>
            {wallet.title} Wallet Adddress
          </Text>
          <View>
            <TextInput
              value={walletAddress}
              style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor: COLORS.white,
                color: COLORS.white,
                width: 350,
                paddingHorizontal: 10,
                paddingRight: 45,
                marginTop: 15,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setActiveCamera(true);
                setActive(true);
              }}
              style={{
                position: 'absolute',
                right: 15,
                top: '45%',
              }}>
              <Image
                source={icons.scan}
                style={{height: 20, width: 20, tintColor: COLORS.white}}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => fetchCopiedText()}
            style={{
              backgroundColor: '#05446f',
              padding: 15,
              marginTop: 20,
              width: 220,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
            }}>
            <Text style={{color: COLORS.white}}>Paste Wallet Address</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 30,
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.gray,
              height: 50,
              width: '48%',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('Send')}>
            <Text style={{color: COLORS.white}}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
           disabled={isSubmitted ? true : false}
            style={{
              backgroundColor: COLORS.yellow,
              height: 50,
              width: '48%',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (amount && walletAddress && !isSubmitted) {
                _transfer();
              }
            }}>
            <Text style={{color: COLORS.white}}>
              {isSubmitted ? 'Please wait...' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function onBarCodeRead(result) {
    if (isActive) {
      if (wallet.wallet_type == 'ERC20') {
        if (result.data.length == 42 && result.data.substring(0, 2) == '0x') {
          Clipboard.setString(result.data);
          setWalletAddress(result.data);
          setActive(false);
          setActiveCamera(false);
        } else {
          Toast.show('Scan only ERC20 wallet address');
        }
      } else if (wallet.wallet_type == 'TRC20') {
        if (result.data.length == 34 && result.data.substring(0, 1) === 'T') {
          Clipboard.setString(result.data);
          setWalletAddress(result.data);
          setActive(false);
          setActiveCamera(false);
        } else {
          Toast.show('Scan only TRC20 wallet address');
        }
      } else {
        Toast.show('Scan only ERC20/TRC20 wallet address');
      }
    }
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

export default Address;
