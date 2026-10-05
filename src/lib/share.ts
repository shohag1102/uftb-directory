import { Alert, Linking } from "react-native";

const open = async (url: string, failMessage: string) => {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Unable to open", failMessage);
  }
};

export const shareViaEmail = (title: string, url: string) => {
  const subject = encodeURIComponent(title);
  const body = encodeURIComponent(`Click to see this:\n${url}`);
  return open(
    `mailto:?subject=${subject}&body=${body}`,
    "No email app was found.",
  );
};

export const shareViaWhatsApp = (url: string) =>
  open(
    `https://wa.me/?text=${encodeURIComponent(url)}`,
    "WhatsApp could not be opened.",
  );

export const shareViaFacebook = (url: string) =>
  open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    "Could not open Facebook.",
  );

export const shareViaLinkedIn = (url: string) =>
  open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    "Could not open LinkedIn.",
  );

const NEWS_BASE_URL = "https://uftb.ac.bd/news";
const NOTICE_BASE_URL = "https://uftb.ac.bd/notices";

export const newsUrl = (id: string) => `${NEWS_BASE_URL}/${id}`;
export const noticeUrl = (id: string) => `${NOTICE_BASE_URL}/${id}`;
