# Meme Generator

## Two Text Inputs

1. Let's start coding - change your `App.js` to a blank screen:

```
import * as React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';

const { width: screenWidth } = Dimensions.get("window");

export default function App() {
  return (
    <View style={styles.container}>
    </View>
  );
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
```

2. Let's add some TextInput with state:

```
export default function App() {
  const [topText, setTopText] = React.useState("");
  const [bottomText, setBottomText] = React.useState("");
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
    </View>
  );
}
```

## Template Memes

1. Hardcode a doge meme below our text inputs:

```
// ...
//   <TextInput
//     style={styles.textInput}
//     onChangeText={(text) => setBottomText(text)}
//     value={bottomText}
//   />
    <View>
      <Image
        source={{uri: 'https://i.imgflip.com/2/4t0m5.jpg'}}
        style={{height: screenWidth, width: screenWidth}}
      />
      <Text style={[styles.memeText, {top: 5}]}> {topText} </Text>
      <Text style={[styles.memeText, {bottom: 5}]}> {bottomText} </Text>
    </View>
```

2. Bring in a bunch of template images:

```
// ...
// const { width: screenWidth } = Dimensions.get('window');

const memeTemplateImageUris = [
  'https://i.imgflip.com/2/4t0m5.jpg',
  'https://imgflip.com/s/meme/Creepy-Condescending-Wonka.jpg',
  'https://i.imgflip.com/3jysf6.png',
  'https://i.imgflip.com/3j1z70.jpg',
  'https://imgflip.com/s/meme/Arthur-Fist.jpg',
];
```

3. Store the imgUri as a React State Variable and change the Doge Meme to use the imgUri:

```
// ...
// export default function App() {
//   const [topText, setTopText] = React.useState('');
//   const [bottomText, setBottomText] = React.useState('');

  const placeholderMeme = memeTemplateImageUris[0];
  const [imgUri, setImgUri] = React.useState(placeholderMeme);

// ...
  <Image
    source={{ uri: imgUri }}
    style={{ height: screenWidth, width: screenWidth }}
  />

```

4. Let's display the template images below the meme:

```
// ...
//    <Text style={[styles.memeText, { bottom: 5 }]}>
//      {bottomText}
//    </Text>
//  </View>

    <View style={{ flexDirection: 'row' }}>
      {memeTemplateImageUris.map((uri) => {
        return (
          <TouchableOpacity
            key={uri}
            onPress={() => {
              setImgUri(uri);
            }}>
            <Image source={{ uri }} style={styles.templateImage} />
          </TouchableOpacity>
        );
      })}
    </View>
```

## Image Picker

1. Make a new file in the `components` folder called `ChoosePhotoButton.js`

```
import * as React from "react";
import { Button } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function TakePhotoButton({ setImgUri }) {
  return (
    <Button title="Take a Photo" onPress={() => takePhotoAsync(setImgUri)} />
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

```

2. Add your dependencies in `package.json`:

```
    "expo-image-picker": "~10.2.2",
    "expo-permissions": "~12.1.1"
```

3. In `App.js`, add the `TakePhotoButton`

```
//  App.js
import TakePhotoButton from "./components/TakePhotoButton";

//  ...
//      <Text style={[styles.memeText, {top: 5}]}> {topText} </Text>
//       <Text style={[styles.memeText, {bottom: 5}]}> {bottomText} </Text>
//     </View>

      <TakePhotoButton setImgUri={setImgUri} />
```
