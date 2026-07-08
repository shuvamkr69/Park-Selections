/**
 * Centralized image sources.
 *
 * All imagery is served from Unsplash and referenced by photo id so that
 * swapping in real photography later only requires changing this file (or
 * dropping local assets into /public and updating the ids to paths).
 */

const UNSPLASH = "https://images.unsplash.com";

/** Build a sized Unsplash URL from a photo id. */
export function img(id: string, width = 1600, quality = 75) {
  return `${UNSPLASH}/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export const IMAGES = {
  // Hero / brand
  heroExterior: "photo-1566073771259-6a8506099945",
  heroLobby: "photo-1582719478250-c89cae4dc85b",
  heroPool: "photo-1551882547-ff40c63fe5fa",
  aboutStory: "photo-1445019980597-93fa8acb246c",
  aboutDetail: "photo-1618773928121-c32242e63f39",

  // Rooms
  deluxeTwin: "photo-1590490360182-c33d57733427",
  deluxeKing: "photo-1611892440504-42a792e24d32",
  premiumKing: "photo-1618773928121-c32242e63f39",
  juniorSuite: "photo-1631049307264-da0ec9d70304",
  suite: "photo-1582719508461-905c673771fd",
  roomDetailBath: "photo-1584132967334-10e028bd69f7",
  roomDetailDesk: "photo-1522708323590-d24dbb6b0267",

  // Events
  wedding: "photo-1519741497674-611481863552",
  engagement: "photo-1519225421980-715cb0215aed",
  reception: "photo-1511795409834-ef04bbd61622",
  corporate: "photo-1497366216548-37526070297c",
  eventHall: "photo-1464366400600-7168b8af9bc3",

  // Dining
  diningRestaurant: "photo-1517248135467-4c7edcad34c4",
  diningDish: "photo-1414235077428-338989a2e8c0",
  diningPlating: "photo-1600891964092-4316c288032e",

  // Amenities / gallery
  spa: "photo-1600334129128-685c5582fd35",
  gym: "photo-1571902943202-507ec2618e8f",
  bar: "photo-1470337458703-46ad1756a187",
  gardenCity: "photo-1520250497591-112f2f40a3f4",
  galleryA: "photo-1596394516093-501ba68a0ba6",
  galleryB: "photo-1578683010236-d716f9a3f461",
  galleryC: "photo-1540541338287-41700207dee6",
  galleryD: "photo-1631049035182-249067d7618e",
} as const;
