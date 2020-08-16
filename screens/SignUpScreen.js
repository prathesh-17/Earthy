import React,{useState,useEffect} from 'react';
import {View,Text,TouchableOpacity,AsyncStorage ,TextInput,Platform,StyleSheet,Image,Animated ,StatusBar,Alert,Modal,Keyboard,Dimensions,YellowBox} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {AntDesign,Entypo,MaterialIcons,MaterialCommunityIcons} from '@expo/vector-icons'
import axios from 'axios'
import styles from '../styles/signUpScreenStyles'
import * as yup from 'yup'
import { Formik } from 'formik'
import ImageSelector from '../components/imagePicker'
import Firebase from '../api/firebase'
import _ from 'lodash';
import Spinner from 'react-native-loading-spinner-overlay';
import { saveData,receiveData } from '../Auth/asyncStorage';
import AuthContext from '../context'

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const {width,height} = Dimensions.get("screen");
const reviewSchema = yup.object().shape({
  username: yup.string()
    .required()
    .min(5)
    .max(20),
  email: yup.string()
    .email()
    .required(),
  password: yup.string()
    .required()
    .matches(/^.{8,}$/,'Must have atleast one uppercase,lowercase,number,special character respectively'),
  confirmPassword:yup.string()
    .oneOf([yup.ref('password'),null],'Passwords must match'),
  age:yup.string()
    .required()
    .test('is-num-1-5', 'Age 5 - 80', (val) => {
      return parseInt(val) < 80 && parseInt(val) > 5;
    })
});

