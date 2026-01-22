import express from "express";
import authRoutes from "./routes/auth.routes";
import fileRoutes from './routes/file.routes';
import adminRoutes from './routes/admin.routes';
import cookieParser from "cookie-parser";
import path from "path";
import * as OpenApiValidator from 'express-openapi-validator';
import { prisma } from './db/prisma';
import { Role } from './generated/prisma/client';
import { decrypt } from "./services/auth.service";
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import { readFileSync } from 'fs';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, 'public')));

const openApiSpec = yaml.load(
  readFileSync(path.join(__dirname, 'docs/components.yml'), 'utf8')
) as any;

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiSpec,
    validateRequests: true,
    validateResponses: process.env.NODE_ENV === 'development',
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/admin", adminRoutes);

app.get('/', (_req, res) => {
  res.render('pages/index');
})

app.get('/dashboard', (_req, res) => {
  res.render('pages/dashboard');
})

app.get('/coaches', async (_req, res) => {
  try {
    const coachListRaw = await prisma.user.findMany({
      where: { role: Role.coach },
      include: {
        photos: true,
        students: {
          include: {
            photos: true,
          }
        },
        events: true,
      },
    });


    const dataList = coachListRaw.map((c, idx) => ({
      idx,
      coach: {
        firstName: c.firstName,
        lastName: c.lastName,
        phoneNumber: decrypt(c.phoneNumber),
        username: c.username,
        id: c.id,
        role: c.role,
        avatarId: c.photos[0]?.id,
        avatar: c.photos[0]?.url,
      },
      students: c.students,
      events: c.events, 
    }));

    res.render('pages/coaches', {
      dataList,
    });

  } catch (error) {
    res.status(500).json(error);
  }
});

//TODO: add delete request to fornt-end, add export to exel, add map integration, coach_login, coach_dashboard

export default app;
