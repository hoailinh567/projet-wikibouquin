import type { Request, Response } from "express";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { isValidSignup } from "../validation/signup.validator.ts";
import type { SignupData } from "../validation/signup.validator.ts";
import userDataMapper from "../dataMapper/user.datamapper.ts";
import roleDatamapper from "../dataMapper/role.datamapper.ts";
import { isValidSignin } from "../validation/signin.validator.ts";
import type { PublicUser } from "../models/user.ts";
import collectionDataMapper from "../dataMapper/collection.datamapper.ts";
import { isValidUpdatePassword } from "../validation/update.password.validator.ts";
import type { UpdatePasswordData } from "../validation/update.password.validator.ts";

const JWT_SECRET = process.env.JWT_SECRET || 'unsafe-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'unsafe-refresh-secret';

const isProduction = process.env.NODE_ENV === 'production';
const baseCookieOptions = {
    httpOnly: true,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    secure: isProduction,
};

const authController = {
    async signUp(req: Request, res: Response) {
        const signUpData = isValidSignup.safeParse(req.body);

        if (!signUpData.success) {
            return res.status(400).contentType('json').send(signUpData.error.message);
        }
        // Forcer le type pour TypeScript
        const { email, password, username } = signUpData.data as SignupData;

        // Vérifier si email et username sont déjà prises, hash pw
        try {
            // Email
            const emailUsed = await userDataMapper.isEmailAlreadyUsed(email);
            if (emailUsed) {
                return res
                    .status(409)
                    .contentType("json")
                    .send({ error: "Cet email est déjà pris." });
            }

            // Username
            const usernameUsed = await userDataMapper.isUsernameAlreadyUsed(username);
            if (usernameUsed) {
                return res
                    .status(409)
                    .contentType("json")
                    .send({ error: "Ce nom d'utilisateur est déjà pris." });
            }

            // Après avoir vérifié email et username
            const roleUser = await roleDatamapper.findByName("user");
            if (!roleUser) {
                return res.status(500).json({ error: "Rôle par défaut non trouvé." });
            }
            // Hash du mot de passe avec Argon2
            const hashedPassword = await argon2.hash(password);

            // Création de l'utilisateur
            const newUser = await userDataMapper.create({
                username,
                email,
                password_hash: hashedPassword,
                role_id: roleUser.id
            });

            // Création de la collection
            const newCollection = await collectionDataMapper.create(newUser.id)

            // Réponse JSON
            return res
                .status(201)
                .contentType("json")
                .send({
                    message: "Utilisateur créé avec succès.",
                    user: {
                        id: newUser.id,
                        username: newUser.username,
                        email: newUser.email,
                    },
                    collection: newCollection
                });

        } catch (error) {
            console.error("Erreur lors de la création d'un utilisateur :", error);
            return res
                .status(500)
                .contentType("json")
                .send({ error: "Une erreur interne est survenue." });
        }

    },

    async signIn(req: Request, res: Response) {
        const signInData = isValidSignin.safeParse(req.body);

        if (!signInData.success) {
            return res.status(400).contentType('json').send(signInData.error.message);
        }
        // Récupérer les donnés de body et force en le type pour TypeScript
        const { email, password } = signInData.data as SignupData;
        // Récupérer le user de BDD
        const user = await userDataMapper.getUserByEmail(email)
        // Vérifier si c'est User? sinon retourne error
        if (!user) {
            return res
                .status(403)
                .contentType("json")
                .send({ error: "Mot de passe incorrect." });
        }

        // Vérifier pw récupéré de body est le même avec le password_hash dans BDD?
        const isPasswordOk = await argon2.verify(user.password_hash, password)
        // Si c'est pas OK, retourn error
        if (!isPasswordOk) {
            return res
                .status(403)
                .contentType("json")
                .send({ error: "Mot de passe incorrect." });
        }

        const CollectionIds = await collectionDataMapper.getCollectionsIdByUserId(user.id)

        // Recrée le même User sans le PW
        const publicUser: PublicUser = { id: user.id, username: user.username, email: user.email, role_id: user.role_id, collection_ids: CollectionIds};

        // Si tout va bien, créer JWT et Refresh JWT
        // Puis envoyer les 2 au frontend dans un cookie HttpOnly et sameSite + res.json()
        const accessToken = jwt.sign(
            publicUser,
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.cookie(
            'accessToken',
            accessToken,
            { ...baseCookieOptions, maxAge: 15 * 60 * 1000 }
        )

        // RefreshToken pour demander un nouveau accessToken s'il a dépassé 15min
        // Créer le refreshToken et l'envoyer au frontend de la même façon
        const refreshToken = jwt.sign(
            publicUser,
            REFRESH_SECRET,
            { expiresIn: '30d' }
        );

        res.cookie(
            'refreshToken',
            refreshToken,
            { ...baseCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 }
        )

        res.json({
            user: publicUser,
        })
    },

    async refresh(req: Request, res: Response) {
        // Récupréré refreshToken crée après log in
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ error: 'no refresh token' })
        }

        try {
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as PublicUser

            const newAccesToken = jwt.sign(
                { id: decoded.id, username: decoded.username, email: decoded.email, role_id: decoded.role_id, collection_ids: decoded.collection_ids },
                JWT_SECRET,
                { expiresIn: '15m' }
            )

            res.cookie(
                'accessToken',
                newAccesToken,
                { ...baseCookieOptions, maxAge: 15 * 60 * 1000 }
            );

            res.json({ success: true })
        } catch (err) {
            return res.status(401).json({ error: 'invalid refresh token' });
        }
    },

    async logout(_req: Request, res: Response) {
        // Supprimer les cookies accessToken et refreshToken
        res.clearCookie('accessToken', baseCookieOptions);
        res.clearCookie('refreshToken', baseCookieOptions);

        res.json({ success: true, message: 'Déconnexion réussie' });
    },

    // Récupère le compte de l'utilisateur connecté pour le page "Mon compte"
    account(_req: Request, res: Response) {
        const user = res.locals.user as PublicUser
        if (!user) {
            return res.status(500).json({ error: "no user" })
        }

        res.json(user);
    },

    async updatePassword(req: Request, res: Response) {
      const publicUser = res.locals.user as PublicUser
      if (!publicUser) {
          return res.status(500).json({ error: "no user" })
      }

      const user = await userDataMapper.getUserByEmail(publicUser.email)
      // Vérifier si c'est User? sinon retourne error
      if (!user) {
        return res.status(500).json({ error: "no user" })
      }

      const updatePasswordData = isValidUpdatePassword.safeParse(req.body)
      if (!updatePasswordData.success) {
        return res.status(400).contentType('json').send(updatePasswordData.error.message);
      }

      const { currentPassword, newPassword } =  updatePasswordData.data as UpdatePasswordData;

      const isCurrentPasswordOk = await argon2.verify(user.password_hash, currentPassword)
      // Si c'est pas OK, retourn error
      if (!isCurrentPasswordOk) {
          return res
              .status(403)
              .contentType("json")
              .send({ error: "Mot de passe actuel incorrect." });
      }

      const hashedPassword = await argon2.hash(newPassword);
      const updatedUser = await userDataMapper.updatePassword(user.email, hashedPassword)
      if (!updatedUser) {
        return res.status(500).json({ error: "un problème est survenu" })
      }

      res.json(updatedUser);
    },
}

export default authController;
