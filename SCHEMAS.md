## Structure application

[![](https://mermaid.ink/img/pako:eNqNU11u2zAMvgqhhyEB3BwgGwYkdrysaIdhbl9W94G1GFutLXn6yRbUPVDP0YuNttc62V4mwIBJfvxEfqQeRWEkiaXY1eZnUaH1cPEt18DnepaLa69q5dBTsLmYw9nZx-6z9mSxVNTBF9yrEr2xY4ILd6XFtpr8N7n4ypSKQI8u5oFZag1zaPketleXFxHEWRbBeTbPxe1I1B-pLBVeGQ1X68mbDIwlgSQojNb0ixEneatXRM8NMsA9hRNAPGOE4-uzwlha3DuOzqdw2odTY5tQI5cApPfm8PI8gTjzr3Yzsns66tX1dt_oGosHhs-hQaUX7eE_Gjxn0Xs-ZaEmBztVVIqsO1UKyINquEmu_aj0Deeugq9Ie8WJ6AdtjgBbBmy0pVI5b6lhHLhehInmrbmknzWko5EOxmY0NrBgo4uNeeBecU8FS-yN_mcd4iGryzDsqUQryXawHUOrYZM-YakJAn_tIFwH8esV72ALH_r0dZLccNVrdMPMJc_85ZmFyX7UyhPXfSsi0ZBlhSVv8WNPkAvWoOHgkn8l7TDUPhe5fmIoBm-ygy7E0ttAkQit5K1MFPIoG7HcYe3YS1JxG5fjyxgeSCRa1N-NmTDWhLL6Yz39BpjiBlA?type=png)](https://mermaid.live/edit#pako:eNqNU11u2zAMvgqhhyEB3BwgGwYkdrysaIdhbl9W94G1GFutLXn6yRbUPVDP0YuNttc62V4mwIBJfvxEfqQeRWEkiaXY1eZnUaH1cPEt18DnepaLa69q5dBTsLmYw9nZx-6z9mSxVNTBF9yrEr2xY4ILd6XFtpr8N7n4ypSKQI8u5oFZag1zaPketleXFxHEWRbBeTbPxe1I1B-pLBVeGQ1X68mbDIwlgSQojNb0ixEneatXRM8NMsA9hRNAPGOE4-uzwlha3DuOzqdw2odTY5tQI5cApPfm8PI8gTjzr3Yzsns66tX1dt_oGosHhs-hQaUX7eE_Gjxn0Xs-ZaEmBztVVIqsO1UKyINquEmu_aj0Deeugq9Ie8WJ6AdtjgBbBmy0pVI5b6lhHLhehInmrbmknzWko5EOxmY0NrBgo4uNeeBecU8FS-yN_mcd4iGryzDsqUQryXawHUOrYZM-YakJAn_tIFwH8esV72ALH_r0dZLccNVrdMPMJc_85ZmFyX7UyhPXfSsi0ZBlhSVv8WNPkAvWoOHgkn8l7TDUPhe5fmIoBm-ygy7E0ttAkQit5K1MFPIoG7HcYe3YS1JxG5fjyxgeSCRa1N-NmTDWhLL6Yz39BpjiBlA)


<details>

<summary>Code mermaid</summary>


```mermaid
flowchart LR
    U("Utilisateur") -->|Interagie| Navigator
    subgraph Navigator["Partie navigateur (Frontend; HTML, CSS, JS)"]
        direction TB
        D["Page de connexion"]
        A["Page HTML du jeu"]
        C(["sendScore.js"])
        F(["Formulaire envoyé"])
    end
    subgraph Server["Partie serveur (Backend) main.py"]
        direction TB
        J("Servir les fichiers HTML, CSS, JS et images")
        E("Authentification")
        H("Enregistrement scores")
    end
    D --> F
    F --> E
    E .-> |Cookie avec jeton| Navigator
    C --> |Sauvegarder| H
    A -->|Gagne une partie| C
    E & H <--> BDD[("Base de données Sqlite")]
```

    
</details>

## Bot du morpion

[![](https://mermaid.ink/img/pako:eNptUt1OwjAUfpWT3qgJ8ABcaMARExKFqFdSLsp2GDVdz-wPxjASH8f34MU828QwsVftl--vp92JlDIUQ7E29J5ulAvwnEgLvEYLKR5pRQEKcqUmK8US-v1rqA6f4MlCoOggQ3jFWMGcvNcrbXTQ6BcsnViPxcogMzykFEsPZcMx6Nlp2YZ0ZLV7Na9duclbxEZWwXgnxZ3KrbIBbqTYt8px22UWdQW3nDeliA5MK-KADuuBbAWzSylmFrwuItNqf3Ohsi06r7Tja1CNHPVXrX7W6BNuMMq2A8jPaiSnNTpQkznhzFtl0jrRnA8CVOkOXwyjibqf6t_cCQxqj7_DAB_1lgtUMP13KNPzNtOTNp1pi54o0BVKZ_z8u5osRdhggVIMeZvhWkUTpJB2z1QVAz192FQMg4vYE7HMVMBEq9yp4ghipgO5-_ZHNR-rJ0plX4iYslbGM8dRzDc_p_03aavSPw?type=png)](https://mermaid.live/edit#pako:eNptUt1OwjAUfpWT3qgJ8ABcaMARExKFqFdSLsp2GDVdz-wPxjASH8f34MU828QwsVftl--vp92JlDIUQ7E29J5ulAvwnEgLvEYLKR5pRQEKcqUmK8US-v1rqA6f4MlCoOggQ3jFWMGcvNcrbXTQ6BcsnViPxcogMzykFEsPZcMx6Nlp2YZ0ZLV7Na9duclbxEZWwXgnxZ3KrbIBbqTYt8px22UWdQW3nDeliA5MK-KADuuBbAWzSylmFrwuItNqf3Ohsi06r7Tja1CNHPVXrX7W6BNuMMq2A8jPaiSnNTpQkznhzFtl0jrRnA8CVOkOXwyjibqf6t_cCQxqj7_DAB_1lgtUMP13KNPzNtOTNp1pi54o0BVKZ_z8u5osRdhggVIMeZvhWkUTpJB2z1QVAz192FQMg4vYE7HMVMBEq9yp4ghipgO5-_ZHNR-rJ0plX4iYslbGM8dRzDc_p_03aavSPw)

<details>


<summary>Code mermaid</summary>

```mermaid
flowchart TD
    A["Robot morpion"] --> |À son tour de jeu| Possibilities[["Ensemble des coups possibles"]]
    Possibilities -->|Pour chaque coup| B{"Gagnant ?"}
    B --> |Oui| C["Jouer le coup"]
    B --> |Non| O("On simule que l'adversaire joue le coup")
    O --> D{"Adv. gagnant ?"}
    D --> |Oui| C
    D --> |Non| E("Calcule les coups possibles après celui-ci")
    E .-> |Pour chaque coup suivant| J{"Gagnant ?"}
    J --> |Oui| C
    J --> |Non| Possibilities
```
    
</details>
