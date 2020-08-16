import React,{useState,useEffect} from 'react';
import { View, Text, Button, StyleSheet,Image,Dimensions,FlatList,TouchableOpacity,Modal,StatusBar } from 'react-native';
import {AntDesign,Entypo,MaterialIcons,FontAwesome,Feather,EvilIcons,Ionicons} from '@expo/vector-icons'
import axios from 'axios'
const {width,height}=Dimensions.get('screen')
import {Placeholder,PlaceholderMedia,PlaceholderLine,ShineOverlay} from 'rn-placeholder'
import {Caption} from 'react-native-paper'
import ProfileScreenOthers from './ProfileScreenOthers'
import ThemeContext from '../themeCntxt';
import { TextInput } from 'react-native-gesture-handler';


const hmx = 80;
const hmn = 70;
const pmx = 80;
const pmn = 40;


const User=({item,changeId,themeState})=>{
//   const {user}=item
//   console.log(item)
  const {name,email,avatar,_id}=item
  return(
    <TouchableOpacity onPress={()=>{changeId(_id)}}>
      <View style={{...styles.post,flexDirection:'row',padding:10,alignItems:'center',backgroundColor:themeState.pst}}>
        <View style = {{marginLeft:-10,borderBottomLeftRadius:40,borderTopLeftRadius:40,width:50,height:55,backgroundColor:'rgb(220,20,60)'}}></View>
        <View
          style={{height: 80,  width: 80,elevation:11,  borderRadius: 40,  borderColor: 'rgb(0,0,0)',  borderWidth: 3.5, 
                    marginLeft:-10}}>
          <Image  source={{uri:avatar}}  style={{ backgroundColor:'white',flex: 1, width: null, height: null,borderRadius:40 }}/>
        </View>
        <View style={{left:14,flexDirection:'column'}}>
          <Text style={{fontWeight:'bold',fontSize:16,color:themeState.txt}}>{name}</Text>
          <Caption style={{color:themeState.txt,opacity:0.7}}>{email} </Caption>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const UpvoteScreen = ({route,navigation}) => {
    const {themeState} = React.useContext(ThemeContext)
    const {user}=route.params
    const [loading,setLoading]=useState(false)
    const [users,setUsers]=useState([])
    const [users1,setUsers1] = useState([])
    const [uid,setUid]=useState(null)
    const [userModal,setuserModal]=useState(false)
    const [val,setVal] = useState('')
    useEffect(()=>{
      setLoading(true)
      getUsers()
    },[])
    const getUsers=()=>{
      axios.get(`https://pra-blog-app.herokuapp.com/users/getAll`)
        .then(res=>{
          setUsers(res.data)
          setUsers1(res.data)
        //   console.log(res.data)
          setLoading(false)
        })
    }

    const changeTxt = (e) => {
        setVal(e)
        if(e.trim().length == 0 ){
            setUsers1(users)
            return 
        }
        
        setUsers1(users.filter(item => {return item.name.includes(e.trim().toLowerCase())}))
    }
    return (
      <View style={{flex:1,backgroundColor:'#eee'}}>
        <View  style={{  position: 'absolute',flexDirection:'row',elevation:10,  top: 0,  left: 0,  right: 0,  backgroundColor: themeState.pri,height:hmx }}  >
          <AntDesign name="closecircle" size={24} color={themeState.sec} style={{padding:6}} onPress={()=>{navigation.goBack()}}/>
          <View style = {{width:width/2.4}}/>
          <View style={{alignItems:'center',elevation:10,backgroundColor:'#eee',borderRadius:20,height:30,marginTop:3,
                flexDirection:'row',width:185}}>
            
            <TextInput placeholderTextColor="rgba(0,0,0,0.5)" placeholder="Search Handle..." value = {val} 
              onChangeText={(e)=>{changeTxt(e)}}
              autoCapitalize = {false}
              style = {{paddingVertical:3,width:150,paddingLeft:20}}
               />
            
              <MaterialIcons  name="person" size={20}  /></View>
        </View>
        <View
          style={{  height: pmx,  width: pmx,elevation:11,  borderRadius: pmx/2,  borderColor: themeState.txt,  borderWidth: 3, marginLeft: width/2-pmx/2-6,marginTop:hmx-pmx/2
          }}>
          <Image  source={{uri:user.avatar}}  style={{ backgroundColor:'white',flex: 1, width: null, height: null,borderRadius:pmx/2 }}/>
        </View>
        <View style={{...styles.posts,backgroundColor:(themeState.pri == '#000'?'#444':'#eee' )}}>

          <FlatList  data={users1}   renderItem={({item})=><User navigation={navigation}
            changeId={(val)=>{setUid(val);setuserModal(true)}} item={item} themeState = {themeState} />}
            keyExtractor={item=>item._id.toString()}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={getUsers}
          />
          {!loading & users.length==0?(<View style={{position:'absolute',left:width/4,top:height/2+hmx,margin:20}}>
                        <Text style={{fontSize:16,color:'#999'}}>No Upvotes</Text>
                     </View>):null}
          </View>
          <Modal visible={userModal}><ProfileScreenOthers  changeUser={()=>{setuserModal(false)}} id={uid}/></Modal>
      </View>
    );
};

const styles=StyleSheet.create({
  posts:{
    height:height-120,
    top:-100,
    paddingTop:60,
    height:height/1.1,
    padding:20,
    marginBottom:100
  },
  post:{
    backgroundColor:'white',
    padding:15,
    margin:10,
    marginTop:35,
    marginBottom:10,
    height:55,
    marginBottom:25,
    borderRadius:40,
    elevation:5
  }
})

export default UpvoteScreen;
