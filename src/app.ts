import express from "express";
import authRoutes from "./routes/auth.routes";
import cors from "cors"; 
import path from "path";

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: 'http://localhost:3300',
  credentials: true
}));

app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
})


app.get('/coaches', (req, res) => {
  res.render('coaches');
})

export default app;
