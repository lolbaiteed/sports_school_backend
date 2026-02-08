import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import swaggerUi from 'swagger-ui-express';
import authRoutes from "./routes/auth.routes";
import fileRoutes from './routes/file.routes';
import studentRoutes from './routes/student.routes';
import coachRoutes from './routes/coach.routes';
import eventRoutes from './routes/event.routes';
import { prisma } from './db/prisma';
import { Role } from './generated/prisma/client';
import { openApiSpec } from "./docs/swagger";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'production') {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
};

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/event", eventRoutes);

app.get('/', async (_req, res) => {
  const coaches = await prisma.user.findMany({
    where: { role: Role.coach},
    select: {
      firstName: true,
      lastName: true,
      middleName: true,
      discipline: true, 
      photos: {
        select: {
          url: true,
        },
        take: 1,
      },
    },
  });
  let students = await prisma.student.findFirst({
    take: 10,
    orderBy: {id: 'asc'},
  });
  res.render('index', {
    coaches,
    students
  });
})

app.get('/dashboard', (_req, res) => {
  res.render('dashboard');
})

// app.get('/coaches', async (_req, res) => {
// });

//TODO: add export to pdf, add recreating/autodelete outdated tokens

export default app;
