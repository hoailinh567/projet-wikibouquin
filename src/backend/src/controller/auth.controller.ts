import type { Request, Response } from "express";
import argon2 from "argon2";
import { isValidSignup } from "../validation/signup.validator.ts";
import type { SignupData } from "../validation/signup.validator.ts";
import userDataMapper from "../dataMapper/user.datamapper.ts";
import roleDatamapper from "../dataMapper/role.datamapper.ts";

const authController = {
    async signUp(req: Request, res: Response) {
        const signUpData = isValidSignup.safeParse(req.body);

        if (!signUpData.success) {
            return res.status(400).contentType('json').send(signUpData.error.message);
        }
        // Forcer le type pour TypeScript
        const { email, password, username} = signUpData.data as SignupData;

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
            console.log("debut")
            console.log(roleUser);
            console.log("FIN");
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
    }
}

export default authController; 