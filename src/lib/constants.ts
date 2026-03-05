export const APP_NAME = "Barsayans Academy";
export const APP_DESCRIPTION =
  "Aprende calistenia de élite con los mejores programas de Street Workout.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Firestore collection names */
export const COLLECTIONS = {
  COURSES: process.env.FIRESTORE_COURSES_COLLECTION ?? "courses",
  SUBSCRIPTIONS: "subscriptions",
} as const;

/** MercadoPago */
export const MP_CURRENCY = "CLP";
