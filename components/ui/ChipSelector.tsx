import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";

interface Option {
  value: string | number;
  label: string;
  color?: string;
}

interface ChipSelectorProps {
  options: Option[];
  value: string | number | null | undefined;
  onChange: (val: string | number | null) => void;
  nullable?: boolean;
  scrollable?: boolean;
}

export function ChipSelector({
  options,
  value,
  onChange,
  nullable = false,
  scrollable = false,
}: ChipSelectorProps) {
  const chips = options.map((opt) => {
    const selected = value === opt.value;
    return (
      <Pressable
        key={String(opt.value)}
        onPress={() => onChange(nullable && selected ? null : opt.value)}
        style={({ pressed }) => ({
          flexDirection:    "row",
          alignItems:       "center",
          gap:              6,
          paddingVertical:  10,
          paddingHorizontal: 16,
          borderRadius:     10,
          borderWidth:      1.5,
          borderColor:      selected ? "#6366F1" : "#D1D5DB",
          backgroundColor:  selected ? "#6366F1" : "#FFFFFF",
          opacity:          pressed ? 0.8 : 1,
        })}
      >
        {opt.color && (
          <View
            style={{
              width: 10, height: 10, borderRadius: 5,
              backgroundColor: opt.color,
            }}
          />
        )}
        <Text
          style={{
            fontSize:   14,
            fontWeight: "500",
            color:      selected ? "#FFFFFF" : "#374151",
          }}
        >
          {opt.label}
        </Text>
      </Pressable>
    );
  });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
      >
        {chips}
      </ScrollView>
    );
  }

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {chips}
    </View>
  );
}
