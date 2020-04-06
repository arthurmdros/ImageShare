import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

export default function App() {  
  let [selectedImage, setSelectedImage] = React.useState(null);
  
  let openImagePickerAsync = async () =>{
    let permissionResul = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResul.granted === false){
      alert("Permissão para acessar os arquivos de mídia é obrigatória.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    
    if (pickerResult.cancelled === true){
      return;
    }

    if (Platform.OS === 'web'){
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else{
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  };

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())){
      alert(`A imagem está diponível em: ${selectedImage.remoteUri}`);
      return;
    }

    Sharing.shareAsync(selectedImage.localUri || selectedImage.localUri);
  };

  if (selectedImage !== null){
    return (
      <View style={styles.container}>
        <Image source={{uri: selectedImage.localUri}}
        style={styles.thumbnail}
        />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Compartilhar</Text>
        </TouchableOpacity>        
      </View>
    );
  }

  
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://i.imgur.com/TkIrScD.png' }} style={styles.logo} />
      <Text style={styles.instructions}>
        Para compartilhar uma imagem do seu dispositivo com um amigo, pressione o botão!        
      </Text>

      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Carregar foto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 20,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  }, 
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});