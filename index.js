import {
  opine,
  eta,
  dirname,
  join,
  json,
  urlencoded,
  serveStatic,
} from "./deps.js";

import {auth} from "./services/twitch.js";
import appRouter from "./routes/app.js";
import apiRouter from "./routes/api.js";

const app = opine();

// View engine setup
const __dirname = dirname(import.meta.url);
app.use(serveStatic(join(__dirname, 'public')));
app.engine("eta", eta.renderFile);
app.set("view engine", "eta")
app.set("views", './views');
app.set("cache", true);

// Handle different incoming body types
app.use(json());
app.use(urlencoded());

// Serve our static assets
app.use(serveStatic(join(dirname("."), "public")));

app.use("/api/v1", apiRouter);
app.use("/", appRouter);

app.use(function (err, _req, res, _next) {
  console.error(err.stack);
  res.setStatus(500).end(`Something Broke!\r\n ${err.stack}`);
});

console.log("Listenting on http://localhost:3000");
app.listen(3000);

// auth?? need to imporve
auth();
