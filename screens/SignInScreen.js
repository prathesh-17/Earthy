import firebase from 'firebase'
import Firebase from '../api/firebase'
import React,{useState} from 'react';
import {View,Text,TouchableOpacity,Dimensions ,Image,TextInput,Platform,StyleSheet,AsyncStorage ,StatusBar,Alert,Modal,KeyboardAvoidingView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {AntDesign,Entypo,MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons'
import axios from 'axios'
import styles from '../styles/signInScreenStyles'
import * as yup from 'yup'
import { Formik } from 'formik'
import Spinner from 'react-native-loading-spinner-overlay';
import { saveData,receiveData } from '../Auth/asyncStorage';
import  AuthContext  from '../context'
import ThemeContext from '../themeCntxt'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {mix,useTransition} from "react-native-redash";

const {width,height} = Dimensions.get("screen");

const reviewSchema = yup.object().shape({
  email: yup.string()
    .email()
    .required(),
  password: yup.string()
    .required()
});


const SignInScreen = ({navigation}) => {
  const [modalVisible,setModalVisible]=useState(false)
  const {signIn} = React.useContext(AuthContext)
  let pri,sec
  pri = '#000'
  sec = 'rgb(220,20,60)'
  const trans = useTransition(modalVisible)
  const bt = mix(trans,0,-200)
  // const bt = 20
  const check=(touch,error)=>{
    if(touch && !error){
      return(
        <Animatable.View  animation="bounceIn">
            <Feather  name="check-circle" color="green"   size={20}/>
        </Animatable.View>
      )
    }
  }

  if(modalVisible){
    setTimeout(() => {
      setModalVisible(false)
    }, 2000);
  }

  const [secureTextEntry,setSecureTextEntry]=useState(true)
  const [loading,setLoading]=useState(false)
  return (

      <View style={styles.container}>
          <StatusBar backgroundColor='rgb(0,140,250)' barStyle="light-content"/>
        <View style={styles.header}>
          <View style={{position:'absolute',left:6}}>
            <Image source={require('../assets/virus.png')}style={{width:40,height:40,left:width/4}}/>
            <Image source={require('../assets/corona2.png')} style={{width:60,height:60,left:width/2.5}}/>
            <Image source={require('../assets/corona2.png')} style={{width:60,height:60,left:width/5}}/>
            <Image source={require('../assets/virus.png')}style={{width:40,height:40,bottom:15}}/>
          </View>
          <TouchableOpacity onPress={()=>navigation.navigate('SignUpScreen')}>
            <View style={{...styles.signup,backgroundColor:sec}}>
              <Text style={{fontSize:22,fontWeight:'bold',paddingLeft:10 ,color:pri}}> Sign Up</Text>
              <MaterialIcons style={{alignSelf:'flex-end',marginBottom:7,color:pri}} name="navigate-next" color="black" size={40}/>
          </View></TouchableOpacity>
        </View>
        <View
            style={[styles.footer, {
                backgroundColor: pri
            }]}
        >
        <Formik
          initialValues={{ username: '',email: '', password: '',confirmPassword:''  }}
          validationSchema={reviewSchema}
          onSubmit={async(values, actions) => {
            // actions.resetForm();
            const notifToken=await AsyncStorage.getItem('ExpoToken')
            const userData={
              email:values.email,
              password:values.password,
              notifToken:notifToken
            }
            setLoading(true)

            console.log('sign in runing',userData)

            axios.post('https://pra-blog-app.herokuapp.com/users/login',userData)
              .then(async(res)=>{
                Alert.alert('Login Successful')
                const userToken={id:res.data.user._id,token:res.data.token}
                await signIn(userToken)
                setLoading(false);
              })
              .catch(err=>{
                console.log(err)
                Alert.alert('Login Failed')
                setLoading(false)
              })
              console.log('finished')
          }}
        >
        {props=>{
          return(
            <View style={{flex:1}}>
            <View style = {{alignSelf:'flex-end',marginBottom:20,width:20,height:20,borderRadius:20,backgroundColor:sec}} />

            <View style={styles.action}>
              <Feather
                  name="mail"
                  color={sec}
                  size={20}
                  style={{paddingBottom:5}}
              />
              <TextInput
                  placeholder="Your Email"
                  placeholderTextColor="#666666"
                  style={[styles.textInput, {
                      color: sec
                  }]}
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                  value={props.values.email}
                  autoCapitalize = 'none'

              />

              </View>
              <View style={styles.action}>
                <Feather
                    name="lock"
                    color={sec}
                    size={20}
                />
                <TextInput
                    placeholder="Your Password"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: sec
                    }]}
                    secureTextEntry={secureTextEntry}
                    onChangeText={props.handleChange('password')}
                    onBlur={props.handleBlur('password')}
                    value={props.values.password}
                    autoCapitalize="none"
                />
                <TouchableOpacity  onPress={()=>{setSecureTextEntry(!secureTextEntry)}}>
                    {secureTextEntry ?
                    <Feather style={{marginRight:4}}  name="eye-off"  color={sec}  size={20}/>
                    :
                    <Feather style={{marginRight:4}}  name="eye"  color={sec}  size={20}/>
                    }
                </TouchableOpacity >

              </View>
              <TouchableOpacity  onPress={props.handleSubmit}><View style={{...styles.submit,backgroundColor:sec}}>
                <Text style = {{fontSize:16,color:'white'}}>Sign In</Text ></View></TouchableOpacity >
            </View>
            )
          }}

          </Formik>
          


        </View>
        <View style = {{width:60,height:60,borderRadius:60,backgroundColor:'rgb(0,0,150)',elevation:20, 
            alignItems:'center',justifyContent:'center',
            position:'absolute',bottom:20,right:20}}> 
          
            <MaterialCommunityIcons  name="lightbulb" onPress={()=>{setModalVisible(true);console.log('clicked')}} size = {32} color='white'/>
          
        </View>

        <Animated.View style={{flexDirection:'row',alignItems:'center',width:width/1.2,height:50,borderRadius:30,backgroundColor:'rgb(250,215,0)',
          marginLeft:40,bottom:-250,elevation:20,transform:[{translateY:bt}]}}>
          <Animated.Image source = {require('../assets/smile.png')} style = {{width:80,height:80,left:-20,top:-10}} />
          <Text style={{left:-25,fontWeight:'bold',fontSize:16}} >Enter A Valid Email And Password</Text>
        </Animated.View>  
        <Spinner visible={loading} animation="fade" overlayColor="rgba(0,0,0,0.3)" color="rgb(220,20,60)"/>
      </View>
  )
}
export default SignInScreen;
