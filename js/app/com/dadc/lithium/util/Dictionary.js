include( "js/app/com/dadc/lithium/util/StorageManager.js" );

var Dictionary = function()
{
    
    this.getText = function( LOCALE_MESSAGE )
    {
        if( StorageManagerInstance === null ) 
    {
        Logger.log("StorageManagerInstance not yet defined");
        return null;
    }
    
        var message = LOCALE_MESSAGE[ StorageManagerInstance.get( 'lang' ).toLowerCase() ];

        if( !message || typeof message === "undefined" )
    {
            message = LOCALE_MESSAGE[ 'en' ];
            return message;
        }
    else
    {
            return message;
        }
    };
    
    this.getSubtitleLocale = function( locale )
    {
        Logger.log( locale );
        return this.getText( Dictionary.TEXT[ locale.toUpperCase().replace( '-', '_' ) ] );
    };
};

var Dictionary = new Dictionary();

Dictionary.TEXT = {
    WANTTOCONTINE:{
        'en': 'Are you still watching?',
        'pt': 'Você ainda está assistindo?',
        'es': '¿Aún estás viendo?',
        'fr': 'Vous regardez toujours?' 
    },
    PRESSFORNEXT:{
        'en': 'Press X or ENTER to start next video',
        'pt': 'Pressione X ou Enter para iniciar o próximo vídeo.',
        'es': 'Presiona X o ENTER para empezar el siguiente video',
        'fr': 'Appuyez sur X ou la touche entrée pour voir la vidéo suivante' 
    },
    UPNEXT:{
        'en': 'Up Next: ',
        'pt': 'Em Seguida: ',
        'es': 'Siguiente: ',
        'fr': 'À suivre: '
    },
    WATCHLISTS: {
        'en': 'Watchlists',
        'pt': 'Filas',
        'es': 'Listas',
		'fr': 'Sélections'
    },
    WATCHLIST: {
        'en': 'Watchlist',
        'pt': 'Filas',
        'es': 'Listas',
		'fr': 'Sélection'
    },
    RECOMMENDED_WATCHLISTS: {
        'en': 'Recommended Watchlists',
        'pt': 'Coleções',
        'es': 'Colecciones',
		'fr': 'Sélections thématiques'
    },
    MY_WATCHLIST: {
        'en': 'My Watchlist',
        'pt': 'Minha Lista',
        'es': 'Mi Lista',
		'fr': 'Ma sélection'
    },
    MY_WATCHLIST_EMPTY:{
        'en': 'Please start adding content to your watchlist.',
        'pt': 'Por favor, começa a adicionar conteúdo à sua lista.',
        'es': 'Por favor empieza a agregar contenido a tu lista.',
		'fr': 'Ajoutez des vidéos à votre sélection.'
    },
    CAST: {
        'en': 'Cast',
        'pt': 'Elenco',
        'es': 'Elenco',
		'fr': 'Casting'
    },
    DIRECTORS: {
        'en': 'Director(s)',
        'pt': 'Diretor(es)',
        'es': 'Director(es)',
		'fr': 'Réalisateur(s)'
    },
    WRITERS: {
        'en': 'Writer(s)',
        'pt': 'Escritor(es)',
        'es': 'Escritor(es)',
		'fr': 'Scénario'
    },
    DESCRIPTION: {
        'en': 'Description',
        'pt': 'Descrição',
        'es': 'Descripción',
		'fr': 'Description'
    },
    EXPIRES_IN: {
        'en': 'Expires in ',
        'pt': 'Expira Em',
        'es': 'Expira en',
		'fr': 'Expire dans'
		
    },
    EXPIRES: {
        'en': 'Expires',
        'pt': 'Expira',
        'es': 'Expira',
		'fr': 'Expire le '
    },
    DAYS_LEFT_TO_WATCH: {
        'en': 'Days Left To Watch',
        'pt': 'dias para assistir',
        'es': 'días para ver',
		'fr': 'jours avant expiration'
    },
    DAY_LEFT_TO_WATCH: {
        'en': 'Day Left To Watch',
        'pt': 'dia para Assistir',
        'es': 'día para ver',
		'fr': 'jour avant expiration'
    },
    MIN: {
        'en': 'min',
        'pt': 'min',
        'es': 'min',
		'fr': 'min'
    },
    NOT_YET_RATED: {
        'en': 'Not Yet Rated',
        'pt': 'Sem classificação',
        'es': 'Sin clasificación',
		'fr': 'Aucune évaluation'
    },
    HOME: {
        'en': 'Home',
        'pt': 'Início',
        'es': 'Inicio',
		'fr': 'Accueil'
    },
    MOVIES: {
        'en': 'Movies',
        'pt': 'Filmes',
        'es': 'Películas',
		'fr': 'Films'
    },
    SHOWS: {
        'en': 'Shows',
        'pt': 'Séries',
        'es': 'Series',
		'fr': 'Séries'
    },
    MY_CRACKLE: {
        'en': 'My Crackle',
        'pt': 'Meu Crackle',
        'es': 'Mi Crackle',
		'fr': 'Mon Crackle'
    },
    FEATURED: {
        'en': 'Featured',
        'pt': 'Destaque',
        'es': 'Destacado',
		'fr': 'À la une'
    },
    MOST_POPULAR: {
        'en': 'Most Popular',
        'pt': 'Mais Populares',
        'es': 'Más Populares',
		'fr': 'Populaires'
    },
    RECENTLY_ADDED: {
        'en': 'Recently Added',
        'pt': 'Recentes',
        'es': 'Recientes',
		'fr': 'Ajouts récents'
    },
    BROWSE_ALL: {
        'en': 'Browse All',
        'pt': 'Procurar Todos',
        'es': 'Explorar Todas',
		'fr': 'Liste complète'
    },
    ERROR_OCCURRED: {
        'en': 'An error has occurred. Please try again later.',
        'pt': 'Ocorreu um erro. Por favor, tente novamente.',
        'es': 'Ha ocurrido un error. Por favor intenta de nuevo más tarde.',
		'fr': "Une erreur s'est produite. Veuillez réessayer ultérieurement."
    },
    RECOMMENDED_WATCHLISTS_MENU_HEADER: {
        'en': 'Recommended Watchlists',
        'pt': 'Coleções',
        'es': 'Colecciones',
		'fr': 'Sélections thématiques'
    },
    WHY_IT_CRACKLES: {
        'en': 'Why It Crackles',
        'pt': 'Why It Crackles',
        'es': 'Why It Crackles',
		'fr': 'Why It Crackles'
    },
    S_SEASON: {
        'en' : 'S',
        'pt': 'T',
        'es': 'T',
		'fr': 'S'
    },
    E_EPISODE: {
        'en' : 'E',
        'pt': 'E',
        'es': 'E',
		'fr': 'E'
    },
    PSNSIGNUP_1: {
        'en': 'ATTENTION',
        'pt': 'Atenção',
        'es': 'Atención',
		'fr': 'ATTENTION'
    },
    PSNSIGNUP_2: {
        'en': 'You must sign in to Sony Entertainment Network before using Crackle. Please press the PS button, quit the application and either sign in or create a new account.',
        'pt': 'Você deve entrar para o site da Sony Entertainment Network antes de usar o Crackle. Por favor, pressione o botão PS, saia da aplicação, faz o lgoin ou criar uma conta nova.',
        'es': 'Tienes que ingresar a Sony Entertainment Network antes de utilizar Crackle. Por favor oprime el botón PS, termina la aplicación, e ingresa de nuevo o crea una nueva cuenta.',
		'fr': "Vous devez vous connecter à Sony Entertainment Network avant de pouvoir utiliser Crackle. Appuyez sur la touche PS, quittez l'application et connectez-vous ou créez un nouveau compte."
    },
    DISCLAIMER_1: {
        'en': 'VIEWER DISCRETION IS ADVISED',
        'pt': 'VER COM DISCRIÇÃO',
        'es': 'VER CON DISCRECIÓN',
		'fr': 'AVERTISSEMENT'
    },
    DISCLAIMER_2: {
        'en': "CRACKLE(™) contains age-restricted material.",
        'pt': 'CRACKLE(™) contêm material restrito para menores de idade.',
        'es': 'CRACKLE(™) contiene material restringido por edad.',
		'fr': "Le contenu de CRACKLE(™) peut être soumis à des restrictions d'âge."
    },
    DISCLAIMER_3: {
        'en': "The following program may contain mature/suggestive themes, simulated gambling, profanity or crude humor, fantasy or realistic violence, sexual content or nudity, horror/fear themes, strong language, alcohol, tobacco, drug use or references.",
        'pt': 'O programa a seguir pode conter temas maduros / sugestivas, jogos de azar, obscenidades ou humor negro, fantasia ou violência realista, conteúdo sexual ou nudez, temas de terror/medo, linguagem forte, alcool, tabaco, uso de drogas ou referências.',
        'es': 'El programa siguiente puede contener temas maduros o sugestivos, juegos de apuestas simulados, palabras de carácter profano o humor vulgar, violencia autentica o fantasiosa, contenido sexual o desnudez, temas de horror o miedo, lenguaje vulgar, o referencias de uso de alcohol, tabaco o drogas.',
		'fr': "Ce programme pourrait présenter des thèmes adultes ou suggestifs, des simulations de jeux d'argent, un langage grossier ou de l'humour vulgaire, de la violence fantastique ou réaliste, des images sexuelles ou de la nudité, des thèmes portant sur l'horreur ou la peur, et des références à l'alcool, au tabac ou à la drogue."
    },
    DISCLAIMER_4: {
        'en': "By pressing the CONTINUE button below you agree to the Crackle Terms of Service, please visit http://www.crackle.com/tos for more details.",
        'pt': 'Ao clicar em CONTINUAR, você está concordando com os Termos de Serviço do Crackle, por favor visite http://www.crackle.com.br/tos para mais detalhes.',
        'es': 'Al presionar el botón CONTINUAR significa que estás de acuerdo con los términos de servicio de Crackle, por favor visita http://www.crackle.com/tos para ver mas detalles. ',
		'fr': "En appuyant sur le bouton CONTINUER ci-dessous, vous acceptez les conditions d'utilisation de Crackle. Rendez-vous sur http://www.crackle.com/tos pour en savoir plus."
    },
    ABOUT: {
        'en': 'About',
        'pt': 'Sobre',
        'es': 'Sobre',
		'fr': 'Informations'
    },
    YES: {
        'en': 'Yes',
        'pt': 'Si',
        'es': 'Si',
        'fr': 'Oui'        
    },
    NO: {
        'en': 'No',
        'pt': 'No',
        'es': 'No',
        'fr': 'Non'
    },
    ABOUT_TEXT: {
        'en': 'Say hello to Crackle, a new kind of network for a new kind of viewer. We handpick the most compelling selection of full-length Hollywood movies, TV shows and originals for you to enjoy wherever, whenever you want. No hassles, no subscription, no commitment required. Ever. Crackle. It’s On. \n\nFor more information, terms of service and privacy policy please visit: \n\nwww.crackle.com/privacy.aspx \nwww.crackle.com/tos',
        'pt': 'Crackle é uma das redes de entretenimento digital que mais cresce mundialmente, oferecendo filmes de qualidade e séries de TV da Columbia Pictures, Tri-Star, Screen Gems, da Sony Pictures Classics e muito mais. O Crackle está disponível via web, celulares, sistemas de jogos e set-top boxes. Para mais informações, visite crackle.com.br. O Crackle é de propriedade da Sony Pictures Entertainment.',
        'es': 'Crackle es unas de las redes de entretenimiento digitales más rápido en crecimiento ofreciendo películas de Hollywood y series de televisión de Columbia Pictures, Tri-Star, Screen Gems, Clásicos de Sony Pictures y mucho más. Crackle está disponible vía web, móvil, sistemas de juego y set-top boxes. Para obtener más información, visite crackle.com. Crackle es una división de Sony Pictures Entertainment.',
		'fr': "Crackle est votre source de divertissement sans restrictions. Découvrez notre sélection de films d'Hollywood et de séries télévisées ou originales en version intégrale et non censurée. Retrouvez le meilleur de vos genres préférés, de la comédie à la science-fiction en passant par l'action, l'horreur et bien d'autres, et profitez-en sans le moindre frais sur votre ordinateur, téléphone portable, tablette, téléviseur connecté à Internet ou console de jeu. Pour en savoir plus et consulter les conditions d'utilisation et la charte de confidentialité, rendez-vous sur www.crackle.com."
    },
    LOGIN: {
        'en': 'Sign In', 
        'pt': 'Login',
        'es': 'Ingresar',
		'fr': 'Connexion'
    },
    LOGIN_SCREEN_TEXT: {
        'en': 'Please sign in with your Crackle account. \nIf you do not have an account, go to \nwww.crackle.com to register.', 
        'pt': 'Por favor, login com sua conta de Crackle. \nSe você não tem uma conta, ir para \nwww.crackle.com para se cadastrar.',
        'es': 'Por favor ingresa con tu cuenta de Crackle. \nSi aún no tienes una cuenta, anda a \nwww.crackle.com para registrarte.',
		'fr': "Connectez-vous avec votre compte Crackle. \nSi vous n'avez pas encore de compte, rendez-vous sur \nwww.crackle.com pour vous inscrire."

    },
    LOGOUT_SCREEN_TEXT: {
        'en': 'You are signed in as:', 
        'pt': 'Você está logado',
        'es': 'Ya has iniciado una sesión',
		'fr': 'Compte connecté:'

    },
    LOGIN_ERROR_BAD_CREDENTIALS:{
        'en':"Your e-mail address or password is incorrect. Please verify the information is correct and try again.",
        'pt':"O seu endereço de e-mail ou senha estão incorretos. Favor verificar se a informação está correta e tente novamente.",
        'es':"Tu correo electrónico o contraseña están incorrectos. Por favor verifica si la información es correcta e intenta nuevamente.",
		'fr':"Adresse e-mail ou mot de passe non valide. Vérifiez les informations saisies et réessayez."
    },
    SUBMIT_BUTTON_TEXT: {
        'en': 'Submit', 
        'pt': 'Login',
        'es': 'Login',
		'fr': 'Connexion'

    },
    EMAIL_INFO:{
        'en': 'E-mail Address', 
        'pt': 'Endereço de e-mail',
        'es': 'Correo Electrónico',
		'fr': 'Adresse e-mail'
    },
    PASSWORD_INFO:{
        'en': 'Password', 
        'pt': 'Senha',
        'es': 'Contraseña',
		'fr': 'Mot de passe'
    },
    LOGOUT_BUTTON_TEXT: {
        'en': 'Sign out', 
        'pt': 'Sair',
        'es': 'Salir',
		'fr': 'Déconnexion'

    },
    REGISTER_BUTTON_TEXT: {
        'en': 'Get a free Crackle account', 
        'pt': 'Login',
        'es': 'Login',
		'fr': 'Créez un compte Crackle gratuit'
    },
    HISTORY: {
        'en': 'History',
        'pt': 'Sobre',
        'es': 'Sobre',
		'fr': 'Historique'
    },
    HISTORY_EMPTY: {
        'en': 'You have no previously viewed videos',
        'pt': 'Sobre',
        'es': 'Sobre',
		'fr': "Vous n'avez aucune vidéo dans votre historique."
    },
    HISTORY_NOT_LOGGED_IN:{
        'en': 'You need ',
        'pt': 'Sobre',
        'es': 'Sobre',
		'fr': 'You need '

    },
    WATCHNOW: {
        'en': 'Watch Now',
        'pt': 'Assista Já',
        'es': 'Ver Ahora',
		'fr': 'Regarder'
    },
    INFO: {
        'en': 'Info',
        'pt': 'Informação',
        'es': 'Información',
		'fr': 'Infos'
    },
    BACK: {
        'en': 'Back',
        'pt': 'Voltar',
        'es': 'Atrás',
		'fr': 'Retour'
    },
    PAUSE: {
        'en': 'Play / Pause',
        'pt': 'Pausa',
        'es': 'Pausa',
		'fr': 'Lecture/Pause'
    },
    SEEK: {
        'en': 'Seek',
        'pt': 'Procurar',
        'es': 'Búsqueda',
		'fr': 'Parcourir'
    },
    CONTINUE: {
        'en': 'Continue',
        'pt': 'Continuar',
        'es': 'Continuar',
		'fr': 'Continuer'
    },
    DUBBED: {
        'en': 'Dubbed',
        'pt': 'Dublado',
        'es': 'Doblada',
		'fr': 'Doublages'
    },
    SUBBED: {
        'en': 'Subbed',
        'pt': 'Legendado',
        'es': 'Subtitulada',
		'fr': 'Sous-titres'
    },
    OK: {
        'en': 'OK',
        'pt': 'OK',
        'es': 'OK',
		'fr': 'OK'
    },
    INVALID_REGION: {
        'en': 'This content is not available from your current region.',
        'pt': 'Este conteúdo não está disponível na sua região.',
        'es': 'Este contenido no está disponible en tu región.',
		'fr': "Ce contenu n'est pas disponible dans votre région."
    },
    EMPTY_PROMO_MESSAGE: {
        'en': 'NOW PLAYING ON CRACKLE!',
        'pt': 'EM CARTAZ NO CRACKLE!',
        'es': 'AHORA EN CRACKLE!',
		'fr': 'EN CE MOMENT SUR CRACKLE !'
    },
    SELECT: {
        'en': 'Select',
        'pt': 'Selecionar',
        'es': 'Seleccionar',
		'fr': 'Sélectionner'
    },
    SUBTITLES: {
        'en': 'Subtitles:',
        'pt': 'Legendas:',
        'es': 'Subtítulos:',
		'fr': 'Sous-titres :'
    },
    PT_BR: {
        'en': 'Portuguese',
        'pt': 'Português',
        'es': 'Portugués',
		'fr': 'Portugais'
    },
    EN_US: {
        'en': 'English',
        'pt': 'Inglês',
        'es': 'Inglés',
		'fr': 'Anglais'
    },
    ES_MX: {
        'en': 'Spanish',
        'pt': 'Espanhol',
        'es': 'Español',
		'fr': 'Espagnol'
    },
    OFF: {
        'en': 'Off',
        'pt': 'Desligado',
        'es': 'Apagado',
		'fr': 'Non'
    },
    NAVIGATE: {
        'en': 'Navigate',
        'pt': 'Procurar',
        'es': 'Explorar',
		'fr': 'Parcourir'
    },
    SETTINGS: {
        'en': 'Settings',
        'pt': 'Idioma',
        'es': 'Idioma',
		'fr': 'Options'
    },
    CLOSE_SETTINGS: {
        'en': 'Close Settings',
        'pt': 'Fechar',
        'es': 'Cerrar',
		'fr': 'Fermer'
    },
    AUDIO: {
        'en': 'Audio:',
        'pt': 'Áudio:',
        'es': 'Audio:',
		'fr': 'Audio:'
    }
};