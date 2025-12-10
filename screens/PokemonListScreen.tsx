// screens/PokemonListScreen.tsx
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { LoadingSpinner } from "../components/LoadingSpinner";
import { PokemonCard } from "../components/PokemonCard";
import { useGlobalSteps } from "../services/pedometer";
import { fetchPokemonDetails, fetchPokemonList } from "../services/pokeApi"; // ← используем правильную функцию!
import { getAllPokemonPowers } from "../services/storage";
import { Pokemon, RootStackParamList } from "../types";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PokemonList"
>;

interface Props {
  navigation: NavigationProp;
}

export const PokemonListScreen: React.FC<Props> = ({ navigation }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { steps, powerLevel: globalPowerLevel } = useGlobalSteps();
  const [pokemonPowers, setPokemonPowers] = useState<Record<number, number>>(
    {}
  );

  // Правильная загрузка — используем URL из списка!
  const loadPokemons = useCallback(async () => {
    try {
      const list = await fetchPokemonList(151);
      const first20 = list.slice(0, 20);

      // Используем готовую функцию, которая сама добавляет слеш!
      const details = await Promise.all(
        first20.map((item) => fetchPokemonDetails(item.url))
      );

      setPokemons(details);
    } catch (error) {
      console.error("Ошибка загрузки покемонов:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadPokemonPowers = useCallback(async () => {
    const saved = await getAllPokemonPowers();
    const map: Record<number, number> = {};
    Object.values(saved).forEach((item) => {
      map[item.pokemonId] = item.powerLevel;
    });
    setPokemonPowers(map);
  }, []);

  useEffect(() => {
    loadPokemons();
    loadPokemonPowers();
  }, [loadPokemons, loadPokemonPowers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPokemons();
    loadPokemonPowers();
  }, [loadPokemons, loadPokemonPowers]);

  const handlePress = useCallback(
    (pokemon: Pokemon) => {
      navigation.navigate("PokemonDetail", { pokemon });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Pokemon }) => (
      <PokemonCard
        pokemon={item}
        powerLevel={pokemonPowers[item.id] ?? globalPowerLevel}
        onPress={() => handlePress(item)}
      />
    ),
    [pokemonPowers, globalPowerLevel, handlePress]
  );

  if (loading) return <LoadingSpinner message="Загружаем покемонов..." />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex Step Power</Text>
        <View style={styles.stepCounter}>
          <Text style={styles.stepEmoji}>Walking</Text>
          <Text style={styles.stepText}>{steps.toLocaleString()} steps</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL {globalPowerLevel}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={pokemons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },

  header: {
    backgroundColor: "#EF5350",
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  stepCounter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  stepEmoji: { fontSize: 22, marginRight: 10 },

  stepText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    marginRight: 12,
  },

  levelBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  levelText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  listContent: { padding: 12 },
  row: { justifyContent: "space-between", marginBottom: 12 },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 18, color: "#888" },
});
