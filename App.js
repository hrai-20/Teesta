import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Button,
  Modal,
} from 'react-native';
import axios from 'axios';
import {useState, useEffect} from 'react';
import ImageCropPicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-date-picker';

axios.defaults.validateStatus = function () {
  return true;
};

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [FirstName, onChangeFirstName] = useState('');
  const [LastName, onChangeLastName] = useState('');
  const [CountryCode, onChangeCountryCode] = useState('+91');
  const [PhoneNumber, onChangePhoneNumber] = useState('');
  const [Email, onChangeEmail] = useState('');
  const [Passport, onChangePassport] = useState('');
  const [Address, onChangeAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  let strdate = JSON.stringify(date);
  strdate = strdate.substring(1, 11);

  const handleCancelPress = () => {
    onChangeFirstName('');
    onChangeLastName('');
    onChangePhoneNumber('');
    onChangeEmail('');
    onChangePassport('');
    onChangeAddress('');
  };
  const handleSubmitPress = () => {
    console.log('Submitted:', inputText);
  };

  const options = {
    //title: 'Select Image',
    mediaType: 'photo',
    
    allowsEditing: true,
    quality: 0.8,
    maxWidth: 800,
    maxHeight: 800,
  };
  
  const getText = async img => {
    try {
      const image = img;
      const data = new FormData();
      data.append('image', {
        uri: image.path,
        type: image.mime,
        name: image.filename || 'image.jpg',
      });
      const response = await axios.post(
        'http://192.168.79.2:5000/api/ocr',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const extractedText = response.data.text;
      console.log('Extracted Text:', extractedText);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Traveler's Details</Text>
      <View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            borderRadius: 10,
            marginHorizontal: 1,
            borderColor: 'grey',
            alignItems: 'center',
            marginBottom: 20,
            justifyContent: 'center',
            backgroundColor: 'white',
            elevation: 5,
          }}
          onPress={() => {
            ImageCropPicker.openCamera({
              width: 300,
              height: 400,
              cropping: false,
            }).then((image) => {
              console.log(image);
              setSelectedImage(image.path);
              getText(image);
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <View>
              <Image
                style={styles.tinyLogo}
                source={require('./image/qr.png')}
              />
            </View>
            <View>
              <Text style={{fontWeight: 'bold', padding: 5}}>
                Scan passport to autofill this form
              </Text>
              <Text style={{fontSize: 11, padding: 5}}>
                We'll automatically fetch details
              </Text>
            </View>
          </View>
          <Text style={styles.buttonText}>
            <Text style={styles.buttonTextcontent}></Text>
          </Text>
        </TouchableOpacity>
        <View>
          <View>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeFirstName}
              value={FirstName}
            />
          </View>
          <View>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeLastName}
              value={LastName}
            />
          </View>
          <Text style={styles.label}>Phone Number</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: 'grey',
              borderWidth: 0.5,
              borderRadius: 10,
              marginTop: 5,
              marginBottom: 20,
            }}>
            <View>
              <TextInput
                style={{
                  borderRightWidth: 0.5,
                  borderColor: 'grey',
                  flex: 1,
                  width: 70,
                  paddingHorizontal: 20,
                  marginTop: 5,
                  marginBottom: 5,
                }}
                onChangeText={onChangeCountryCode}
                value={CountryCode}
              />
            </View>
            <View>
              <TextInput
                style={{
                  width: 300,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  marginTop: 5,
                  marginBottom: 5,
                }}
                onChangeText={onChangePhoneNumber}
                value={PhoneNumber}
              />
            </View>
          </View>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              value={Email}
            />
          </View>
          <View>
            <Text style={styles.label}>Passport</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangePassport}
              value={Passport}
            />
          </View>
        </View>
        <View>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, {height: 100}]}
            onChangeText={onChangeAddress}
            value={Address}
          />
        </View>
        <Text style={styles.label}>DOB</Text>

        <View>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              setOpen(true);
            }}>
            <Text>{strdate}</Text>
          </TouchableOpacity>
        </View>

        <DatePicker
          modal
          mode={'date'}
          open={open}
          date={date}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelPress}>
            <Text style={{color: '#297df2', fontSize: 15, textAlign: 'center'}}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitPress}>
            <Text style={{color: 'white', fontSize: 15, textAlign: 'center'}}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    margin: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
  },
  tinyLogo: {
    margin: 10,
    width: 50,
    height: 50,
  },
  input: {
    borderColor: 'grey',
    borderWidth: 0.5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
    height: 55,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#297df2',
    justifyContent: 'center',
    borderColor: '#297df2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  submitButton: {
    flex: 1,
    borderWidth: 0.5,
    paddingVertical: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#297df2',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    margin: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
export default App;
