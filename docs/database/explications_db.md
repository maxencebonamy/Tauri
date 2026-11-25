## Project

La table projet sert à stocker toutes les informations concernant le projet en cours.
Elle contient donc le nombre d'équipes, le ratio H/F, le nombre de sprints et la phase actuelle (qui servira pour savoir quelles informations afficher sur certaines pages selon le rôle de l'utilisateur et la phase).
La phase peut être `COMPOSING` (les équipes sont en compisition par le project leader), `PREPUBLISHED` (les équipes sont prépubliées et sont accessibles pour les étudiants, c'est la phase où les étudiants peuvent proposer des changements) ou `PUBLISHED` (Les équipes sont définitives et le projet a potentiellement commencé). (à voir si on met d'autres phases selon les besoins).
Pour le moment, un projet n'est associé qu'à une équipe mais je pense qu'il faut aussi d'autres associations, à voir...

## User

Un utilisateur a un nom, un email, un mot de passe et un type.
Le type peut être `OPTION_LEADER`, `PROJECT_LEADER`, `SUPERVISOR`, `STUDENT`, `COACH`. (Il y aura une enum pour le type d'un utilisateur)


## Student

Un étudiant `hérite` d'un utilisateur (autrement dit, un étudiant EST un utilisateur). Pour le schéma logique, ça se traduit juste par une clé étrangère de la table Student vers la table User.
Un étudiant a un genre (`MALE` ou `FEMALE`, il y aura une enum pour ça), un champ booléen `bachelor` qui indique si c'est un bachelor ou pas, et un rôle (System admin, Scrum, etc.)

## Team

Chaque étudiant peut être associé à une équipe (ou aucune si les équipes n'ont pas encore été constituées).
Inversement, une équipe contient autant d'étudiants que possible, pas de limite.
Une équipe a un nom.
Une équipe est nécessairement associé à un projet aussi.

## Flag

Un flag sert pendant la composition des équipes pour indiquer si on est d'accord ou pas.
Il contient une description et un type.
Le type est soit `REPORT`, soit `CONFIRM`. (enum)
Pour un flag de type `REPORT`, ça indique qu'un étudiant ou un SS n'est pas d'accord avec la composition des équipes et voudrait une modification. (pour les modifications il faudra approndir ce point je pense).
Pour un flag de type `CONFIRM`, ça indique qu'un SS est d'accord avec la composition des équipes, car l'option leader doit pouvoir voir si les SS ont validé ou pas la compisition des équipes.
Donc un flag est donné par quelqu'un, un auteur de type utilisateur.

## Grade

Une note a une valeur et un commentaire.
Elle est attribué soit à un étudiant, soit à une équipe. (Par exemple si elle est associée à une équipe, la clé étrangère de l'équipe va pointer vers l'id de l'équipe concernée, mais la clé étrangère de l'étudiant sera nulle)
Une note est donnée par quelqu'un, donc il y a aussi une relation vers l'auteur, qui est un utilisateur.

## Grade Type

Un type de note a un nom (par exemple `PDLO`), un coefficient et un booléen `group` qui permet de savoir si c'est une note de groupe ou pas.
Chaque note est associé à un type de note, ce qui permet de ne pas dupliquer toutes les informations concernant une note.

## Grade Scale

Un barême de note a un type et un contenu.
Le type peut être soit `PRESENTATIONS`, `SPRINT_CONFORMITY`,  `TECHNICAL_SOLUTION`, `PROJECT_MANAGEMENT`. (il y aura une enum aussi pour ça).
Le contenu est soit directement le barême sous le format json ou autre, soit le lien vers l'image du barême (selon ce que ça soit être vu qu'on sait pas encore trop j'ai l'impression).
Un type de note peut (ou pas) être associé à un barême.

## Bonus

Un bonus a une valeur, un commentaire, et deux booléens `limited` et `confirmed`.
`Limited` indique si le bonus est limité (voir les US mais en gros un bonus limité est donné par les étudiants)
`Confirmed` indique si le bonus est validé (car tous les membres de l'équipe doivent valider + les SS je crois)
Un bonus peut aussi être un malus (il faut juste que la valeur soit négative).

Un bonus est associé à une note (inversement une note peut être associé à plusieurs bonus vu que plusieurs personnes peuvent donner un bonus à une même note).
L'idée c'est que pour calculer une note ensuite, on regarde aussi tous les bonus associés à cette note pour faire le calcul et avoir la note finale (pas besoin de stocker la note finale avec bonus pris en compte dans la bdd du coup).
Un bonus a été donné par quelqu'un, l'auteur est est un utilisateur.

## Sprint

Un sprint a une date de début, une date de fin, et un type de fin.
Le type de fin peut être ... (on sait pas encore je crois, mais on fera une enum pour toute les types de fin je pense)
Ensuite, pour avoir l'ordre de présentation à la fin du sprint, il y a une table d'association entre les sprints et les étudiants, qui contient une valeur qui correspond à l'ordre.
Comme ça, on peut stocker l'ordre de présentation par rapport à n'importe quel sprint et on va pas écraser les anciennes valeurs à chaque nouveau sprint.

## Comment

Un commentaire a un contenu et un booléen `feedback` qui permet de savoir si le commentaire correspond à un feedback ou pas. (la nuance est importante selon les US car un feedback sera ensuite transmis aux étudiants alors qu'un simple commentaire non).
Ensuite, un commentaire a un auteur, un utilisateur et aussi est attribué à une équipe (d'après ce que j'ai vu, un feedback n'est jamais attribué à un étudiant seul mais toujours à l'équipe).