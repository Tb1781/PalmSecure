import 'dotenv/config';

export default {
  expo: {
    name: "PalmSecure",
    slug: "your-app-slug",
    // Other Expo config fields...

    // This extra field is accessible at runtime using expo-constants.
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};
