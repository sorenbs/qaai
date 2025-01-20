import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [

    route("tests/", "routes/tests.tsx", [
        route(":testId", "routes/test.tsx", [
            route("run/:runId", "routes/run.tsx"),
        ])
    ]),


] satisfies RouteConfig;
