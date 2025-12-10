import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Pokemon, TYPE_COLORS } from "../types";

interface PokemonCardProps {
  pokemon: Pokemon;
  powerLevel?: number;
  onPress: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  powerLevel = 0,
  onPress,
}) => {
  const primaryType = pokemon.types[0]?.type.name || "normal";
  const typeColors = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: typeColors[0] }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, "0")}</Text>
        {powerLevel > 0 && (
          <View style={styles.powerBadge}>
            <Text style={styles.powerText}>⚡{powerLevel}</Text>
          </View>
        )}
      </View>

      <Image
        source={{
          uri:
            pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default,
        }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.name}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </Text>

      <View style={styles.typesContainer}>
        {pokemon.types.map((type) => (
          <View
            key={type.slot}
            style={[
              styles.typeBadge,
              { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            ]}
          >
            <Text style={styles.typeText}>{type.type.name.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  id: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.7)",
  },
  powerBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  powerText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 100,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  typesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
});
