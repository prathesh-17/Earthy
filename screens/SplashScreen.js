import React,{useEffect} from 'react';
import {View,Text,TouchableOpacity,Dimensions,StyleSheet,StatusBar,Image,Button,Animated} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { interpolate } from 'react-native-reanimated';

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;


const SplashScreen = ({navigation}) => {
  const rot = new Animated.Value(0)
  useEffect(()=>{
    func()
  },[])
  const func = ()=>{
    rot.setValue(0);
    Animated.sequence([
      Animated.timing(rot,{
        toValue:180,
        duration:2000
      }).start(()=>{func()})
    ])
  }
  const rot1 = rot.interpolate({
    inputRange:[0,180],
    outputRange:['0deg','360deg'],
    extrapolate:'clamp'
  })
  return (
    <View style={styles.container}>
        <StatusBar backgroundColor='rgb(255,215,0)' barStyle="dark-content"/>
      <View style={styles.header}>
          <Animated.Image
          source={require('../assets/globe.png')}
          style={{...styles.logo,transform:[{rotateZ:rot1}]}}
          resizeMode="stretch"
          />
      </View>
      <Animatable.View animation="bounceIn" style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor:'rgb(0,0,120)',
        bottom:20,right:20,width:60,height:60,borderRadius:30,elevation:10,alignSelf:'flex-end'}}>
        <MaterialIcons name="navigate-next" size={34} color="white" onPress={()=>{navigation.navigate('SignInScreen')}}/>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255,215,0)'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  logo: {
    borderRadius:height*0.4,
    width: height_logo,
    height: height_logo
  }
})
export default SplashScreen
