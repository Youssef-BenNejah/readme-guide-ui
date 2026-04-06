export interface SessionState {
  restaurantId: string | null;
  deviceId: string | null;
  ownerId: string | null;
  ownerName: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  taxRateId: string | null;
  taxRateLabel: string | null;
  taxRateValue: number | null;
  familyId: string | null;
  familyName: string | null;
  categoryId: string | null;
  categoryName: string | null;
  modifierGroupId: string | null;
  modifierGroupName: string | null;
  restaurantName: string | null;
  menuItemName: string | null;
  menuItemPrice: number | null;
  skippedStep8: boolean;
}

export const initialSessionState: SessionState = {
  restaurantId: null,
  deviceId: null,
  ownerId: null,
  ownerName: null,
  accessToken: null,
  refreshToken: null,
  taxRateId: null,
  taxRateLabel: null,
  taxRateValue: null,
  familyId: null,
  familyName: null,
  categoryId: null,
  categoryName: null,
  modifierGroupId: null,
  modifierGroupName: null,
  restaurantName: null,
  menuItemName: null,
  menuItemPrice: null,
  skippedStep8: false,
};

export interface Restaurant {
  id: string;
  name: string;
  owner: string;
  deviceId: string;
  taxRate: string | null;
  taxRateValue: number | null;
  family: string | null;
  category: string | null;
  modifierGroup: string | null;
  menuItems: MenuItem[];
  createdAt: string;
}

export interface MenuItem {
  name: string;
  price: number;
  family: string | null;
  category: string | null;
  modifierGroup: string | null;
}

export interface StepProps {
  sessionState: SessionState;
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>;
  onNext: () => void;
  onSkip?: () => void;
}
