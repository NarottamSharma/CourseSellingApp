const { Router } = express();

const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
    res.json({
        message: "admin Signup page ",
    });
});

adminRouter.post("/signin", (req, res) => {
    res.json({
        message: "Signin endpoint - POST request",
    });
});

adminRouter.post("/course", (req, res) => {
    res.json({
        message: "admin Course endpoint - POST request",
    });
});

module.export = {
    adminRouter: adminRouter,
};
