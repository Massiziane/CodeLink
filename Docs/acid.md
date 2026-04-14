# ACID dans CodeLink

Le projet illustre bien ACID à travers la création transactionnelle d’une commande dans `createOrder()`.

**Atomicité** : dans `createOrder()`, la création de la commande et des `OrderItem` doit réussir ensemble.
Si le service demandé est introuvable ou non publié, la transaction échoue et rien n’est enregistré, donc on évite une commande “à moitié créée”.

**Cohérence** : la base doit toujours respecter les règles métier du schéma, par exemple un `OrderItem` doit pointer vers un `Service` existant et publié.
La quantité doit rester supérieure à zéro et le total de la commande doit correspondre à la somme des services achetés.

**Isolation** : si deux clients essaient d’acheter en même temps le dernier service disponible, chaque transaction doit être traitée comme si elle était seule.
Sans bonne isolation, on risque une double vente ou un état intermédiaire incohérent.

**Durabilité** : une fois la transaction validée, la BD garantit que la commande, ses articles et son total restent enregistrés même en cas de panne ou de redémarrage.
C’est ce qui rend l’achat fiable après le `commit`.