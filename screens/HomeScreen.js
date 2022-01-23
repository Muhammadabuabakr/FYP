import React from 'react';
import {ImageBackground , StyleSheet,SafeAreaView, Button
    } from 'react-native';


const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
        style={styles.background}
        source={require("../assets/backimages.jpg")}
        resizeMode='contain'
        backgroundColor = '#FFFCD8'
        blurRadius={0}
    >  
    
    <SafeAreaView style= {styles.CameraButton}>
    
    <Button 
        color = "#000000"
        title ="Open Camera"
        onPress={() => navigation.navigate("CameraScreen")}
        />
    </SafeAreaView>
    </ImageBackground>
);
};

const styles = StyleSheet.create({
  background:{
      
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      borderWidth: 7,
      borderColor: '#FFFCD8'
      
  },
  CameraButton:{
      marginTop: 400,
      width: '50%',
      height:50,
      backgroundColor:"#9B533F",
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      borderWidth: 5,
      borderColor: '#FFFCD8'
      
  },
  logo:{
      width: 200,
      height:120,
      position: 'relative',
      top: -15,
      resizeMode:'stretch',
      borderRadius: 5,
      borderWidth: 0,
    
      alignItems: 'center',
      justifyContent: 'center',
  },
  text: {
      fontSize: 42,
    },
  
})

export default HomeScreen;