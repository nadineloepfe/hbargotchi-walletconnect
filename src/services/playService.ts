export function updatePlayScore(metadata: any) {
    const newMetadata = { ...metadata };
  
    // Update Playscore
    newMetadata.properties.playscore = (newMetadata.properties.playscore || 0) + 1;
  
    // Update Happiness based on Playscore
    if (newMetadata.properties.playscore > 7) {
      newMetadata.properties.happiness = "blissful";
    } else if (newMetadata.properties.playscore >= 5) {
      newMetadata.properties.happiness = "happy";
    } else if (newMetadata.properties.playscore >= 3) {
      newMetadata.properties.happiness = "content";
    } else if (newMetadata.properties.playscore < 1) {
      newMetadata.properties.happiness = "sad";
    }
  
    return newMetadata;
  }
  