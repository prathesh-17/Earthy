import React,{useEffect,useState,useContext} from 'react';
import { View, Button,StatusBar, StyleSheet,Dimensions,FlatList,Image,Animated,ScrollView,Modal,TextInput,TouchableOpacity,Alert, TouchableWithoutFeedback, AsyncStorage } from 'react-native';
import {Avatar,Title,Caption,Paragraph,Drawer,Text,TouchableRipple,Switch} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {AntDesign,Entypo,MaterialIcons,FontAwesome,Feather,EvilIcons,Ionicons,MaterialCommunityIcons} from '@expo/vector-icons'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
const {width,height}=Dimensions.get('window')
import {Placeholder,PlaceholderMedia,PlaceholderLine,ShineOverlay} from 'rn-placeholder'
import Spinner from 'react-native-loading-spinner-overlay';
import ProfileScreenOthers from './ProfileScreenOthers'
import AuthContext from '../context'
import TokenContext from '../tokenCntxt'
import {receiveData} from '../Auth/asyncStorage'
import {useFocusEffect,useNavigation} from '@react-navigation/native';
import urlRegex from 'url-regex'

import { Colors } from 'react-native/Libraries/NewAppScreen';
import ThemeContext from '../themeCntxt'
import ImageViewer from '../components/imageViewer';
import ImagePost from './ImagePost'
import ImageView from './ImageView'
import MultImgView from '../components/MultImgView'

const hmx = 110;
const hmn = 70;
const pmx = 80;
const pmn = 40;
const iurl=require('../assets/uicon.png')


const Ph=()=>{
    return (<View style={{...styles.post,height:150}}>
      <Placeholder
        Left={PlaceholderMedia}
        Right={PlaceholderMedia}
        Animation={ShineOverlay}>
        <PlaceholderLine width={80} />
        <PlaceholderLine />
        <PlaceholderLine width={70}/>
        <PlaceholderLine />
        <PlaceholderLine width={30} />
      </Placeholder>
    </View>)
}


const Comment=({item,redComment,TokId,closeBlog,disModal})=>{
  const {themeState} = useContext(ThemeContext)
  if(TokId&&TokId.Token){
    const navigation=useNavigation()
    const {_id,userid,name,avatar,body,commentedBy}=item;
    const [u,setU]=useState(false)
    let userModal=false;
    useEffect(()=>{
    },[userModal])
    const deleteComment=()=>{

      axios.post(`https://pra-blog-app.herokuapp.com/comment/remove/${_id}`,{token:TokId.Token})
        .then(res=>{
          Alert.alert('Comment Deleted')
          redComment(item)
        })
    }
    return (
      <View style={{marginTop:6,padding:20}}>
      {TokId.Id===commentedBy?<MaterialIcons style={{position:'absolute',top:20,right:width/5}}name="delete" color="red" size={24} onPress={()=>deleteComment()}/>:null}
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>{if(commentedBy==TokId.Id){navigation.navigate('Profile')}else{
              disModal(commentedBy)
            }
          }}>
            <Avatar.Image source={{uri:avatar}} size={40}/>
          </TouchableOpacity>
          <Text style={{paddingLeft:7,fontSize:15,fontWeight:'bold',color:themeState.txt}}>{name}</Text>
        </View>
        <Text style={{paddingLeft:47,color:themeState.txt,fontSize:11}}>{body}</Text>

      </View>

    )
  }
  return null
}

