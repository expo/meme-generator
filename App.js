import * as React from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
  Share,
} from "react-native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";

// Converts a React View to a png
import { captureRef } from "react-native-view-shot";

const { width: screenWidth } = Dimensions.get("window");

const memeTemplateImageUris = [
  "https://i.imgflip.com/2/4t0m5.jpg",
  "https://imgflip.com/s/meme/Creepy-Condescending-Wonka.jpg",
  "https://i.imgflip.com/3jysf6.png",
  "https://i.imgflip.com/3j1z70.jpg",
  "https://imgflip.com/s/meme/Arthur-Fist.jpg",
];

export default function App() {
  const [topText, setTopText] = React.useState("");
  const [bottomText, setBottomText] = React.useState("");

  const placeholderMeme = memeTemplateImageUris[0];
  const [imgUri, setImgUri] = React.useState(placeholderMeme);
  const memeView = React.useRef();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setTopText(text)}
        value={topText}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setBottomText(text)}
        value={bottomText}
      />
      <View collapsable={false} ref={memeView}>
        <Image
          source={{ uri: imgUri }}
          style={{ height: screenWidth, width: screenWidth }}
        />
        <Text style={[styles.memeText, { top: 5 }]}>{topText}</Text>
        <Text style={[styles.memeText, { bottom: 5 }]}>{bottomText}</Text>
      </View>
      <Button title="Take a Photo" onPress={() => takePhotoAsync(setImgUri)} />
      <Button
        title="Choose a Photo"
        onPress={() => choosePhotoAsync(setImgUri)}
      />
      <View style={{ flexDirection: "row" }}>
        {memeTemplateImageUris.map((uri) => {
          return (
            <TouchableOpacity
              key={uri}
              onPress={() => {
                setImgUri(uri);
              }}
            >
              <Image source={{ uri }} style={styles.templateImage} />
            </TouchableOpacity>
          );
        })}
      </View>
      <Button title="Share Meme" onPress={() => shareAsync(memeView)} />
    </View>
  );
}

async function takePhotoAsync(setImgUri) {
  // Asking for Permissions is slow. In production, store these values in React State
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  const isSuccessful = status === "granted";
  if (!isSuccessful) {
    alert("Camera permissions not granted");
    return;
  }

  const image = await ImagePicker.launchCameraAsync();
  if (!image.cancelled) {
    // { cancelled: false, type: 'image', uri, width, height, exif, base64 }
    setImgUri(image.uri);
  }
}

async function choosePhotoAsync(setImgUri) {
  // Asking for Permissions is slow. In production, store these values in React State
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  const isSuccessful = status === "granted";
  if (!isSuccessful) {
    alert("Media Library permissions not granted");
    return;
  }

  const image = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [1, 1],
  });
  if (!image.cancelled) {
    setImgUri(image.uri);
  }
}

async function shareAsync(memeView) {
  if (!memeView.current) {
    console.log("The memeView is not rendered yet, cannot share");
    return;
  }
  const imgUri = await captureRef(memeView, {
    format: "png",
    quality: 0.5,
    result: "data-uri",
  });

  const cloudUri = await uploadImageAsync(imgUri);
  console.log("meme uploaded to", cloudUri);
  Share.share({ url: cloudUri });
}

async function uploadImageAsync(uri) {
  const formData = new FormData();
  formData.append("image", {
    uri: uri,
    name: "upload.png",
    type: "image/png",
  });

  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    body: formData,
    headers: {
      // replace with your own API key
      Authorization: "Client-ID 658d72e5b4a0c6b",
    },
  });
  let responseJson = await response.json();
  console.log(responseJson);
  let url = responseJson.data.link;

  return url;
}

const styles = StyleSheet.create({
  memeText: {
    color: "white",
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center",
    position: "absolute",
    left: 5,
    right: 5,
    backgroundColor: "transparent",
    textShadowColor: "black",
    textShadowRadius: 5,
    textShadowOffset: { height: 2, width: 2 },
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    width: screenWidth,
  },
  templateImage: {
    height: 60,
    width: 60,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
  },
});
