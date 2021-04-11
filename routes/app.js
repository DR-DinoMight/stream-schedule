import { Router, env } from "../deps.js";
import { index as streamControllerIndex } from "../controllers/stream_controller.js"

const router = Router();

//Get home page.
router.get("/", async (_req, res, _next) => {
  const data = await streamControllerIndex();
  res.render("index", data);
});

export default router;
