import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import swaggerUi from 'swagger-ui-express';
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from './routes/student.routes.js';
import coachRoutes from './routes/coach.routes.js';
import eventRoutes from './routes/event.routes.js';
import { Role, Discipline } from './generated/prisma/client.js';
import { openApiSpec } from "./docs/swagger.js";
import { authorize } from "./middleware/authorize.js";
import { authenticate } from "./middleware/auth.js";
import { detectLanguage, LangRequest, switchLang } from "./middleware/lang.js";
import { getCoaches, getStudentsIndex, getAllStudents, getEventByCoachId} from "./utils/getData.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/views'));
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(process.cwd(), 'src/public')));

if (process.env.NODE_ENV !== 'production') {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
};

app.use("/api/auth", authRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/event", eventRoutes);
app.use(detectLanguage);
app.use(switchLang);

app.get('/', async (_req, res) => {
  const coaches = await getCoaches();
  const students = await getStudentsIndex();
  res.render('index', {
    coaches,
    students
  });
})

app.get('/login', (req, res) => {
  const lang = (req as LangRequest).lang;
  res.render('login', {
    lang,
  });
})

app.get('/dashboard', authenticate, authorize(Role.admin, Role.coach), async (req, res) => {
  const disciplines = Object.values(Discipline);
  const lang = (req as LangRequest).lang;
  const coaches = await getCoaches();
  const students = await getAllStudents();

  if (req.query.role === 'coach') {
    const event = await getEventByCoachId(Number(req.query.id));
    console.log(event);
    res.render('coach_dashboard', {
      event,
      lang
    });
  } else if (req.query.role === 'admin') {
    res.render('admin_dashboard', {
      disciplines,
      coaches,
      lang,
      students
    });
  }
})

app.get('/athletes', (_req, res) => {
  res.render('athletes');
})

app.get('/international', (_req, res) => {
  res.render('international');
})

app.get('/medals', (_req, res) => {
  res.render('medals');
})

//TODO: add export to pdf  

export default app;
