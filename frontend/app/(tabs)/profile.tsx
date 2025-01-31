import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feed from '@/components/Feed';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import EvilIcons from '@expo/vector-icons/EvilIcons';

const backgroundImage = {uri: "https://media.gettyimages.com/id/1645930993/vector/blurred-fluid-dark-gradient-colourful-background.jpg?s=612x612&w=0&k=20&c=cEPW-qd3k8OID7CV-Z7KEp2P2z3w4Zs9QqorK32LO_8="};

const feedItems = [
  {
    user: "You",
    eventName: "Alicia Keys World Tour",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    action: "saved",
    id: "10"
  }, 
  {
    user: "You",
    eventName: "Kaytranada World Tour",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    action: "attended",
    id: "11"
  }, 
  { 
    user: "You",
    eventName: "Usher",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    action: "saved",
    id: "12"
  },
  { 
    user: "You",
    eventName: "Taylor Swift World Tour",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    action: "saved",
    id: "13"
  },
  { 
    user: "You",
    eventName: "Avril Lavigne World Tour",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    action: "saved",
    id: "14"
  },
  { 
    user: "You",
    eventName: "Justin Bieber World Tour",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    action: "saved",
    id: "15"
  },
  { 
    user: "You",
    eventName: "Bruno Mars World Tour",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    action: "saved",
    id: "16"
  }
];

function ProfileImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const uploadImage = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      alert("Please grant camera roll permissions inside your system's settings");
    }
    else {
      let profileImage = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });
      if (!profileImage.canceled) {
        setImage(profileImage.assets[0].uri);
      }
    }
  };

  return  (
    <View style={styles.profileImageUpload}>
      {
        image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      }
      <TouchableOpacity onPress={uploadImage} style={styles.profileImageUploadBtn}>
        <EvilIcons name="pencil" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export default function Profile() {
  
  
  /*const uploadProfileImage = async (mode: "gallery" | "camera") => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
        })
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
        })
      }
    } catch {

    }
  }*/
  
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
          <ProfileImageUpload />
          <View style={styles.userInfo}>
            <Text style={styles.name}>Angelica Jolie</Text>
            <Text style={styles.username}>@angelicabelica</Text>
          </View>

          <View style={styles.metricsContainer}>
            <Text style={styles.metricsText}>82 concerts attended</Text>
            <Text style={styles.divider}>|</Text>
            <Text style={styles.metricsText}>3 concerts saved</Text>
            
          </View>
          <Feed feedItems={feedItems}/>
          {
              /*
                display concerts attended and saved here
                data to display:
                  - date
                  - attended vs saved
                  - name of the concert
                  - pictures
                  - some type of reaction about the event
              */
            }
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    alignItems: "center",
    marginTop: 10,
    gap: 4
  },
  name: {
    color: "white",
    fontSize: 20
  },
  username: {
    color: "white"
  },
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
  },
  backgroundImage: {
    flex: 1, 
    paddingTop: 20
  },
  postText: {
    color: "white"
  },
  post: {
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 1,
    height: 80,
    width: "100%",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    gap: 10
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 20
  },
  metricsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  divider: {
    color: "white",
    fontSize: 18
  },
  profileImageUpload: {
    height: 150,
    width: 150,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
    alignSelf: "center"
  },
  profileImageUploadBtn: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    right: 25,
  },
})
