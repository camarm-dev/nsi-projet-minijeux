### Infrastructure serveurs

Pour déployer le site, nous utilisons plusieurs outils.

Le site est lancé sur un _conteneur LXC_, avec une image _Alpine Linux_.

> **LXC** est un système virtualisation, utilisant l'isolation comme méthode de cloisonnement au niveau du système d'exploitation.

> **Alpine Linux** est une distribution Linux ultra-légère, orientée sécurité. Souvent utilisée pour la créations de conteneurs.

LXC permet une couche de sécurité, et Alpine Linux, permet d'avoir un système facile à gérer, et qui contient "le strict minimum".

Pour faire tourner le serveur web Flask en arrière-plan, nous utilisons `pm2`, un gestionnaire de processus qui permet de facilement lancer des processus en arrière-plan.
pm2 permet aussi de relancer ces processus au lancement du conteneur.

Enfin, le conteneur est accessible depuis une interface web appelée Proxmox :

![](.github/images/servers.png)

**Concernant l'exposition du conteneur sur Internet**

Pour que les utilisateurs puissent accéder au site, il faut que le conteneur ou est lancé Flask soit accessible sur Internet.



[![](https://mermaid.ink/img/pako:eNp1kU1OwzAQha8ymg1UajlAFiygLCohVLV0Q92FqaeNRTIO_uFHTQ_EObgYk5jSCqle-SXv87xn73DtDGGBm8q9r0vtI8zuFYOsRSC_VLiItrJBR0pe4QpGo-v2jqMnqAiMq7VlamH8MF9eKpyTfxNfJxUOVvkcET01-_4KrkrROgYj-MVk2sLMpdiPuXEfMGHZM0WZk9H8F0ZXgj96zWFDElDgxvkYWujneRl86wTlPuJAcYZDet563ZQwlVaWIB2LQHYcWmZFbP6Bhzwn9q7ZGXfXj3TqLoVCtK-JTrjc5Khz8r-jcIg1eblMI0-x6z4rjCXVpLCQrdH-RaHivfh0im7-yWssok80RO_StsRio6sgKjVGGo6tlkz1wdJofnKu_jXtfwCnwKSK?type=png)](https://mermaid.live/edit#pako:eNp1kU1OwzAQha8ymg1UajlAFiygLCohVLV0Q92FqaeNRTIO_uFHTQ_EObgYk5jSCqle-SXv87xn73DtDGGBm8q9r0vtI8zuFYOsRSC_VLiItrJBR0pe4QpGo-v2jqMnqAiMq7VlamH8MF9eKpyTfxNfJxUOVvkcET01-_4KrkrROgYj-MVk2sLMpdiPuXEfMGHZM0WZk9H8F0ZXgj96zWFDElDgxvkYWujneRl86wTlPuJAcYZDet563ZQwlVaWIB2LQHYcWmZFbP6Bhzwn9q7ZGXfXj3TqLoVCtK-JTrjc5Khz8r-jcIg1eblMI0-x6z4rjCXVpLCQrdH-RaHivfh0im7-yWssok80RO_StsRio6sgKjVGGo6tlkz1wdJofnKu_jXtfwCnwKSK)











```mermaid
flowchart RL
    User["Utilisateur"] -->|Entre le domaine| DNS[("Serveur DNS")]
    DNS -->|Résolution de l'IP| Router["Box Internet"]
    Router -.->|Transfert de ports| Server("Conteneur")

    subgraph Partie utilisateur 
        User
    end
    subgraph Internet 
        DNS
    end
    subgraph Réseau domestique 
        Router
        Server
    end
```
