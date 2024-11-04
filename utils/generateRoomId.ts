export const generateRoomId = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const generateSegment = () => {
    return Array.from(
      { length: 3 },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
  };

  return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
};

