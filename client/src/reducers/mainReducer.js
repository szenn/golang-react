export const mainReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_SUCCESS":
      return {
        ...state,
        authenticated:true,
        token: action.payload,
      };
    case "AUTH_TERMINATE":
      localStorage.removeItem("sessionToken");

      return {
        ...state,
        authenticated:false,
        token: "",

      };

    default:
      break;
  }
};
