import { Alert, Linking } from "react-native";

// const NEWS_BASE_URL = "https://uftb.ac.bd/news"; // TODO: replace with your real domain
const NEWS_BASE_URL = "http://10.253.19.252:5000/api/news";

export const newsUrl = (id: string) => `${NEWS_BASE_URL}/${id}`;

const open = async (url: string, failMessage: string) => {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Unable to open", failMessage);
  }
};

export const shareViaEmail = (title: string, id: string) => {
  const subject = encodeURIComponent(title);
  const body = encodeURIComponent(`Click to see the news:\n${newsUrl(id)}`);
  return open(
    `mailto:?subject=${subject}&body=${body}`,
    "No email app was found.",
  );
};

export const shareViaWhatsApp = (id: string) => {
  const text = encodeURIComponent(newsUrl(id));
  // web-based endpoint works whether or not the app scheme is registered, and lets
  // the user pick a contact/inbox themselves, per your requirement
  return open(`https://wa.me/?text=${text}`, "WhatsApp could not be opened.");
};

export const shareViaFacebook = (id: string) => {
  const url = encodeURIComponent(newsUrl(id));
  return open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    "Could not open Facebook.",
  );
};

// test DU news
// export const shareViaFacebook = (id: string) => {
//   const url2 = "https://www.du.ac.bd/du_post_details/post/28779";

//   const encodedUrl = encodeURIComponent(url2);

//   const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

//   console.log("Facebook URL:", facebookUrl);

//   return open(facebookUrl, "Could not open Facebook.");
// };
// test ubtb bangla latest news to share
// export const shareViaFacebook = (id: string) => {
//   const articleUrl =
//     "https://uftb.ac.bd/news-and-events/general-news/%E0%A6%87%E0%A6%89%E0%A6%8F%E0%A6%AB%E0%A6%9F%E0%A6%BF%E0%A6%AC%E0%A6%BF-%E0%A6%93-%E0%A6%AA%E0%A6%BF%E0%A6%AA%E0%A6%B2%E0%A6%8F%E0%A6%A8%E0%A6%9F%E0%A7%87%E0%A6%95%E0%A7%87%E0%A6%B0-%E0%A6%AE%E0%A6%A7%E0%A7%8D%E0%A6%AF%E0%A7%87-%E0%A6%B8%E0%A6%AE%E0%A6%9D%E0%A7%8B%E0%A6%A4%E0%A6%BE-%E0%A6%B8%E0%A7%8D%E0%A6%AE%E0%A6%BE%E0%A6%B0%E0%A6%95-%E0%A6%B8%E0%A7%8D%E0%A0%95%E0%A6%B7%E0%A0%B0";

//   const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;

//   console.log("Article URL:", articleUrl);
//   console.log("Facebook URL:", facebookShareUrl);

//   return open(facebookShareUrl, "Could not open Facebook.");
// };

export const shareViaLinkedIn = (id: string) => {
  const url = encodeURIComponent(newsUrl(id));
  return open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    "Could not open LinkedIn.",
  );
};
