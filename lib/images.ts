/**
 * Centralized image sources.
 *
 * Imagery now comes from the hotel's own publicly available assets, referenced
 * by a source-prefixed id so swapping any photo only requires changing this
 * file:
 *
 *   "wix:<mediaId>"    - originals from www.parkselections.com (Wix media CDN)
 *   "staah:<file>"     - officials from booking.parkselections.com (STAAH
 *                        image library; `img()` picks the `medium_` rendition
 *                        for small widths and the full-resolution master for
 *                        large ones)
 *   "photo-<id>"       - Unsplash placeholder (no original exists yet - see
 *                        the MANUAL REPLACEMENT list below)
 *
 * ── ⚠ MANUAL REPLACEMENT REQUIRED ──────────────────────────────────────────
 * The original website exposes no publicly accessible photography for the
 * assets below, so they intentionally remain placeholders until the hotel
 * supplies real photos (do NOT ship these as final):
 *   • heroPool                                  (no pool photography)
 *   • diningRestaurant / diningDish / diningPlating
 *     (Namaskaram is "opening soon" - no restaurant photography published)
 *   • engagement / reception / corporate        (venue pages reuse generic
 *     Wix stock; only the wedding hall photo is original)
 *   • spa / gym / bar                           (no amenity photography)
 * ---------------------------------------------------------------------------
 */

const UNSPLASH = "https://images.unsplash.com";
const WIX = "https://static.wixstatic.com/media";
const STAAH = "https://homesweb.staah.net/imagelibrary";

/**
 * Build an optimized delivery URL for any image id.
 * Width is a hint - next/image performs the final responsive resizing.
 */
export function img(id: string, width = 1600, quality = 80) {
  if (id.startsWith("wix:")) {
    // Wix media supports on-the-fly transforms; `fit` preserves aspect ratio
    // and `enc_auto` negotiates AVIF/WebP.
    const media = id.slice(4);
    const w = Math.min(Math.max(width, 400), 2400);
    return `${WIX}/${media}/v1/fit/w_${w},h_${w},q_${quality},enc_auto/image.jpg`;
  }
  if (id.startsWith("staah:")) {
    // STAAH ships two renditions: `medium_<file>` (~800px) and the master.
    const file = id.slice(6);
    return width <= 800 ? `${STAAH}/medium_${file}` : `${STAAH}/${file}`;
  }
  return `${UNSPLASH}/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export const IMAGES = {
  // Hero / brand - original hotel photography
  heroExterior: "wix:e08cc7_d0ae254bbc0746a692a9172446bfa9e5~mv2.jpg", // façade at night
  heroLobby: "staah:14113_1775289308129.jpeg", // lobby lounge
  heroPool: "photo-1551882547-ff40c63fe5fa", // ⚠ placeholder - no original
  aboutStory: "staah:14113_1775218772519.jpeg", // façade & lawn, daytime
  aboutDetail: "staah:14113_1775644126618.jpeg", // window seating nook

  // Rooms - official booking-platform / website photography
  deluxeTwin: "staah:14113_1775644387754.jpeg",
  deluxeKing: "staah:14113_1775218772678.jpeg",
  premiumKing: "wix:e08cc7_bf238a59d46b440eab8b8196ed5121b2~mv2.png",
  juniorSuite: "wix:e08cc7_6fde52d720784b46a40cf3b8184c897e~mv2.jpg",
  suite: "staah:14113_1775644234274.jpeg",
  roomDetailBath: "wix:e08cc7_d2ac4796fd264df08afee152a4387544~mv2.jpg",
  roomDetailDesk: "wix:e08cc7_6e952a67de344285852b26009ab09551~mv2.jpg",

  // Events - the wedding hall is the only original venue photo published
  wedding: "wix:e08cc7_5fbae194bd2243fea0e1c01f7f395bcc~mv2.jpg",
  engagement: "photo-1519225421980-715cb0215aed", // ⚠ placeholder - no original
  reception: "photo-1511795409834-ef04bbd61622", // ⚠ placeholder - no original
  corporate: "photo-1497366216548-37526070297c", // ⚠ placeholder - no original
  eventHall: "wix:e08cc7_5fbae194bd2243fea0e1c01f7f395bcc~mv2.jpg",

  // Dining - ⚠ placeholders; Namaskaram photography not yet published
  diningRestaurant: "photo-1517248135467-4c7edcad34c4",
  diningDish: "photo-1414235077428-338989a2e8c0",
  diningPlating: "photo-1600891964092-4316c288032e",

  // Amenities / gallery - original hotel photography where available
  spa: "photo-1600334129128-685c5582fd35", // ⚠ placeholder - no original
  gym: "photo-1571902943202-507ec2618e8f", // ⚠ placeholder - no original
  bar: "photo-1470337458703-46ad1756a187", // ⚠ placeholder - no original
  gardenCity: "staah:14113_1775218772519.jpeg", // lawn & façade
  galleryA: "staah:14113_1775289308129.jpeg", // lobby lounge
  galleryB: "staah:14113_1775644422974.jpeg", // deluxe twin gallery
  galleryC: "staah:14113_1775644314274.jpeg", // suite gallery
  galleryD: "staah:14113_1775644183438.jpeg", // deluxe king gallery
} as const;
