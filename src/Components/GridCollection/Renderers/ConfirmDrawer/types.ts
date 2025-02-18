export type ConfirmDrawerProps = {
  isOpenMenu: boolean;
  onCloseMenu: () => void;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onDenied?: () => void;
  confirmButtonLabel?: string;
  deniedButtonLabel?: string;
}