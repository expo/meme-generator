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
