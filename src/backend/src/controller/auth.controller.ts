import type { Request, Response } from "express";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { isValidSignup } from "../validation/signup.validator.ts";
import type { SignupData } from "../validation/signup.validator.ts";
import userDataMapper from "../dataMapper/user.datamapper.ts";
import roleDatamapper from "../dataMapper/role.datamapper.ts";
import { isValidSignin } from "../validation/signin.validator.ts";


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
                });

        } catch (error) {
            console.error("Erreur lors de la création d'un utilisateur :", error);
            return res
                .status(500)
                .contentType("json")
                .send({ error: "Une erreur interne est survenue." });
        }

        // vérifier si l'username n'est pas déjà pris
        // si tout ça c'est ok, préparer les données pour l'enregistrement en bdd (postgres)
        // encoder le password pour qu'il ne soit plus visible en clair
        // finalement, envoyer la réponse au frontend que tout s'est bien passé
        // comme on n'a pas de login pour le moment juste un "ok" (200)
        // lorsqu'on aura un système de login, on pourra connecter l'utilisateur et
        // renvoyer son token jwt => options : mettre dans cookies et HTTP only/ same site = strict 
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
        // Vérifier si c'est User?, sinon retourne error
        if (!user) {
            return res
                .status(403)
                .contentType("json")
                .send({ error: "Mot de passe incorrect." });
        }

        // Vérifier pw récupéré de body est le même avec le password_has dans BDD?
        const isPasswordOk = await argon2.verify(user.password_hash, password)
        // Sinon, retourn error
        if (!isPasswordOk) {
            return res
                .status(403)
                .contentType("json")
                .send({ error: "Mot de passe incorrect." });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        // recrée le même User sans le PW
        const publicUser = { id: user.id, email: user.email, username: user.username, role_id: user.role_id };

        // Si tout va bien, créer JWT et puis envoyer à frontend
        const accessToken = jwt.sign(
            publicUser,
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.cookie(
            'accessToken',
            accessToken,
            {
                httpOnly: true,
                sameSite: true,
                maxAge: 15 * 60 * 1000 // 15min = 15 x 60 (s) x 1000 (ms)
            }
        )

        res.json({
            user: publicUser,
        })
    }
}

export default authController; 