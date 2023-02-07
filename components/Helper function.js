import { showMessage } from "react-native-flash-message";

//create functions to return messages
const showSuccessMessage = (message) => {
  showMessage({
    message: message,
    type: "success",
    icon: "success",
    animationDuration: 400,
    autoHide: true,
    duration: 2850,
  });
};

const showErrorMessage = (message) => {
  showMessage({
    message: message,
    type: "danger",
    icon: "danger",
    animationDuration: 400,
    autoHide: true,
    duration: 2850,
  });
};

export { showSuccessMessage, showErrorMessage };
