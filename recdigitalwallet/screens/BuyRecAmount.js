import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import {TextInput} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import APPJSON from '../app.json';

const BuyRecAmount = ({navigation, route}) => {
  const [wallet, setWallet] = React.useState(route.params.wallet);
  const [isFineXGM, setIsFineXGM] = React.useState(route.params.isFineXGM);
  const [calculatedCurrencyAmount, setCalculatedCurrencyAmount] =
    React.useState(0);
  const [amount, setAmount] = React.useState('');
  var [isPress, setIsPress] = React.useState(null);
  var [address_copied, setCopiedAddress] = React.useState(
    route.params.address_copied,
  );

  function calculate() {
    const current_rate = wallet.current_rate;
    const calculateedValue = current_rate * amount;
    setCalculatedCurrencyAmount(calculateedValue);
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
          padding: 20,
        }}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{marginTop: 0, fontSize: 15}}>REC Amount</Text>
          <View style={{flexDirection: 'row', position: 'absolute'}}>
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
            flexDirection: 'row',
            marginTop: 30,
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={wallet.icon} style={{height: 50, width: 50}} />
            <View style={{marginLeft: 10}}>
              <Text style={{fontSize: 14}}>{wallet.title}</Text>
              <Text style={{fontSize: 10}}>Paying Wallet</Text>
            </View>
          </View>
          <View>
            <Text style={{fontSize: 14}}>
              {wallet.balance + ' ' + wallet.title}{' '}
            </Text>
            <Text style={{fontSize: 10}}>{'$ ' + wallet.usd_balance}</Text>
          </View>
          <View>
            <Text>Current Rate</Text>
            <Text style={{fontSize: 10}}>{'$' + wallet.current_rate}</Text>
          </View>
        </View>
        <View
          style={{
            marginVertical: 20,
            marginBottom: 5,
            borderRadius: 20,
            backgroundColor: COLORS.primary,
            height: 80,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TextInput
            value={amount}
            editable={false}
            onChangeText={Text => {
              setAmount(Text);
            }}
            keyboardType="numeric"
            style={{
              marginVertical: SIZES.padding,
              marginLeft: 30,
              padding: 10,
              borderRadius: 10,
              fontSize: 30,
              fontWeight: 'bold',
              width: '60%',
              color: COLORS.white,
              textAlign: 'right',
            }}
          />
          <Text
            style={{
              fontSize: 30,
              height: 50,
              marginRight: 10,
              color: COLORS.primaryBlue,
            }}>
            |
          </Text>
          <Text
            style={{
              fontSize: 30,
              height: 50,
              width: '40%',
              color: COLORS.white,
            }}>
            REC
          </Text>
        </View>
        <View style={{padding: 20}}>
          <View
            style={{
              height: 70,
              marginTop: 0,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsPress(1);
                calculate();
                setAmount(amount + '' + 1);
                setTimeout(() => {
                  setIsPress(null);
                }, 1);
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>1</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsPress(2);
                calculate();
                setAmount(amount + '' + 2);
                setTimeout(() => {
                  setIsPress(null);
                }, 1);
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsPress(3);
                calculate();
                setAmount(amount + '' + 3);
                setTimeout(() => {
                  setIsPress(null);
                }, 1);
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 70,
              marginTop: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsPress(4);
                calculate();
                setAmount(amount + '' + 4);
                setTimeout(() => {
                  setIsPress(null);
                }, 1);
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>4</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsPress(5);
                calculate();
                setAmount(amount + '' + 5);
                setTimeout(() => {
                  setIsPress(null);
                }, 1);
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>5</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsPress(6);
                calculate();
                setAmount(amount + '' + 6);
                setTimeout(() => {
                  setIsPress(null);
                }, 1);
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>6</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 70,
              marginTop: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsPress(7);
                calculate();
                setAmount(amount + '' + 7);
                setTimeout(() => {
                  setIsPress(null);
                }, 1);
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>7</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsPress(8);
                calculate();
                setAmount(amount + '' + 8);
                setTimeout(() => {
                  setIsPress(null);
                }, 1);
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>8</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsPress(9);
                calculate();
                setAmount(amount + '' + 9);
                setTimeout(() => {
                  setIsPress(null);
                }, 1);
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>9</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (amount && !amount.includes('.')) {
                  setIsPress('.');
                  calculate();
                  setAmount(amount + '.');
                  setTimeout(() => {
                    setIsPress(null);
                  }, 1);
                }
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>.</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (amount !== 0) {
                  setIsPress(0);
                  calculate();
                  setAmount(amount + '' + 0);
                  setTimeout(() => {
                    setIsPress(null);
                  }, 1);
                }
              }}
              style={{
                borderRadius: 50,
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 55,
                  width: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Text style={{fontSize: 30, color: COLORS.white}}>0</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (amount) {
                  setIsPress(-1);
                  calculate();
                  setAmount(amount.slice(0, -1));
                  setTimeout(() => {
                    setIsPress(null);
                  }, 1);
                }
              }}
              style={{
                height: 70,
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                <Image
                  source={icons.removeText}
                  style={{height: 30, width: 30}}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
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
              onPress={() => navigation.goBack({wallet})}>
              <Text style={{color: COLORS.white}}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.yellow,
                height: 50,
                width: '48%',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                if (
                  amount > 0 &&
                  parseFloat(amount) * parseFloat(wallet.rec_rate) <=
                    parseFloat(wallet.usd_balance)
                ) {
                  navigation.navigate('ConfirmBuy', {
                    wallet,
                    amount,
                  });
                } else {
                  Toast.show(
                    'You dont have suffecient balance to request this amount.',
                  );
                }
              }}>
              <Text style={{color: COLORS.white}}>Next</Text>
            </TouchableOpacity>
          </View>
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

export default BuyRecAmount;
