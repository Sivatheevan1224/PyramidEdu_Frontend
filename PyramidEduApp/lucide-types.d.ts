declare module 'lucide-react-native' {
  import * as React from 'react';
  import { GestureResponderEvent } from 'react-native';

  export interface LucideProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    style?: any;
    onPress?: (event: GestureResponderEvent) => void;
  }

  export type LucideIcon = React.ComponentType<LucideProps>;

  export const Bell: LucideIcon;
  export const Camera: LucideIcon;
  export const Check: LucideIcon;
  export const X: LucideIcon;
  export const Mail: LucideIcon;
  export const Phone: LucideIcon;
  export const User: LucideIcon;
  export const Award: LucideIcon;
  export const Settings: LucideIcon;
  export const LogOut: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Clock: LucideIcon;
  export const Users: LucideIcon;
  export const BrainCircuit: LucideIcon;
  export const QrCode: LucideIcon;
  export const Eye: LucideIcon;
  export const Download: LucideIcon;
  export const Search: LucideIcon;
  export const BookOpen: LucideIcon;
  export const FileText: LucideIcon;
  export const BarChart3: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Star: LucideIcon;
  export const Wallet: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const FileDown: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const Layers3: LucideIcon;
  export const Calendar: LucideIcon;
  export const Home: LucideIcon;
  export const ClipboardList: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const Lock: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Send: LucideIcon;
  export const Info: LucideIcon;
  export const Book: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Sun: LucideIcon;
  export const Moon: LucideIcon;
  export const Globe: LucideIcon;
  export const MapPin: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Save: LucideIcon;
  export const Key: LucideIcon;
  export const RefreshCw: LucideIcon;
}


