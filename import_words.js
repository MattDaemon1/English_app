import fs from 'fs';

// Dictionnaire de traductions pour les mots les plus courants
const translations = {
    // Mots de base
    "a": "un/une", "about": "à propos", "above": "au-dessus", "accept": "accepter", "accident": "accident",
    "account": "compte", "across": "à travers", "act": "agir", "action": "action", "active": "actif",
    "activity": "activité", "actor": "acteur", "actually": "en fait", "add": "ajouter", "address": "adresse",
    "administration": "administration", "adult": "adulte", "affect": "affecter", "after": "après", "again": "encore",
    "against": "contre", "age": "âge", "agency": "agence", "agent": "agent", "ago": "il y a",
    "agree": "être d'accord", "agreement": "accord", "ahead": "devant", "air": "air", "all": "tout",
    "allow": "permettre", "almost": "presque", "alone": "seul", "along": "le long", "already": "déjà",
    "also": "aussi", "although": "bien que", "always": "toujours", "among": "parmi", "amount": "montant",
    "analysis": "analyse", "and": "et", "animal": "animal", "another": "autre", "answer": "réponse",
    "any": "n'importe quel", "anyone": "n'importe qui", "anything": "n'importe quoi", "appear": "apparaître", "approach": "approche",
    "area": "zone", "argue": "argumenter", "arm": "bras", "around": "autour", "arrive": "arriver",
    "art": "art", "article": "article", "artist": "artiste", "as": "comme", "ask": "demander",
    "assume": "supposer", "at": "à", "attack": "attaquer", "attempt": "tentative", "attend": "assister",
    "attention": "attention", "attorney": "avocat", "attract": "attirer", "audience": "public", "author": "auteur",
    "authority": "autorité", "available": "disponible", "avoid": "éviter", "away": "loin", "baby": "bébé",
    "back": "dos/arrière", "bad": "mauvais", "bag": "sac", "ball": "balle", "bank": "banque",
    "bar": "bar", "base": "base", "basic": "basique", "battle": "bataille", "be": "être",
    "beat": "battre", "beautiful": "beau", "because": "parce que", "become": "devenir", "bed": "lit",
    "before": "avant", "begin": "commencer", "behavior": "comportement", "behind": "derrière", "believe": "croire",
    "benefit": "bénéfice", "best": "meilleur", "better": "mieux", "between": "entre", "beyond": "au-delà",
    "big": "grand", "bill": "facture", "billion": "milliard", "bit": "un peu", "black": "noir",
    "blood": "sang", "blue": "bleu", "board": "conseil", "body": "corps", "book": "livre",
    "born": "né", "both": "les deux", "box": "boîte", "boy": "garçon", "break": "casser",
    "bring": "apporter", "brother": "frère", "budget": "budget", "build": "construire", "building": "bâtiment",
    "business": "affaires", "but": "mais", "buy": "acheter", "by": "par", "call": "appeler",
    "camera": "caméra", "campaign": "campagne", "can": "pouvoir", "cancer": "cancer", "candidate": "candidat",
    "capital": "capital", "car": "voiture", "card": "carte", "care": "soin", "career": "carrière",
    "carry": "porter", "case": "cas", "catch": "attraper", "cause": "cause", "cell": "cellule",
    "center": "centre", "central": "central", "century": "siècle", "certain": "certain", "certainly": "certainement",
    "chair": "chaise", "challenge": "défi", "chance": "chance", "change": "changer", "character": "caractère",
    "charge": "charger", "check": "vérifier", "child": "enfant", "choice": "choix", "choose": "choisir",
    "church": "église", "citizen": "citoyen", "city": "ville", "civil": "civil", "claim": "revendication",
    "class": "classe", "clear": "clair", "clearly": "clairement", "close": "fermer", "coach": "entraîneur",
    "cold": "froid", "collection": "collection", "college": "université", "color": "couleur", "come": "venir",
    "commercial": "commercial", "common": "commun", "community": "communauté", "company": "entreprise", "compare": "comparer",
    "computer": "ordinateur", "concept": "concept", "concern": "préoccupation", "condition": "condition", "conference": "conférence",
    "congress": "congrès", "consider": "considérer", "consumer": "consommateur", "contain": "contenir", "continue": "continuer",
    "control": "contrôler", "cost": "coût", "could": "pourrait", "country": "pays", "couple": "couple",
    "course": "cours", "court": "tribunal", "cover": "couvrir", "create": "créer", "crime": "crime",
    "cultural": "culturel", "culture": "culture", "cup": "tasse", "current": "actuel", "customer": "client",
    "cut": "couper", "dark": "sombre", "data": "données", "date": "date", "daughter": "fille",
    "day": "jour", "dead": "mort", "deal": "accord", "death": "mort", "debate": "débat",
    "decade": "décennie", "decide": "décider", "decision": "décision", "deep": "profond", "defense": "défense",
    "degree": "degré", "democratic": "démocratique", "describe": "décrire", "design": "design", "despite": "malgré",
    "detail": "détail", "determine": "déterminer", "develop": "développer", "development": "développement", "die": "mourir",
    "difference": "différence", "different": "différent", "difficult": "difficile", "dinner": "dîner", "direction": "direction",
    "director": "directeur", "discover": "découvrir", "discuss": "discuter", "discussion": "discussion", "disease": "maladie",
    "do": "faire", "doctor": "docteur", "dog": "chien", "door": "porte", "down": "en bas",
    "draw": "dessiner", "dream": "rêve", "drive": "conduire", "drop": "laisser tomber", "drug": "médicament",
    "during": "pendant", "each": "chaque", "early": "tôt", "east": "est", "easy": "facile",
    "eat": "manger", "economic": "économique", "economy": "économie", "edge": "bord", "education": "éducation",
    "effect": "effet", "effort": "effort", "eight": "huit", "either": "soit", "election": "élection",
    "else": "autre", "employee": "employé", "end": "fin", "energy": "énergie", "enjoy": "profiter",
    "enough": "assez", "enter": "entrer", "entire": "entier", "environment": "environnement", "especially": "surtout",
    "establish": "établir", "even": "même", "evening": "soir", "event": "événement", "ever": "jamais",
    "every": "chaque", "everyone": "tout le monde", "everything": "tout", "evidence": "preuve", "exactly": "exactement",
    "example": "exemple", "executive": "exécutif", "exist": "exister", "expect": "s'attendre", "experience": "expérience",
    "expert": "expert", "explain": "expliquer", "eye": "œil", "face": "visage", "fact": "fait",
    "factor": "facteur", "fail": "échouer", "fall": "tomber", "family": "famille", "far": "loin",
    "fast": "rapide", "father": "père", "fear": "peur", "federal": "fédéral", "feel": "sentir",
    "feeling": "sentiment", "few": "peu", "field": "champ", "fight": "combattre", "figure": "figure",
    "fill": "remplir", "film": "film", "final": "final", "finally": "finalement", "financial": "financier",
    "find": "trouver", "fine": "bien", "finger": "doigt", "finish": "finir", "fire": "feu",
    "firm": "entreprise", "first": "premier", "fish": "poisson", "five": "cinq", "floor": "sol",
    "fly": "voler", "focus": "focus", "follow": "suivre", "food": "nourriture", "foot": "pied",
    "for": "pour", "force": "force", "foreign": "étranger", "forget": "oublier", "form": "forme",
    "former": "ancien", "forward": "en avant", "four": "quatre", "free": "libre", "friend": "ami",
    "from": "de", "front": "devant", "full": "plein", "fund": "fonds", "future": "futur",
    "game": "jeu", "garden": "jardin", "gas": "gaz", "general": "général", "generation": "génération",
    "get": "obtenir", "girl": "fille", "give": "donner", "glass": "verre", "go": "aller",
    "goal": "objectif", "good": "bon", "government": "gouvernement", "great": "grand", "green": "vert",
    "ground": "sol", "group": "groupe", "grow": "grandir", "growth": "croissance", "guess": "deviner",
    "gun": "arme", "guy": "gars", "hair": "cheveux", "half": "moitié", "hand": "main",
    "hang": "accrocher", "happen": "arriver", "happy": "heureux", "hard": "dur", "have": "avoir",
    "he": "il", "head": "tête", "health": "santé", "hear": "entendre", "heart": "cœur",
    "heat": "chaleur", "heavy": "lourd", "help": "aide", "her": "elle", "here": "ici",
    "herself": "elle-même", "high": "haut", "him": "lui", "himself": "lui-même", "his": "son",
    "history": "histoire", "hit": "frapper", "hold": "tenir", "home": "maison", "hope": "espoir",
    "hospital": "hôpital", "hot": "chaud", "hotel": "hôtel", "hour": "heure", "house": "maison",
    "how": "comment", "however": "cependant", "huge": "énorme", "human": "humain", "hundred": "cent",
    "husband": "mari", "I": "je", "idea": "idée", "identify": "identifier", "if": "si",
    "image": "image", "imagine": "imaginer", "impact": "impact", "important": "important", "improve": "améliorer",
    "in": "dans", "include": "inclure", "including": "y compris", "increase": "augmenter", "indeed": "en effet",
    "indicate": "indiquer", "individual": "individuel", "industry": "industrie", "information": "information", "inside": "à l'intérieur",
    "instead": "au lieu", "institution": "institution", "interest": "intérêt", "interesting": "intéressant", "international": "international",
    "interview": "entretien", "into": "dans", "investment": "investissement", "involve": "impliquer", "issue": "problème",
    "it": "il/elle", "item": "article", "its": "son", "itself": "soi-même", "job": "travail",
    "join": "rejoindre", "just": "juste", "keep": "garder", "key": "clé", "kid": "enfant",
    "kill": "tuer", "kind": "gentil", "kitchen": "cuisine", "know": "savoir", "knowledge": "connaissance",
    "land": "terre", "language": "langue", "large": "grand", "last": "dernier", "late": "tard",
    "later": "plus tard", "laugh": "rire", "law": "loi", "lawyer": "avocat", "lay": "poser",
    "lead": "mener", "leader": "leader", "learn": "apprendre", "least": "moins", "leave": "partir",
    "left": "gauche", "leg": "jambe", "legal": "légal", "less": "moins", "let": "laisser",
    "letter": "lettre", "level": "niveau", "lie": "mentir", "life": "vie", "light": "lumière",
    "like": "aimer", "likely": "probable", "line": "ligne", "list": "liste", "listen": "écouter",
    "little": "petit", "live": "vivre", "local": "local", "long": "long", "look": "regarder",
    "lose": "perdre", "loss": "perte", "lot": "beaucoup", "love": "amour", "low": "bas",
    "machine": "machine", "magazine": "magazine", "main": "principal", "maintain": "maintenir", "major": "majeur",
    "make": "faire", "man": "homme", "manage": "gérer", "management": "gestion", "manager": "manager",
    "many": "beaucoup", "market": "marché", "marriage": "mariage", "material": "matériel", "matter": "matière",
    "may": "peut", "maybe": "peut-être", "me": "moi", "mean": "signifier", "measure": "mesurer",
    "media": "médias", "medical": "médical", "meet": "rencontrer", "meeting": "réunion", "member": "membre",
    "memory": "mémoire", "mention": "mentionner", "message": "message", "method": "méthode", "middle": "milieu",
    "might": "pourrait", "military": "militaire", "million": "million", "mind": "esprit", "minute": "minute",
    "miss": "manquer", "mission": "mission", "model": "modèle", "modern": "moderne", "moment": "moment",
    "money": "argent", "month": "mois", "more": "plus", "morning": "matin", "most": "plus",
    "mother": "mère", "mouth": "bouche", "move": "bouger", "movement": "mouvement", "movie": "film",
    "Mr": "Monsieur", "Mrs": "Madame", "much": "beaucoup", "music": "musique", "must": "devoir",
    "my": "mon", "myself": "moi-même", "name": "nom", "nation": "nation", "national": "national",
    "natural": "naturel", "nature": "nature", "near": "près", "nearly": "presque", "necessary": "nécessaire",
    "need": "besoin", "network": "réseau", "never": "jamais", "new": "nouveau", "news": "nouvelles",
    "newspaper": "journal", "next": "suivant", "nice": "gentil", "night": "nuit", "no": "non",
    "nor": "ni", "north": "nord", "not": "pas", "note": "note", "nothing": "rien",
    "notice": "remarquer", "now": "maintenant", "number": "numéro", "occur": "arriver", "of": "de",
    "off": "éteint", "offer": "offrir", "office": "bureau", "officer": "officier", "official": "officiel",
    "often": "souvent", "oh": "oh", "oil": "huile", "ok": "ok", "old": "vieux",
    "on": "sur", "once": "une fois", "one": "un", "only": "seulement", "onto": "sur",
    "open": "ouvrir", "operation": "opération", "opportunity": "opportunité", "option": "option", "or": "ou",
    "order": "ordre", "organization": "organisation", "other": "autre", "others": "autres", "our": "notre",
    "out": "dehors", "outside": "dehors", "over": "sur", "own": "propre", "owner": "propriétaire",
    "page": "page", "pain": "douleur", "painting": "peinture", "paper": "papier", "parent": "parent",
    "part": "partie", "participant": "participant", "particular": "particulier", "particularly": "particulièrement", "partner": "partenaire",
    "party": "fête", "pass": "passer", "past": "passé", "patient": "patient", "pattern": "modèle",
    "pay": "payer", "peace": "paix", "people": "gens", "per": "par", "perform": "effectuer",
    "performance": "performance", "perhaps": "peut-être", "period": "période", "person": "personne", "personal": "personnel",
    "phone": "téléphone", "physical": "physique", "pick": "choisir", "picture": "image", "piece": "morceau",
    "place": "lieu", "plan": "plan", "plant": "plante", "play": "jouer", "player": "joueur",
    "PM": "après-midi", "point": "point", "police": "police", "policy": "politique", "political": "politique",
    "politics": "politique", "poor": "pauvre", "popular": "populaire", "population": "population", "position": "position",
    "positive": "positif", "possible": "possible", "power": "pouvoir", "practice": "pratique", "prepare": "préparer",
    "present": "présent", "president": "président", "pressure": "pression", "pretty": "joli", "prevent": "prévenir",
    "price": "prix", "private": "privé", "probably": "probablement", "problem": "problème", "process": "processus",
    "produce": "produire", "product": "produit", "production": "production", "professional": "professionnel", "professor": "professeur",
    "program": "programme", "project": "projet", "property": "propriété", "protect": "protéger", "provide": "fournir",
    "public": "public", "pull": "tirer", "purpose": "but", "push": "pousser", "put": "mettre",
    "quality": "qualité", "question": "question", "quickly": "rapidement", "quite": "assez", "race": "course",
    "radio": "radio", "raise": "lever", "range": "gamme", "rate": "taux", "rather": "plutôt",
    "reach": "atteindre", "read": "lire", "ready": "prêt", "real": "vrai", "reality": "réalité",
    "realize": "réaliser", "really": "vraiment", "reason": "raison", "receive": "recevoir", "recent": "récent",
    "recently": "récemment", "recognize": "reconnaître", "record": "enregistrer", "red": "rouge", "reduce": "réduire",
    "reflect": "refléter", "region": "région", "relate": "relier", "relationship": "relation", "religious": "religieux",
    "remain": "rester", "remember": "se souvenir", "remove": "enlever", "report": "rapport", "represent": "représenter",
    "republican": "républicain", "require": "exiger", "research": "recherche", "resource": "ressource", "respond": "répondre",
    "response": "réponse", "responsibility": "responsabilité", "rest": "repos", "result": "résultat", "return": "retourner",
    "reveal": "révéler", "rich": "riche", "right": "droit", "rise": "se lever", "risk": "risque",
    "road": "route", "rock": "rocher", "role": "rôle", "room": "chambre", "rule": "règle",
    "run": "courir", "safe": "sûr", "same": "même", "save": "sauver", "say": "dire",
    "scene": "scène", "school": "école", "science": "science", "scientist": "scientifique", "score": "score",
    "sea": "mer", "season": "saison", "seat": "siège", "second": "second", "section": "section",
    "security": "sécurité", "see": "voir", "seek": "chercher", "seem": "sembler", "sell": "vendre",
    "send": "envoyer", "senior": "senior", "sense": "sens", "series": "série", "serious": "sérieux",
    "serve": "servir", "service": "service", "set": "ensemble", "seven": "sept", "several": "plusieurs",
    "sex": "sexe", "sexual": "sexuel", "shake": "secouer", "share": "partager", "she": "elle",
    "shoot": "tirer", "short": "court", "shot": "tir", "should": "devrait", "shoulder": "épaule",
    "show": "montrer", "side": "côté", "sign": "signe", "significant": "significatif", "similar": "similaire",
    "simple": "simple", "simply": "simplement", "since": "depuis", "sing": "chanter", "single": "célibataire",
    "sister": "sœur", "sit": "s'asseoir", "site": "site", "situation": "situation", "six": "six",
    "size": "taille", "skill": "compétence", "skin": "peau", "small": "petit", "smile": "sourire",
    "so": "donc", "social": "social", "society": "société", "soldier": "soldat", "some": "quelque",
    "somebody": "quelqu'un", "someone": "quelqu'un", "something": "quelque chose", "sometimes": "parfois", "son": "fils",
    "song": "chanson", "soon": "bientôt", "sort": "sorte", "sound": "son", "source": "source",
    "south": "sud", "southern": "du sud", "space": "espace", "speak": "parler", "special": "spécial",
    "specific": "spécifique", "speech": "discours", "spend": "dépenser", "sport": "sport", "spring": "printemps",
    "staff": "personnel", "stage": "scène", "stand": "debout", "standard": "standard", "star": "étoile",
    "start": "commencer", "state": "état", "statement": "déclaration", "station": "station", "stay": "rester",
    "step": "étape", "still": "encore", "stock": "stock", "stop": "arrêter", "store": "magasin",
    "story": "histoire", "strategy": "stratégie", "street": "rue", "strong": "fort", "structure": "structure",
    "student": "étudiant", "study": "étudier", "stuff": "truc", "style": "style", "subject": "sujet",
    "success": "succès", "successful": "réussi", "such": "tel", "suddenly": "soudainement", "suffer": "souffrir",
    "suggest": "suggérer", "summer": "été", "support": "soutien", "sure": "sûr", "surface": "surface",
    "system": "système", "table": "table", "take": "prendre", "talk": "parler", "task": "tâche",
    "tax": "taxe", "teach": "enseigner", "teacher": "professeur", "team": "équipe", "technology": "technologie",
    "television": "télévision", "tell": "dire", "ten": "dix", "tend": "tendre", "term": "terme",
    "test": "test", "than": "que", "thank": "remercier", "that": "que", "the": "le",
    "their": "leur", "them": "eux", "themselves": "eux-mêmes", "then": "alors", "theory": "théorie",
    "there": "là", "these": "ces", "they": "ils", "thing": "chose", "think": "penser",
    "third": "troisième", "this": "ceci", "those": "ceux", "though": "bien que", "thought": "pensée",
    "thousand": "mille", "threat": "menace", "three": "trois", "through": "à travers", "throughout": "partout",
    "throw": "jeter", "thus": "ainsi", "time": "temps", "to": "à", "today": "aujourd'hui",
    "together": "ensemble", "tonight": "ce soir", "too": "aussi", "top": "haut", "total": "total",
    "tough": "dur", "toward": "vers", "town": "ville", "trade": "commerce", "traditional": "traditionnel",
    "training": "formation", "travel": "voyage", "treat": "traiter", "treatment": "traitement", "tree": "arbre",
    "trial": "procès", "trip": "voyage", "trouble": "problème", "true": "vrai", "truth": "vérité",
    "try": "essayer", "turn": "tourner", "TV": "télé", "two": "deux", "type": "type",
    "under": "sous", "understand": "comprendre", "union": "union", "unit": "unité", "united": "uni",
    "university": "université", "unless": "à moins que", "until": "jusqu'à", "up": "en haut", "upon": "sur",
    "us": "nous", "use": "utiliser", "used": "utilisé", "useful": "utile", "user": "utilisateur",
    "usually": "habituellement", "value": "valeur", "various": "divers", "very": "très", "victim": "victime",
    "view": "vue", "violence": "violence", "visit": "visite", "voice": "voix", "vote": "vote",
    "wait": "attendre", "walk": "marcher", "wall": "mur", "want": "vouloir", "war": "guerre",
    "watch": "regarder", "water": "eau", "way": "chemin", "we": "nous", "weapon": "arme",
    "wear": "porter", "week": "semaine", "weight": "poids", "well": "bien", "west": "ouest",
    "western": "occidental", "what": "quoi", "whatever": "peu importe", "when": "quand", "where": "où",
    "whether": "si", "which": "lequel", "while": "pendant", "white": "blanc", "who": "qui",
    "whole": "entier", "whom": "qui", "whose": "dont", "why": "pourquoi", "wide": "large",
    "wife": "épouse", "will": "volonté", "win": "gagner", "wind": "vent", "window": "fenêtre",
    "wish": "souhaiter", "with": "avec", "within": "dans", "without": "sans", "woman": "femme",
    "wonder": "se demander", "word": "mot", "work": "travail", "worker": "travailleur", "working": "travaillant",
    "world": "monde", "worry": "s'inquiéter", "worse": "pire", "worst": "pire", "worth": "valoir",
    "would": "ferait", "write": "écrire", "writer": "écrivain", "wrong": "faux", "yard": "cour",
    "yeah": "ouais", "year": "année", "yes": "oui", "yet": "encore", "you": "vous",
    "young": "jeune", "your": "votre", "yourself": "vous-même", "zone": "zone"
};

