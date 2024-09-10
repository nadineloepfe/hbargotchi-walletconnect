export const updatePlayScoreAndHappiness = (currentMetadata: any) => {
  const updatedMetadata = { ...currentMetadata }; 

  // Increase Playscore by 1
  updatedMetadata.properties.playscore += 1;

  const playscore = updatedMetadata.properties.playscore;

  if (playscore > 7) {
    updatedMetadata.properties.happiness = "Blissful";
  } else if (playscore >= 5) {
    updatedMetadata.properties.happiness = "Happy";
  } else if (playscore >= 3) {
    updatedMetadata.properties.happiness = "Content";
  } else if (playscore == 0) {
    updatedMetadata.properties.happiness = "Neutral";
  } else if (playscore < 1) {
    updatedMetadata.properties.happiness = "Sad";
  }

  return updatedMetadata;
};
