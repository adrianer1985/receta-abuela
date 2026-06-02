// Recipe dataset for www.recetadeabuela.com
const recipes = [
  {
    id: "estufa-velas",
    title: "Estufa de Macetas de Arcilla y Velas",
    category: "hogar",
    tag: "Hogar Ecológico",
    image: "assets/images/estufa.png",
    views: 618000,
    summary: "Aprende a construir un sistema de calefacción radiante natural utilizando macetas de terracota y pequeñas velas de té. Calor ecológico, económico y sin electricidad.",
    intro: "La estufa de macetas es un ingenioso calefactor casero que aprovecha el principio de la inercia térmica y la convección natural. La arcilla refractaria absorbe y multiplica la energía térmica generada por unas simples velas, distribuyéndola de manera radiante y constante en la estancia sin necesidad de ventiladores ni consumo de red eléctrica.",
    healthBenefit: "A diferencia de los calefactores comerciales de aire forzado o radiadores de gas, esta estufa calienta por radiación térmica suave e inercia de la arcilla. Esto evita la sequedad extrema del aire (protegiendo tus mucosas respiratorias y garganta) y previene la dispersión en suspensión de polvo, polen y ácaros, resultando ideal para personas con asma o alergias.",
    time: "15 minutos",
    rawDuration: "Macetas: Ilimitada",
    finalDuration: "Velas de té: 4 horas",
    cost: "0.40 €",
    metrics: {
      economy: 90,
      health: 85,
      ecosystem: 90
    },
    shoppingList: [
      { name: "Maceta de arcilla sin esmaltar (20cm)", price: "1.50 €" },
      { name: "Maceta de arcilla sin esmaltar (15cm)", price: "1.00 €" },
      { name: "Plato de base para maceta de arcilla", price: "0.80 €" },
      { name: "Varilla roscada, tuercas y arandelas", price: "1.20 €" },
      { name: "Velas de té de parafina vegetal (4 uds)", price: "0.40 €" }
    ],
    steps: [
      "Asegúrate de que las dos macetas y la base tengan un orificio central limpio y alineado.",
      "Introduce la varilla roscada a través del plato de arcilla que servirá como base firme del conjunto.",
      "Coloca una arandela y una tuerca para fijar la varilla en la base por ambos lados del plato.",
      "Introduce la maceta pequeña boca abajo por la varilla y elévala unos 2 cm de la base usando tuercas para permitir el flujo de oxígeno. Asegúrala firmemente.",
      "Coloca la maceta grande boca abajo tapando la pequeña. Debe quedar un espacio o cámara de aire entre ambas. Fíjala con una tuerca final en el extremo.",
      "Coloca 3 o 4 velas de té sobre el plato base y enciéndelas con cuidado.",
      "La campana de arcilla interior acumulará el calor directo y el aire caliente fluirá por convección a través del espacio intermedio, templando la maceta exterior para que irradie calor constante."
    ],
    altUses: [
      "Difusor de aromaterapia colocando unas gotas de aceites esenciales puros sobre la maceta exterior templada.",
      "Calentador rústico ecológico para invernaderos pequeños para evitar heladas nocturnas.",
      "Centro de mesa radiante para exteriores decorativo."
    ],
    extraInfo: "La física detrás de este sistema radica en la transferencia de calor radiante. La campana interna absorbe la llama de la vela (que alcanza los 800°C en su núcleo) y previene la pérdida de calor directa hacia el techo. La campana externa actúa como un disipador térmico que calienta el aire frío que entra por la parte inferior mediante convección natural.",
    comparisonTable: [
      { concepto: "Coste por 4 Horas", casero: "0.40 € (Velas)", comercial: "1.50 € (Calefactor 1000W)", diferencia: "Ahorro del 73.3%" },
      { concepto: "Humedad Ambiental", casero: "Preserva humedad natural", comercial: "Reseca las vías mucosas", diferencia: "Mejor respiración" },
      { concepto: "Corrientes de Aire", casero: "0% Sin corrientes (Radiante)", comercial: "Mueve polvo, esporas y ácaros", diferencia: "Hipoalergénico" },
      { concepto: "Autonomía de Red", casero: "100% Autónomo (Emergencia)", comercial: "Requiere red eléctrica o gas", diferencia: "Sin cables" }
    ]
  },
  {
    id: "detergente-hiedra",
    title: "Detergente Líquido de Hiedra y Lavanda",
    category: "hogar",
    tag: "Hogar Ecológico",
    image: "assets/images/detergente.png",
    views: 600000,
    summary: "Aprende a elaborar tu propio detergente ecológico concentrado a partir de hojas de hiedra común (rica en saponinas naturales) y aromatizado con esencia silvestre de lavanda.",
    intro: "La hiedra común (Hedera helix) contiene entre un 5% y un 8% de saponinas, un tensoactivo natural que actúa como jabón para desprender la suciedad de las fibras textiles. Este detergente casero no contiene fosfatos, blanqueadores ópticos ni sulfatos químicos, lo que lo convierte en una solución perfecta para pieles atópicas y para reducir drásticamente el impacto ecológico de las aguas residuales domésticas.",
    healthBenefit: "Evita la exposición directa a disruptores endocrinos, fragancias artificiales y blanqueadores ópticos presentes en los detergentes comerciales. Estos compuestos sintéticos quedan atrapados en las fibras textiles y penetran en el torrente sanguíneo por contacto dérmico constante, siendo causantes principales de brotes de dermatitis atópica, alergias de contacto e irritaciones respiratorias al inhalar los perfumes de la ropa.",
    time: "25 minutos",
    rawDuration: "Hojas frescas: 2 semanas",
    finalDuration: "Detergente líquido: 6 meses",
    cost: "0.50 €",
    metrics: {
      economy: 95,
      health: 90,
      ecosystem: 100
    },
    shoppingList: [
      { name: "Hojas de hiedra común (recolectadas)", price: "0.00 €" },
      { name: "Agua de grifo purificada (2 Litros)", price: "0.05 €" },
      { name: "Aceite esencial de lavanda pura (30 gotas)", price: "0.45 €" }
    ],
    steps: [
      "Recolecta unas 60-80 hojas frescas de hiedra común (evita las que estén cerca de carreteras principales). Lávalas a fondo en agua fría para retirar la tierra.",
      "Trocea o machaca ligeramente las hojas con las manos para liberar las saponinas internas de las fibras vegetales.",
      "Coloca las hojas troceadas en una olla grande con 2 litros de agua. Lleva a ebullición a fuego medio.",
      "Una vez hierva, reduce el fuego y deja cocer a fuego lento durante 20 minutos con la olla tapada.",
      "Apaga el fuego y deja enfriar por completo la olla sin destapar para que termine de reposar (unas 3-4 horas). El agua tomará un color verdoso-marrón.",
      "Cuela el líquido resultante empleando un paño de algodón o colador fino para eliminar todos los restos vegetales.",
      "Añade las 30 gotas de aceite esencial de lavanda y remueve bien para homogeneizar. Vierte en una botella de vidrio o plástico reciclado.",
      "Dosificación: Usa 150ml (una taza estándar) directamente en el cajetín de la lavadora por cada carga completa de ropa."
    ],
    altUses: [
      "Lavavajillas manual biodegradable diluyendo el líquido resultante al 50% con agua.",
      "Limpiador foliar para plantas: pulverizado sobre las hojas actúa como abrillantador y repelente natural de plagas como el pulgón.",
      "Abono orgánico ligero: los restos de hiedra cocidos se pueden compostar aportando nitrógeno al suelo."
    ],
    extraInfo: "Las saponinas de la hiedra son solubles en agua caliente y liberan espuma natural al agitarse. No es necesario añadir espesantes artificiales. Para ropa blanca muy sucia, se recomienda complementar la colada agregando dos cucharadas de percarbonato de sodio directamente en el tambor de la lavadora.",
    comparisonTable: [
      { concepto: "Coste por Litro", casero: "0.25 €", comercial: "3.50 €", diferencia: "Ahorro del 92.8%" },
      { concepto: "Químicos / Sulfatos", casero: "0% (Solo saponina natural)", comercial: "Tensoactivos sintéticos y PEG", diferencia: "Sin alérgenos" },
      { concepto: "Residuos de Envase", casero: "Cero (Envase reutilizable)", comercial: "Botellas plásticas HDPE monouso", diferencia: "100% Sostenible" },
      { concepto: "Rendimiento (Cargas)", casero: "13 lavados por litro", comercial: "20 lavados por litro", diferencia: "Similar eficiencia" }
    ]
  },
  {
    id: "nevera-arcilla",
    title: "Refrigerador de Arcilla sin Electricidad (Nevera Zeer)",
    category: "hogar",
    tag: "Hogar Ecológico",
    image: "assets/images/nevera.png",
    views: 420000,
    summary: "Construye tu propio refrigerador evaporativo artesanal combinando dos macetas de terracota y arena húmeda. Conservación de alimentos 100% natural, sin cables y de bajo coste.",
    intro: "La nevera Zeer es una estructura evaporativa que permite conservar verduras, frutas y líquidos a temperaturas frescas sin electricidad. Es ideal para climas cálidos y secos y funciona mediante las leyes de la termodinámica, enfriando la maceta interior a medida que el agua contenida en la arena exterior se evapora a través de la arcilla porosa.",
    healthBenefit: "Mantiene los alimentos frescos en un ambiente de humedad natural constante que evita la deshidratación rápida de las verduras, preservando sus vitaminas y antioxidantes solubles por más tiempo. Además, funciona con absoluto silencio (0 dB), eliminando la contaminación acústica del compresor eléctrico comercial que altera tu descanso e incrementa los niveles corporales de cortisol (la hormona del estrés).",
    time: "30 minutos",
    rawDuration: "Macetas: Ilimitada",
    finalDuration: "Arena húmeda: Recarga diaria",
    cost: "9.50 €",
    metrics: {
      economy: 85,
      health: 90,
      ecosystem: 95
    },
    shoppingList: [
      { name: "Maceta grande de arcilla sin esmaltar (40cm)", price: "5.50 €" },
      { name: "Maceta pequeña de arcilla sin esmaltar (30cm)", price: "3.00 €" },
      { name: "Arena fina de río (1 saco)", price: "0.80 €" },
      { name: "Paño de arpillera o algodón grueso", price: "0.20 €" }
    ],
    steps: [
      "Bloquea y sella herméticamente los agujeros de drenaje de ambas macetas con arcilla húmeda o corcho para evitar fugas de arena.",
      "Coloca una capa firme de 5 cm de arena fina en el fondo de la maceta grande.",
      "Centra la maceta pequeña dentro de la maceta grande sobre la capa de arena inicial.",
      "Rellena el espacio libre circular entre las dos macetas con arena fina de río hasta el borde superior.",
      "Vierte agua fría con cuidado sobre la arena hasta saturarla completamente de humedad, asegurando que no pase agua a la maceta pequeña interior.",
      "Introduce los vegetales, frutas o botellas en el compartimento interior de la maceta pequeña.",
      "Cubre la abertura con un paño de arpillera o algodón grueso previamente humedecido.",
      "Coloca el refrigerador en una zona sombreada y ventilada. Mójalo dos veces al día para mantener el proceso evaporativo activo."
    ],
    altUses: [
      "Enfriador ecológico de bebidas y refrescos para terrazas, jardines o acampadas.",
      "Cámara para la maduración controlada de quesos artesanales que requieren humedad alta.",
      "Almacenamiento y conservación a largo plazo de patatas, ajos y cebollas en sótanos."
    ],
    extraInfo: "Este refrigerador funciona de forma óptima en climas con baja humedad relativa. A medida que el aire seco pasa sobre las paredes húmedas de la maceta exterior, provoca la evaporación del agua. Este cambio de estado requiere energía (calor latente), la cual se extrae del interior del refrigerador, logrando disminuir la temperatura interna entre 5°C y 15°C por debajo de la temperatura ambiental.",
    comparisonTable: [
      { concepto: "Consumo de Luz", casero: "0W (Cero electricidad)", comercial: "150W - 300W continuos", diferencia: "Ahorro del 100%" },
      { concepto: "Preservación Verde", casero: "Humedad óptima (Sin resecar)", comercial: "El frío seco deshidrata vegetales", diferencia: "Alimentos más frescos" },
      { concepto: "Ruido Acústico", casero: "0 dB (Silencio absoluto)", comercial: "35-45 dB (Compresor constante)", diferencia: "Reduce el estrés" },
      { concepto: "Refrigerantes Químicos", casero: "Solo agua corriente", comercial: "Gases HFC dañinos para la capa de ozono", diferencia: "100% Ecológico" }
    ]
  },
  {
    id: "repelente-ajo",
    title: "Repelente Orgánico de Ajo y Aceite de Nim",
    category: "hogar",
    tag: "Hogar Ecológico",
    image: "assets/images/repelente_ajo.png",
    views: 330000,
    summary: "Protege tu huerto o plantas de interior de plagas comunes como pulgón y mosca blanca con un pulverizador natural a base de ajo fermentado y aceite puro de Neem.",
    intro: "El ajo contiene potentes compuestos organosulfurados, como la alicina, que actúan como repelente olfativo y larvicida natural. Combinado con el aceite de nim (rico en azadiractina), este repelente orgánico interrumpe el ciclo biológico de las plagas sin dañar a los insectos polinizadores (como las abejas) ni contaminar el sustrato con residuos químicos sintéticos.",
    healthBenefit: "Evita el contacto e inhalación de insecticidas comerciales basados en piretroides y organofosforados, que actúan como potentes neurotoxinas acumulativas y disruptores endocrinos. Al usar este repelente natural, proteges tu hogar y tus cultivos domésticos de plagas sin introducir sustancias tóxicas que puedan depositarse en las hojas comestibles o ser inhaladas por tus niños o mascotas.",
    time: "20 minutos (Maceración: 24 horas)",
    rawDuration: "Aceite de Nim: 1 año",
    finalDuration: "Solución preparada: 2 semanas",
    cost: "1.10 €",
    metrics: {
      economy: 90,
      health: 95,
      ecosystem: 100
    },
    shoppingList: [
      { name: "Cabeza de ajo fresco entera", price: "0.40 €" },
      { name: "Aceite de nim (Neem) puro prensado (10ml)", price: "0.50 €" },
      { name: "Jabón potásico o neutro biodegradable (10g)", price: "0.15 €" },
      { name: "Agua destilada o sin cloro (1 Litro)", price: "0.05 €" }
    ],
    steps: [
      "Desgrana la cabeza de ajo completa y tritura todos los dientes pelados junto con 500ml de agua en una batidora hasta lograr una pasta fina.",
      "Vierte la mezcla batida en un tarro de vidrio, ciérralo y déjalo reposar a temperatura ambiente durante 24 horas para que fermente y libere la alicina.",
      "Filtra la maceración de ajo con un paño de algodón o gasa fina, exprimiendo bien para separar toda la pulpa vegetal que pueda obstruir el pulverizador.",
      "Calienta el resto del agua (500ml) a temperatura tibia y disuelve el jabón potásico, que actuará como emulsionante del aceite.",
      "Vierte los 10ml de aceite de nim sobre el agua jabonosa y bate con fuerza para formar una emulsión homogénea.",
      "Combina la emulsión de aceite de nim con el extracto colado de ajo en una botella con atomizador.",
      "Aplica la mezcla pulverizándola directamente sobre las hojas (haz y envés) del huerto al atardecer, cada 7 días como preventivo o cada 3 días ante plagas activas."
    ],
    altUses: [
      "Barrera protectora contra hormigas y caracoles rociando la base de las macetas.",
      "Desinfectante antifúngico preventivo para suelos propensos al enmohecimiento.",
      "Insecticida natural seguro para plantas decorativas en oficinas y hogares sin olores químicos residuales."
    ],
    extraInfo: "La azadiractina del aceite de nim actúa por contacto e ingestión. Es un análogo de la ecdisona (la hormona de la muda en los insectos), lo que bloquea el desarrollo de las larvas e impide que lleguen a su fase reproductora. Al no ser un veneno neurotóxico directo de amplio espectro, respeta a la fauna beneficiosa como mariquitas y abejas si se aplica cuando estas no están activas.",
    comparisonTable: [
      { concepto: "Coste por Litro", casero: "1.10 €", comercial: "14.50 € (Pesticida comercial)", diferencia: "Ahorro del 92.4%" },
      { concepto: "Residuos en Cosecha", casero: "0% Residuo persistente", comercial: "Requiere plazos de seguridad de días", diferencia: "Comida limpia" },
      { concepto: "Toxicidad Pulmonar", casero: "Completamente seguro e inofensivo", comercial: "Tóxico por inhalación y contacto", diferencia: "Sin riesgos" },
      { concepto: "Biodegradabilidad", casero: "100% Rápida en el suelo", comercial: "Persistente en aguas subterráneas", diferencia: "Protege el agua" }
    ]
  },
  {
    id: "pasta-dientes",
    title: "Pasta de Dientes Remineralizante de Arcilla y Coco",
    category: "cuerpo",
    tag: "Cuidado Personal",
    image: "assets/images/pasta_dientes.png",
    views: 210000,
    summary: "Elabora una pasta dental alcalinizante y libre de flúor sintético utilizando caolín (arcilla blanca de uso interno) purificante, bicarbonato y aceite de coco antibacteriano.",
    intro: "Esta receta ofrece una alternativa saludable, ecológica y totalmente libre de químicos a las pastas dentales industriales. La arcilla blanca limpia y remineraliza el esmalte sin desgastarlo gracias a su baja abrasividad, mientras que el aceite de coco virgen combate los microorganismos patógenos y el bicarbonato equilibra la acidez de la cavidad bucal de forma totalmente natural.",
    healthBenefit: "Prescinde por completo del flúor sintético (asociado a toxicidad sistémica y acumulación de fluorosis en los huesos), del lauril sulfato de sodio (un espumante industrial muy irritante que genera microlesiones y aftas bucales) y de los microplásticos. Esta fórmula natural alcaliniza el pH bucal, remineraliza el esmalte con calcio vegetal y limpia eficazmente respetando el microbioma oral protector.",
    time: "10 minutos",
    rawDuration: "Arcilla e ingredientes: 1 año",
    finalDuration: "Pasta dental: 3 meses",
    cost: "1.20 €",
    metrics: {
      economy: 85,
      health: 100,
      ecosystem: 95
    },
    shoppingList: [
      { name: "Arcilla blanca de uso interno (Caolín) (30g)", price: "0.50 €" },
      { name: "Aceite de coco virgen extra orgánico (20g)", price: "0.40 €" },
      { name: "Bicarbonato de sodio grado alimentario (5g)", price: "0.05 €" },
      { name: "Aceite esencial de menta piperita (10 gotas)", price: "0.20 €" },
      { name: "Tarro pequeño de vidrio con tapa", price: "0.05 €" }
    ],
    steps: [
      "Mezcla la arcilla blanca (caolín) y el bicarbonato de sodio en un bol de vidrio, cerámica o madera. Evita utensilios metálicos para no alterar las propiedades iónicas de la arcilla.",
      "Si el aceite de coco está en estado sólido, disuélvelo al baño María a fuego muy suave hasta que quede líquido.",
      "Vierte el aceite de coco tibio sobre la mezcla de polvos secos de forma gradual.",
      "Remueve con paciencia utilizando una espátula de madera o silicona hasta lograr una consistencia pastosa cremosa.",
      "Añade las 10 gotas de aceite esencial de menta piperita para aportar frescor y sabor agradable. Mezcla por última vez.",
      "Pasa la pasta terminada al tarro pequeño de vidrio limpio y tápalo.",
      "Uso: Coge una porción pequeña (tamaño de un guisante) con una espátula limpia o con el propio cepillo seco. Cepilla suavemente durante 3 minutos y enjuaga bien."
    ],
    altUses: [
      "Aplicación directa en picaduras de insectos para calmar la picazón y desinfectar.",
      "Limpiador ultra suave no abrasivo para recuperar el brillo de piezas de plata.",
      "Desodorante axilar de emergencia gracias al bicarbonato y aceite de coco."
    ],
    extraInfo: "La arcilla blanca o caolín es rica en sílice y minerales que nutren las encías y apoyan la remineralización del esmalte. Al contrario que el carbonato cálcico de mala calidad de algunas pastas comerciales, el caolín tiene un índice de abrasividad extremadamente bajo, lo que protege el esmalte dental sensible. El aceite de coco contiene ácido láurico, que ataca bacterias nocivas como la *Streptococcus mutans*.",
    comparisonTable: [
      { concepto: "Coste por 60ml", casero: "1.20 €", comercial: "4.50 € (Pasta ecológica)", diferencia: "Ahorro del 73.3%" },
      { concepto: "Flúor y Sulfatos (SLS)", casero: "0% Sin flúor ni SLS irritante", comercial: "Presentes como ingredientes estándar", diferencia: "Sin sustancias tóxicas" },
      { concepto: "Protección de Encías", casero: "Fórmula calmante y protectora", comercial: "El SLS reseca y favorece aftas bucales", diferencia: "Protección natural" },
      { concepto: "Tipo de Envase", casero: "Tarro de vidrio reutilizable", comercial: "Tubo de plástico laminado no reciclable", diferencia: "Residuo Cero" }
    ]
  },
  {
    id: "balsamo-calendula",
    title: "Bálsamo Reparador de Caléndula y Aceite de Oliva",
    category: "cuerpo",
    tag: "Cuidado Personal",
    image: "assets/images/balsamo.png",
    views: 120000,
    summary: "Ungüento balsámico tradicional formulado para aliviar quemaduras leves, irritaciones de la piel y sequedad extrema mediante flores de caléndula maceradas en aceite de oliva y cera de abejas.",
    intro: "El oleato de caléndula posee propiedades calmantes, cicatrizantes and antiinflamatorias gracias a sus flavonoides y triterpenos. Combinado con el aceite de oliva virgen extra y la cera pura de abejas, este bálsamo forma una barrera protectora transpirable sobre la piel que acelera la regeneración celular y nutre en profundidad, sin aditivos de origen mineral ni petrolatos.",
    healthBenefit: "Aporta nutrientes lipídicos y vitaminas esenciales directamente a las células cutáneas mediante aceites vegetales puros, en lugar de recubrir la piel con aceites minerales derivados del petróleo (como la vaselina o parafina líquida). Los derivados de hidrocarburos crean una película impermeable plástica que obstruye los poros e impide que la piel elimine toxinas de manera natural.",
    time: "35 minutos (Maceración previa de 40 días)",
    rawDuration: "Flores secas: 2 años",
    finalDuration: "Bálsamo terminado: 12 meses",
    cost: "3.20 €",
    metrics: {
      economy: 80,
      health: 100,
      ecosystem: 95
    },
    shoppingList: [
      { name: "Aceite de oliva virgen extra (100ml)", price: "0.80 €" },
      { name: "Flores secas de caléndula orgánica (15g)", price: "0.90 €" },
      { name: "Cera pura de abejas natural (15g)", price: "1.20 €" },
      { name: "Tarro de vidrio ámbar de 50ml", price: "0.30 €" }
    ],
    steps: [
      "Preparación del oleato: Coloca las flores secas de caléndula en un frasco de vidrio limpio. Cúbrelas por completo con el aceite de oliva virgen extra. Cierra el frasco y déjalo macerar en un lugar cálido y seco alejado de la luz solar directa durante 40 días, agitándolo suavemente cada día.",
      "Transcurridos los 40 días, filtra el aceite usando un paño limpio o colador de tela fina, exprimiendo las flores para extraer todo el extracto concentrado de caléndula.",
      "Vierte los 100ml del aceite filtrado en un recipiente de vidrio resistente al calor.",
      "Añade la cera de abejas al recipiente.",
      "Lleva el recipiente a baño María a fuego medio-bajo hasta que la cera de abejas se derrita por completo y se mezcle homogéneamente con el aceite de oliva.",
      "Retira del fuego y remueve la mezcla suavemente durante un minuto con una espátula de madera limpia.",
      "Vierte el líquido inmediatamente en el tarro de vidrio ámbar de 50ml antes de que empiece a solidificar.",
      "Deja enfriar a temperatura ambiente destapado durante 3-4 horas hasta que adquiera su consistencia cerosa definitiva. Coloca la tapa hermética y guárdalo en un lugar fresco."
    ],
    altUses: [
      "Crema pañalera para bebés: su suavidad extrema protege contra la dermatitis del pañal sin aportar siliconas ni perfumes sintéticos.",
      "Bálsamo labial nutritivo de emergencia para labios agrietados por el frío o el viento.",
      "Crema hidratante intensiva para talones y codos secos."
    ],
    extraInfo: "Si deseas preparar el bálsamo más rápido sin esperar los 40 días, puedes calentar las flores secas con el aceite de oliva al baño María a fuego muy lento (sin superar los 50°C) durante unas 3 horas, revolviendo de vez en cuando. Este método caliente extrae los principios activos de forma acelerada.",
    comparisonTable: [
      { concepto: "Coste por 50ml", casero: "1.60 € (Por tarro)", comercial: "12.50 € (Farmacia)", diferencia: "Ahorro del 87.2%" },
      { concepto: "Base de formulación", casero: "Aceite de oliva virgen", comercial: "Vaselina / Petrolatum (Petróleo)", diferencia: "100% Orgánica" },
      { concepto: "Alérgenos y Perfume", casero: "Sin perfumes sintéticos", comercial: "Fragrancia y conservantes PEG", diferencia: "Hipoalergénico" },
      { concepto: "Estabilidad a la luz", casero: "Vidrio ámbar protector", comercial: "Envase plástico genérico", diferencia: "Mejor conservación" }
    ]
  },
  {
    id: "champu-solid",
    title: "Champú Sólido de Ortiga y Romero",
    category: "cuerpo",
    tag: "Cuidado Personal",
    image: "assets/images/champu.png",
    views: 95000,
    summary: "Una pastilla de champú biodegradable formulada para fortalecer el folículo piloso, regular el exceso de sebo capilar y reactivar la circulación gracias a la ortiga verde y el romero.",
    intro: "La combinación de la ortiga verde (Urtica dioica) y el romero (Salvia rosmarinus) aporta minerales como silicio y hierro, además de antioxidantes. Esta pastilla de champú limpia en profundidad sin eliminar los aceites naturales del cuero cabelludo, evitando el molesto 'efecto rebote' de producción de grasa provocado por los sulfatos convencionales. Al ser sólido, prescinde al 100% de envases plásticos.",
    healthBenefit: "Libera a tu cuero cabelludo de los sulfatos agresivos (SLS/SLES) y las siliconas sintéticas que obstruyen los folículos capilares e impiden la transpiración y respiración celular de la piel. Al utilizar ingredientes limpios, regulas la producción natural de sebo capilar sin causar sequedad, descamación, caspa ni debilitamiento folicular, promoviendo un crecimiento capilar fuerte y saludable.",
    time: "45 minutos",
    rawDuration: "Materia prima seca: 1 año",
    finalDuration: "Pastilla de champú: 12 meses",
    cost: "2.20 €",
    metrics: {
      economy: 75,
      health: 95,
      ecosystem: 90
    },
    shoppingList: [
      { name: "Tensoactivo natural SCI (coco) (70g)", price: "1.40 €" },
      { name: "Polvo de ortiga verde deshidratada (10g)", price: "0.30 €" },
      { name: "Aceite de oliva virgen extra macerado con romero (10g)", price: "0.20 €" },
      { name: "Infusión concentrada de romero silvestre (10ml)", price: "0.05 €" },
      { name: "Aceite esencial de romero puro (15 gotas)", price: "0.25 €" }
    ],
    steps: [
      "Ponte una mascarilla antipolvo y mezcla el tensoactivo SCI y el polvo de ortiga verde en un bol resistente al calor.",
      "Añade al bol el aceite de oliva macerado con romero y la infusión concentrada de romero.",
      "Coloca el bol al baño María a fuego muy lento para ablandar los tensoactivos, removiendo pacientemente con una espátula de madera durante unos 5-8 minutos hasta obtener una pasta densa y manejable.",
      "Retira del fuego y deja templar unos minutos antes de incorporar las 15 gotas de aceite esencial de romero (el calor excesivo volatiza el aroma y propiedades del aceite esencial).",
      "Amasa la mezcla con las manos (puedes usar guantes) para terminar de integrar y prénsala con firmeza dentro de un molde de silicona redondo o cuadrado.",
      "Deja reposar el champú en el molde a temperatura ambiente durante 24 horas para que solidifique por completo.",
      "Desmolda y deja curar la pastilla en un lugar seco y ventilado durante otras 48 horas antes de su primer uso.",
      "Uso: Humedece el cabello, frota la pastilla directamente en el cuero cabelludo hasta generar espuma, masajea y enjuaga con abundante agua."
    ],
    altUses: [
      "Jabón corporal exfoliante suave para pieles grasas o propensas al acné.",
      "Pastilla para lavado de barbas: el romero actúa como desinfectante y acondicionador capilar facial."
    ],
    extraInfo: "Para alargar la vida útil de tu champú sólido, colócalo siempre en una jabonera con drenaje de agua después de usarlo. Si se mantiene seco entre lavados, una sola pastilla de 100g puede durar entre 70 y 80 lavados, equivaliendo a casi 3 botellas de champú líquido comercial.",
    comparisonTable: [
      { concepto: "Coste por 100g", casero: "2.20 €", comercial: "8.00 € (Supermercado)", diferencia: "Ahorro del 72.5%" },
      { concepto: "Conservantes / Parabenos", casero: "0% Natural", comercial: "Metilparabeno, Siliconas", diferencia: "Sin tóxicos" },
      { concepto: "Vida útil (Lavados)", casero: "Hasta 80 lavados", comercial: "Aprox. 30 por botella", diferencia: "Mayor duración" },
      { concepto: "Huella de Carbono", casero: "Nula (Sin plástico ni agua libre)", comercial: "Alta (Transporte de agua y envase)", diferencia: "Ecológico" }
    ]
  },
  {
    id: "limpiador-citricos",
    title: "Limpiador Multiusos de Pieles de Cítricos y Vinagre",
    category: "hogar",
    tag: "Hogar Ecológico",
    image: "assets/images/limpiador.png",
    views: 75000,
    summary: "Un limpiador desinfectante y abrillantador casero elaborado a base de la maceración de pieles de naranja y limón en vinagre blanco de limpieza. Elimina cal, grasa y malos olores.",
    intro: "El vinagre blanco es conocido por su alta concentración de ácido acético (alrededor del 8%), un potente agente descalcificador y antibacteriano natural. Sin embargo, su olor penetrante a veces resulta molesto. Macerando cáscaras de cítricos liberamos limoneno y aceites esenciales cítricos de las pieles, que neutralizan el olor a vinagre y aportan propiedades desengrasantes y desinfectantes adicionales.",
    healthBenefit: "Protege tu sistema respiratorio y tus mucosas oculares eliminando los limpiadores químicos industriales que liberan gases irritantes a base de amoníaco, cloro y compuestos orgánicos volátiles (COV). La inhalación continuada de estos vapores domésticos irrita los bronquios y pulmones, siendo un factor de riesgo directo para el desarrollo de asma y sensibilidad química múltiple.",
    time: "15 minutos (Maceración de 14 días)",
    rawDuration: "Pieles frescas: 3 días",
    finalDuration: "Limpiador multiusos: 12 meses",
    cost: "0.30 €",
    metrics: {
      economy: 98,
      health: 95,
      ecosystem: 100
    },
    shoppingList: [
      { name: "Vinagre blanco de limpieza (1 Litro)", price: "0.20 €" },
      { name: "Pieles de naranjas y limones de residuo (4 uds)", price: "0.00 €" },
      { name: "Agua filtrada destilada (500ml)", price: "0.05 €" },
      { name: "Botella pulverizadora de vidrio reusable", price: "0.05 €" }
    ],
    steps: [
      "Lava bien las naranjas y limones antes de pelarlos para retirar impurezas. Guarda las cáscaras resultantes del consumo habitual.",
      "Trocea las pieles de los cítricos y colócalas dentro de un tarro grande de vidrio de boca ancha hasta llenarlo aproximadamente a la mitad.",
      "Vierte el vinagre blanco de limpieza sobre las cáscaras de cítricos hasta cubrirlas por completo. Cierra bien el tarro.",
      "Guarda el tarro en un armario oscuro a temperatura ambiente durante 14 días. El vinagre cambiará de color a un tono ámbar claro y absorberá los aceites cítricos.",
      "Transcurridos los 14 días, filtra el vinagre cítrico con un colador fino descartando las cáscaras (pueden tirarse a la pila de compost).",
      "Para preparar el limpiador de uso diario, mezcla 1 parte de vinagre cítrico concentrado con 1 parte de agua destilada (dilución al 50%) dentro de tu botella pulverizadora de vidrio.",
      "Agita bien antes de cada uso. Aplícalo directamente sobre encimeras, azulejos, grifería, cristales o sanitarios y limpia con un paño de microfibra o algodón."
    ],
    altUses: [
      "Suavizante ecológico para ropa: añade 100ml del vinagre cítrico concentrado (sin diluir con agua) en el cajetín del suavizante en tu lavadora. La ropa saldrá suave y sin olor a vinagre.",
      "Desatascador de tuberías ligero: añade media taza de bicarbonato de sodio por el desagüe y vierte inmediatamente una taza de este vinagre cítrico caliente. Deja actuar y aclara con agua hirviendo."
    ],
    extraInfo: "Advertencia de uso: Debido a la acidez natural del ácido acético del vinagre, evita usar este limpiador sobre superficies delicadas de piedra caliza natural como el mármol o granito pulido, ya que podría desgastar el brillo natural de la piedra con el uso continuado.",
    comparisonTable: [
      { concepto: "Coste por Litro", casero: "0.15 €", comercial: "2.80 € (Antical grasa)", diferencia: "Ahorro del 94.6%" },
      { concepto: "Tóxicos inhalados", casero: "Cero gases tóxicos", comercial: "Amoniaco, fragancias sintéticas", diferencia: "100% Saludable" },
      { concepto: "Efecto sobre la cal", casero: "Muy eficaz (Ácido acético)", comercial: "Eficaz con químicos fuertes", diferencia: "Misma eficacia" },
      { concepto: "Seguridad ambiental", casero: "Biodegradable al 100%", comercial: "Peligroso para fauna acuática", diferencia: "Sin contaminantes" }
    ]
  }
];

