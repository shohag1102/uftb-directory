export type Person = {
  id?: string;
  name: string;
  designation?: string;
  office?: string;
  university?: string;
  image?: string | number | null; // URL from the API, or require('...') for a local asset
  phone?: string;
  email?: string;
  extension?: string;
  bloodGroup?: string;
};
