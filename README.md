<div align="center">

![borne_arcade_v1.png](design/borne_arcade_v1.png)

</div> 

# Projet mini jeux NSI
NSI 1ère Projet Mini Jeux

## Liens utiles
- Gestion des tâches : [projet Github](https://github.com/users/camarm-dev/projects/6)

## Crédits

Ce projet est disponible sous la licence [CeCILL-2.1](./LICENSE).

## Direction artistique / graphisme

- Style 8-bit / police pixelisée (type minecraft)
- Cartouches de jeux
- Les jeux tournent dans une borne d'arcade

## Documentation

- Installer les dépendances python
```shell
pip install -r requirements.txt
```
- Lancer le serveur
```shell
python3 main.py
```

## Base de données

La base de données est située à la racine; `database.db`. C'est une base Sqlite3.

Ci-dessous la définition des tables:

| Nom de la table | Description                         |
|-----------------|-------------------------------------|
| users           | Stockages des profils utilisateurs  |
| scores          | Stockages des résultats des parties |

**Table `users`**

| Nom de la colonne (propriété) | Description                         |
|-------------------------------|-------------------------------------|
| name                          | Nom complet de l'utilisateur        |
| pseudo                        | Pseudo de l'utilisateur             |
| email                         | Email de l'utilisateur              |
| password                      | Mot de passe hashé de l'utilisateur |
| created_at                    | Date de création de l'utilisateur   |


**Table `scores`**

| Nom de la colonne (propriété) | Description                                                     |
|-------------------------------|-----------------------------------------------------------------|
| game                          | Nom du jeu parmis `morpion`, `pfc`, `osu`, `dino`, `justeprix`. |
| date                          | Date d'enregistrement de la partie                              |
| user                          | Pseudo de l'utilisateur                                         |
| points                        | Nombres de points gagnés                                        |

## À propos du hashage des mots de passes

Comme décrit dans le cahier des charges, la sécurité des mots de passe est une couche de sécurité attendue.
Nous utilisons l'algorithme [PBKDF2](https://fr.wikipedia.org/wiki/PBKDF2): Password Based Key Derivation Function 2.

Son fonctionnement est itératif : 
- il _hash_ le mot de passe avec un algorithme donné un certain nombre de fois (SHA-256, 260 000 fois dans notre cas)
- en plus ce hashage, cet algorithme rajoute un sel ; une chaine de caractères aléatoires qui complique le cassage par force brute

Cet algorithme permet donc de hasher des mots de passes et de comparer leur hash mais rend presque impossible le cassage de ceux-ci, car il est lent...

L'implémentation python de cet algorithme est à `pbkdf2.py` et provient de [Password hashing in Python with pbkdf2 - Simon Willison](https://til.simonwillison.net/python/password-hashing-with-pbkdf2)

## À propos des jetons de connexion

Notre système utilise les Json Web Token ([JWT](https://fr.wikipedia.org/wiki/JSON_Web_Token)). Ces jetons uniques permettent d'identifier les utilisateurs.

Ils possèdent : 
- une charge utile, avec le pseudo unique de l'utilisateur
- une date d'expiration
- une signature, qui permet de vérifier leur authenticité (si le jeton a bien été généré par notre site)

La clé secrète, permettant de générer des jetons qui font autorité est générée aléatoirement au lancement du site. Si elle venait à être compromise, le site doit donc être relancé.

## Crédits sons

Les sons sont des sons libres de droits du site pixabay; liens des sites:
- https://pixabay.com/sound-effects/success-02-68338/
- https://pixabay.com/sound-effects/arcade-countdown-7007/
