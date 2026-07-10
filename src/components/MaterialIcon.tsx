import React from 'react';
import { 
  Loader2, 
  Check, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  ShieldCheck, 
  Clock, 
  FileText, 
  UserCheck, 
  Landmark, 
  ArrowLeft, 
  ChevronRight, 
  AlertTriangle, 
  Camera, 
  Trash2, 
  FolderOpen, 
  User, 
  MapPin, 
  DraftingCompass,
  UploadCloud,
  FileCheck,
  FileDigit,
  Image as ImageIcon,
  Download,
  Search,
  X
} from 'lucide-react';

interface MaterialIconProps {
  name: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export default function MaterialIcon({ name, className = '', size = 20, style = {} }: MaterialIconProps) {
  // Map Google Material Symbols to Lucide React SVG components
  switch (name) {
    case 'sync':
      return <Loader2 className={`animate-spin ${className}`} size={size} style={style} />;
    case 'check':
      return <Check className={className} size={size} style={style} />;
    case 'check_circle':
      return <CheckCircle2 className={className} size={size} style={style} />;
    case 'help_outline':
      return <HelpCircle className={className} size={size} style={style} />;
    case 'info':
      return <Info className={className} size={size} style={style} />;
    case 'verified':
      return <ShieldCheck className={className} size={size} style={style} />;
    case 'schedule':
      return <Clock className={className} size={size} style={style} />;
    case 'description':
      return <FileText className={className} size={size} style={style} />;
    case 'support_agent':
      return <UserCheck className={className} size={size} style={style} />;
    case 'account_balance':
      return <Landmark className={className} size={size} style={style} />;
    case 'verified_user':
      return <ShieldCheck className={className} size={size} style={style} />;
    case 'arrow_back':
      return <ArrowLeft className={className} size={size} style={style} />;
    case 'chevron_right':
      return <ChevronRight className={className} size={size} style={style} />;
    case 'error':
      return <AlertTriangle className={className} size={size} style={style} />;
    case 'photo_camera':
      return <Camera className={className} size={size} style={style} />;
    case 'delete':
      return <Trash2 className={className} size={size} style={style} />;
    case 'folder_open':
      return <FolderOpen className={className} size={size} style={style} />;
    case 'person':
      return <User className={className} size={size} style={style} />;
    case 'location_on':
      return <MapPin className={className} size={size} style={style} />;
    case 'architecture':
      return <DraftingCompass className={className} size={size} style={style} />;
    case 'upload_file':
      return <FileCheck className={className} size={size} style={style} />;
    case 'cloud_upload':
      return <UploadCloud className={className} size={size} style={style} />;
    case 'history_edu':
      return <FileDigit className={className} size={size} style={style} />;
    case 'photo_library':
      return <ImageIcon className={className} size={size} style={style} />;
    case 'download':
      return <Download className={className} size={size} style={style} />;
    case 'search':
      return <Search className={className} size={size} style={style} />;
    case 'close':
      return <X className={className} size={size} style={style} />;
    default:
      // Fallback: render the name as text if we missed any
      return <span className={`font-mono text-xs ${className}`}>{name}</span>;
  }
}