// App State
let activeCategory = "all";
let activeSort = "default";
let searchQuery = "";

// DOM Elements
const recipesGrid = document.getElementById("recipes-grid");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".btn-filter");
const navLinks = document.querySelectorAll(".nav-links a");
const recipeModal = document.getElementById("recipe-modal");
const modalDynamicBody = document.getElementById("modal-dynamic-body");
const modalCloseBtn = document.getElementById("modal-close-btn");

// Helper to format views
function formatViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1).replace(".", ",") + "M";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(0) + "K";
  }
  return views.toString();
}

// Init App
document.addEventListener("DOMContentLoaded", () => {
  renderGrid(recipes);
  setupListeners();
});

// Render cards grid
function renderGrid(recipesData) {
  recipesGrid.innerHTML = "";
  
  // Apply search & category filters
  let filteredRecipes = recipesData.filter(recipe => {
    const matchesCategory = activeCategory === "all" || recipe.category === activeCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          recipe.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.intro.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Apply sorting
  if (activeSort === "default") {
    filteredRecipes.sort((a, b) => b.views - a.views);
  } else if (activeSort === "economia") {
    filteredRecipes.sort((a, b) => b.metrics.economy - a.metrics.economy);
  } else if (activeSort === "salud") {
    filteredRecipes.sort((a, b) => b.metrics.health - a.metrics.health);
  } else if (activeSort === "ecosistema") {
    filteredRecipes.sort((a, b) => b.metrics.ecosystem - a.metrics.ecosystem);
  }

  // Handle empty state
  if (filteredRecipes.length === 0) {
    recipesGrid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h3>No se encontraron recetas</h3>
        <p>Prueba a buscar con otros términos o cambia el filtro de categoría.</p>
      </div>
    `;
    return;
  }

  // Insert cards
  filteredRecipes.forEach(recipe => {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.setAttribute("aria-label", `Receta: ${recipe.title}`);
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${recipe.image}" alt="${recipe.title}" class="card-img" loading="lazy">
        <span class="card-tag">${recipe.tag}</span>
        <span class="card-views-badge">
          <svg class="card-views-icon" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          ${formatViews(recipe.views)}
        </span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${recipe.title}</h3>
        <p class="card-summary">${recipe.summary}</p>
        <div class="card-metrics">
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot eco"></span>Ahorro</span>
            <div class="metric-track"><div class="metric-fill eco" style="width: ${recipe.metrics.economy}%"></div></div>
            <span class="metric-val">${recipe.metrics.economy}%</span>
          </div>
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot health"></span>Salud</span>
            <div class="metric-track"><div class="metric-fill health" style="width: ${recipe.metrics.health}%"></div></div>
            <span class="metric-val">${recipe.metrics.health}%</span>
          </div>
          <div class="metric-bar-group">
            <span class="metric-label"><span class="metric-dot ecosys"></span>Ecosistema</span>
            <div class="metric-track"><div class="metric-fill ecosys" style="width: ${recipe.metrics.ecosystem}%"></div></div>
            <span class="metric-val">${recipe.metrics.ecosystem}%</span>
          </div>
        </div>
      </div>
    `;
    
    // Add open modal trigger
    card.addEventListener("click", () => openRecipeModal(recipe));
    recipesGrid.appendChild(card);
  });
}

// Open modal and populate its content
function openRecipeModal(recipe) {
  // Populate dynamically
  modalDynamicBody.innerHTML = `
    <!-- Top banner image -->
    <img src="${recipe.image}" alt="${recipe.title}" class="modal-hero-img">
    
    <!-- Header title and summary -->
    <div class="modal-header-info">
      <span class="modal-category">${recipe.tag}</span>
      <h2 class="modal-title">${recipe.title}</h2>
      <p class="modal-intro">${recipe.intro}</p>
    </div>
    
    <!-- Health Highlight -->
    <div class="body-health-highlight">
      <div class="health-highlight-header">
        <svg class="health-highlight-icon" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <h4 class="health-highlight-title">Beneficios para tu Cuerpo y Salud</h4>
      </div>
      <p class="health-highlight-text">${recipe.healthBenefit}</p>
    </div>
    
    <!-- Meta stats boxes -->
    <div class="modal-meta-grid">
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <div class="meta-details">
          <span class="meta-label">Elaboración</span>
          <span class="meta-value">${recipe.time}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <div class="meta-details">
          <span class="meta-label">Coste total</span>
          <span class="meta-value">${recipe.cost}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        <div class="meta-details">
          <span class="meta-label">Duración Materia</span>
          <span class="meta-value">${recipe.rawDuration}</span>
        </div>
      </div>
      <div class="meta-box">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <div class="meta-details">
          <span class="meta-label">Duración Producto</span>
          <span class="meta-value">${recipe.finalDuration}</span>
        </div>
      </div>
    </div>
    
    <!-- Split Layout: Ingredients on left, steps on right -->
    <div class="modal-body-layout">
      <!-- Ingredients column -->
      <section class="body-col-left">
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          Lista de la Compra y Costes
        </h3>
        <ul class="shopping-list">
          ${recipe.shoppingList.map(item => `
            <li class="shopping-item">
              <span class="item-name">${item.name}</span>
              <span class="item-price">${item.price}</span>
            </li>
          `).join("")}
        </ul>
      </section>
      
      <!-- Steps column -->
      <section class="body-col-right">
        <h3 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Proceso Paso a Paso
        </h3>
        <ol class="process-steps">
          ${recipe.steps.map((step, index) => `
            <li class="step-item">
              <span class="step-num">${index + 1}</span>
              <p class="step-text">${step}</p>
            </li>
          `).join("")}
        </ol>
      </section>
    </div>
    
    <!-- Full-width Bottom Sections -->
    <div class="modal-bottom-layout">
      <!-- Alternate Uses Section -->
      <section class="alt-uses-box">
        <h3 class="modal-section-title" style="border: none; margin: 0; padding: 0;">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Usos Alternativos del Producto
        </h3>
        <ul class="alt-uses-list">
          ${recipe.altUses.map(use => `
            <li class="alt-use-item">${use}</li>
          `).join("")}
        </ul>
      </section>
      
      <!-- Scientific / Extra Information -->
      <section class="extra-info-box">
        <h4 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Información de Interés Científico
        </h4>
        <p class="extra-text">${recipe.extraInfo}</p>
      </section>
      
      <!-- Detailed Impact Circles -->
      <section>
        <h4 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          Evaluación Detallada de Impacto
        </h4>
        <div class="modal-impact-metrics">
          <div class="impact-metric-box">
            <div class="impact-metric-circle eco">${recipe.metrics.economy}%</div>
            <span class="impact-metric-name">Económico</span>
            <span class="impact-metric-desc">Porcentaje de reducción de gastos frente a marcas comerciales líderes.</span>
          </div>
          <div class="impact-metric-box">
            <div class="impact-metric-circle health">${recipe.metrics.health}%</div>
            <span class="impact-metric-name">Salud</span>
            <span class="impact-metric-desc">Puntuación hipoalergénica y ausencia de químicos disruptores hormonales.</span>
          </div>
          <div class="impact-metric-box">
            <div class="impact-metric-circle ecosys">${recipe.metrics.ecosystem}%</div>
            <span class="impact-metric-name">Ecosistema</span>
            <span class="impact-metric-desc">Tasa de biodegradabilidad y reducción de emisiones y microplásticos.</span>
          </div>
        </div>
      </section>
      
      <!-- Commercial Comparison Table -->
      <section>
        <h4 class="modal-section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Tabla Comparativa Comercial (España)
        </h4>
        <div class="comparison-table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Característica</th>
                <th>Opción Casera (Abuela)</th>
                <th>Equivalente Comercial (Supermercado)</th>
                <th>Evaluación / Ahorro</th>
              </tr>
            </thead>
            <tbody>
              ${recipe.comparisonTable.map((row, idx) => `
                <tr class="${idx === 0 ? 'highlight-row' : ''}">
                  <td>${row.concepto}</td>
                  <td>${row.casero}</td>
                  <td>${row.comercial}</td>
                  <td>
                    <span class="badge-comparison ${row.diferencia.includes('Ahorro') || row.diferencia.includes('Sin') || row.diferencia.includes('Ecológico') || row.diferencia.includes('duración') || row.diferencia.includes('limpia') || row.diferencia.includes('Saludable') || row.diferencia.includes('respiración') || row.diferencia.includes('Cero') ? 'positive' : 'negative'}">
                      ${row.diferencia}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
  
  // Show dialog
  recipeModal.showModal();
  document.body.style.overflow = "hidden"; // Prevent background scroll
}

// Close Modal
function closeRecipeModal() {
  recipeModal.close();
  document.body.style.overflow = ""; // Restore background scroll
}

// Setup Event Listeners
function setupListeners() {
  // Close buttons
  modalCloseBtn.addEventListener("click", closeRecipeModal);
  
  // Close modal when clicking outside (on backdrop)
  recipeModal.addEventListener("click", (e) => {
    const rect = recipeModal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      closeRecipeModal();
    }
  });

  // Search input change event
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderGrid(recipes);
  });

  // Sorting filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeSort = btn.getAttribute("data-sort");
      renderGrid(recipes);
    });
  });

  // Navigation tab filter links
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      
      const id = link.getAttribute("id");
      if (id === "nav-all") {
        activeCategory = "all";
      } else if (id === "nav-hogar") {
        activeCategory = "hogar";
      } else if (id === "nav-cuerpo") {
        activeCategory = "cuerpo";
      }
      
      renderGrid(recipes);
    });
  });
}
