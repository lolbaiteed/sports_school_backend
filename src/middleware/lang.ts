import { Request, Response, NextFunction } from 'express';
import { disciplineTranslations, adminTranslations } from '../utils/lang';
const supportedLangs = ["ru", "kk"];

export interface LangRequest extends Request {
  lang?: string
}

export function detectLanguage(req: LangRequest, res: Response, next: NextFunction) {
  const cookieLang = (req as any).cookies?.lang;

  if (cookieLang && supportedLangs.includes(cookieLang)) {
    req.lang = cookieLang;
    return next();
  }

  const header = req.headers["accept-language"];
  let lang = "kk";

  if (header) {
    const preferred = header
      .split(",")
      .map(l => l.split(";")[0].toLowerCase());

    const found = preferred.find(l =>
      supportedLangs.includes(l) || supportedLangs.includes(l.split("-")[0])
    );

    if (found) {
      lang = found.split("-")[0];
    }
  }

  res.cookie("lang", lang, { maxAge: 1000 * 60 * 60 * 24 * 365 });
  req.lang = lang;
  next();
}

export function switchLang(req: LangRequest, res: Response, next: NextFunction) {
  const lang = req.lang || "kk"; // from your detectLanguage middleware

  // tDiscipline: enum translations
  res.locals.tDiscipline = (key: string) =>
    disciplineTranslations[lang]?.[key] || key;

  // tUI: other UI translations
  res.locals.tAdmin= (key: string) =>
    adminTranslations[lang]?.[key] || key;

  next();
}