const Post=({item,changeId,TokId,navigation,deleteFromPosts,imgurl,imgv,imgs})=>{
  const {themeState} = useContext(ThemeContext)
  if(TokId&&TokId.Token){
    const {owner,title,body,createdAt,id,name,avatar,isLiked,col,images}=item;
    const [like,setLike]=useState(isLiked);
    const [comments,setComments] = useState([])
    const [comment,setComment]=useState('')
    const [commentModal,setCommentModal]=useState(false)
    const [blog,setBlog]=useState(false)
    const [ploading,setPloading]=useState(false)
    const [indvPost,setIndvPost]=useState({})
    const [likes,setLikes]=useState(0)
    const [uid,setUid]=useState(null)
    const [userModal,setUserModal]=useState(false)
    const arr = images

    let url = []
    let bdy = [body]
    const a = body.match(urlRegex())
    url = a
    if(a){
        let c = body[0]
        let b = []
        for (i=0;i<a.length;i++){
            // console.log(c)
            let k = c.substring(0,c.indexOf(a[i]))
            b.push(k)
            b.push(a[i])
            c = c.substring(c.indexOf(a[i])+a[i].length)

        }
        b.push(c)
        bdy = b
    }    
    const deletePost=async()=>{

      return (
        Alert.alert("Delete Post","Are You Sure?",
          [{text:"Cancel",onPress:()=>{console.log("Cancel")},style:{color:'red'}},
            {text:"Ok",onPress:()=>{
              axios.post(`https://pra-blog-app.herokuapp.com/blogs/remove/${id}`,{token:TokId.Token})
              .then(()=>{
                setBlog(false)
                Alert.alert("Post Deleted")
                deleteFromPosts(id)

              })}}]
        )
      )
    }
    const redComment=(val)=>{
      setComments(comments.filter((item)=>{return item._id!=val._id}))
    }
    const indPost=(id)=>{
      setPloading(true)
      axios.get(`https://pra-blog-app.herokuapp.com/blogs/find/${id}`)
        .then((res)=>{
          setLikes(res.data.likes)
          setComments(res.data.comments)
          console.log(res.data)
          setPloading(false)
          setBlog(true)
        })
        .catch(err=>{
          console.log(err)
        })
    }

    const hitLike=(id,a=1)=>{
      if(!like){
        axios.post(`https://pra-blog-app.herokuapp.com/like/${id}`,{token:TokId.Token})
          .then(()=>{
            setLike(!like)
            setLikes(likes+1)
          })
          .catch((err)=>{
            console.log(err);
          })

      }
      else{
        axios.post(`https://pra-blog-app.herokuapp.com/like/remove/${id}`,{token:TokId.Token})
          .then(()=>{
            setLike(!like)
            setLikes(likes-1)
          })
          .catch((err)=>{
            console.log(err);
          })

      }
    }
    console.log('url: ' + body.match(urlRegex()))
  const sendComment=()=>{
    setPloading(true)
    if(comment.trim()!=''){
      axios.post(`https://pra-blog-app.herokuapp.com/comment/${id}`,{
        comment:comment,
        token:TokId.Token
      })
      .then(async(res)=>{
        await setComments([...comments,{_id:res.data._id,body:body,avatar:avatar,name:name}])
        Alert.alert('Comment Posted Successfully')
        indPost(id)
        setComment('')
        setPloading(false)
        setCommentModal(false)
      })
      .catch(err=>{
        Alert.alert('Sorry Something Wrong On Our Side')
      })
    }
  }
  const check = (item)=>{
    if (!url || url.length == 0){
        return false
    }
    for (i=0;i<url.length;i++){
        // console.log(item,url[i],item == url[i])
        if(item == url[i]){
            return true
        }
    }
    return false
  }
    return (
      <View style={{backgroundColor:themeState.pst,...styles.post}}>
        <TouchableOpacity onPress={()=>{if(owner==TokId.Id){navigation.navigate('Profile')}else{changeId(owner);}}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>

          <TouchableOpacity onPress={()=>{console.log('pressed');imgv(avatar)}}>
          <Avatar.Image source={{uri:avatar}}/></TouchableOpacity>
          <View style={{flexDirection:'column',paddingLeft:6}}>
            <Text style={{fontWeight:'bold',fontSize:18,color:themeState.txt}}>{name}</Text>
            <Caption style={{color:'#ccc'}}>{dayjs(createdAt).fromNow()}</Caption>
          </View>
          {TokId.Id===owner?<MaterialIcons color={themeState.txt} style={{position:'absolute',right:0}}name="delete" size={24} onPress={()=>deletePost()}/>:null}
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{indPost(id)}}>
          <View style={{borderBottomWidth:0.5,borderBottomColor:'#777',marginVertical:15}}/>
            <Text style={{fontSize:18,fontWeight:'bold',color:themeState.txt}}>{title}</Text>
            <Text style={{color:themeState.txt,fontSize:12,paddingTop:5}} selectable>
                {bdy.map((item,ind)=>{
                    if(item == ''){return null}
                    else if(check(item)){return <Text onPress = {()=>{Linking.openURL('https://'+item.replace('https://',''))}} key={ind} 
                        style={{color:'rgb(0,140,250)',fontWeight:'bold'}}>{item}</Text>}
                    else{  return <Text key = {ind} >{item}</Text>}
                })}
            </Text>

            <ImageView images = {arr} imgs = {(val)=>{imgs(arr,val)}} len = {arr.length} themeState = {themeState} wd = {1.15} />

          <View style={{borderBottomWidth:0.5,borderBottomColor:'#777',marginVertical:15}}/>
          <View style={{flexDirection:"row",justifyContent:'space-between'}}>
            <AntDesign name={like?'heart':'hearto'} size={20} color={like?'red':'#555'} onPress={()=>{hitLike(id)}}/>
            <EvilIcons name="comment" size={28} color='#555' onPress={()=>setCommentModal(true)}/>
          </View>
        </TouchableOpacity>
        <Modal visible={commentModal} animationType="slide">
          <View  style={{ flexDirection:'row',alignItems:'center', position: 'absolute', 
           top: 0,  left: 0,  right: 0,  backgroundColor: themeState.pri,height:60 }}  >
            <Ionicons color={themeState.sec} name="ios-arrow-back" size={24} style={{padding:16}} onPress={()=>{setCommentModal(false)}}/>
            <Text style={{fontWeight:'bold',fontSize:18,color:themeState.sec}}>Comment</Text>
            </View>
          <View style={{backgroundColor:themeState.dr,marginTop:60,paddingTop:20,width:width,height:height-60}}>  
          <View style={{flexDirection:'row',paddingLeft:5,
            }}>
            <Avatar.Image size={40} source={{uri:imgurl}}/>
            <TextInput multiline placeholder="Comments..." style={{paddingLeft:8,width:width/1.2,color:themeState.txt}}
             value={comment} onChangeText={(e) => setComment(e)}/>
          </View></View>
          <View style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor:'rgb(255,215,0)',
            bottom:20,right:20,width:50,height:50,borderRadius:25,elevation:10,alignSelf:'flex-end'}}>
            <Ionicons name="md-send" size={34} color="black" style={{paddingLeft:7}} onPress={()=>{if(comment.trim()!=''){setPloading(true);
              setTimeout(() => {
                sendComment()  
              }, 1000);
              }}}/>
          </View>
        </Modal>

        <Modal visible={blog} statusBarTranslucent={false} animationType="slide" >
          <View  style={{ flexDirection:'row',alignItems:'center', position: 'absolute',  top: 0,  left: 0,  right: 0,  
            elevation:11,
            backgroundColor: themeState.pri,height:60 }}  >
            <Ionicons color={themeState.sec} name="ios-arrow-back" size={24} style={{padding:16}} onPress={()=>{setBlog(false)}}/>
            <Text style={{fontWeight:'bold',fontSize:23,color:themeState.sec}}>Blog</Text>
            {TokId.Id===owner?<MaterialIcons style={{position:'absolute',right:10}}name="delete" 
              color={themeState.sec}
              size={24} onPress={()=>deletePost()}/>:null}
          </View>
          <ScrollView style ={{flex:1,marginTop:60,backgroundColor:themeState.dr}}>
            <View style={{flexDirection:'row',marginTop:20,paddingLeft:5,alignSelf:'flex-start'}}>
            <TouchableOpacity onPress={()=>{if(owner==TokId.Id){navigation.navigate('Profile')}else{changeId(owner);}}}>
            <View style={{flexDirection:'row'}}>
            <Avatar.Image size={60} source={{uri:avatar}}/>
              <View style={{flexDirection:'column',paddingLeft:13}}>
                <Text style={{ fontWeight: 'bold', fontSize: 26,color:themeState.txt }}>{name}</Text>
                <Caption style={{color:themeState.txt,opacity:0.8}}>{dayjs(createdAt).format('YYYY , D MMM ')}</Caption>
              </View>
              </View>
              </TouchableOpacity>
            </View>
            <View style={{padding:20}}>
              <Text style={{fontSize:22,color:themeState.txt,paddingVertical:8,fontWeight:'bold'}}>{title}</Text>
              <Text style={{color:themeState.txt,fontSize:13}} selectable>{body}</Text>

              <ImageView images = {arr} imgs = {(val)=>{imgs(arr,val)}} len = {arr.length} themeState = {themeState} wd = {1.11} />

              <View style={{flexDirection:'row',paddingTop:15}}>
                <Paragraph style={{fontWeight:"bold",color:themeState.txt}}>{likes}</Paragraph>
                  <Caption style={{color:themeState.txt,opacity:0.8}}> Likes</Caption>
                <Paragraph style={{fontWeight:"bold",paddingLeft:8,color:themeState.txt}}>{comments.length}</Paragraph>
                  <Caption style={{color:themeState.txt,opacity:0.8}}> Comments</Caption>
              </View>
            </View>
            <View style={{borderBottomWidth:0.5,borderBottomColor:themeState.bg,marginVertical:15}}/>
            <View style={{flexDirection:"row",padding:20,paddingVertical:0,justifyContent:'space-between'}}>
              <AntDesign name={like?'heart':'hearto'} size={20} color={like?'red':'#555'} onPress={()=>{hitLike(id,2)}}/>
              <EvilIcons name="comment" size={28} color="#555" onPress={()=>setCommentModal(true)}/>
            </View>
            <View style={{borderBottomWidth:0.5,borderBottomColor:themeState.bg,marginVertical:15}}/>
            {comments.map(item=><Comment key={Math.random().toString()}
              disModal={(val)=>{setUserModal(true); setUid(val)}} redComment={(val)=>{redComment(val)}}
              navigation={navigation}
              TokId={TokId} closeBlog={()=>{setBlog(false)}} item={item}/>)}
              
            
          </ScrollView>
        </Modal>
        <Spinner visible={ploading} animation="fade" overlayColor="rgba(0,0,0,0)" color="black" />
        <Modal visible={userModal}><ProfileScreenOthers  changeUser={()=>{setUserModal(false)}} id={uid}/></Modal>
      </View>

    )
  }
  return null
}


