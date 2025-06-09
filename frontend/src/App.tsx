import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes.config";

function App() {
  return useRoutes(routes);
}

export default App;