import ContactModal from "@/components/ContactModal";
import type { Person } from "@/types/person";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Ctx = { openContact: (person: Person) => void; closeContact: () => void };
const ContactModalContext = createContext<Ctx | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [person, setPerson] = useState<Person | null>(null);
  const [visible, setVisible] = useState(false);

  const openContact = useCallback((p: Person) => {
    setPerson(p);
    setVisible(true);
  }, []);
  const closeContact = useCallback(() => setVisible(false), []); // keep `person` so the fade-out still shows content

  const value = useMemo(
    () => ({ openContact, closeContact }),
    [openContact, closeContact],
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactModal person={person} visible={visible} onClose={closeContact} />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx)
    throw new Error("useContactModal must be used inside ContactModalProvider");
  return ctx;
}