const SignInScreen = ({navigation}) => {
  const {signIn}=React.useContext(AuthContext)
  const pri = '#000'
  const sec = 'rgb(220,20,60)'
  const [color,setColor]=useState('#333')
  const iurl='https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png'
  const [image,setImage]=useState('icon.png')
  const [loading,setLoading]=useState(false)
  const urlSet=(value)=>{
    console.log('imageurl',value)
    if(value){
      setImage(value)
    }
    else{
      setImage(null)
    }
  }

  const imageUpload=async(imageUri,userData)=>{
    const response=await fetch(imageUri)
    const blob=await response.blob();
    const fileExtension = imageUri.split('.').pop();
      console.log("EXT: " + fileExtension);
      const fname=Math.round(Math.random()*10000000);
      const fileName = `${fname}.${fileExtension}`;
      console.log(fileName);
      var storageRef = Firebase.storage().ref().child(`blog/user/${fileName}`);
      var uploadTask= storageRef.put(blob);
      uploadTask.on('state_changed',function(snapshot){
      },function(err){
      },function(){
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
          console.log('File Available at',downloadURL)
          userData.avatar=downloadURL;
          console.log(userData)
          PostUser(userData)
        })
      })
  }
  const PostUser=async(userData)=>{
    const notifToken=await AsyncStorage.getItem('ExpoToken');
    axios.post('https://pra-blog-app.herokuapp.com/users',{...userData,notifToken})
      .then((res)=>{
        Alert.alert('SignUp successful')
        const userToken={id:res.data.user._id,token:res.data.token}
        signIn(userToken)
      })
      .catch(err=>{
        Alert.alert('Error','Email already exists')
        setLoading(false)
        setImage(iurl)
      })
  }
  const [securetextEntry,setSecuretextEntry]=useState(true)
  let keyboardHeight=new Animated.Value(0);
  let headerHeight=new Animated.Value(height/6)
  let op=new Animated.Value(1)
  let tp=new Animated.Value(height/5.5)
  const [modVisible,setModVisible] = useState(false)
  useEffect(() => {
      let keyboardDidShowListener=Keyboard.addListener('keyboardDidShow',keyboardDidShow)
      let keyboardDidHideListener=Keyboard.addListener('keyboardDidHide',keyboardDidHide)
      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      }
  }, [])
  const keyboardDidShow=(event)=>{
    Animated.parallel([Animated.timing(keyboardHeight,{duration:300,toValue:event.endCoordinates.height}),
                        Animated.timing(headerHeight,{duration:300,toValue:0}),
                        Animated.timing(op,{duration:event.duration,toValue:0}),
                        Animated.timing(tp,{duration:300,toValue:height/10}),   ]).start()
  }
  const keyboardDidHide=(event)=>{
    Animated.parallel([Animated.timing(keyboardHeight,{duration:300,toValue:0}),
                        Animated.timing(headerHeight,{duration:300,toValue:height/6}),
                        Animated.timing(op,{duration:event.duration,toValue:1}),
                        Animated.timing(tp,{duration:300,toValue:height/5.5}), ]).start()
  }

  const check=(touch,error)=>{
    // console.log(touch,error)
    if(touch && !error){
      setColor('#333')
      return(
        <Animatable.View  animation="bounceIn">
            <Feather  name="check-circle" color="green"   size={20}/>
        </Animatable.View>
      )
    }
    if(touch && error){
      setColor('rgb(220,20,60)')
    }
  }
  let i=0;
  let vr = ['WELCOME!!!','Username must be greater than 5','Enter a valid email','Password must be greater than 8','Age must be between 5 and 80'];
  const t = new Animated.Value(0)
  const tt = new Animated.Value(-width)
  const modSet=()=>{
    Animated.sequence([
      Animated.timing(tt,{
        duration:1000,
        toValue:20
      })
    ]).start(()=>{tt.setValue(20);modSet1()})
  }
  const modSet1=()=>{
      if(i==-(vr.length-1)){
        i = 0
        
        Animated.sequence([
          Animated.timing(tt,{
            duration:500,
            toValue:-width
          })
        ]).start(()=>{t.setValue(0)})
        
        return
      }
      
      t.setValue(i*50)
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(t,{
          toValue:--i*50,
          duration:500
        })
      ]).start(()=>{modSet()})
  }    
  const [secureTextEntry,setSecureTextEntry]=useState(true)
  const [modalVisible,setModalVisible]=useState(false)
  return (

      <View style={styles.container}>
          <StatusBar backgroundColor='rgb(0,140,250)' barStyle="light-content"/>
        <Animated.View >
          <Animatable.View animation="fadeIn" style={{flexDirection:'row',top:10,left:3,justifyContent:'space-between'}}>
            <TouchableOpacity onPress={()=>navigation.navigate('SignInScreen')}><View style={{...styles.signup,elevation:0,backgroundColor:'rgba(0,0,0,0)'}}>
            <MaterialIcons style={{alignSelf:'flex-start',marginLeft:-3,marginTop:8}} name="arrow-back" color="black" size={30}/>
            
          </View></TouchableOpacity></Animatable.View>
          <View style={{position:'absolute',left:6}}>
            <Image source={require('../assets/virus.png')}style={{width:40,height:40,left:width/4}}/>
            <Image source={require('../assets/corona2.png')} style={{width:60,height:60,left:width/2.5}}/>
            <Image source={require('../assets/corona2.png')} style={{width:60,height:60,top:-10,left:width/5}}/>
            <Image source={require('../assets/virus.png')}style={{width:40,height:40,top:-60}}/>
            <Image source={require('../assets/virus.png')}style={{width:40,height:40,left:width/1.5,top:-110}}/>
          </View>
        </Animated.View>
        <Animatable.View
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: pri,
                // overflow:'hidden',
                // transform:[{translateY:headerHeight}]
                top:tp
            }]}
        >
        <Formik
          initialValues={{ username: '',email: '', password: '',confirmPassword:''  }}
          validationSchema={reviewSchema}
          onSubmit={(values, actions) => {
            // actions.resetForm();
            const userData={
              name:values.username,
              email:values.email,
              password:values.password,
              age:parseInt(values.age),
              Type:"Normal"
            }
            setLoading(true);
            if(image!=='icon.png'){
              imageUpload(image,userData)
            }
            else {
              userData.avatar=iurl
              PostUser(userData)
            }
            }}
        >
        {props=>{
          return(
            <View style={{flex:1}}>
            <Animated.View style ={{width:width/1.03,height:headerHeight,opacity:op,paddingTop:30,elevation:20,borderTopLeftRadius:40,borderTopRightRadius:40,
                backgroundColor:'rgb(255,255,0)',top:-30,left:-20,justifyContent:'center'}}>
              <ImageSelector urlSet={urlSet}/>
            </Animated.View>
            <View style={styles.action}>
              <FontAwesome
                  name="user-o"
                  color={sec}
                  style={{paddingBottom:5}}
                  size={20}
              />
              <TextInput
                  placeholder="Username"
                  placeholderTextColor="#666666"
                  style={[styles.textInput, {
                      color: sec
                  }]}
                  onChangeText={props.handleChange('username')}
                  onBlur={props.handleBlur('username')}
                  value={props.values.username}
                  
              />
              {
                check(props.touched.username,props.errors.username)
              }
              </View>
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
                  autoCapitalize="none"
              />
              {
                check(props.touched.email,props.errors.email)
              }
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
                {
                  check(props.touched.password,props.errors.password)
                }
              </View>
              <View style={styles.action}>
                <Feather
                    name="lock"
                    color={sec}
                    size={20}
                />
                <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: sec
                    }]}
                    secureTextEntry={securetextEntry}
                    onChangeText={props.handleChange('confirmPassword')}
                    onBlur={props.handleBlur('confirmPassword')}
                    value={props.values.confirmPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity  onPress={()=>{setSecuretextEntry(!securetextEntry)}}>
                    {securetextEntry ?
                    <Feather style={{marginRight:4}}  name="eye-off"  color={sec}  size={20}/>
                    :
                    <Feather style={{marginRight:4}}  name="eye"  color={sec}  size={20}/>
                    }
                </TouchableOpacity >
                {
                  check(props.touched.confirmPassword,props.errors.confirmPassword)
                }
              </View>
              <View style={styles.action}>
                <Feather
                    name="calendar"
                    color={sec}
                    size={20}
                />
                <TextInput
                    placeholder="Enter Your Age"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: sec
                    }]}
                    onChangeText={props.handleChange('age')}
                    onBlur={props.handleBlur('age')}
                    value={props.values.age}
                    autoCapitalize="none"
                    keyboardType="numeric"
                />
                {
                  check(props.touched.age,props.errors.age)
                }
                </View>

              <TouchableOpacity  onPress={props.handleSubmit}>
                <View style={styles.submit}><Text style={{fontSize:16,color:'white'}}>Sign Up</Text ></View></TouchableOpacity >
            </View>
            )
          }}

          </Formik>

        </Animatable.View>


        <View style = {{width:60,height:60,borderRadius:60,backgroundColor:'rgb(0,0,150)',elevation:20, 
            alignItems:'center',justifyContent:'center',
            position:'absolute',top:10,right:10}}> 
            <MaterialCommunityIcons  name="lightbulb" onPress={()=>{modSet();console.log('clicked')}} size = {32} color='white'/>
        </View>

        <Animated.View style={{flexDirection:'row',alignItems:'center',width:width/1.3,height:50,borderRadius:30,backgroundColor:'rgb(250,215,0)',
          marginLeft:40,bottom:-250,elevation:20,justifyContent:'center',top:20,left:tt
          }}>
          <Animated.Image source = {require('../assets/smile.png')} style = {{width:80,height:80,left:35,top:-10}} />
          <View style={{overflow:'hidden',width:width/1.1,height:50}}>
           <Animated.View style ={{height:vr.length*50,justifyContent:'space-around',top:t}}> 
            {vr.map(item => (<Text key={item} style={{paddingLeft:28,fontWeight:'bold',fontSize:16}} >{item}</Text>))}
            
           </Animated.View>
          </View>
        </Animated.View>


        <Spinner
          visible={loading}
          animation="fade" overlayColor="rgba(0,0,0,0.3)" color="rgb(220,20,60)"
        />
      </View>
  )
}
export default SignInScreen;
