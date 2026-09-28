import { Alert, Linking } from "react-native";

const DEFAULT_COUNTRY_CODE = "880"; // Bangladesh, used when a number is written locally as 01XXXXXXXXX

const open = async (url: string, failMessage: string) => {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Unable to open", failMessage);
  }
};

const clean = (p: string) => p.replace(/[^\d+]/g, "");

// WhatsApp wants the full international number, digits only
export const toWhatsAppNumber = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  if (phone.trim().startsWith("+")) return d;
  if (d.startsWith("00")) return d.slice(2);
  if (d.startsWith("0")) return DEFAULT_COUNTRY_CODE + d.slice(1);
  return d;
};

export const callNumber = (phone: string) =>
  open(`tel:${clean(phone)}`, "Phone calls are not available on this device.");

export const sendSms = (phone: string) =>
  open(`sms:${clean(phone)}`, "No messaging app was found.");

export const openWhatsApp = (phone: string) =>
  open(
    `https://wa.me/${toWhatsAppNumber(phone)}`,
    "WhatsApp could not be opened.",
  );

export const sendEmail = (email: string) =>
  open(`mailto:${email.trim()}`, "No email app was found.");