const HomeScreen = ({navigation}) => {
    const  [TokId,setTokId]=useState({})
    const {themeState,themeDispatch }= useContext(ThemeContext)
    const [imgv,setImgv] = useState(false)
    // console.log('themeState',themeState)
    // themeDispatch({type:'DARK'})
    dayjs.extend(relativeTime)
    dayjs.extend(calendar)
    const createdAt='2020-04-02T08:02:17-05:00'
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(true)
    const [postModal,setPostModal]=useState(false)
    const [ploading,setpLoading]=useState(false)
    const [title,setTitle]=useState('')
    const [body , setBody]=useState('')
    const [uid,setUid]=useState(null)
    const [userModal,setuserModal]=useState(false)
    const [render,setRender]=useState(false)
    const [avatar,setAvatar]=useState(null)
    const [inst,setInst] = useState(true)
    useFocusEffect(
      React.useCallback(()=>{
        
        getData()
        return () => {
            setLoading(true)
        }
      },[render])
    )
    const getData=async ()=>{
      const a = await AsyncStorage.getItem('home')
      // console.log(a)
      if(a=='true'){
        setInst(false)
        setTimeout(async()=>{
          setLoading(true)
          receiveData()
          .then((res)=>{
              // console.log('res',res)
              setTokId({Id:res.Id,Token:res.Token})
              // console.log("home",TokId)
              if(!TokId.Token){
                console.log('running Token')
                setPosts([])
                setRender(!render)
              }
              if(TokId&&TokId.Token){
                console.log('running url')
                axios.get('https://pra-blog-app.herokuapp.com/blogs',{
                  headers:{
                    authorization:`Bearer ${TokId.Token}`
                  }
                })
                .then((res)=>{
                  if(posts.length!=res.data.length){
                    setPosts(res.data)
                  }
                  setLoading(false)
                  axios.get(`https://pra-blog-app.herokuapp.com/users/me`,{
                    headers:{
                      authorization:`Bearer ${TokId.Token}`
                    }
                  })
                  .then((res)=>{
                    const avatar=res.data.user.avatar
                    setAvatar(avatar)
                    
                  })
                })
              }
          })
        },1000)
      }
      else{
        modSet()
      }
    }
    const [imgu,setImgu] = useState('')
    const [imgar,setImgar] = useState(false)
    const [imgs,setImgs] = useState([])
    const [cur,setCur] = useState(0)

    let i=0;
  let vr = ['WELCOME !!!','Try Everything After This Instructions','Swipe Left For Drawer Navigation','Enjoy Our Dark Mode','Images Are Viewable','Posts and Profiles are also Viewable','Explore And Enjoy'];
  const t = new Animated.Value(0)
  const tt = new Animated.Value(-width)
  const modSet=()=>{
    // console.log('modset running')
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
            duration:2000,
            toValue:-width
          })
        ]).start(async ()=>{t.setValue(0);setInst(false);await AsyncStorage.setItem('home','true');setRender(!render)})
        
        return
      }
      
      t.setValue(i*50)
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(t,{
          toValue:--i*50,
          duration:500
        })
      ]).start()
  }
    if(inst ){
      return (
        <Animated.View style={{flexDirection:'row',alignItems:'center',width:width/1.1,height:50,borderRadius:30,backgroundColor:'rgb(250,215,0)',
        elevation:20,justifyContent:'center',top:height/2-100,left:tt,position:'absolute'
        }}>
        <Animated.Image source = {require('../assets/smile.png')} style = {{width:80,height:80,left:5,top:-10}} />
        <View style={{overflow:'hidden',width:width/1.3,height:50}}>
         <Animated.View style ={{height:vr.length*50,justifyContent:'space-around',top:t}}> 
          {vr.map(item => {return (  
              <Text key={item} style ={{paddingLeft:5,fontWeight:'bold',fontSize:16}} >{item}</Text>
            )} )}
         </Animated.View>
        </View>
        <Ionicons name = 'ios-arrow-dropright-circle' style={{left:-30}} size = {30} onPress = {()=>{ modSet1() }} />
      </Animated.View>

      )

    }

    if(imgv&&imgu){
      return <ImageViewer uri={imgu} im = {()=>{themeDispatch({type:'HIT'});setImgu('');setImgv(false)}}/>
    }
    if(imgar & imgs.length != 0){
      console.log(imgs,cur,imgar)
      return <MultImgView images = {imgs} cur = {cur} im = {()=>{themeDispatch({type:'HIT'});setImgs([]);setImgar(false);setCur(0) }} />
    }
    if(TokId&&TokId.Token){


      const deleteFromPosts=(id)=>{
        setPosts(posts.filter((post)=>{return post.id!=id}))
      }
      if(postModal){
        
        return (
          <ImagePost themeState = {themeState} themeDispatch={themeDispatch} avatar = {avatar} render = {()=>setRender(!render)}
            token = {TokId.Token} postModal={()=>{setPostModal(false);themeDispatch({type:'HIT'})}} />
          
        )
      }
      return (
      <View style={styles.container}>
        <StatusBar barStyle={themeState.pri == '#000'?"light-content":'dark-content'} backgroundColor={themeState.pri} />

        <View style={{...styles.posts,flex:1,backgroundColor:themeState.bg}}>
          <FlatList  data={posts}   renderItem={({item})=><Post TokId={TokId} navigation={navigation} deleteFromPosts={deleteFromPosts}
            imgv = {(val)=>{setImgu(val);setImgv(imgv => true);themeDispatch({type:'HEIGHT'})}} 
            imgs = {(val,val1) => {setImgar(true);setImgs(val); setCur(val1);themeDispatch({type:'HEIGHT'})}}
            imgurl={avatar} changeId={(val)=>{setUid(val);setuserModal(true)}} item={item}/>}

            keyExtractor={item=>item.id.toString()+Math.random()}
            refreshing={loading}
            onRefresh={getData}
          />
        </View>
        {posts.length !=0 &&
          <View style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor:'rgb(255,215,0)',
            shadowColor:'white',shadowOffset:{width:4.0,height:4.0},
            bottom:20,right:20,width:60,height:60,borderRadius:30,elevation:10,alignSelf:'flex-end'}}>
            <MaterialCommunityIcons name="pencil-outline" size={34} color="black" onPress={()=>{setPostModal(true);}}/>
          </View>
        }
        {/* <Modal visible={postModal} animationType="fade" statusBarTranslucent={false} > */}
          
         {/* </Modal> */}
        {/* <Spinner visible={ploading} animation="fade" overlayColor="rgba(0,0,0,0)" color={themeState.sec} /> */}

        
        
        <Modal visible={userModal}><ProfileScreenOthers changeUser={()=>{setuserModal(false)}} id={uid}/></Modal>
        
        

      </View>
    );
    }
    return null;
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  posts:{
    width:width,
    // backgroundColor:'#444',
    height:height-hmx-12,
  },
  post:{
    // backgroundColor:'#fff',
    padding:15,
    margin:10,
    marginTop:6,
    marginBottom:6,
    marginBottom:0,
    borderRadius:20,
    elevation:5
  }
});
