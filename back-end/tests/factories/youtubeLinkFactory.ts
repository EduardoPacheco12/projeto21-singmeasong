export async function createYoutubeLink() {
  const youtubeData = [
    "https://www.youtube.com/watch?v=jd00enZSNFc&list=RDbLk4TiYZ_0U&index=9&ab_channel=LouGarcia",
    "https://www.youtube.com/watch?v=s0JJxPyhOH0&list=RDbLk4TiYZ_0U&index=5&ab_channel=Joji-Topic",
    "https://www.youtube.com/watch?v=JdKDGAZaO9Y&list=RDbLk4TiYZ_0U&index=3&ab_channel=JaoVEVO",
    "https://www.youtube.com/watch?v=bpOSxM0rNPM&ab_channel=OfficialArcticMonkeys",
    "https://www.youtube.com/watch?v=HyHNuVaZJ-k&ab_channel=Gorillaz",
    "https://www.youtube.com/watch?v=kXYiU_JCYtU&ab_channel=LinkinPark",
  ];

  const random = Math.floor(Math.random() * youtubeData.length);

  return youtubeData[random];
}