// Fonction pour déterminer la catégorie basée sur le mot
function determineCategory(word) {
    const categories = {
        'technology': ['computer', 'internet', 'phone', 'digital', 'software', 'hardware', 'tech', 'app', 'web'],
        'food': ['food', 'eat', 'drink', 'cook', 'kitchen', 'restaurant', 'meal', 'dinner', 'lunch'],
        'family': ['family', 'mother', 'father', 'brother', 'sister', 'parent', 'child', 'baby', 'husband', 'wife'],
        'emotions': ['happy', 'sad', 'angry', 'love', 'hate', 'fear', 'joy', 'feel', 'emotion'],
        'transport': ['car', 'bus', 'train', 'plane', 'travel', 'road', 'drive', 'fly', 'walk'],
        'work': ['work', 'job', 'office', 'business', 'company', 'employee', 'manager', 'career'],
        'education': ['school', 'learn', 'teach', 'student', 'book', 'study', 'knowledge', 'university'],
        'nature': ['tree', 'flower', 'animal', 'water', 'sun', 'moon', 'earth', 'nature', 'environment'],
        'time': ['time', 'day', 'night', 'week', 'month', 'year', 'hour', 'minute', 'today', 'tomorrow'],
        'colors': ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'orange'],
        'body': ['head', 'hand', 'foot', 'eye', 'nose', 'mouth', 'arm', 'leg', 'body', 'hair'],
        'house': ['house', 'home', 'room', 'kitchen', 'bedroom', 'door', 'window', 'wall', 'floor'],
        'clothes': ['shirt', 'pants', 'dress', 'shoes', 'hat', 'coat', 'wear', 'clothes'],
        'weather': ['sun', 'rain', 'snow', 'wind', 'cloud', 'hot', 'cold', 'weather']
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => word.toLowerCase().includes(keyword))) {
            return category;
        }
    }
    return 'daily-life'; // catégorie par défaut
}

