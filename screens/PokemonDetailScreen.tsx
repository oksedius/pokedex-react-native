// screens/PokemonDetailScreen.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { PowerUpAnimation } from "../components/PowerUpAnimation";
import { STEPS_PER_LEVEL, useGlobalSteps } from "../services/pedometer";
import { getPokemonPower, savePokemonPower } from "../services/storage";
import { RootStackParamList, TYPE_COLORS } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "PokemonDetail">;

const { width } = Dimensions.get("window");

export const PokemonDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { pokemon } = route.params;

  // Глобальные шаги из expo-sensors
  const { steps, powerLevel: globalPowerLevel, stepsToNext } = useGlobalSteps();

  // Локальное состояние для этого покемона
  const [localPowerLevel, setLocalPowerLevel] = useState(0);
  const [previousLevel, setPreviousLevel] = useState(0);
  const [showPowerUp, setShowPowerUp] = useState(false);

  const primaryType = pokemon.types[0]?.type.name || "normal";
  const typeColors = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

  // Загружаем сохранённый уровень покемона из AsyncStorage
  useEffect(() => {
    const loadSavedPower = async () => {
      const saved = await getPokemonPower(pokemon.id);
      if (saved?.powerLevel != null) {
        setLocalPowerLevel(saved.powerLevel);
        setPreviousLevel(saved.powerLevel);
      } else {
        // Если не было сохранено — берём текущий глобальный уровень
        setLocalPowerLevel(globalPowerLevel);
        setPreviousLevel(globalPowerLevel);
      }
    };

    loadSavedPower();
  }, [pokemon.id, globalPowerLevel]);

  // Отслеживаем рост глобального уровня → прокачиваем покемона
  useEffect(() => {
    if (globalPowerLevel > previousLevel) {
      setShowPowerUp(true);
      setLocalPowerLevel(globalPowerLevel);
      setPreviousLevel(globalPowerLevel);

      // Сохраняем прогресс для этого покемона
      savePokemonPower(pokemon.id, globalPowerLevel, steps);
    }
  }, [globalPowerLevel, previousLevel, pokemon.id]);

  return (
    <View style={styles.container}>
      <PowerUpAnimation
        visible={showPowerUp}
        powerLevel={localPowerLevel}
        onComplete={() => setShowPowerUp(false)}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: typeColors[0] }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.id}>
            #{pokemon.id.toString().padStart(3, "0")}
          </Text>
          <Text style={styles.name}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>

          <Image
            source={{
              uri: pokemon.sprites.other["official-artwork"].front_default,
            }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {/* Power Level Section */}
        <View style={styles.powerSection}>
          <Text style={styles.sectionTitle}>Power Level</Text>
          <View style={styles.powerCard}>
            <Text style={styles.powerNumber}>{localPowerLevel}</Text>
            <Text style={styles.powerLabel}>Current Level</Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((steps % STEPS_PER_LEVEL) / STEPS_PER_LEVEL) *
                      100}%`,
                    backgroundColor: typeColors[0],
                  },
                ]}
              />
            </View>

            <Text style={styles.stepsInfo}>
              {stepsToNext} steps to level {localPowerLevel + 1}
            </Text>
          </View>
        </View>

        {/* Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Types</Text>
          <View style={styles.typesRow}>
            {pokemon.types.map((t) => (
              <View
                key={t.slot}
                style={[
                  styles.typeChip,
                  { backgroundColor: TYPE_COLORS[t.type.name]?.[0] || "#999" },
                ]}
              >
                <Text style={styles.typeChipText}>
                  {t.type.name.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Base Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Base Stats</Text>
          {pokemon.stats.map((stat) => {
            const percentage = (stat.base_stat / 255) * 100;
            return (
              <View key={stat.stat.name} style={styles.statRow}>
                <Text style={styles.statName}>
                  {stat.stat.name.replace("-", " ").toUpperCase()}
                </Text>
                <Text style={styles.statValue}>{stat.base_stat}</Text>
                <View style={styles.statBar}>
                  <View
                    style={[
                      styles.statBarFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: typeColors[0],
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Physical Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Info</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>
                {(pokemon.height / 10).toFixed(1)} m
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>
                {(pokemon.weight / 10).toFixed(1)} kg
              </Text>
            </View>
          </View>
        </View>

        {/* Abilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abilities</Text>
          {pokemon.abilities.map((a) => (
            <View key={a.slot} style={styles.abilityChip}>
              <Text style={styles.abilityText}>
                {a.ability.name.replace("-", " ").toUpperCase()}
                {a.is_hidden && " (Hidden)"}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  id: { fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  name: { fontSize: 36, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  mainImage: { width: width * 0.7, height: width * 0.7 },

  powerSection: { padding: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  powerCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  powerNumber: { fontSize: 72, fontWeight: "900", color: "#EF5350" },
  powerLabel: { fontSize: 16, color: "#777", marginBottom: 16 },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 12,
  },
  progressFill: { height: "100%", borderRadius: 5 },
  stepsInfo: { fontSize: 15, color: "#555" },

  section: { paddingHorizontal: 20, marginBottom: 10 },
  typesRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25 },
  typeChipText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  statRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  statName: {
    width: 110,
    fontSize: 13,
    color: "#666",
    textTransform: "uppercase",
  },
  statValue: {
    width: 50,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  statBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginLeft: 12,
    overflow: "hidden",
  },
  statBarFill: { height: "100%" },

  infoRow: { flexDirection: "row", justifyContent: "space-around" },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  infoLabel: { fontSize: 14, color: "#888" },
  infoValue: { fontSize: 22, fontWeight: "bold", marginTop: 4 },

  abilityChip: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  abilityText: { fontSize: 15, fontWeight: "600", color: "#333" },
});
