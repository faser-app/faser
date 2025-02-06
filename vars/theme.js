import Cookies from "js-cookie";

const theme = ref(Cookies.get("theme") || "normal");

export default theme;