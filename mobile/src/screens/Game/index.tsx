import {SafeAreaView} from 'react-native-safe-area-context'
import { Background } from '../../components/Background';
import {useRoute, useNavigation} from '@react-navigation/native' // resgatar as informacoes
import {View, TouchableOpacity, Image, FlatList, Text} from 'react-native'
import {Entypo} from '@expo/vector-icons'
import { THEME } from '../../theme';
import logoImg from "../../assets/logo-nlw-esports.png"
import { styles } from './styles';
import { GameParams } from '../../@types/navigation';
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import React, { useEffect, useState } from 'react';
import {DuoMatch} from "../../components/DuoMatch"



export function Game() {
  const route = useRoute()
  const game= route.params as GameParams
  const navigation = useNavigation()
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const [discordDuoSelected,setDiscordDuoSelected] = useState('')


  function handleGoBack(){
    navigation.goBack()
  }
  
  async function getDiscordUser(adsID: string){
    fetch(`http://192.168.0.17:3333/ads/${adsID}/discord`)
      .then(response => response.json())
      .then(data => setDiscordDuoSelected(data.discord))
  }

  useEffect( () => {
    fetch(`http://192.168.0.17:3333/games/${game.id}/ads`)
    .then(response => response.json())
    .then(data => setDuos(data))
  }, [])

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo name="chevron-thin-left" color={THEME.COLORS.CAPTION_300} size={20}/>
          </TouchableOpacity>
        </View>

        <Image source={logoImg} style={styles.logo}/>
        <View style={styles.right} />
        <Image source={{uri: game.bannerUrl}} style={styles.cover} resizeMode="cover" />
        <Heading title={game.title} subtitle="Conecte-se e comece a jogar"  />
        <FlatList
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <DuoCard data={item} onConnect={() => getDiscordUser(item.id) }/>
          )}
          horizontal
          style={styles.containerList}
          contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent ]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyList}>
              Não há anúncios para esse jogo
            </Text>
          )}
        />
        <DuoMatch visible={discordDuoSelected.length > 0} discord={discordDuoSelected} onClose={() => setDiscordDuoSelected('')} />
      </SafeAreaView>
    </Background>

  );
}