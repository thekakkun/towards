import { getAllLocations } from "../controllers/locationControllers";

const locationRouter = {
  "/locations": getAllLocations,
};

export default locationRouter;
