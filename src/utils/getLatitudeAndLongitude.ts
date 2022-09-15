export async function getLatitudeAndLongidute(location: string) {
  const [latitude, longitude] = location.split(",");
  return {
    latitude: latitude,
    longitude: longitude,
  };
}
