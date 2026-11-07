// Entry point for the static demo build (npm run build:demo): swap in the
// in-browser API before the app (and its stores) start up.
import { installDemo } from "../demo/demoApi";

installDemo();
await import("./entry");
