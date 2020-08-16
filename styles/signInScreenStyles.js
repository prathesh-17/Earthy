import {Dimensions,StyleSheet} from 'react-native'
const {width,height} = Dimensions.get("screen");

const textStyle={
  textShadowColor:'rgba(0,0,0,0.72)',
  textShadowOffset:{width:-1,height:1},
  textShadowRadius:5
}

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(0,140,250)',
      
    },
    header: {
        height:height/4,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },

    footer: {
        height:height*0.42,
        backgroundColor: '#222',
        elevation:20,
        shadowOffset:{width:0,height:10},
        borderRadius:40,
        paddingHorizontal: 25,
        paddingVertical: 30,
        width:width/1.03,
        alignSelf:'center',
    },
    text_header: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#666',
        padding: 10,
        height:45,
        marginVertical:10,
        justifyContent:'center'
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 15,
        fontSize:15,
        bottom:-5,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    modal:{
      backgroundColor:'#eee',
      position:'absolute',
      bottom:0,
      borderTopLeftRadius:30,
      borderTopRightRadius:30,
      width:width,
      elevation:20,
      height:height/3,
      elevation:10
    },
    icon:{
      elevation:5,
      shadowOffset:{width:0,height:4}
    },
    close:{
      backgroundColor:'white',
      color:'black',
      borderRadius:50,
      width:32,
      margin:12,
      padding:6,
      elevation:20,
      alignSelf:'flex-end',
      textAlign:'center'
    },
    submit:{
      alignSelf:'center',
      justifyContent:'center',
      alignItems:'center',
      width:width/2,
      height:50,
      marginTop:50,
      elevation:20,
      backgroundColor:'rgb(220,20,60)',
      borderRadius:50,
    },
    icons:{
      marginTop:10,
      flex:1,
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center'
    },
    social:{
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center',
      height:60,
      width:width/2.5,
      backgroundColor:'#eee',
      elevation:5,
      borderRadius:30
    },
    signup:{
      height:55,
      borderRadius:50,
      width:width/3,
      textAlign:'center',
      alignItems:'center',
      flexDirection:'row',
      marginTop:0,
      justifyContent:'space-around',
      alignSelf:'flex-end',
      backgroundColor:'white',
      elevation:5
    }

  },

);
