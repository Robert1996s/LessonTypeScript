import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, ReactChild } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { round } from 'react-native-reanimated';


const CatalogHeader = () => {
  return(
    <View style={{flexDirection: 'row'}}>
    <GetDataApi/>
    </View>
  )
}
const ItemPage = () => {
  const route = useRoute()
  const {item} = route.params
  return(
    <View style={styles.container}>
        <Text>{item.title}</Text>
        <Text>Price: {item.price}</Text>
        <Image style={{width: 70, height: 70}}source={{uri:item.image}}></Image>
    </View>
  )
}


interface Item {
  title: string,
  image: string, 
  price: number, 
  id: number, 
  description: string}

const CatalogScreen  = () => {
  const Stack = createStackNavigator();
  return(
    
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
          name="Catalog" 
          component={CatalogHeader}/>

          <Stack.Screen 
          name="ItemPage" 
          component={ItemPage}
          />
        </Stack.Navigator>
      </NavigationContainer>
    
  );
}


const GetDataApi = () => {
  const [data, setData] = useState <Item[]>([]);
  const navigation = useNavigation();

  const fetchData = () => {
    fetch('https://fakestoreapi.com/products')
            .then((response)=>response.json())
            .then((json) => {
              //console.log(json);
              let dataResults: Item[] = [];
              json.forEach((item: Item) => {
                let result = {id: item.id, title: item.title, description: item.description, image: item.image, price: item.price};
                dataResults.push(result);
              });
              setData(dataResults);
              console.log("!!!", dataResults);
          });
          
  }
  useEffect(() => {
    fetchData();
  }, []);

  return(
      <View style={{flexDirection: 'column', justifyContent:'space-between'}}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("ItemPage", {item})}>
              <Image style={{width: 70, height: 70, padding: 3}}source={{uri:item.image}}></Image>
              <View style={{flexDirection: 'column'}}>
              <Text style={styles.item}>{item.title}</Text>
              <Text style={styles.item}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
  );
}

export default function App() {
  return(
    
      <CatalogScreen/>
      
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'column',
    alignContent: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 3,
  },
});