// Fonction pour déterminer la difficulté
function determineDifficulty(word, index) {
    if (word.length <= 4 && index < 100) return 'beginner';
    if (word.length <= 7 && index < 400) return 'intermediate';
    return 'advanced';
}

// Lire le fichier des mots
const wordsText = fs.readFileSync('3000_english_words.txt', 'utf-8');
const wordsList = wordsText.split('\n')
    .map(word => word.trim())
    .filter(word => word.length > 0)
    .slice(0, 200); // Prendre les 200 premiers mots pour commencer

console.log(`Traitement de ${wordsList.length} mots...`);

// Générer les données structurées
const generatedWords = wordsList.map((word, index) => ({
    id: index + 41, // Commencer après nos 40 mots existants
    word: word,
    translation: translations[word.toLowerCase()] || `[${word}]`, // Utiliser la traduction ou placeholder
    pronunciation: `/${word}/`, // Placeholder pour la prononciation
    partOfSpeech: "noun", // Placeholder - pourrait être amélioré
    definition: `Définition de ${word}`,
    example: `This is an example with ${word}.`,
    exampleTranslation: `Ceci est un exemple avec ${translations[word.toLowerCase()] || word}.`,
    difficulty: determineDifficulty(word, index),
    category: determineCategory(word)
}));

// Afficher statistiques
const stats = {
    total: generatedWords.length,
    beginner: generatedWords.filter(w => w.difficulty === 'beginner').length,
    intermediate: generatedWords.filter(w => w.difficulty === 'intermediate').length,
    advanced: generatedWords.filter(w => w.difficulty === 'advanced').length,
    translated: generatedWords.filter(w => !w.translation.startsWith('[')).length
};

console.log('\n📊 Statistiques:');
console.log(`Total: ${stats.total} mots`);
console.log(`Beginner: ${stats.beginner} mots`);
console.log(`Intermediate: ${stats.intermediate} mots`);
console.log(`Advanced: ${stats.advanced} mots`);
console.log(`Traduits: ${stats.translated} mots (${Math.round(stats.translated / stats.total * 100)}%)`);

// Sauvegarder
fs.writeFileSync('import_words.json', JSON.stringify(generatedWords, null, 2));
console.log('\n✅ Mots sauvegardés dans import_words.json');
console.log('📝 Vous pouvez maintenant intégrer ces mots dans votre application !');
