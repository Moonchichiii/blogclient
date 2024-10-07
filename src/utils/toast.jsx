import { toast } from 'react-toastify';

const showToast = (message, type = 'error') => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'info':
      toast.info(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    default:
      toast.error(message);
  }
};

export default showToast;
