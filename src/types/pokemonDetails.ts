export type StatRowProps = {
  label: string;
  value: number;
  icon: any;
  color: string;
  isMCI?: boolean;
};

export type DetailHeaderProps = {
  name: string;
  id: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};
 